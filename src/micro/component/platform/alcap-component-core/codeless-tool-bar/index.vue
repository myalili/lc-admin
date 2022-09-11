<template>
  <div class="code-less-toolbar" ref="codeLessToolbar">
    <div class="code-less-toolbar-left  whitespace-nowrap" ref = 'codeLessToolbarLeft'>
      <codeless-back @back="editC = !editC" v-if="edit"></codeless-back>
      <span class="title">{{ title }}</span>
    </div>

    <div class="code-less-toolbar-center relative  px-4" ref='codeLessToolbarCenter' :style='{"width":`${width}px`}'>
      <i
        class="el-icon-arrow-left cursor-pointer absolute left-4"
        @click="goLeft"
        v-show="arrowShow && edit"
      ></i>

      <div ref='toolbarCenterExtensionWrapper' class='w-full overflow-hidden mx-4 text-center relative' style="height:50px">
        <div ref='scrollCtt' class='scroll-ctt inline-block ' :class='{"absolute":arrowShow&&edit}' :style="{'left':`${left}px`}">
          <component
            v-for="(item, index) in toolbarCenterExtension"
            ref="compSelect"
            :is="item.component"
            :key="index"
            v-show="isShow(item)"
          ></component>
        </div>
          
      </div>
      
      <i
        class="el-icon-arrow-right cursor-pointer absolute right-4"
        @click="goRight"
        v-show="arrowShow && edit"
      ></i>
      <!-- <slot name="center"></slot> -->
    </div>
    <div class="code-less-toolbar-right whitespace-nowrap flex items-center" ref = 'codeLessToolbarRight'>
      <component
        v-for="(item, index) in toolbarRightExtension"
        :is="item.component"
        :key="index"
        v-show="isShow(item)"
      ></component>
      <slot name="right"></slot>
      <!-- <el-button
        type="primary"
        icon="el-icon-mobile-phone"
        v-if="edit"
        @click="mobile = !mobile"
        size="mini"
        style="margin-right: 5px;"
      /> -->

      <span
        class="code-less-toolbar-save flex items-center"
        title="编辑"
        v-if="!edit"
        @click="editC = !editC"
      >
        <codeless-icon class="v2-a-svgicon" icon="icon-bianji"></codeless-icon>编辑</span
      >
      <span class="code-less-toolbar-save" title="保存" v-if="edit" @click="save" v-show='!readOnly'>
        <codeless-icon class="v2-a-svgicon" icon="icon-baocun"></codeless-icon>保存</span
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'toolBar',
  inject: ["root"],
  props: ["edit", "title", "type"],
  data() {
    return {
      arrowShow:false,
      width:0,
      left:0
      // mode: false,

      // scrollLeft: "",

      // isMounted: false,
    };
  },
  mounted() {
    let self = this;
    window.addEventListener("resize",self.update);
    setTimeout(()=>{
     self.update()
    },1000)
    // this.isMounted = true;
  },
  computed: {
    // arrowShow() {
    //   if (this.isMounted) {
    //     return this.toolbarCenterExtension.length > 0 && this.edit;
    //   } else {
    //     return false;
    //   }
    // },
    readOnly(){
      return this.$route.query.status === 'published' && this.type==='3'
    },
    isShow() {
      return (item) => {
        let edit = this.edit;
        let ret = edit;
        if (Array.isArray(item.showCondition) && item.showCondition.length) {
          if (
            item.showCondition.length === 1 &&
            item.showCondition[0] === "preview"
          ) {
            ret = !edit;
          } else if (item.showCondition.length === 2) {
            ret = true;
          }
        }

        return ret;
      };
    },
    toolbarCenterExtension() {
      let ret = [];
      let { toolBarCenter } = this.curPage;
      if (Array.isArray(toolBarCenter) && toolBarCenter.length) {
        toolBarCenter.forEach((item) => {
          item.component && ret.push(item);
        });
      }
      return ret;
    },
    toolbarRightExtension() {
      let ret = [];
      let { toolBarRight } = this.curPage;
      if (Array.isArray(toolBarRight) && toolBarRight.length) {
        toolBarRight.forEach((item) => {
          item.component && ret.push(item);
        });
      }
      return ret;
    },
    pages() {
      let ret = [];
      let pages = activator.getPage();
      if (pages && Object.keys(pages).length) {
        Object.keys(pages).forEach((name) => {
          pages[name] && ret.push(pages[name]);
        });
        // console.log(ret);
      }
      return ret;
    },
    curPage() {
      let page = {};
      let self = this;

      let ret = this.pages.filter((item) => {
        return item.type === self.type;
      });
      console.log(ret);
      ret.length && (page = ret[0]);
      return page;
    },
    editC: {
      get() {
        return this.edit;
      },
      set(val) {
        this.$emit("update:edit", val);
      },
    },
  },
  beforeDestroy(){
    let self = this;
     window.removeEventListener("resize",self.update);

  },

  methods: {
    update(){
      //  this.width = this.toolbarWidth-this.leftWidth -this.rightWidth - 64
      
      let leftWidth = this.$refs.codeLessToolbarLeft? this.$refs.codeLessToolbarLeft.clientWidth:0;
      let rightWidth = this.$refs.codeLessToolbarRight? this.$refs.codeLessToolbarRight.clientWidth:0;
      let toolbarWidth = this.$refs.codeLessToolbar? this.$refs.codeLessToolbar.clientWidth:0;
      // console.log(toolbarWidth)
      // console.log(leftWidth)
      // console.log(rightWidth)
      this.width =toolbarWidth-leftWidth -rightWidth - 32;
      let ctn = this.$refs.toolbarCenterExtensionWrapper;
      let ctt = this.$refs.scrollCtt;
      if( ctn && ctt && this.edit){
        let ctnWidth = ctn.clientWidth;
        let cttWidth = ctt.clientWidth;
        // console.log(ctnWidth)
        // console.log(cttWidth)
        if(cttWidth > ctnWidth){
          this.arrowShow = true;
        }else{
          this.arrowShow = false;
        }
        console.log(this.arrowShow)
      }
    },
    save() {
      this.$emit("save");
    },
    goLeft(){
      if(this.left+100<0){
        this.left+= 100
      }else{
        this.left+= 0-this.left
      }
    },
    goRight(){
      let ctn = this.$refs.toolbarCenterExtensionWrapper;
      let ctt = this.$refs.scrollCtt;
      let ctnWidth = ctn.clientWidth;
      let cttWidth = ctt.clientWidth;
      let scrollDistance = cttWidth+this.left-ctnWidth
      if(scrollDistance<100){
        this.left-=scrollDistance
      }else{
        this.left-=100
      }
    }
    // handle(n) {
    //   this.$refs.compSelect[0].tabScroll(n);
    // },
  },
  watch:{
    edit(){
      let self =this;
      
      setTimeout(()=>{
        self.left = 0;
        self.update()
      })
    }
  }
};
</script>

<style lang="less" scoped>
.code-less-toolbar {
  display: flex;
  // justify-content: space-between;
  height: 50px;
  padding: 0 16px;
  line-height: 50px;

  &-center {
    //max-width: 70%;
    //flex:1;
    display: flex;
    justify-content: center;
    align-items: center;

    .scroll-ctt{
      transition: left .3s;
    }
  }

  // .back {
  //   width: 20px;
  //   height: 20px;
  //   background-color:var(--color-primary);
  //   // background: linear-gradient(316deg, #15c0ff 0%, #00ddaa 100%);
  //   border-radius: 50%;
  //   display: inline-flex;
  //   align-items: center;
  //   justify-content: center;
  //   cursor: pointer;
  //   margin-right: 6px;
  //   .v2-a-svgicon {
  //     width: 12px;
  //     height: 12px;
  //   }
  // }
  .title {
    font-size: 16px;
    color: #333;
  }
  &-right {
    > span {
      width: 64px;
      height: 28px;
      @apply bg-primary;
      opacity: 1;
      border-radius: 22px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #fff;
      font-size: 12px;
      .v2-a-svgicon {
        margin-right: 4px;
        width: 12px;
        height: 12px;
      }
      &:hover {
        opacity: .7;
      }
    }
  }
}
</style>