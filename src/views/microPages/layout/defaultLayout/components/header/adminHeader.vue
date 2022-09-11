<template>
  <div class="codeless-header-ctn box-border flex items-center justify-between w-full">
    <!-- <logo :collapsed="collapsed" class="aweb-header-logo" /> -->
    <div class="codeless-header-left h-full items-center flex">
        <div class="codeless-header-left-icon flex items-center justify-center h-full cursor-pointer" @click="changeProject">
          <el-tooltip class="item" effect="dark" :content="projMess" placement="bottom-start" v-if="!superAdmin">
              <codeless-icon icon="icon-xiangmuxinxi" style="width:16px;height:16px" class="transform hover:scale-150" ></codeless-icon>
          </el-tooltip>
          <codeless-icon icon="icon-xiangmuxinxi"  v-else style="width:16px;height:16px" ></codeless-icon>
        </div>
        <div class="codeless-header-left-divided"></div>
    </div>
    <div class="codeless-header-center h-full inline-flex justify-between items-center">
      <div class="switch-wdepartmentlistsbox">
          <div class="switch-wdepartmentlist" v-if="!hiddendepartmentlist">
            <svg class="icon svg-icon" aria-hidden="true">
              <use xlink:href="#icon-zuhu"></use>
            </svg>
            <span >{{name}}</span>
            <i  class="el-icon-arrow-up"></i>
          </div>
        <el-dropdown @command="switchcurrentdepartment" class="el-dropdown-sss">
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="items.id" v-for="(items) in departmentlist" :key="items.id" :style="{'color':curdepartment.id===items.id?'var(--color-primary)':''}">{{items.name}}</el-dropdown-item>
          </el-dropdown-menu>
          <div class="switch-wdepartmentlists"></div>
        </el-dropdown>
      </div>
      <div class="whitespace-nowrap hidden sm:hidden md:inline-block">
        <span class="codeless-header-notice">
          <i class="iconfont icon-dinglanbiaoyu"></i> 头条：
        </span>
        <span class="text-muted">热烈庆祝我行用户储蓄突破9000万亿！</span>
      </div>
      <!-- <div style='color:#98AAB3'>       
        <i class="el-icon-time"></i>
        上次登录于2021年06月08日 13:45
      </div> -->
      <!-- <div class="relative">
        <svg
          aria-hidden="true"
          class="icon user-icon absolute z-1 w-3 h-3"
          :class="type"
          style="right: 136px; top: 13px"
          v-if="!superAdmin"
        >
          <use xlink:href="#icon-zuhumingcheng "></use>
        </svg>
        <i class='iconfont icon-zuhumingcheng absolute z-1' style='right:258px;font-size:12px'></i>
        <el-select
          v-model="tenantId"
          placeholder="请选择"
          class="w-40 tenant-select"
          @change="changeHandler"
          v-if="!superAdmin"
          size="mini"
        >
          <el-option
            v-for="item in tenantList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div> -->
      <div
        class="
          codeless-menu-time
          align-middle
          whitespace-nowrap
          hidden
          sm:hidden
          md:inline-block
          text-muted
        "
      >
        <i class="el-icon-date text-muted"></i>
        {{ getTime }}
      </div>
    </div>

    <i class="el-icon-lock cursor-pointer text-lg mr-4" @click="lock"></i>

    <div class="codeless-header-right flex h-full float-right">

        <theme></theme>
      <header-avatar></header-avatar>
    </div>
  </div>
</template>

<script>
// import awebMenu from "../menu/awebMenu.vue";
import headerAvatar from "./headerAvatar.vue";
import theme from "./theme.vue";
import projectMessage from './projectMessage.vue'
export default {
  name: "AdminHeader",
  components: {headerAvatar,theme },
  mixins: [window.V8.mixins,window.codelessMixins.customDialog],
  props: ["collapsed", "menus", "showMenu"],
  data() {
    return {
      timer: null,
      date: new Date(),
      langList: [
        { key: "CN", name: "简体中文", alias: "简体" },
        { key: "HK", name: "繁體中文", alias: "繁體" },
        { key: "US", name: "English", alias: "English" },
      ],
      // currentdepartment:{
      //   name:"未关联部门"
      // },
      icon_down_up: false,
      
    };
  },
  computed: {
    name(){
       return this.curdepartment.name||'未关联部门'
    },
    curdepartment(){
      return this.$store.state.user.curDepartment||{}
    },
    departmentlist(){
      return this.$store.state.user.currentData.department;
    },
    hiddendepartmentlist(){
      return  !this.departmentlist.length;
    },
    projMess(){
      if(this.tenantList.length>1){
         return '切换项目'
      }else{
        return '项目信息'
      }
    },
    tenantList() {
      //console.log('tenantId',this.$store.state.user.tenantList)
      return this.$store.state.user.tenantList;
    },
    superAdmin() {
      return this.$store.state.user.currentData.superAdmin;
    },
    tenantId() {
      //console.log('tenantId',this.$store.getters["user/tenantId"])
      return this.$store.getters["user/tenantId"];
    },
    getTime() {
      let week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      let date = window.moment(this.date);
      return ` ${date.format("YYYY年MM月DD日")} ${
        week[date.day()]
      } ${date.format("HH:mm")}`;
    },
    // info() {
    //   return this.$store.getters["project/GET_PROJECT_INFO"] || {};
    // },
  },
  mounted() {
    // console.log(this.tenantId);
    this.getTenantList();
    this.timer = setInterval(() => {
      this.date = new Date(); // 修改日期数据
    }, 1000);
    //默认选中第一个部门
    // this.$nextTick(()=>{
    //   if(this.departmentlist.length > 0){
    //      this.currentdepartment =  this.departmentlist[0];
    //   }
    // })
  },
  methods: {
    //切换部门
    async switchcurrentdepartment(id){
      let row = this.departmentlist.filter(v => v.id ==id)[0];
      if(row.id===this.curdepartment.id){
        return 
      }
      // this.currentdepartment =  row;
      let res = await this.$store.dispatch("user/setcurDepartment",row);
      res && this.$router.push('/login');
    },
    changeProject(){
      if(!this.superAdmin){
        let self = this;
        let tenantId = { tenantId:this.tenantId }
        self.openCustomDialog({
          title:self.projMess,
          path:'projectMessage',
          width:"616px",
          component:projectMessage,
          hideFooter:true,
          maxHeight:'600px',
          propsData:{
            tenantList:self.tenantList,
            tenantId,
            
          },
    
          confirmCallback:async(tenantId)=>{
            self.changeHandler(tenantId)
          }
        })
    }
         
    },
    lock() {
      this.$emit('lock');
    },
    changeHandler(val) {
      this.$store
        .dispatch("user/changeTenant", {
          tenantId: val,
        })
        .then((res) => {
          this.$router.push('/login');
         
          //window.location.reload();
          //  window.location.reload();
        })
        .catch((e) => {
          this.$notify({
            title: "切换租户失败",
            message: e,
            type: "success",
          });
        });
    },
    getTenantList() {
      this.$store.dispatch("user/setTenants");
    },
    menuSelect(data) {
      this.$emit("menuSelect", data);
    }
  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除当前日期定时器
    }
  },
};
</script>

<style lang="less" scoped>
.codeless-header-ctn {
  height: 40px;
  // box-sizing: border-box;
  line-height: 40px;
  border-bottom:1px solid #EBEEF0;
  // position: relative;
  // display: flex;
  // align-items: center;
  // justify-content: space-between;

  .codeless-header-left{
    width:60px;
    height:40px;
    .codeless-header-left-icon{
      width:59px;
    }
    .codeless-header-left-divided{
      width:1px;
      height:13px;
      background-color: #A8C1D6;
    }
    
  }
  .codeless-header-center {
      color: #5b5b5b;
      font-size: 12px;
      flex:1;
      padding-left:16px;
      margin-right:16px;

      .codeless-menu-time {
        .el-icon-date{
          // color:#B8C5CC;
          margin-right:2px;
        }
      }
      .codeless-header-notice {
        i{
          font-size: 12px;
        }
        color: #ff5500;
      }
      .tenant-select{
        ::v-deep .el-input__icon{
          height: 26px;
          line-height: 26px;
          color:#374E71;
          font-size: 12px;
        }
        ::v-deep .el-input__inner{
          border-radius:222px;
          background-color: #F0F2F5;
          line-height: 26px;
          height:26px;
          border:none;
          color:#374E71;
          padding-left:32px;
        }
      }
      .switch-wdepartmentlistsbox {
          height:100%;
          width:auto;
          display:flex;
          flex-direction: row;
          align-items:center;
          justify-content:flex-start;
          position: relative;

        .switch-wdepartmentlist {
          display:flex;
          flex-direction: row;
          align-items:center;
          justify-content:space-between;
          cursor: pointer;
          z-index:0;
          svg {
            width: 12px;
            height:14px;
          }

          span {
            font-size: 14px;
            font-weight: 400;
            color: var(--codeless-font-color-primary);
            margin-left:8px;
            margin-right: 8px;
          }
          i {
            font-size: 7px;
            transform-origin: 50% 50%;
            transform:rotate(180deg);
            color:var(--color-gray);
            transition: all 0.2s ease-in-outm 0s;
          }
        }
        .el-dropdown {
          width:100%;
          height: 100%;
          position:absolute;
        }
        .switch-wdepartmentlists {
          width:100%;
          height: 100%;
          position:absolute;
          left:0px;
          top:0px;
          z-index:9;
        }
      }
    }
  .codeless-header-right {
    // float: right;
    // display: flex;
    // height: 100%;

   ::v-deep .el-dropdown{
      color:#374E71;
      font-size: 12px;
    }
    
  }
}

  ::v-deep .aweb-dialog__body{
  padding-bottom: 40px;
}
</style>
