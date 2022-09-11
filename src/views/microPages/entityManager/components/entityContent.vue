<template>
  <div class="entity-container">
    <div
      class="entity-content-box relative"
      v-if="mode == 'view' && JSON.stringify(entity) !== '{}'"
    >
      <div class="entity-content-box-header">
        <div>
          <div class="header-title">
            <span class="header-title-desc">{{ entity.desc }}</span>
            <span class="header-title-name">({{ entity.name }})</span>
          </div>
          <div class="header-content">
            <div class="content-item-box">
              <span class="content-item">
                <label for="">id:&nbsp;</label>
                <span>{{ entity.id }}</span>
              </span>
              <span class="content-item">
                <label for="">实体类型:&nbsp;</label>
                <span>{{ entity.type }}</span>
              </span>
              <span class="content-item">
                <label for="">schemaType：&nbsp;</label>
                <span class="schemaType-box">
                  <span
                    v-for="(item, index) in entity.schemas"
                    :key="index"
                    class="schemaType"
                  >
                    <!-- {{
                      filterOperateName(item.operationType) +
                      "|" +
                      item.desc +
                      "|" +
                      item.name
                    }} -->
                    <span>{{ filterOperateName(item.operationType) }}</span>
                    <span class="mx-2">|</span>
                    <span>{{ item.desc }}</span>
                    <span class="mx-2">|</span>
                    <span>{{ item.name }}</span>
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- <span
        class="
          flex
          items-center
          justify-center
          w-16
          h-7
          cursor-pointer
          rounded-full
          text-white
          bg-gradient-primary
          absolute
          right-0
        "
        @click="editEntity"
    
      >
        <el-icon class="el-icon-edit" style="font-size: 8px"></el-icon>
        <span class="ml-1 text-white text-xs">编辑</span>
      </span> -->
      <el-button
        size="mini"
        round
        type="primary"
        icon="el-icon-edit"
        @click="editEntity"
        class="absolute right-0"
        >编辑</el-button
      >
      <el-divider class="divider"></el-divider>
      <div class="fields-table" v-loading="fieldLoading">
        <el-table
          ref="fieldsTable"
          :data="tableData"
          style="width: 100%"
          height="535"
          @row-click="rowClick"
          highlight-current-row
        >
        
          <el-table-column label="" width="40px">
            <template slot-scope="scope">
              <i class="el-icon-key" v-if="scope.row.primaryKey == '1'"></i>
            </template>
          </el-table-column>
          <el-table-column label="中文名称">
            <template slot-scope="scope">
              {{ scope.row.desc }}
            </template>
          </el-table-column>
          <el-table-column label="英文名称">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="展示类型">
            <template slot-scope="scope">
              {{ compDisplayType(scope.row.displayType) }}
            </template>
          </el-table-column>
          <el-table-column label="数据类型">
            <template slot-scope="scope">
              {{ scope.row.type }}
            </template>
          </el-table-column>
          <el-table-column label="字段长度" v-if="entity.type == 'db'">
            <template slot-scope="scope" v-if="scope.row.type == 'string'">
              {{ scope.row.length }}
            </template>
          </el-table-column>
          <el-table-column label="标准码" width="160">
            <template slot-scope="scope">
              <span class="flex items-center" v-if="scope.row.code">
                <i
                  class="el-icon-info mr-1 cursor-pointer"
                  style="color: #97aeba"
                  @click="openCodeDialog(scope.row, false)"
                ></i>
                {{ scope.row.code }}
              </span>
            </template>
          </el-table-column>
        </el-table>

        <div class="field-detail-box" v-show="showFieldDetail">
          <field-validation :fieldItem="fieldItem"></field-validation>
        </div>
      </div>
    </div>
    <div
      v-if="mode == 'view' && JSON.stringify(entity) == '{}'"
      class="empty-box"
    >
      <img data-v-3904da1b="" width="100%" src="img/empty.svg" alt="" />
    </div>
    <div v-if="mode !== 'view'">
      <entity-editor
        :mode="mode"
        @reset="reset"
        :entity="JSON.parse(JSON.stringify(entity))"
      ></entity-editor>
    </div>

    <code-dialog
      :visible.sync="showCode"
      v-if="showCode"
      :editRow="editRow"
      :isEdit="false"
    ></code-dialog>
  </div>
</template>

<script>
const { getEntity } = window.getBffApi();
// import { getEnums } from "../api/portalApi";
import fieldValidation from "./fieldValidation.vue";
import entityEditor from "./entityEditor.vue";

import codeDialog from "./codeDialog.vue";
export default {
  components: {
    fieldValidation,
    entityEditor,
    codeDialog,
  },
  data() {
    return {
      showDialog: false,
      fieldLoading: false,
      showFieldDetail: false,
      tableData: [],
      ValidationType: [],
      fieldItem: {},

      showCode: false,
      editRow: {},
      projectId: this.$store.getters["user/tenantId"]
    };
  },
  props: {
    entity: {
      type: Object,
      default: function () {
        return {};
      },
    },
    mode: {
      type: String,
      default: "view",
    },
  },
  computed: {
    compDisplayType() {
      return (href) => {
        const comps = pipe.component.getComponentList();
        for (const key in comps) {
          if (
            comps[key].hasOwnProperty("extendOptions") &&
            comps[key].extendOptions.hasOwnProperty("_options")
          ) {
            let _options = comps[key].extendOptions._options;
            if (_options.href === href) {
              return _options.name;
            }
          }
        }
      };
    },
  },
  methods: {
    openCodeDialog(row) {
      const ctx = this;
      ctx.showCode = true;
      ctx.editRow = row;
    },
    reset(id) {
      this.$emit("reset", id);
    },
    deleteField(id) {
      console.log(id);
    },
    editEntity() {
      //this.showDialog=true
      this.$emit("showEntityDetail", this.entity, this.entity.id, "edit");
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
    // getValidationType() {
    //   getEnums()
    //     .then((res) => {
    //       this.ValidationType = res.ValidationType;
    //     })
    //     .catch((error) => {
    //       this.$notify({
    //         title: error,
    //         type: "error",
    //       });
    //     });
    // },
    rowClick(val) {
      this.showFieldDetail = true;
      this.fieldItem = val.validations;
    },
    queryEntity() {
      this.fieldLoading = true;
      this.tableData = [];
      var params = {
        id: this.entity.id,
      };
      getEntity(params)
        .then((res) => {
          this.tableData = res.fields;
          if (this.tableData.length !== 0 && this.$refs.fieldsTable) {
            this.$refs.fieldsTable.setCurrentRow(this.tableData[0], true);
            this.rowClick(this.tableData[0]);
          }
          this.fieldLoading = false;
        })
        .catch((error) => {
          this.$notify({
            title: error,
            type: "error",
          });
        });
    },
  },
  watch: {
    entity: {
      handler(n) {
        if (this.mode == "view" && JSON.stringify(n) == '{}') {
          this.showFieldDetail = false;
        } else if(this.mode == "view" && JSON.stringify(n) !== '{}') {
          this.queryEntity();
        }
      }
      
    },
  },
  mounted() {
    // if (!JSON.parse(window.localStorage.getItem("enums"))) {
    //   this.ValidationType = JSON.parse(
    //     window.localStorage.getItem("enums")
    //   ).ValidationType;
    // } else {
    //   this.getValidationType();
    // }
  },
};
</script>

<style lang="scss" scoped>
.entity-container {
  height: 100%;
  overflow: auto;
  padding: 15px;
  .empty-box {
    height: 100%;
    display: flex;
  }
  .entity-content-box {
    display: flex;
    flex-direction: column;
    height: 100%;
    &-header {
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      .header-title {
        margin-bottom: 12px;
        &-desc {
          font-weight: bold;
        }
        &-name {
          color: #7f8c93;
        }
      }
      .header-content {
        color: #7f8c93;
        .content-item-box {
          display: flex;
          flex-wrap: wrap;
          .content-item {
            margin-right: 65px;
            display: flex;
            label {
              flex: none;
              display: flex;
              align-items: center;
            }
            span {
              width: max-content;
              display: flex;
              align-items: center;
            }
            .schemaType-box {
              display: flex;
              flex-wrap: wrap;
              width: 100%;
              .schemaType {
                color: #333333;
                padding: 5px 8px;
                margin-right: 8px;
                background-color: #e7ecef;
                border-radius: 4px;
                display: inline-grid;
                display: flex;
                align-items: center;
              }
            }
         
          }
        }
      }
      .edit-btn {
        height: fit-content;
        align-self: center;
        float: right;
        margin-right: 20px;
      }
    }
    .el-divider {
      flex: none;
    }
    .fields-table {
      display: flex;
      // height: 100%;
      ::v-deep.el-table--enable-row-hover
        .el-table__body
        tr:not(.current-row):hover
        > td {
        background-color: #e3f2fc !important;
      }
      .field-detail-box {
        width: 30%;
        height: 100%;
        border-left: 1px solid #e7ecef;
      }
    }
  }
}
</style>