<template>
  <div
    class="color-inputs flex items-center justify-between"
    style="width: 280px"
  >
    <div class="color-input flex flex-col items-center">
      <el-input
        v-model="Hex"
        :validate-event="false"
        size="mini"
        maxlength="6"
        style="width: 70px"
        @keyup.native.enter="HexConfirm"
        @blur="HexConfirm"
      >
        <template slot="prepend">#</template>
      </el-input>
      <div class="text-xs mt-1" style="color: #7f8c93">Hex</div>
    </div>
    <div
      class="color-input flex flex-col items-center"
      v-for="(item, key) in rgba"
      :key="key"
    >
      <el-input v-model="rgba[key]" size="mini" maxlength="3" style="width: 40px" @input="rbgaChange($event, key)">
      </el-input>
      <div class="text-xs mt-1" style="color: #7f8c93">{{ key.toUpperCase() }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pageCss: {
      type: Object,
      default: ()=> {
        return {}
      }
    },
    color: {
      type: Object,
      default: ()=> {
        return {}
      }
    }
  },
  data() {
    return {
      Hex: '000000',
      rgba: {
        r: 0,
        g: 0,
        b: 0,
        a: 100,
      },
    };
  },
  computed: {
    
  },
  watch: {
    color: {
      deep: true,
      immediate: true,
      handler(val) {
        this.Hex = val.toHex(val.toRgb()).substring(1);
        this.hex2Rgb(this.Hex);

        this.rgba.a = val._alpha
      }
    }
  },
  methods: {
    HexConfirm(rbgaChange) {
      const ctx = this;
      console.log("ctx.hex2Rgb('#' + ctx.Hex)",ctx.Hex, ctx.hex2Rgb(ctx.Hex));
      if(!rbgaChange) ctx.hex2Rgb(ctx.Hex)
      ctx.color.fromString(ctx.hex2Rgb(ctx.Hex))

      // get() { 
      //   const ctx = this;
      //   let hex = '000000';
      //   if(JSON.stringify(ctx.pageCss) !== '{}' && ctx.pageCss?.color) {
      //     const ctx = this;
      //     hex = ctx.color.toHex(ctx.color.toRgb()).substring(1);
      //   }
      //   console.log('get到的颜色', hex);
      //   ctx.hex2Rgb(hex)
      //   return hex
      // }
    },
    hex2Rgb(hex) {
      const ctx = this;
      const str = hex;
      let arr;
      if (str.length === 3)
        arr = str.split("").map((d) => parseInt(d.repeat(2), 16));
      else
        arr = [
          parseInt(str.slice(0, 2), 16),
          parseInt(str.slice(2, 4), 16),
          parseInt(str.slice(4, 6), 16),
          ctx.rgba.a / 100
        ];
      
      if(arr.some(i=>isNaN(i))) return 

      ctx.rgba.r = arr[0];
      ctx.rgba.b = arr[1];
      ctx.rgba.g = arr[2];
      
      return `rgba(${arr.join(", ")})`;
    },
    rbgaChange(val, key) {
      const ctx = this;
      console.log('4321', val, key);
      if(key === 'a') {
        ctx.color._alpha = val
      }else {
        const { r, g, b } = ctx.rgba;
        ctx.Hex = ctx.color.toHex({r, g, b}).substring(1);
        ctx.HexConfirm(true);
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.color-inputs {
  .color-input {
    ::v-deep .el-input {
      .el-input__inner {
        height: 24px;
        background: rgba(246, 247, 248, 0.39);
        border: 1px solid #dddfe5;
        opacity: 1;
        border-radius: 2px;
        padding: 0 6px;
      }
    }
  }
  .color-input:nth-child(1) {
    ::v-deep .el-input {
      .el-input__inner {
        border-left-width: 0;
        border-radius: 0 2px 2px 0;
        padding-left: 3px;
      }
      .el-input-group__prepend {
        padding-right: 0;
        padding-left: 6px;
        background: rgba(246, 247, 248, 0.39);
        border: 1px solid #dddfe5;
        border-right-width: 0;
      }
    }
  }
}
</style>