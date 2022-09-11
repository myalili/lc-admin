<template>
  <div class="dialog-type-icon">
    <div class="icon-list px-4" ref='icon-list'>
      <div class="icon-content flex-col" 
        v-for="(i,index) in icons" 
        :key="index" 
        :class="{ iactived : active === i.value }"
        @click="active = i.value"
      >
        <svg style='width:32px;height:32px' aria-hidden="true">
          <use :xlink:href="'#' + i.value"></use>
        </svg>
        <!-- <codeless-icon style='width:32px;height:32px' :icon="i.value"></codeless-icon> -->
        <span class='truncate max-w-96 mt-3 mb-1' :title='i.label'>{{i.label}}</span>
        <span class='text-gray-7F8C93 truncate max-w-96' :title='i.value'>{{i.value}}</span>
      </div>
    </div>
  </div>
</template>

<script>
// 
export default {
  name:'codelessDialogInputIcon',
  // mixins: [ window.V8.mixins ],
  props: [ 'icon','icons'],
  data() {
    return {
      active: ""
    }
  },
  computed:{
    // isShow(){
    //   return (icon)=>{
    //     if(this.searchText && this.searchText.trim().length){
    //         return icon.label.includes(this.searchText)||icon.value.includes(this.searchText)
    //     }else{
    //       return true
    //     }
    //   }
    // }
  },
  mounted() {
   
      this.active = this.icon;
    
  },
  watch: {
    "active": {
      handler(n) {
        this.$emit('update:icon', n);
      }
    },
    "icon": {
      handler(n) {
        this.active = n;
      }
    },
    icons(){
      this.$refs['icon-list'].scrollTop = 0
    }
    
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.dialog-type-icon {
  // --size: 108px;
  // width: 100%;
  // min-height: 100%;
  height:100%;
  .icon-list {

    // max-height: 400px;
    height: 100%;
    overflow-y: overlay;
    display:flex;
    flex-wrap: wrap;
    // scroll-behavior: smooth;
    // display: grid;
    // grid-template-columns: repeat(auto-fill, var(--size));
    // grid-row-gap: 4px;
    // grid-column-gap: 4px;
    .icon-content {
      width:112px;
      height:104px;
      margin-right:4px;
      margin-bottom:4px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid initial;
      &:hover {
        cursor: pointer;
        border-radius:4px;
        background:#E3F2FC
      }
      &.iactived {
        cursor: pointer;
        border-radius:4px;
        background:#E3F2FC;
        border:unset;
      }
    }
    
  }
}
</style>