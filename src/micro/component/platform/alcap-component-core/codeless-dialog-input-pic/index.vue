<template>
  <div class="dialog-type-pic">
    <div class="pic-list px-4" ref='pic-list'>
      <div class="pic-content flex-col relative" 
        v-for="(i,index) in pics" 
        :key="index" 
        :class="{ iactived : active === i }"
        @click="active = i"
      >
        <img class=" w-8 h-8"  :src="i" alt="" srcset="">
        <span class='truncate max-w-96 mt-3 mb-1' :title='i'>{{ picName(i) }}</span>

        <i class="el-icon-close absolute top-1 right-1 cursor-pointer hidden" @click="del(i)" v-if="!i.startsWith('/img')"></i>
      </div>
    </div>
  </div>
</template>

<script>
// 
export default {
  name:'codelessDialogInputPic',
  mixins: [window.codelessMixins.customDialog],
  props: [ 'pic','pics', 'netImgsOrg'],
  data() {
    return {
      active: ""
    }
  },
  computed:{
    picName() {
      const ctx = this;
      return (item)=> {
        if (item.indexOf(`${axios.bff}`) > -1) {
          return ctx.netImgsOrg.find(i=>i.url.indexOf(item.substring(item.lastIndexOf('/') + 1)) > -1).name
        }else {
          return item.substring(item.lastIndexOf('/') + 1);
        }
        
      }
    }
  },
  mounted() {
   
      this.active = this.pic;
    
  },
  watch: {
    "active": {
      handler(n) {
        this.$emit('update:pic', n);
      }
    },
    "pic": {
      handler(n) {
        this.active = n;
      }
    },
    pics(){
      this.$refs['pic-list'].scrollTop = 0
    }
    
  },
  methods: {
    del(item) {
      const ctx = this;
      let id = ctx.netImgsOrg.find(i=>i.url.indexOf(item.substring(item.lastIndexOf('/') + 1)) > -1).id;

       ctx.openCustomDialog({
        title: "提示",
        path: "deleteConfirm",
        width: "300px",
        component: {
          template: `<div>确认删除该图片吗?</div>`,
        },
        confirmCallback() {
          ctx.$emit('del', id);
        },
      });
    }
  }
}
</script>

<style lang="less" scoped>
.dialog-type-pic {
  // --size: 108px;
  // width: 100%;
  // min-height: 100%;
  height:100%;
  .pic-list {

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
    .pic-content {
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
        background:#E3F2FC;
        i {
          display: block;
        }
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