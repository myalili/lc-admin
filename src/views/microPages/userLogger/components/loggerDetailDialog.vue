<template>
  <div class="logger-dialog">
    <dialogHeader :title="'执行详情'" @close="$root.cancel">
      <!-- <i class="ideicon ideicon-sousuo"></i> -->
      <i class="iconfont icon-a-daimakuanghuanfuqianse" title="切换主题" @click="switchSkin"></i>
      <i class="iconfont" :class="{ 'icon-daimakuangquanping': !this.isFullScreen, 'icon-daimakuangtuichuquanping': this.isFullScreen }" @click="fullScreen"></i>
    </dialogHeader>
    <div class="detail-container">
      <div class="detail-catalog" v-loading="loading">
        <div class="catalog-title">
          <el-button-group>
            <el-button :type="catalogType === 'all' ? 'primary' : 'info'" size="mini" @click="changeCatalogType('all')" round>全部({{ listTypeNum.all }})</el-button>
            <el-button :type="catalogType === 'normal' ? 'primary' : 'info'" size="mini" @click="changeCatalogType('normal')" round>正常({{ listTypeNum.success || 0 }})</el-button>
            <el-button :type="catalogType === 'abnormal' ? 'primary' : 'info'" size="mini" @click="changeCatalogType('abnormal')" round
              >异常({{ listTypeNum.error || 0 }})</el-button
            >
          </el-button-group>
          <el-tooltip class="item" effect="dark" content="下载当前全部日志" placement="bottom">
            <div class="icon-btn" @click="download()">
              <i v-if="!isDownload" class="iconfont icon-xiazaiquanburizhi"></i>
              <i v-if="isDownload" class="el-icon-loading"></i>
            </div>
          </el-tooltip>
        </div>
        <div class="item-container">
          <div class="detail-item" :class="{ active: item.id === activeId }" v-for="(item, i) in loopData" :key="i" @click="clickItem(item)">
            <div class="detail-title">
              <span :class="{ 'success-operation': item.status == 1, 'error-operation': item.status == 0 }"></span>
              <!-- <span>{{ item.createUserName }}</span> -->
              <span>{{ item.operation }}</span>
            </div>
            <span class="detail-time"> {{ item.formatTime }} </span>
            <el-tooltip class="item" effect="dark" content="下载日志" placement="bottom">
              <i class="el-icon-download" @click="download(item)"></i>
            </el-tooltip>
          </div>
        </div>

        <div class="pagination-footer">
          <span>共{{ totolSize }}条</span>
          <el-pagination v-if="totolSize > 10"  @current-change="pageChange" small layout="prev, pager, next" :total="totolSize"> </el-pagination>
        </div>
      </div>
      <div class="detail-info">
        <codeEditor ref="codeEditor" style="width:100%;height:100%" lang="plaintext" :value="showCode" :showRightMenu="false" />
      </div>
    </div>
    <!-- <div class="detail-footer">
      <el-button type="primary" size="small" round @click="$emit('close')">确认</el-button>
    </div> -->
    <dialogFooter
          @cancel ='$root.cancel'
          @confirm ='$root.confirm'
    >
    </dialogFooter>
  </div>
</template>

<script>
// import Header from "../../components/dialogHeader";
// import codeEditor from "@v2-lib/webide.core/client/components/codeEditor.vue";
const {
  userLoggerApi
} = window.getBffApi()

export default {
  components: {
    // Header,
    //codeEditor,
  },
  mixins:[window.V8.mixins],
  // props: ["response", "params", "loggerData", "isSingle"],
  data() {
    return {
      isFullScreen: false,
      catalogType: "all",
      listData: [],
      listTypeNum: {
        all: 0,
        success: null,
        error: null,
      },
      activeId: null,
      pageSize: 10,
      pageNumber: 1,
      totolPage: 0,
      totolSize: 0,
      currentData: {},
      loading: false,
      isDownload:false,
      response:{},
      params:{},
      loggerData:{},
      isSingle:true,
    };
  },
  watch: {
    isFullScreen() {
      if (this.isFullScreen) {
        this.pageSize = 15;
      } else {
        this.pageSize = 6;
      }
    },
  },
  mounted() {
    let {response,params, loggerData, isSingle} = this.AParams;
    this.response = response;
    this.params = params;
    this.loggerData = loggerData;
    this.isSingle = isSingle;

    if (this.isSingle) {
      this.listData = [JSON.parse(JSON.stringify(this.loggerData))];
      if (this.loggerData.status == 1) {
        this.listTypeNum.success = 1;
      } else {
        this.listTypeNum.error = 1;
      }
      this.listTypeNum.all = 1;
      this.activeId = this.loggerData.id;
      this.totolSize = 1;
    } else {
      this.init();
    }
  },
  computed: {
    loopData() {
      let list = [];
      if (this.isSingle && this.listData.length > 0) {
        let data = this.listData[0];
        if (this.catalogType == "all") {
          list = this.listData;
        } else if (this.catalogType == "normal" && data.status == 1) {
          list.push(data);
        } else if (this.catalogType == "abnormal" && data.status == 0) {
          list.push(data);
        }
      } else {
        list = this.listData;
      }
      return list;
    },
    showCode() {
      let code = "";
      let params = "",
        response = "";
      if (this.isSingle) {
        params = this.params;
        response = this.response;
      } else {
        params = this.currentData.params;
        response = this.currentData.response;
      }
      if (params) {
        code = code + "######### 入参 #########";
        code = code + "\n" + userLoggerApi.request("formatTxTCode", params) + "\n";
      }
      if (response) {
        code = code + "######### 出参 #########";
        code = code + "\n" + userLoggerApi.request("formatTxTCode", response) + "\n";
      }
      return code;
    },
  },
  methods: {
    init() {
      let params = {
        pageNum: this.pageNumber,
        pageSize: this.pageSize,
        orders: [
          {
            key: "createTime",
            order: "DESC",
          },
        ],
        query: {
          keyId: this.loggerData.keyId,
        },
      };
      if (this.catalogType === "normal") {
        params.query.status = "1";
      }
      if (this.catalogType === "abnormal") {
        params.query.status = "0";
      }
      this.loading = true;
      userLoggerApi.request(
        "getLogList",
        params,
        (res) => {
          if (this.listTypeNum.error == null && this.catalogType !== "abnormal") {
            this.getErrorNumber();
          }
          for (const data of res.obj.content) {
            data.formatTime = window.moment(Number(data.createTime)).format("YYYY-MM-DD HH:mm:ss");
          }

          this.totolPage = res.obj.totalPages;
          this.totolSize = res.obj.totalElements;
          this.listData = res.obj.content;
          this.currentData = this.loopData[0] || {};
          this.activeId = this.loopData[0]?.id;
          this.loading = false;
          if (this.catalogType == "all") {
            this.listTypeNum.all = res.obj.totalElements;
          }
          if (this.catalogType == "normal") {
            this.listTypeNum.success = res.obj.totalElements;
            if (this.listTypeNum.all) {
              this.listTypeNum.error = this.listTypeNum.all - res.obj.totalElements;
            }
          }
          if (this.catalogType == "abnormal") {
            this.listTypeNum.error = res.obj.totalElements;
            if (this.listTypeNum.all) {
              this.listTypeNum.success = this.listTypeNum.all - res.obj.totalElements;
            }
          }
        },
        (err) => {
          console.log(err);
          this.loading = false;
          this.$message.error("获取详情列表失败！");
        }
      );
    },
    getErrorNumber() {
      userLoggerApi.request(
        "getLogList",
        {
          pageNum: 1,
          pageSize: 1,
          query: {
            keyId: this.loggerData.keyId,
            status: 0,
          },
        },
        (res) => {
          this.listTypeNum.error = res.obj.totalElements;
          this.listTypeNum.success = this.listTypeNum.all - this.listTypeNum.error;
        }
      );
    },

    clickItem(data) {
      this.currentData = data;
      this.activeId = data.id;
    },

    changeCatalogType(type) {
      this.catalogType = type;
      if (!this.isSingle) {
        this.init();
      }
    },

    pageChange(n) {
      this.pageNumber = n;
      this.init();
    },

    fullScreen() {
      this.isFullScreen = !this.isFullScreen;
      if (this.isFullScreen) {
        this.$el.style.width = "100%";
        this.$el.style.height = "100%";
      } else {
        this.$el.style.width = "60%";
        this.$el.style.height = "663px";
      }
    },
    switchSkin() {
      this.$refs.codeEditor.switchTheme();
    },
    download(data) {
      if (this.isSingle) {
        let fileName = `${this.loggerData.formatTime} ${this.loggerData.content} 出入参日志记录.txt`;
        userLoggerApi.request("createTxTDownload", this.showCode, fileName);
      }else{
        if(this.isDownload){
          return
        }
        this.isDownload = true
        window
        .$axios({
          method: "post",
          url:window.axios.bff+ "/log/export-excel2",
          responseType: "blob",
          data:{
            keyId:this.loggerData.keyId
          }
        })
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res]), { type: "application/vnd.ms-excel" });
          userLoggerApi.request("createDownload", url, "日志导出Excel.xlsx");
          window.URL.revokeObjectURL(url);
          this.isDownload = false
        })
        .catch((err) => {
          this.$message.error("下载失败");
          this.isDownload = false
        });
      }
    },
  },
};
</script>

<style lang="scss" scope>
.logger-dialog {
  width: 100%;
  height: 500px;
  .detail-container {
    width: 100%;
    height: calc(100% - 100px);
    display: flex;
    .detail-catalog {
      // flex: 3;
      // width:calc(100% - 70px);
      // max-width: 360px;
      width:360px;
      .catalog-title {
        height: 40px;
        width: 100%;
        line-height: 40px;
        text-align: center;
        .el-button-group {
          width: calc(100% - 62px);
          .el-button {
            width: 33%;
          }
        }
        .el-button--primary {
          background: #374e71;
          border-color: transparent;
        }
        .el-button--info {
          background: #e7ecef;
          border-color: transparent;
          color: #7f8c93;
        }
      }
      .item-container {
        width: 100%;
        height: calc(100% - 70px);
        overflow: auto;
        .detail-item {
          box-sizing: border-box;
          width: 92%;
          line-height: 13px;
          margin-left: 4%;
          border-bottom: 1px solid #dddfe5;
          text-align: left;
          padding: 10px 15px;
          font-size:12px;
          cursor: pointer;
          position: relative;
          .detail-title {
            width: 90%;
            > span {
              color: #333;
              font-weight: 500;
              vertical-align: middle;
              font-size: 13px;
            }
          }
          .detail-time {
            width: 80%;
            margin-top: 8px;
            display: inline-block;
            color: #7f8c93;
            padding-left: 14px;
          }
          .el-icon-download {
            position: absolute;
            right: 13px;
            top: 18px;
            font-size: 18px;
            color: #7f8c93;
            display: none;
          }

          &:hover {
            background: #f0f4f7;
            .el-icon-download {
              display: block;
            }
          }
        }
        .active {
          background: #f0f4f7;
          .el-icon-download {
            display: block;
          }
        }
      }

      .pagination-footer {
        > span {
          float: left;
          margin-top: 6px;
          margin-left: 8px;
        }
        .el-pagination {
          float: right;
        }
      }
    }
    .detail-info {
      // flex: 1;
      width:calc(100% - 360px);
      .code-editor-statusbar {
        display: none;
      }
    }
  }
  .detail-footer {
    height: 50px;
    width: 100%;
    text-align: center;
    line-height: 50px;
    border-top: 1px solid #dddfe5;
    box-sizing: border-box;
  }
  .iconfont {
    font-size: 15px !important;
    color: #7f8c93;
    cursor: pointer;
    margin: 0 5px;
  }
  .icon-btn {
    border-radius: 50%;
    display: inline-block;
    width: 26px;
    height: 26px;
    background-color: #e7ecef;
    vertical-align: middle;
    text-align: center;
    line-height: 26px;
    margin-left: 5px;
    > i {
      font-size: 12px;
      color: #374e71;
    }
  }

  .success-operation,
  .error-operation {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: #27c699;
    vertical-align: middle;
    display: inline-block !important;
    margin-right: 8px;
    position: relative;
  }
  .success-operation {
    width: 9px;
    height: 9px;
    // vertical-align: top;
    margin-left: 5px;
  }
  .error-operation {
    width: 16px;
    height: 16px;
    margin-right: 6px;
    background-color: #ffc7c7;
    &::before {
      content: "";
      position: absolute;
      width: 9px;
      height: 9px;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      margin: auto;
      border-radius: 50%;
      background-color: #f65656;
      //   left: 3.5px;
      //   top: 3px;
    }
  }
}
</style>
