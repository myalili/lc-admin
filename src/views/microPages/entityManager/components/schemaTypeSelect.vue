<template>
  <div class="schema-select-container">
    <div class="select-input" :class="{ 'py-2': schemsSeleted.length > 0 }">
      <!-- <div class="flex h-7 items-center" v-if="schemsSeleted.length == 0" style="color: #c0c4cc">请选择</div> -->
      <div class=" flex items-center flex-wrap" style="width: 95%">
        <span class="select-item" v-for="item in schemsSeleted" :key="item.id">
          <span>{{ filterOperateName(item.operationType) }}</span>
          <span class="mx-2">|</span>
          <span>{{ item.desc }}</span>
          <span class="mx-2">|</span>
          <span>{{ item.name }}</span>
          <i
            class="el-icon-close"
            style="cursor: pointer"
            @click="clearItem(item)"
          ></i>
        </span>
        <el-input
          v-model="searchVal"
          style="flex:1"
          placeholder="输入关键字"
          @change="searchOpr"
        ></el-input>
      </div>
      <div
        v-if="schemsSeleted.length !== 0"
        style="display: inline; float: right"
      >
        <i
          class="el-icon-close flex items-center justify-center"
          style="
            cursor: pointer;
            border-radius: 50%;
            background-color: #d4dfe6;
            padding: 3px;
            font-size: 4px;
            width:14px;
            height: 14px
          "
          @click="clearAll"
        ></i>
      </div>
    </div>

    <el-tabs
      v-model="operationType"
      type="border-card"
      class="schema-select-tab"
      @tab-click="tabChange"
    >
      <el-tab-pane
        v-for="(item, index) in schemasOptions"
        :key="index"
        :name="item.value"
      >
        <span slot="label"
          ><el-checkbox
            label=""
            v-model="item.checked"
            @change="operateChange(item)"
            size="mini"
            ><br /></el-checkbox
          >{{ item.label }}</span
        >
        <div class="w-full h-full flex flex-col items-center justify-between">
          <ul class="w-full">
            <li
              v-show='isShow(child)'
              v-for="(child, index) in item.children"
              :key="index"
              class="schema-select-item w-full"
              :class="{ 'selectedItem': child.checked }"
              @click="itemSelected(item, item.children, child)"
            >
              <span>
                <span>{{ child.desc }}</span>
                <span class=" mx-2">|</span>
                <span style="color: #7F8C93">{{ child.name }}</span>
              </span>
              
              
              
              <span
                :class="
                  schemsSeleted.findIndex(i=>i.name === child.name) > -1
                    ? 'myicon-tick-checked'
                    : 'myicon-tick-unChecked'
                "
              ></span>
            </li>
          </ul>
          <!-- <el-pagination
            layout="prev, pager, next"
            :total="total"
            @current-change="handleCurrentChange"
          >
          </el-pagination> -->
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
const {getSchemaListNoPage} =  window.getBffApi();
export default {
  props: {
    schemaType: {
      type: String,
      default: "db",
    },
    schemas: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      schemsSeleted: [],
      input: "",
      schemasOptions: [
        {
          value: "retrieve",
          label: "查询",
          checked: false,
          children: [],
        },
        {
          value: "create",
          label: "新增",
          checked: false,
          children: [],
        },
        {
          value: "update",
          label: "修改",
          checked: false,
          children: [],
        },
        {
          value: "delete",
          label: "删除",
          checked: false,
          children: [],
        },
      ],
      searchVal: "",

      // currentPage: 1,
      total: 0,
      operationType: "retrieve",
      schemasList: [],

      tenantId: this.$store.getters["user/tenantId"],
      list: []
    };
  },
  computed: {
    isShow(){
      return (item)=>{
        return item.desc.includes(this.searchVal) || item.name.toUpperCase().includes(this.searchVal.toUpperCase())
      }
    }
    // compSchemasList() {
    //   const ctx = this;
    //   return (item) => {
    //     let arr = [];
    //     if (ctx.searchVal) {
    //       item.children.forEach((i) => {
    //         if (i.desc.indexOf(ctx.searchVal) > -1) {
    //           arr.push(i);
    //         }
    //       });
    //       return arr;
    //     } else {
    //       return item.children;
    //     }
    //   };
    // },
  },
  methods: {
    tabChange(e) {
      // this.operationType = e.name;
      // this.querySchemaList();
    },
    searchOpr(e) {
      console.log(e);
    },
    clearAll() {
      this.schemsSeleted = [];
      this.schemasOptions.forEach((schema) => {
        schema.checked = false;
      });
    },
    clearItem(item) {
      this.schemsSeleted.splice(
        this.schemsSeleted.findIndex((i) => i.id === item.id),
        1
      );
      this.schemasOptions.forEach((schema) => {
        if (item.operationType == schema.value) {
          schema.checked = false;
          // this.operateChange(schema)
          return;
        }
      });
    },
    filterOperateName(name) {
      if (name == "retrieve") {
        return "查询";
      } else if (name == "create") {
        return "新增";
      } else if (name == "update") {
        return "修改";
      } else if (name == "delete") {
        return "删除";
      }
      return name;
    },
    operateChange(item) {
      if (item.checked == false) {
        item.children.forEach((element) => {
          element.checked = false;
          if (this.schemsSeleted.findIndex(i=>i.name === element.name) > -1) {
            this.clearItem(element);
          }
        });
      } else {
        console.log(item.children);
        item.children[0].checked = true;
        // this.$set(item.children[0], 'checked', true)
      }

      this.schemasOptions.forEach((schema) => {
        if (schema.checked) {
          schema.children.forEach((schemaItem) => {
            if (schemaItem.checked && !this.schemsSeleted.find(item=>item.id===schemaItem.id)) {
              this.schemsSeleted.push({
                desc: schemaItem.desc,
                id: schemaItem.id,
                name: schemaItem.name,
                operationType: schemaItem.operationType,
                structure: schemaItem.structure,
              });
            }
          });
        }
      });
      this.$emit("update-schema", this.schemsSeleted);
    },
    itemSelected(item, children, child) {
      item.checked = true;
      children.forEach((element) => {
        element.checked = false;
      });
      child.checked = !child.checked;
      this.schemsSeleted = [];
      this.schemasOptions.forEach((schema) => {
        if (schema.checked) {
          schema.children.forEach((schemaItem) => {
            if (schemaItem.checked) {
              this.schemsSeleted.push({
                desc: schemaItem.desc,
                id: schemaItem.id,
                name: schemaItem.name,
                operationType: schemaItem.operationType,
                structure: schemaItem.structure,
              });
            }
          });
        }
      });
      this.$emit("update-schema", this.schemsSeleted);
      this.$forceUpdate();
    },
    // handleCurrentChange(e) {
    //   this.currentPage = e;
    //   // this.querySchemaList(e);
    // },
    querySchemaList(page) {
      this.schemsSeleted = [];
      // this.schemasOptions.forEach((schema) => {
      //   schema.checked = false;
      //   schema.children = [];
      // });
      // page && (this.currentPage = page);
      // !page && (this.currentPage = 1);
      // var params = {
      //   name:this.searchVal,
      //   type: this.schemaType == "db" ? "db" : "db,data_source",
      //   pageNum: this.currentPage || 1,
      //   pageSize: 5,
      //   operationType: this.operationType,
      //   tenantId: ''
      // };
      getSchemaListNoPage({tenantId:this.tenantId}).then((res) => {
        let list = res.obj;
        this.list = list;
        // this.total = res.totalElements;
        if (list.length !== 0) {
            this.schemasOptions.forEach((option) => {
              let optionChild = [];
              list.forEach((element) => {
              if (option.value == element.operationType) {
                optionChild.push(element);
                return;
              }
            });
            option.children = optionChild
          });

          if (this.schemas.length !== 0) {
            this.schemasOptions.forEach((option) => {
              this.schemas.forEach((schema) => {
                if (option.value == schema.operationType) {
                  option.checked = true;
                  option.children.forEach((child) => {
                    if (child.id == schema.id) {
                      child.checked = true;
                    }
                  });
                }
              });
            });
            this.schemsSeleted = this.schemas;
            this.$emit("update-schema", this.schemsSeleted);
          }
        }
      });
    },
  },
  mounted() {
    this.querySchemaList();
  },
  watch: {
    schemaType() {
      this.querySchemaList();
    },
    schemas(n) {
      this.querySchemaList();
    }
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-input {
  .el-input__inner {
    border: none;
    height: 28px;
  }
}
.schema-select-container:hover {
  .select-input {
    border: 1px solid #4A8BFD;
   }
  .schema-select-tab {
    display: block;
  }
}
.schema-select-container {
  position: relative;
  .select-input {
    border: 1px solid #c8d0d4;
    border-radius: 4px;
    padding: 5px 12px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .select-item {
      background-color: #E7ECEF;
      padding: 0 8px;
      display: inline-block;
      height: 22px;
      line-height: 22px;
      margin-right: 10px;
      border-radius: 4px;
    }
  }
  .schema-select-tab {
    position: absolute;
    width: 370px;
    z-index: 2;
    display: none;
    border-top: none;
    ::v-deep .el-tabs__header  {
      background: #F7FAFB;
      border-radius: 6px 0 0 6px;
    }
    ::v-deep .el-tabs__nav {
      height: 36px;
      padding-bottom: 0 !important;
      .el-tabs__item {
        height: 36px;
        line-height: 36px;
        border-top-width: 0;
        border-bottom-width: 0;
        padding: 0 16px !important;
      }
    }
    ::v-deep .el-tabs__content {
      height: 300px;
      padding: 8px;
      overflow: scroll;
      .el-tab-pane {
        height: 100%;
      }

      .schema-select-item {
        cursor: pointer;
        // padding: 10px;
        padding: 0 12px;
        height: 36px;
        border-bottom: 1px solid #e7ecef;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        .myicon-tick-checked {
          display: inline-block;
          font-weight: 700;
          margin: 0 10px;
          width: 5px;
          height: 10px;
          -webkit-transform: rotate(45deg);
          transform: rotate(45deg);
          border-style: solid;
          border-width: 0 2px 2px 0;
          align-self: center;
          color: #07b6b5;
          border-color: #4A8BFD;
        }
      }
      .schema-select-item:hover {
        background-color: #e3f2fc;
      }
      .selectedItem {
        background-color: #e3f2fc;
      }
    }
  }
  ::v-deep .el-tabs--border-card {
    border-radius: 6px;
  }
}
</style>