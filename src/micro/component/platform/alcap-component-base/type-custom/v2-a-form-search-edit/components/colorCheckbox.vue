<template>
  <div class="color-check-box">
    <div 
      class="color-check-box-item" 
      v-for="item in options"
      :key="item.color"
      :class="{ actived: dataValue === item.color }"
      @click="dataValue = item.color"
    >
      <div 
        class="item-color"
        :style="{ background: item.color }"
        :class="{ border: item.border }"
      >
        <i class="el-icon-check" :style="{ color: item.border ? 'A4AEB4' : '#ffffff'}" v-if="dataValue === item.color"></i>
      </div>
    </div>

    <el-switch
      v-model="isThematicComp"
      active-text="主题颜色"
      class="ml-4"
    >
    </el-switch>
  </div>
</template>

<script>
export default {
  name: 'ColorCheckbox',
  props: {
    value: {
      type: String,
      default: ()=> {
        return '';
      }
    },
    isThematic: {
      type: Boolean,
      default: ()=> {
        return false;
      }
    }

  },
  data() {
    return {
      dataValue: this.value || '#3698F2',
      options: [ 
        {
          color: '#3698F2',
          border: false,
        },
        {
          color: '#374E71',
          border: false,
        },
        {
          color: '#D8021C',
          border: false,
        },
        {
          color: '#FFFFFF',
          border: true,
        }
       ]
    }
  },
  computed: {
    isThematicComp: {
      get() {
        return this.isThematic
      },
      set(val) {
        this.$emit('update:isThematic', val);
      }
    }
  },
  watch: {
    "dataValue": {
      handler(n) {
        this.$emit('update:value', n);
      }
    },
    "value": {
      handler(n) {
        this.dataValue = n;
      }
    }
  },
  methods:{

  }
}
</script>

<style lang="less" scope>
.color-check-box {
  display: flex;
  align-items: center;
  .color-check-box-item {
    width: 30px;
    height: 30px;
    padding: 3px;
    
    opacity: 1;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .item-color {
      width: 22px;
      height: 22px;
      background: #3698F2;
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .actived {
    border: 1px solid #333333;
  }
  .border {
    border: 1px solid #A4AEB4;
  }
}
</style>