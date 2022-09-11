<template>
  <div class="string_input">
    <span class="flex items-center justify-between">
      <span class="text-sm">{{ item.desp }}</span>
    </span>
    <div class="">
      <div
        class="prototype-config flex flex-col items-center"
        @mouseover="obj.model[item.name].hoverIndex = 1"
        @mouseout="obj.model[item.name].hoverIndex = -1"
      >
        <div class="title relative">
          <span :title="obj.model[item.name].title" v-if="!obj.model[item.name].edit">{{ obj.model[item.name].title }}</span>
          <el-input
            size="mini"
            style="width: 150px"
            v-model="obj.model[item.name].title"
            v-else
          ></el-input>
          <div class="extra">
            <el-button
              type="text"
              icon="el-icon-edit"
              class="text-sm text-gray-500"
              @click="obj.model[item.name].edit = !obj.model[item.name].edit"
            />
            <!-- <el-button
              type="text"
              icon="el-icon-delete"
              class="text-sm text-gray-500"
              @click="del(obj.model[item.name], indexi)"
            /> -->
          </div>
        </div>
        <el-divider />
        <div class="content">
          <div class="proto">
            <div class="pcr">类型</div>
            <span v-if="!obj.model[item.name].edit">{{
              pageType.find((i) => i.value === obj.model[item.name].type).label
            }}</span>
            <el-select
              size="mini"
              style="width: 150px"
              v-model="obj.model[item.name].type"
              placeholder="请选择"
              @change="typeChange($event, obj.model[item.name])"
              :disabled="item.noPageType"
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
          <div class="proto" v-if="obj.model[item.name].type === 'SUB' && obj.model[item.name].dialogInfo">
            <div class="pcr">弹窗宽度</div>
            <el-input
              size="mini"
              v-model="obj.model[item.name].dialogInfo.width"
              style="width: 75px"
              placeholder="请填写"
              v-if="obj.model[item.name].edit"
            />
            <el-select
              size="mini"
              style="width: 75px"
              v-model="obj.model[item.name].dialogInfo.widthUnit"
              v-if="obj.model[item.name].edit"
            >
              <el-option value="px">px</el-option>
              <el-option value="em">em</el-option>
              <el-option value="rem">rem</el-option>
              <el-option value="%">%</el-option>
            </el-select>
            <span v-else>{{
              obj.model[item.name].dialogInfo.width + obj.model[item.name].dialogInfo.widthUnit
            }}</span>
          </div>
          <div class="proto" v-if="obj.model[item.name].type === 'SUB' && obj.model[item.name].dialogInfo">
            <div class="pcr">弹窗高度</div>
            <el-input
              size="mini"
              v-model="obj.model[item.name].dialogInfo.height"
              style="width: 75px"
              placeholder="请填写"
              v-if="obj.model[item.name].edit"
            />
            <el-select
              size="mini"
              style="width: 75px"
              v-model="obj.model[item.name].dialogInfo.heightUnit"
              v-if="obj.model[item.name].edit"
            >
              <el-option value="px">px</el-option>
              <el-option value="em">em</el-option>
              <el-option value="rem">rem</el-option>
              <el-option value="%">%</el-option>
            </el-select>
            <span v-else>{{
              obj.model[item.name].dialogInfo.height + obj.model[item.name].dialogInfo.heightUnit
            }}</span>
          </div>
          <div class="proto">
            <div class="pcr">路径</div>
            <el-input
              size="mini"
              style="width: 150px"
              v-model="obj.model[item.name].path"
              v-if="(obj.model[item.name].type === 'WINDOW' && obj.model[item.name].edit) || (obj.model[item.name].type === 'js' && obj.model[item.name].edit)"
            ></el-input>
            <span
              v-if="(obj.model[item.name].type === 'WINDOW' && !obj.model[item.name].edit) || (obj.model[item.name].type === 'js' && !obj.model[item.name].edit)"
              :title="obj.model[item.name].edit"
              >{{ obj.model[item.name].path }}</span
            >
            <page-select
              width="150px"
              :value.sync="obj.model[item.name].path"
              @select="getPageInfo"
              :disabled="!obj.model[item.name].edit"
              :wid="obj.model.wid"
              v-if="obj.model[item.name].type !== 'WINDOW' && obj.model[item.name].type !== 'js'"
            />
          </div>
          <div class="proto"  v-if="obj.model[item.name].path">
            <div class="pcr">页面传参</div>
            <codeless-page-data-binding
              :value.sync="obj.model[item.name].syncParams"
              :current-args-arr="root.argsArr"
              :args-arr="argsArr"
              :component-params="componentParams"
              :componentName="componentName"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { require } from "./mixins";
export default {
  mixins: [require],
  inject: [ 'root' ],
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
      argsArr: [],
      list: []
    };
  },
  created() {
    console.log(this.item);
   
    const ctx = this;
     console.log('ctx.obj.model[ctx.item.name]', this.obj.model[this.item.name]);
     if (JSON.stringify(this.obj.model[this.item.name]) === '{}') {
       ctx.$set(this.obj.model, [this.item.name], {
         title: "新页面",
        type: "",
        path: "",
        hoverIndex: -1,
        edit: true,
        dialogInfo: {
          width: "50",
          widthUnit: "%",
          height: "50",
          heightUnit: "%",
        },})
     }
     msgHub.$on('entityChange', (e)=> {
      if (e.type === 'db') {
        this.list = e.fields.map(i=> {
          return {
            label: i.dictionaryItem.name,
            value: i.dictionaryItem.engNameShort
          }
        })
        console.log('实体的字典',this.list);
      }else if (e.type === 'data_factory_sql') {
        this.list = JSON.parse(e.dataFactoryJson).selectItems.map(i=> {
          return {
            label: i.desc,
            value: i.name
          }
        })
      }
      
    });
  },
  computed: {
    componentParams() {
      const ctx = this;
      const fields = this.list.map((i) => {
        return {
          id: i.value,
          name: i.label,
        };
      });
      return [
        ...fields,
      ];
    },
    componentName() {
      return this.obj.model.title || this.obj.model.name
    }
  },
  methods: {
    getPageInfo(e) {
      const ctx = this;
      console.log(1111111, e);
      if(e.pageContent){
        ctx.argsArr = JSON.parse(e.pageContent).argsArr
      }
      
    },
    // async choosePage(e, itemi) {
    //   console.log(e, itemi.path);
    //   const ctx = this;
    //   itemi.path = e;

    //   // let res = await this._getMenu(itemi.path.prototypeId);

    //   // ctx.argsArr = pageContent.argsArr
      
    // },
    typeChange(e, itemi) {
      console.log(e);
      if (e === "WINDOW") {
        itemi.path = "";
      }
    },
    _getMenu(id) {
      const { getPageDetails } = window.getBffApi();
      return new Promise((resolve, reject) => {
        getPageDetails({id})
          .then((res) => {
            if (res.success) {
              resolve(JSON.parse(res.obj.pageContent));
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.string_input {
  width: 100%;
  margin-bottom: 10px;
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
</style>