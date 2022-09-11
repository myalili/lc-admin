<template>
  <div class="card-list">
    <div
      class="card"
      :style="{ '--color1': item.color[0], '--color2': item.color[1] }"
      v-for="(item, index) in options"
      :key="index"
      @click="openPage(item)"
    >
      <div class="icon">
        <codeless-icon :icon="item.icon"></codeless-icon>
      </div>
      <div class="content">
        <div class="title-ch">{{ item.titleCh }}</div>
        <div class="title-en">{{ item.titleEn }}</div>
      </div>
      <div class="num">
        {{ Number(item.num) > 999 ? "999" : item.num }}
      </div>
    </div>
  </div>
</template>

<script>
// import "../../icon/iconfont.css";
// import "../../icon/iconfont.js";
// import '../../fonts/icon/iconfont.css'
// import '../../fonts/icon/iconfont.js'
import pck from "./package.json";
export default {
  mixins:[window.V8.mixins],
  _options: pck.docs,
  name: "v2AWorkCard",
  props: ["dataSource"],
  data() {
    return {
      options: {
        Sponsor: {
          icon: "icon-wofaqide-gongzuotai",
          titleCh: "我的流程",
          titleEn: "Sponsor",
          path:'/myProcess',
          page:'microPages/myProcess',
          type: "leave",
          num: "3",
          color: ["#FF8DD3", "#3A91F4"],
        },
        Mention: {
          icon: "icon-tidaowo-gongzuotai",
          titleCh: "我的待办",
          titleEn: "Mention",
          path:'/myToDoList',
          type: "approve",
          page:'microPages/myToDoList',
          num: "6",
          color: ["#1E27ED", "#68CEEC"],
        },
        Agency: {
          icon: "icon-daibanshu-gongzuotai",
          titleCh: "我的跟踪",
          titleEn: "Agency",
          path:'/myTrack',
          page:'microPages/processRunning',
          num: "22",
          color: ["#CB78FF", "#0AECE1"],
        },
        Assignment: {
          icon: "icon-renwushu-gongzuotai",
          titleCh: "我的归档",
          titleEn: "Assignment",
          path:'/myDoneList',
          page:'microPages/processHistory',
          num: "20",
          color: ["#F9D664", "#FE69BE"],
        },
        Index: {
          icon: "icon-wodezhibiao-gongzuotai",
          titleCh: "我的指标",
          titleEn: "Index",
          num: "36",
          color: ["#0CD18F", "#0AECE1"],
        }
     
      },
    };
  },
  mounted() {
    const ctx = this;
  },
  computed: {
    objMap() {
      const ctx = this;
      return ctx.options;
    },
  },
  methods: {
    colorMap() {
      const ctx = this;
      ctx.obj = ctx.options[ctx.type];
    },
    openPage(item) {
      if(item.page){
        this.open({
         path:item.path,
         component: item.page,
        })
      }else if(item.type){
         this.$router.push({
          path: "/" + item.type,
        });
      }
    
    },
  },
};
</script>

<style lang="less" scoped>
.card-list {
  box-sizing: border-box;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  background: #ffffff;
  opacity: 1;
  border-radius: 6px;
  overflow: auto;
  .card:nth-last-child(1) {
    margin-right: 0;
  }
  .card {
    width: 200px;
    height: 91px;
    margin-right: 16px;
    background: linear-gradient(45deg, var(--color1) 0%, var(--color2) 100%);
    opacity: 1;
    border-radius: 5px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    justify-content: space-between;
    padding: 24px 20px 22px 23px;
    cursor: pointer;
    .icon {
      width: 23px;
      height: 23px;
    }
    .content {
      width: 40%;
      color: #fff;

      .title-ch {
        font-size: 14px;
        font-family: Arial;
        font-weight: bold;
        line-height: 28px;
        color: #ffffff;
        opacity: 1;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }
      .title-en {
        font-size: 14px;
        font-family: Arial;
        font-weight: 400;
        line-height: 28px;
        color: #ffffff;
        opacity: 0.5;
      }
    }
    .num {
      // width: 30%;
      font-size: 22px;
      font-family: Arial;
      font-weight: bold;
      line-height: 28px;
      color: #ffffff;
      opacity: 1;
    }
  }
}
</style>