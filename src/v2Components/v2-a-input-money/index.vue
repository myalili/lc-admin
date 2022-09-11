<template>
  <div class="v2-a-input-money flex items-center">
    <el-input
      :style="{width: text ? '50%': '100%'}"
      v-model="formatDataValue"
      :step="0.01"
      :precision="2"
      :disabled="disabled"
      :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
      :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
      @change="onChange"
      placeholder="请输入金额"
      size="mini"
    />
    <span class="ml-3" :title="text" v-if="text">{{ text }}</span>
  </div>
</template>

<script>
// 数据类型和类型： 绑定值:string
import pck from "./package.json";
export default {
  _options: pck.docs,
  name: 'v2AInputMoney',
  props: { 
    value: {
      type: Number | String,
      default: () => {
        return 0;
      },
    },
    step: {
      type: [Number, String],
      default: ()=> { 
        return 0.01;
      }
    },
    disabled: {
      type: Boolean,
      default: ()=> {
        return false;
      }
    }
  },
  data() {
    return {
      formatDataValue: '',
      dataValue: this.value,
      text: '',
      unit: new Array("仟", "佰", "拾", "", "仟", "佰", "拾", "", "角", "分"),
    }
  },
  watch: {
    "dataValue": {
      handler(n) {
        this.$emit('update:value', n);
      }
    },
    "value": {
      immediate: true,
      handler(n) {
        this.dataValue = n;
        if (!n) {
          this.text = ''
          this.formatDataValue = null
        } else {
          this.formatDataValue = n.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
      }
    }
  },
  methods: {
    onChange(value) {
      const ctx = this;
      console.log(value);
      if (value.indexOf(',') > -1) {
        value = value.replace(/,/g, '');
      }
      if (isNaN(value)) {
        value = value.replace(/[^\d.]/g, "");
      }
      if (!value) {
        ctx.text = ''
        ctx.formatDataValue = null
        ctx.dataValue = null
        return
      }
      
      
      value = Number(value).toFixed(2);
      
      ctx.formatDataValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      ctx.text = window.codelessUtils.convertCurrency(value);

      ctx.dataValue = value;

    },
  }
}
</script>

<style lang="less" scoped>
.v2-a-input-money{
  span {
    width: calc( 50% - 12px );
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1; //在第几行显示...
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
}
</style>