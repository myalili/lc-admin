<template>
  <div class="code-less-toolbar" ref="codeLessToolbar">
    <div
      class="code-less-toolbar-left whitespace-nowrap flex items-center"
      ref="codeLessToolbarLeft"
    >
      <codeless-back v-if="edit" @back="!disabled && (editC = !editC)" class="mr-3"></codeless-back>
      <codeless-back v-else-if="showBack" @back="$router.go(-1)" class="mr-3"></codeless-back>
      <span class="title">{{ title }}</span>
    </div>

    <div
      v-if="!hideCenter"
      class="code-less-toolbar-center relative px-4"
      ref="codeLessToolbarCenter"
      :style="{ width: `${width}px` }"
    >
      <i
        class="el-icon-arrow-left cursor-pointer absolute left-4"
        @click="goLeft"
        v-show="arrowShow && edit"
      ></i>

      <div
        ref="toolbarCenterExtensionWrapper"
        class="w-full overflow-hidden mx-4 text-center relative"
      >
        <div
          ref="scrollCtt"
          class="scroll-ctt flex justify-center"
          :class="{ absolute: arrowShow && edit }"
          :style="{ left: `${left}px` }"
        >
          <component
            v-for="(item, index) in toolbarCenterExtension"
            ref="compSelect"
            :is="item.component"
            :key="index"
            v-show="edit"
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
    <div
      class="code-less-toolbar-right whitespace-nowrap flex items-center"
      ref="codeLessToolbarRight"
       v-if="!hideRight"
    >
      <!-- <el-popover
        popper-class="codeless-opr-btn-wrapper"
        v-if="edit && toolbarRightMoreExtension.length"
      >
        <component
          v-for="(item, index) in toolbarRightMoreExtension"
          :key="index"
          class="codeless-select-item-bg-color cursor-pointer select-item"
          :is="item.component"
        ></component>
        <el-button
          type="plain"
          icon="iconfont icon-gengduo"
          circle
          title="????????????"
          slot="reference"
        ></el-button>
      </el-popover> -->

      <template v-if="edit && toolbarRightMoreExtension.length">
        <component
          v-for="(item, index) in toolbarRightMoreExtension"
          :key="index"
          class=""
          :is="item.component"
        ></component>
      </template>

      <component
        v-for="(item, index) in toolbarRightExtension"
        :is="item.component"
        :key="index"
        v-show="edit"
      ></component>

      <slot name="right"></slot>
      <div class="relative" v-if="!edit">
        <i class="iconfont icon-cunweibanben absolute z-1 w-3 h-3"></i>
        <el-select
          v-model="curVer"
          placeholder="?????????"
          size="mini"
          class="w-40 version-select"
          @change="changeHandler"
        >
          <el-option
            v-for="item in verList"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          size="mini"
          round
          class="codeless-btn-padding codeless-btn-margin"
          @click="release"
          :disabled="
            disabled ||
            (curVer &&
              versionMap[curVer] &&
              versionMap[curVer].status === 'release')
          "
          >??????</el-button
        >

        <el-divider direction="vertical"></el-divider>

        <el-button
          type="primary"
          icon="iconfont icon-bianji2"
          circle
          title="??????"
          @click="editC = !editC"
          :disabled="disabled"
        ></el-button>
        <el-popover popper-class="codeless-opr-btn-wrapper">
          <div
            class="codeless-select-item-bg-color cursor-pointer select-item"
            @click="discardPage"
            v-if="versionMap[curVer] && versionMap[curVer].status === 'release'&& type!=='3'"
          >
            ???????????????
          </div>
          <div
            class="codeless-select-item-bg-color cursor-pointer select-item"
            @click="deletePage"
            v-if="versionMap[curVer] && versionMap[curVer].status !== 'release'"
          >
            ?????????{{
              versionMap[curVer] && versionMap[curVer].status === "draft"
                ? "??????"
                : "??????"
            }}
          </div>
          <el-button
            type="plain"
            icon="iconfont icon-gengduo"
            circle
            title="????????????"
            slot="reference"
            :disabled="disabled || !curVer"
          ></el-button>
        </el-popover>
      </div>
      <template v-else>
        <div class="code-less-toolbar-right-edit flex items-center ml-5">
          <!-- <el-divider
            direction="vertical"
            v-if="
              toolbarRightMoreExtension.length || toolbarRightExtension.length
            "
          ></el-divider> -->
          <!-- <el-button type='plain' size='mini' round class="codeless-btn-padding" :disabled="disabled" @click="release">??????</el-button> -->
          <el-button
            type="primary"
            size="mini"
            class="
              rounded-none rounded-l-2xl
              codeless-btn-padding codeless-btn-margin
              px-6
            "
            @click="save({status:'draft'})"
            :disabled="disabled"
            >????????????</el-button
          >
          <el-dropdown @command="handleCommand" trigger="click" class=" flex items-center">
            <el-button
              type="primary"
              size="mini"
              class="rounded-none rounded-r-2xl codeless-btn-padding h-7 px-2"
              style="padding-right: 10px"
              :disabled="disabled"
              @click="saveArrow = !saveArrow"
            >
              <i :class="saveArrow ? 'el-icon-arrow-up': 'el-icon-arrow-down'"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="new" :disabled="disabled">
                <div>???????????????</div>
              </el-dropdown-item>
              <el-dropdown-item command="publish"  :disabled="disabled">
                <div>??????</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </template>

      <!-- <span
        class="code-less-toolbar-save"
        title="??????"
        v-if="!edit"
        @click="editC = !editC"
      >
        <codeless-icon icon="icon-bianji"></codeless-icon>??????</span
      >
      <span class="code-less-toolbar-save" title="??????" v-else @click="save">
        <codeless-icon icon="icon-baocun"></codeless-icon>??????</span
      > -->
    </div>
  </div>
</template>

<script>
import publishForm from "./components/publishDialog.vue";
export default {
  name: "toolBarV2",
  inject: ["root"],
  mixins: [window.codelessMixins.customDialog],
  props: ["edit", "title", "type", "versions", "disabled","hideRight","hideCenter","showBack"],
  data() {
    return {

      arrowShow: false,
      width: 0,
      left: 0,
      curVer: "",
      defaultVer: "",
      versionMap: {},

      saveArrow: false
    };
  },
  mounted() {
    let self = this;
    window.addEventListener("resize", self.update);
    setTimeout(() => {
      self.update();
    }, 1000);
  },
  computed: {
    verList() {
      let ctx = this;
      let ret = [];
      ctx.versionMap = {};
      ret = ctx.versions.map((item) => {
        let i = {
          id: item.id,
        };
        ctx.versionMap[item.id] = item;
        switch (item.status) {
          case "draft":
            i.label = "??????";
            ctx.defaultVer = item.id;
            break;
          case "history":
            i.label = item.version;
            break;

          case "release":
            i.label = `${item.version}???????????????`;
            break;
        }
        return i;
      });
      !ctx.defaultVer &&
        (ctx.defaultVer =
          (ctx.versions && ctx.versions[0] && ctx.versions[0].id) || "");

      return ret;
    },
    toolbarRightMoreExtension() {
      let ret = [];
      let { toolBarRightMore } = this.curPage;
      if (Array.isArray(toolBarRightMore) && toolBarRightMore.length) {
        toolBarRightMore.forEach((item) => {
          item.component && ret.push(item);
        });
      }
      return ret;
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
      let { toolBarRightV2 } = this.curPage;
      if (Array.isArray(toolBarRightV2) && toolBarRightV2.length) {
        toolBarRightV2.forEach((item) => {
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
      console.log(ret);
      return ret;
    },
    curPage() {
      let page = {};
      let self = this;
      console.log(self.type);
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
  beforeDestroy() {
    let self = this;
    window.removeEventListener("resize", self.update);
  },

  methods: {
    handleCommand(command) {
      if (command === "new") {
        this.publish();
      } else if (command === "publish") {
        this.release();
      }
    },
    discardPage() {
      let ctx = this;
      let desp = "??????????????????????";
      let title = "??????";
      ctx.openCustomDialog({
        title: `${title}`,
        path: "discardConfirm",
        width: "300px",
        component: {
          template: `<div>${desp}</div>`,
        },
        confirmCallback() {
          ctx.save({
            status: "discard",
            id: ctx.curVer,
          });
        },
      });
    },
    release() {
      let ctx = this;
      let item = ctx.versionMap[ctx.curVer];
      if (ctx.edit||item.status === "draft") {
        //????????????????????????????????????????????????????????????
        ctx.openCustomDialog({
          path: "release",
          title: "??????",
          width: "460px",
          component: publishForm,
          beforeConfirm($_dontCare, $el) {
            let ret = $el.confirm();
            ret && ctx.save({
              status:"release",
              ver:$el.form.version,
              name:ctx.title
            });
            return ret;
          },
        });
      } else if (item.status === "history") {
        ctx.save({
            status:"release",
            ver:item.version,
            id:item.id,
            name:ctx.title
          });
      }
    },
    publish() {
      let ctx = this;
      ctx.openCustomDialog({
        path: "saveAsNewVer",
        title: "??????????????????",
        width: "460px",
        component: publishForm,
        beforeConfirm($_dontCare, $el) {
          let ret = $el.confirm();
          ctx.save({
            status:"publish",
            ver:$el.form.version
          });
          return ret;
        },
      });
    },
    update() {
      let leftWidth = this.$refs.codeLessToolbarLeft
        ? this.$refs.codeLessToolbarLeft.clientWidth
        : 0;
      let rightWidth = this.$refs.codeLessToolbarRight
        ? this.$refs.codeLessToolbarRight.clientWidth
        : 0;
      let toolbarWidth = this.$refs.codeLessToolbar
        ? this.$refs.codeLessToolbar.clientWidth
        : 0;
      this.width = toolbarWidth - leftWidth - rightWidth - 32;
      let ctn = this.$refs.toolbarCenterExtensionWrapper;
      let ctt = this.$refs.scrollCtt;
      if (ctn && ctt && this.edit) {
        let ctnWidth = ctn.clientWidth;
        let cttWidth = ctt.clientWidth;
        if (cttWidth > ctnWidth) {
          this.arrowShow = true;
        } else {
          this.arrowShow = false;
        }
        console.log(this.arrowShow);
      }
    },
    save({status, ver, id,name}) {
      this.$emit("save", {
        status,
        ver,
        id,
        name
      });
    },
    goLeft() {
      if (this.left + 100 < 0) {
        this.left += 100;
      } else {
        this.left += 0 - this.left;
      }
    },
    goRight() {
      let ctn = this.$refs.toolbarCenterExtensionWrapper;
      let ctt = this.$refs.scrollCtt;
      let ctnWidth = ctn.clientWidth;
      let cttWidth = ctt.clientWidth;
      let scrollDistance = cttWidth + this.left - ctnWidth;
      if (scrollDistance < 100) {
        this.left -= scrollDistance;
      } else {
        this.left -= 100;
      }
    },
    deletePage() {
      let ctx = this;
      let desp = "?????????????????????????";
      let title = "??????";
      if (ctx.versionMap[ctx.curVer].status === "history") {
        desp = `??????????????????${ctx.versionMap[ctx.curVer].version}???????`;
        title = "??????";
      }
      ctx.openCustomDialog({
        title: `??????${title}`,
        path: "deleteConfirm",
        width: "300px",
        component: {
          template: `<div>${desp}</div>`,
        },
        confirmCallback() {
          ctx.$emit("save", {
            status: "delete",
            id: ctx.curVer,
          });
        },
      });
    },
  },
  watch: {
    edit() {
      let self = this;

      setTimeout(() => {
        self.left = 0;
        self.update();
      });
    },
    defaultVer(val) {
      this.curVer = val;
    },
    curVer(val) {
      let ctx = this;
      console.log(val,ctx.versionMap[val])
      if (val && ctx.versionMap[val]) {
      
          ctx.$emit("pageContentChange", ctx.versionMap[val].pageContent);
       
      }
    },
  },
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

    .scroll-ctt {
      transition: left 0.3s;
    }
     &::-webkit-scrollbar {
        display: none;
      }
  }

 
  .title {
    font-size: 16px;
    color: #333;
  }
  &-right {
    // > span {
    //   width: 64px;
    //   height: 28px;
    //   background: linear-gradient(135deg, #0ae6f4 0%, #2772fa 100%);
    //   opacity: 1;
    //   border-radius: 22px;
    //   display: inline-flex;
    //   align-items: center;
    //   justify-content: center;
    //   cursor: pointer;
    //   color: #fff;
    //   font-size: 12px;
    //   .v2-a-svgicon {
    //     margin-right: 4px;
    //     width: 12px;
    //     height: 12px;
    //   }
    // }
    .version-select {
      ::v-deep .el-input__icon {
        height: 26px;
        line-height: 26px;
        color: #374e71;
        font-size: 12px;
      }
      ::v-deep .el-input__inner {
        border-radius: 222px;
        background-color: #f0f2f5;
        line-height: 26px;
        height: 26px;
        border: none;
        color: #374e71;
        padding-left: 32px;
      }
    }
    .el-divider {
      background-color: #c0c4cc;
    }

    .el-divider--vertical {
      height: 18px;
      margin: 0 12px;
    }

    .icon-cunweibanben {
      color: #4a5664;
      left: 12px;
      font-size: 12px;
    }
    ::v-deep .el-popover__reference-wrapper {
      margin-left: 12px;
    }

    ::v-deep .el-button {
      &.is-circle {
        padding: 7px 8px;
      }
      // &.is-round{
      //   padding:7px 24px;
      //   margin-left:12px;
      // }
      .iconfont {
        font-size: 12px;
      }
    }

    &-edit {
      .el-button {
        margin-left: 1px !important;
      }
    }
  }
}
</style>

<style lang="less">
.codeless-opr-btn-wrapper {
  padding: 8px 0;
  font-size: 14px;
  color: #333333;
  line-height: 1;
  .select-item {
    padding: 8px 0 8px 14px;
  }
}
</style>