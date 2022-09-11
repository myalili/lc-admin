<template>
  <div class="v2-a-work-files-edit">
    <div class="string_input mb-4">
      <span class="flex items-center justify-between">
        <span class="text-sm">{{ item.desp }}</span>
        <!-- <span class="btn-add" @click="add">+</span> -->
        <el-button type="primary" size="mini" class="w-5 h-5" style="padding: 0" icon="el-icon-plus" circle @click="add"></el-button>
      </span>
      <div class="">
        <div
          class="prototype-config flex flex-col items-center"
          v-for="(itemi, indexi) in obj.model[item.name].pages"
          :key="indexi"
          @mouseover="itemi.hoverIndex = 1"
          @mouseout="itemi.hoverIndex = -1"
        >
          <div class="title relative">
            <div class="absolute -left-2 w-8 h-7 config-icon">
              <!-- <img src="../images/no.png" alt="" srcset="" /> -->
              <span class="absolute top-1 left-1 text-white text-sm"
                >0{{ indexi + 1 }}</span
              >
            </div>
            <span :title="itemi.title" v-if="!itemi.edit">{{
              itemi.title
            }}</span>
            <el-input
              size="mini"
              style="width: 150px"
              v-model="itemi.title"
              v-else
            ></el-input>
            <div class="extra">
              <el-button
                type="text"
                icon="el-icon-edit"
                class="text-sm text-gray-500"
                @click="itemi.edit = !itemi.edit"
              />
              <el-button
                type="text"
                icon="el-icon-delete"
                class="text-sm text-gray-500"
                @click="del(itemi, indexi)"
              />
            </div>
          </div>
          <el-divider />
          <div class="content">
            <div class="proto">
              <div class="pcr">类型</div>
              <span v-if="!itemi.edit">{{
                pageType.filter((i) => i.value === itemi.type)[0].label
              }}</span>
              <el-select
                size="mini"
                style="width: 150px"
                v-model="itemi.type"
                placeholder="请选择"
                @change="typeChange($event, itemi)"
                v-else
              >
                <el-option
                  v-for="item in pageType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div class="proto" v-if="itemi.type === 'SUB' && itemi.dialogInfo">
              <div class="pcr">弹窗宽度</div>
              <el-input
                size="mini"
                v-model="itemi.dialogInfo.width"
                style="width: 75px"
                placeholder="请填写"
                v-if="itemi.edit"
              />
              <el-select
                size="mini"
                style="width: 75px"
                v-model="itemi.dialogInfo.widthUnit"
                v-if="itemi.edit"
              >
                <el-option value="px">px</el-option>
                <el-option value="em">em</el-option>
                <el-option value="rem">rem</el-option>
                <el-option value="%">%</el-option>
              </el-select>
              <span v-else>{{
                itemi.dialogInfo.width + itemi.dialogInfo.widthUnit
              }}</span>
            </div>
            <div class="proto" v-if="itemi.type === 'SUB' && itemi.dialogInfo">
              <div class="pcr">弹窗高度</div>
              <el-input
                size="mini"
                v-model="itemi.dialogInfo.height"
                style="width: 75px"
                placeholder="请填写"
                v-if="itemi.edit"
              />
              <el-select
                size="mini"
                style="width: 75px"
                v-model="itemi.dialogInfo.heightUnit"
                v-if="itemi.edit"
              >
                <el-option value="px">px</el-option>
                <el-option value="em">em</el-option>
                <el-option value="rem">rem</el-option>
                <el-option value="%">%</el-option>
              </el-select>
              <span v-else>{{
                itemi.dialogInfo.height + itemi.dialogInfo.heightUnit
              }}</span>
            </div>
            <div class="proto">
              <div class="pcr">路径</div>
              <el-input
                size="mini"
                style="width: 150px"
                v-model="itemi.path"
                v-if="
                  (itemi.type === 'WINDOW' && itemi.edit) ||
                  (itemi.type === 'js' && itemi.edit)
                "
              ></el-input>
              <span
                v-if="
                  (itemi.type === 'WINDOW' && !itemi.edit) ||
                  (itemi.type === 'js' && !itemi.edit)
                "
                :title="itemi.edit"
                >{{ itemi.path }}</span
              >
              <page-select
                :value.sync="itemi.path"
                :wid="itemi.wid"
                style="width: 150px"
                :disabled="!itemi.edit"
                :menus="$store.state.user.menus"
                v-if="itemi.type !== 'WINDOW' && itemi.type !== 'js'"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="flex-center margin-top-8">
      <span class="config-title">入口列表：</span>
      <el-select
        class="margin-left-8"
        style="width: 100%"
        filterable
        multiple
        value-key="id"
        v-model="obj.model[item.name].pages"
        placeholder="请选择"
        size="mini"
      >
        <el-option
          v-for="item in menus"
          :key="item.id"
          :label="item.meta && item.meta.title"
          :value="item"
        />
      </el-select>
    </div> -->
  </div>
</template>

<script>
import pck from "./package.json";

export default {
  _options: pck.docs,
  name: "v2AWorkEntranceEdit",

  props: {
    obj: {
      type: Object,
      default: () => {
        return {};
      },
    },
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  data() {
    return {
      pageType: [
        {
          label: "打开页面",
          value: "",
        },
        {
          label: "打开弹窗",
          value: "SUB",
        },
        {
          label: "打开抽屉页面",
          value: "drawer",
        },
        {
          label: "打开外部页面",
          value: "WINDOW",
        },
        {
          label: "打开js页面",
          value: "js",
        },
      ],
    };
  },
  mounted() {
    console.log(this.obj.model, this.item);
    console.log(this.obj.model[this.item.name]);
  },
  computed: {
    menus() {
      console.log("this.$store.state.user.menus", this.$store.state.user.menus);
      return this.$store.state.user.menus.filter(
        (i) => i.codelessType && i.codelessType === "0"
      );
    },
  },

  methods: {
    add() {
      const ctx = this;
      console.log(ctx.obj.model[ctx.item.name].pages);
      console.log(ctx.item.name);
      ctx.obj.model[ctx.item.name].pages.push({
        title: "新页面" + ctx.obj.model[ctx.item.name].pages.length,
        type: "",
        path: "",
        hoverIndex: -1,
        edit: true,
        dialogInfo: {
          width: "50",
          widthUnit: "%",
          height: "50",
          heightUnit: "%",
        },
        wid: ctx.obj.model.wid + '-' + ctx.obj.model[ctx.item.name].pages.length
        // [ctx.item.itemName] : '标签' + (indexi + 2),
      });
    },
    del(itemi, indexi) {
      const ctx = this;
      ctx.obj.model[ctx.item.name].pages.splice(indexi, 1);
    },
    // choosePage(e, itemi) {
    //   console.log(e, itemi.path);
    //   console.log("选择页面", e);
    //   const ctx = this;
    //   itemi.path = e;
    // },
    typeChange(e, itemi) {
      console.log(e);
      if (e === "WINDOW") {
        itemi.path = "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.v2-a-work-files-edit {
  width: 100%;
  margin-bottom: 30px;
  font-size: 14px;
  line-height: 27px;
  color: #333333;
  .sub-title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    font-weight: bold;
    line-height: 27px;
    color: #333333;
  }
  .prototype-config {
    width: 100%;
    background: #ffffff;
    border: 1px solid #c8d0d4;
    box-sizing: border-box;
    padding-bottom: 14px;
    margin-top: 14px;
    border-radius: 5px;
    position: relative;
    .title {
      width: 100%;
      padding: 0 14px 0 32px;
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      line-height: 47px;
      color: #333333;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        width: 50%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1; //在第几行显示...
        -webkit-box-orient: vertical;
      }
    }
    .content {
      width: 100%;
      box-sizing: border-box;
      padding-left: 18px;
      background: #ffffff !important;
      .proto {
        width: 100%;
        font-size: 14px;
        color: #333333;
        margin-top: 14px;
        display: flex;
        align-items: center;
        .pcr {
          width: 73px;
          height: 25px;
          margin-right: 9px;
          color: #5b5b5b;
          background: #f0f2f5;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        span {
          max-width: 62%;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 1; //在第几行显示...
          display: -webkit-box;
          -webkit-box-orient: vertical;
        }
      }
    }
  }

  ::v-deep .el-divider--horizontal {
    width: 95%;
    margin: 0;
  }
}

.config-title {
  font-weight: bold;
}

.flex-center {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.margin-top-8 {
  margin-top: 8px;
}
.margin-left-8 {
  margin-left: 8px;
}
</style>
