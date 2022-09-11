<template>
  <div class="userloggerTable">
    <div class="excel-btn" @click="exportExcel" title="导出Excel文件"><i class="ideicon ideicon-daochuweiexcel"></i> <i v-show="isDownload" class="el-icon-loading"></i> 导出</div>
    <el-table :data="tableData" height="98%" v-loading="loading">
      <!-- <el-table-column align="center" width="55">
        <template slot-scope="scope">
          <svg v-if="scope.row.star == 1" class="icon svg-icon" @click="statLogger(scope.row)" aria-hidden="true">
            <use xlink:href="#ideicon-yishoucang"></use>
          </svg>
          <svg v-if="scope.row.star == 0" class="icon svg-icon" @click="statLogger(scope.row)" aria-hidden="true">
            <use xlink:href="#icon-shoucang"></use>
          </svg>
        </template>
      </el-table-column> -->
      <el-table-column prop="formatTime"  align="center" label="时间"></el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span :class="{ 'success-operation': scope.row.status == 1, 'error-operation': scope.row.status == 0 }"></span>
          <span :class="{ success: scope.row.status == 1, error: scope.row.status == 0 }"> {{ scope.row.status == 1 ? "正常" : "异常" }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="描述">
        <template slot-scope="scope">
          <span class="tips-text" @click="openDialog(scope.row)">{{ scope.row.operation}}</span>
        </template>
      </el-table-column>
    </el-table>
    <span class="total-num-tips">共 {{ totalSize }} 条</span>
    <el-pagination
      class="footer-pagination"
      background
      layout="sizes,prev, pager, next"
      :current-page="pageNumber"
      @size-change="pageSizeChange"
      @current-change="pageNumberChange"
      :page-sizes="[10, 15, 30, 100]"
      :page-size="pageSize"
      :total="totalSize"
    >
    </el-pagination>
  </div>
</template>

<script>
import tableMixin from '../js/tableMixin.js'
// import moment from 'moment'
import loggerDetailDialog from './loggerDetailDialog.vue'

export default {
  mixins: [tableMixin,window.V8.mixins],
  data() {
    return {
      isDownload: false,
      getDataPath: "getLogList",
    };
  },
  mounted() {},
  methods: {
    // ====== hook =======
    initParams() {
      return Object.assign({ pageNum: this.pageNumber, pageSize: this.pageSize }, this.$parent.getQueryParams());
    },
    afterInitHook(result) {
      for (const data of result.obj.content) {
        data.formatTime = window.moment(Number(data.createTime)).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    openDialog(data) {
      let ctx = this;
      ctx.open({
        path:"getLoggerDeatil",
        component:loggerDetailDialog,
        width: "60%", 
        type:'SUB',
        params:{
          response: data.response, 
          params: data.params, 
          loggerData: data, 
          isSingle: !data.keyId 
        },
        hideCancelBtn:true,
        hideConfirmBtn:true,
        customClass:'codeless-custom-dialog'
        
      })
      // window.activator.openDialog("loggerDetailDialog", { response: data.response, params: data.params, loggerData: data, isSingle: !data.keyId }, { width: "60%", height: "663px" });
    },

    statLogger(data) {
      this.API.request(
        "starLog?id=" + data.id,
        {},
        (res) => {
          this.$message.success("操作成功");
          data.star = "1";
        },
        (err) => {
          console.log(err);
          this.$message.error("操作失败！" + err.message);
        }
      );
    },

    exportExcel() {
      if (this.isDownload) {
        return;
      }
      this.isDownload = true;
      let ins = this.$message({
        duration: 0,
        type: "info",
        iconClass: "el-icon-loading",
        message: "正在下载文件，请稍后",
        center: true,
        showClose: true,
      });
      window
        .axios({
          method: "post",
          url:window.axios.bff+ "/log/export-excel",
          responseType: "blob",
          data: this.initParams(),
        })
        .then((res) => {
          this.isDownload = false;
          const url = window.URL.createObjectURL(new Blob([res]), { type: "application/vnd.ms-excel" });
          this.API.request("createDownload", url, "日志导出Excel.xlsx");
          ins.close();
          window.URL.revokeObjectURL(url);
        })
        .catch((err) => {
          this.$message.error("下载失败");
          this.isDownload = false;
          ins.close();
        });
    },
  },
};
</script>

<style lang="scss" scope>
.userloggerTable {
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 8px;
  padding: 30px;
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
    width: 10px;
    height: 10px;
    vertical-align: top;
    margin-top: 6px;
  }
  .error-operation {
    width: 8px;
    height: 8px;
    display: inline-block;
    vertical-align: top;
    margin: 6px 4px 0 4px;
    border-radius: 50%;
    background-color: #ff5353;
    position: relative;
    &::after {
      content: "";
      width: 15px;
      height: 15px;
      background-color: #ff5353;
      display: block;
      position: absolute;
      top: -3px;
      left: -3px;
      opacity: 0.35;
      border-radius: 50%;
    }
  }
  .success {
    color: #27c699;
  }
  .error {
    color: #f65656;
  }
  .total-num-tips {
    vertical-align: middle;
    margin-top: 15px;
    float: left;
  }
  .footer-pagination {
    //   display: inline-block;
    float: right;
    vertical-align: middle;
    margin-top: 6px;
  }
  .serach {
    top: -17px !important;
  }

  .excel-btn {
    position: absolute;
    top: -14px;
    left: 150px;
    width: 87px;
    height: 32px;
    background: #07b6b5;
    box-shadow: 0px 3px 6px rgba(55, 78, 113, 0.2);
    opacity: 1;
    border-radius: 100px;
    text-align: center;
    color: white;
    font-size: 14px;
    line-height: 32px;
    cursor: pointer;
  }

  .tips-text {
    font-size: 14px;
    cursor: pointer;
    font-weight: 500;
    color: #009aa6;
  }
}
</style>
