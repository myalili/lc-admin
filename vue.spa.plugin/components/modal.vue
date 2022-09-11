<template>
  <transition name="dialog-fade">
    <div
      class="aweb-dialog__wrapper"
      v-if="dialogVisible"
      @click.self="cancel(true)"
      ref="awebDiao"
    >
      <div
        class="aweb-dialog"
        :style="{
          width: isGrow ? '100%' : width,
          height: isGrow ? '100%' : height,
        }"
        :class="[customClass]"
        ref="awebDialog"
      >
        <div class="aweb-dialog__header" slot="header">
          <span class="aweb-dialog__title" v-if="title">{{ title }}</span>
          <div class="aweb-dialog__header-right">
            <i
              class="aweb-dialog__headerbtn"
              v-for="optItem in optBtns"
              :class="optItem.class"
              :key="optItem.id || Math.random()"
              v-html="optItem.content"
              @click.stop="proxyFn($event, optItem, optItem.callback)"
            ></i>

            <i
              class="aweb-dialog__fullview"
              @click.stop="btnGrow"
              v-if="fullScreenC"
            >
              <svg
                t="1630635822515"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="5017"
                width="128"
                height="128"
              >
                <path
                  d="M347.989333 806.784H231.594667a36.949333 36.949333 0 0 1-36.949334-36.949333v-89.813334H144V810.666667a42.666667 42.666667 0 0 0 42.666667 42.666666h161.322666v-46.549333zM194.688 243.498667c0-20.394667 16.554667-36.949333 36.949333-36.949334h116.394667V160H186.666667a42.666667 42.666667 0 0 0-42.666667 42.666667v136.021333h50.688V243.498667zM848 769.834667a36.949333 36.949333 0 0 1-36.949333 36.949333h-121.728V853.333333h166.656a42.666667 42.666667 0 0 0 42.666666-42.666666v-130.688h-50.688v89.856zM856.021333 160h-166.656v46.549333h121.728c20.437333 0 36.949333 16.554667 36.949334 36.949334v95.189333h50.688V202.666667c-0.042667-23.552-19.157333-42.666667-42.709334-42.666667z"
                  p-id="5018"
                ></path>
              </svg>
            </i>

            <i class="aweb-dialog__close" @click.stop="btnClose">
              <svg
                t="1630635995913"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="6327"
                width="64"
                height="64"
              >
                <path
                  d="M819.43773308 838.48919788a25.24793148 25.24793148 0 0 1-17.84677073-7.40116078L193.64596748 223.1430422a25.19544098 25.19544098 0 1 1 35.69354138-35.69354141l607.99748541 607.99748541a25.30042199 25.30042199 0 0 1-17.89926119 43.04221168"
                  fill="#434243"
                  p-id="6328"
                ></path>
                <path
                  d="M211.49273817 838.48919788a25.19544098 25.19544098 0 0 1-17.84677069-43.09470218L801.64345286 187.44950079a25.24793148 25.24793148 0 0 1 35.64105091 35.69354141L229.33950886 831.0880371a25.19544098 25.19544098 0 0 1-17.8467707 7.40116077"
                  fill="#434243"
                  p-id="6329"
                ></path>
              </svg>
            </i>
          </div>
        </div>
        <div
          class="aweb-dialog__body"
          :class="{
            'no-footer': hideCancelBtn && hideConfirmBtn,
          }"
        >
          <transition name="fade" mode="out-in">
            <sub-page-ctn
              :page="component"
              :params="params"
              :deploy="deploy"
              :other="other"
              :pageType="pageType"
              ref="subPageCtn"
            ></sub-page-ctn>
          </transition>
        </div>
        <div
          slot="footer"
          class="aweb-dialog__footer"
          v-if="!(hideCancelBtn && hideConfirmBtn)"
        >
          <div class="dialog-footer">
            <button
              type="button"
              class="aweb-button aweb-button--default"
              v-if="!hideCancelBtn"
              @click.stop="cancel(false, '__instance')"
            >
              <span v-html="customCancelBtn"></span>
            </button>
            <button
              type="button"
              class="aweb-button aweb-button--primary"
              v-if="!hideConfirmBtn"
              @click.stop="confirm('__instance')"
            >
              <span v-html="customConfirmBtn"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import subPageCtn from "./subPageCtn";
export default {
  name: "Amodal",
  props: {
    __parent: {
      default() {
        return null;
      },
    },
    deploy: Boolean,
    other: Boolean,
    customClass: String,
    awb__modal__store: {
      default() {
        return null;
      },
    },
    pageType: {
      default: () => "",
    },
    width: {
      default() {
        return "50%";
      },
    },
    height: {
      default() {
        return "auto";
      },
    },
    closeOnClickModal: {
      default() {
        return false;
      },
    },
    cancelCallback: {
      default() {
        return () => {};
      },
    },
    confirmCallback: {
      default() {
        return () => {};
      },
    },
    beforeConfirm: Function,
    fullScreen: Boolean,
    hideCancelBtn: Boolean,
    hideConfirmBtn: Boolean,
    customConfirmBtn: String,
    customCancelBtn: String,
    component: {
      default() {
        return "";
      },
    },
    title: {
      default() {
        return "";
      },
    },
    params: {
      default() {
        return {};
      },
    },
    optBtns: {
      default() {
        return [];
      },
    },
  },
  components: {
    subPageCtn,
  },
  data() {
    return {
      isGrow: false,
      dialogGorw:
        window.store &&
        window.store.getters &&
        window.store.getters["project/GET_PROJECT_INFO"] &&
        window.store.getters["project/GET_PROJECT_INFO"].dialogGorw,
      dailogWidth: 0,
      dailogHeight: 0,
    };
  },
  beforeCreate() {},
  mounted() {
    this.__parent &&
      this.__parent.$root &&
      this.__parent.$root.$emit("dailog__after__load", this);
  },
  computed: {
    fullScreenC() {
      return this.dialogGorw || this.fullScreen;
    },
    dialogVisible: {
      get() {
        return this.awb__modal__store.state.modalVisible;
      },
      set(val) {
        console.log(this.dailogHeight, this.dailogWidth);
        this.awb__modal__store.commit("set_modalVisible", val);
      },
    },
  },

  methods: {
    async proxyFn(e, item, cb) {
      if (typeof cb === "function") {
        await cb(e, item, this);
      } else {
        console.error(
          "aweb-dialog__headerctn bind click callback isn function"
        );
      }
    },
    async cancel(isLayer, params, ...retParmas) {
      if (isLayer && !this.closeOnClickModal) {
        return;
      }
      if (params === "__instance") {
        params =
          this.$refs.subPageCtn &&
          this.$refs.subPageCtn.$refs &&
          this.$refs.subPageCtn.$refs._op_subPage;
      }
      if (typeof this.cancelCallback === "function") {
        await this.cancelCallback(params, ...retParmas);
      }
      this.closeDialog();
    },
    async confirm(params, ...retParams) {
      let $el =
        this.$refs.subPageCtn &&
        this.$refs.subPageCtn.$refs &&
        this.$refs.subPageCtn.$refs._op_subPage;
      if (params === "__instance") {
        params = $el;
      }
      if (typeof this.beforeConfirm === "function") {
        let ret = await this.beforeConfirm($el, ...retParams);
        if (!ret) {
          return;
        }
      }

      if (typeof this.confirmCallback === "function") {
        await this.confirmCallback(params, ...retParams);
      }

      this.closeDialog();
    },
    closeDialog() {
      this.dialogVisible = false;
      this.awb__modal__store.state.modalIns &&
        this.awb__modal__store.state.modalIns.$destroy();
    },
    close(params, ...retParmas) {
      this.cancel(false, params, ...retParmas);
    },
    btnClose() {
      this.dialogVisible = false;
      this.awb__modal__store.state.modalIns &&
        this.awb__modal__store.state.modalIns.$destroy();
    },
    btnGrow() {
      if (this.fullScreenC) {
        this.isGrow = !this.isGrow;
      }
      // let type = typeof this.dialogGorw;
      // console.log(type, "type");
      // console.log($(".aweb-dialog"));
      // if (type == "boolean") {
      //   if (this.isGrow) {
      //     $(".aweb-dialog").addClass("fullView");
      //     this.isGrow = false;
      //   } else {
      //     $(".aweb-dialog").removeClass("fullView");
      //     this.isGrow = true;
      //   }
      // } else if (type == "number") {
      //   this.dailogWidth = $(".aweb-dialog")[0].clientWidth;
      //   this.dailogHeight = $(".aweb-dialog")[0].clientHeight;
      //   if (this.isGrow) {
      //     $(".aweb-dialog").css("width", this.dailogWidth * this.dialogGorw);
      //     $(".aweb-dialog").css("height", this.dailogHeight * this.dialogGorw);
      //     this.isGrow = false;
      //   } else {
      //     $(".aweb-dialog").css("width", this.dailogWidth / this.dialogGorw);
      //     $(".aweb-dialog").css("height", this.dailogHeight / this.dialogGorw);
      //     this.isGrow = true;
      //   }
      // }
    },
  },
  beforeDestroy() {
    this.__parent &&
      this.__parent.$root &&
      this.__parent.$root.$emit("dailog__before__close", this);
    let modalIns =
      this.awb__modal__store &&
      this.awb__modal__store.state &&
      this.awb__modal__store.state.modalIns;
    modalIns &&
      modalIns.$el &&
      modalIns.$el.parentNode &&
      modalIns.$el.parentNode.removeChild(modalIns.$el);
    this.awb__modal__store &&
      this.awb__modal__store.commit("set_modalIns", null);
  },
  destroyed() {},
};
</script>

<style lang="less">
.aweb-dialog__wrapper {
  z-index: 999;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  background: rgba(0, 0, 0, 0.3);
  .aweb-dialog {
    position: absolute;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    box-sizing: border-box;
    width: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .fullView {
      width: 100% !important;
      height: 100% !important;
      margin: 0px;
    }
  }

  .aweb-dialog__header {
    display: flex;
    padding: 12px 20px;
    padding-bottom: 10px;
    align-items: center;
    flex-direction: row;
    border-bottom: 1px solid #e5e5e5;

    .aweb-dialog__title {
      flex-grow: 1;
      flex-shrink: 1;
      min-width: 100px;
      text-overflow: ellipsis;
    }
    .aweb-dialog__header-right {
      position: absolute;
      right: 20px;
      i {
        display: inline-block;
        vertical-align: middle;
        margin-left: 10px;
        cursor: pointer;
        color: #909399;
        svg {
          display: inline-block;
          vertical-align: middle;
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
      }
    }
  }
  .aweb-dialog__body {
    padding: 20px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
    overflow-y: auto;
    height: calc(100% - 100px);
    box-sizing: border-box;
    flex-grow: 1;
  }
  .aweb-dialog__body.no-footer {
    // height: calc(100% - 48px);
    height: 100%;
  }

  .aweb-dialog__footer {
    padding: 10px 20px;
    text-align: right;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    .aweb-button {
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      background: #ffffff;
      border: 1px solid #dcdfe6;
      border-color: #dcdfe6;
      color: #606266;
      -webkit-appearance: none;
      text-align: center;
      box-sizing: border-box;
      outline: none;
      margin: 0;
      transition: 0.1s;
      font-weight: 500;
      user-select: none;
      padding: 10px 20px;
      font-size: 14px;
      border-radius: 4px;
      & + .aweb-button {
        margin-left: 12px;
      }
      &.aweb-button--primary {
        color: #ffffff;
        background-color: #409eff;
        border-color: #409eff;
      }
    }
  }
}
</style>