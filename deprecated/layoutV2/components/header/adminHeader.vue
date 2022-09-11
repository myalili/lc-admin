<template>
  <div :class="['aweb-header-ctn']">
    <!-- <logo :collapsed="collapsed" class="aweb-header-logo" /> -->
    <div class="aweb-header-center">
      <div
        class="
          aweb-memu-time
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
      <div class="whitespace-nowrap hidden sm:hidden md:inline-block">
        <span class="aweb-header-notice">
          <i class="iconfont icon-dinglanbiaoyu"></i> 头条：
        </span>
        <span class="text-muted">热烈庆祝我行用户储蓄突破9000万亿！</span>
      </div>
      <!-- <div style='color:#98AAB3'>       
        <i class="el-icon-time"></i>
        上次登录于2021年06月08日 13:45
      </div> -->
      <div class="relative">
        <svg
          aria-hidden="true"
          class="icon user-icon absolute z-1 w-3 h-3"
          :class="type"
          style="right: 136px; top: 13px"
          v-if="!superAdmin"
        >
          <use xlink:href="#icon-zuhumingcheng "></use>
        </svg>
        <!-- <i class='iconfont icon-zuhumingcheng absolute z-1' style='right:258px;font-size:12px'></i> -->
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
      </div>
    </div>

    <div class="aweb-header-menu" v-if="showMenu">
      <aweb-menu
        theme="dark"
        mode="horizontal"
        :menus="menus"
        @select="menuSelect"
      ></aweb-menu>
    </div>

    <i class="el-icon-lock cursor-pointer text-lg mr-4" @click="lock"></i>

    <div :class="['aweb-header-right']">

        <theme></theme>
      <header-avatar></header-avatar>
    </div>
  </div>
</template>

<script>
import awebMenu from "../menu/awebMenu.vue";
import headerAvatar from "./headerAvatar.vue";
import theme from "./theme.vue";

// import monent from "moment";

export default {
  name: "AdminHeader",
  components: { awebMenu, headerAvatar,theme },
  props: ["collapsed", "menus", "showMenu"],
  data() {
    return {
      timer: null,
      date: new Date(),
      langList: [
        { key: "CN", name: "简体中文", alias: "简体" },
        { key: "HK", name: "繁體中文", alias: "繁體" },
        { key: "US", name: "English", alias: "English" },
      ]
    };
  },
  computed: {
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
  },
  methods: {
    lock() {
      this.$emit('lock');
    },
    changeHandler(val) {
      this.$store
        .dispatch("user/changeTenant", {
          tenantId: val,
        })
        .then((res) => {
          // this.$router.push('/')
          window.location.reload();
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
</style>
