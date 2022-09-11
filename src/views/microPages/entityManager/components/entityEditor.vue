<template>
  <div class="form-container">
    <el-form
      ref="form"
      :model="form"
      label-width="100px"
      :rules="rules"
      size="mini"
      label-suffix="："
    >
      <el-form-item label="中文名称" prop="desc">
        <span class="flex items-center justify-between">
          <el-input
            style="width: 35%"
            v-model="form.desc"
            placeholder="请输入中文"
          ></el-input>
          <div class="operate-btn">
            <el-button
              size="mini"
              round
              type="primary"
              @click="entityInfoImport"
              v-if="mode == 'create'"
              >导入</el-button
            >
            <el-button
              size="mini"
              round
              type="primary"
              @click="save"
              v-if="mode == 'create'"
              >创建</el-button
            >
            <el-button
              icon="el-icon-document"
              size="mini"
              round
              type="primary"
              @click="update"
              v-if="mode == 'edit'"
              >保存</el-button
            >
            <el-button size="mini" round @click="cancel">取消</el-button>
          </div>
        </span>
      </el-form-item>
      <el-form-item label="英文名称" prop="name">
        <el-input
          style="width: 35%"
          v-model="form.name"
          placeholder="请输入英文"
          @input="inputLimit($event, form)"
          onkeyup
          :disabled="mode == 'edit'"
        ></el-input>
      </el-form-item>
      <el-form-item label="实体类型" prop="type">
        <el-radio-group
          v-model="form.type"
          @change="changeType"
          :disabled="mode == 'edit'"
        >
          <el-radio-button label="db">db</el-radio-button>
          <el-radio-button label="data_source">三方数据源</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="数据源"
        prop="domainId"
        v-if="form.type === 'data_source'"
      >
        <el-cascader
          style="width: 35%"
          v-model="form.domainId"
          :options="domainList"
          :props="domainProps"
          @change="handleChange"
          popper-class="domain-cascader"
          clearable
          filterable
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="schemaType">
        <schemaType-Select
          ref="schemaTypeSelect"
          :schemaType="form.type"
          @update-schema="updateSchema"
          :schemas="form.schemas"
        ></schemaType-Select>
      </el-form-item>

      <el-form-item :label="'字段' + form.fields.length">
        <el-button type="primary" round @click="entityInfoImport">
          导入字段
        </el-button>
        <!-- <el-button type="primary" round @click="fieldsExport">
          导出字段
        </el-button> -->
        <el-button
          round
          type="primary"
          @click="showDialog = true"
          icon="el-icon-document"
        >
          从字典导入</el-button
        >
        <el-button round type="primary" @click="addField" icon="el-icon-plus"
          >新增</el-button
        >
        <el-button round :disabled="selectRow.length == 0" @click="deleteFields"
          >删除</el-button
        >
        <el-table
          :data="form.fields"
          style="width: 100%; z-index: 1"
          height="376"
          ref="fieldTable"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="中文名称">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.desc"
                placeholder="请输入"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="英文名称">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.name"
                placeholder="请输入"
                @input="inputLimit($event, scope.row)"
                onkeyup
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="展示类型">
            <template slot-scope="scope">
              <el-select
                filterable
                v-model="scope.row.displayType"
                placeholder="请选择"
              >
                <el-option
                  :value="item.href"
                  :label="item.name"
                  v-for="item in componentList"
                  :key="item.href"
                >
                  {{ item.name }}
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="数据类型">
            <template slot-scope="scope">
              <el-select
                filterable
                v-model="scope.row.type"
                placeholder="请选择"
                @change="fieldTypeChange($event, scope.row)"
              >
                <el-option
                  :value="item"
                  :label="item"
                  v-for="item in dataTypeList"
                  :key="item"
                >
                  {{ item }}
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="字段长度" v-if="entity.type == 'db'">
            <template slot-scope="scope" v-if="scope.row.type == 'string'">
              <el-input
                v-model="scope.row.length"
                size="mini"
                placeholder="请输入"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="是否主键" v-if="entity.type == 'db'">
            <template slot-scope="scope">
              <el-switch
                active-value="1"
                inactive-value="0"
                v-model="scope.row.primaryKey"
                @change="primaryKeyChange($event, scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="标准码">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.code"
                placeholder="请输入"
                @focus="openCodeDialog(scope.row)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="校验条件">
            <template slot-scope="scope">
              <el-button type="text" @click="openValidation(scope.row)"
                ><i class="el-icon-edit-outline" style="font-size: 14px"></i
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>

    <entity-dialog
      :visible.sync="showDialog"
      v-if="showDialog"
      @selectFields="selectFields"
    ></entity-dialog>

    <valid-dialog
      :visible.sync="showValid"
      v-if="showValid"
      :editRow="editRow"
    ></valid-dialog>

    <code-dialog
      :visible.sync="showCode"
      v-if="showCode"
      :editRow="editRow"
    ></code-dialog>
  </div>
</template>

<script>
import schemaTypeSelect from "./schemaTypeSelect.vue";
import entityDialog from "./entityDialog.vue";
import validDialog from "./validDialog.vue";
import codeDialog from "./codeDialog.vue";
import entityInfoImportDialog from "./entityInfoImport.vue";
const { addEntity, updateEntity } = window.getBffApi();
export default {
  mixins: [window.codelessMixins.customDialog],
  props: {
    mode: {
      type: String,
      default: "",
    },
    entity: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: {
    schemaTypeSelect,
    entityDialog,
    validDialog,
    codeDialog,
  },
  data() {
    return {
      form: {},
      selectRow: [],
      showDialog: false,
      showValid: false,
      showCode: false,
      rules: {
        name: [
          { required: true, message: "请输入英文名称", trigger: "blur" },
          {
            pattern: /^[A-Za-z_]{1,}$/,
            message: "请输入字母或下划线",
            trigger: "blur",
          },
        ],
        id: [{ required: true, message: "请输入英文名称", trigger: "blur" }],
        type: [
          { required: true, message: "请选择实体类型", trigger: "change" },
        ],
      },
      active: 1,

      editRow: {},

      codes: [], // 标准码

      componentList: [],
      dataTypeList: ["string", "bool", "number", "textarea"],

      copyForm: {},
      domains: [],
    };
  },
  created() {
    const ctx = this;
    ctx.getComponentList();
    ctx.getDomainList();
  },
  mounted() {
    const ctx = this;
    if (ctx.mode === "edit") {
      ctx.copyForm = JSON.parse(JSON.stringify(ctx.form));
    }
  },
  computed: {
    domainList() {
      return this.domains;
    },
    domainProps() {
      return {
        children: "interfaces",
        value: "id",
        label: "desc",
        expandTrigger: "hover",
      };
    },
  },
  methods: {
    fieldTypeChange(e, row) {
      if (e === "string") {
        row.length === 300;
      } else {
        row.length = null;
      }
    },
    async getDomainList() {
      const { domainList } = window.getBffApi();
      let res = await domainList();

      this.domains = res.map((i) => {
        return {
          ...i,
          interfaces: i.interfaces.map((e) => {
            return {
              desc: e.name,
              ...e,
            };
          }),
        };
      });
      console.log("请求的到的数据源", this.domains);
    },
    getComponentList() {
      const ctx = this;
      ctx.componentList = pipe.component.getComponentList("form");
    },
    openCodeDialog(row) {
      const ctx = this;
      ctx.showCode = true;
      ctx.editRow = row;
    },
    openValidation(row) {
      const ctx = this;
      ctx.showValid = true;
      ctx.editRow = row;
    },
    randomChars(len) {
      const result = [];

      for (let i = 0; i < len; i++) {
        // 生成0~25的随机数字
        const ram = Math.ceil(Math.random() * 25);

        const char = String.fromCharCode(65 + ram);
        // 随机转为大小
        if (Math.random() < 0.33) {
          result.push(Math.floor(Math.random() * 10));
        } else if (Math.random() > 0.33 && Math.random() < 0.66) {
          result.push(char.toLowerCase());
        } else {
          result.push(char);
        }
      }
      return result.join("");
    },
    inputLimit(e, item) {
      const ctx = this;
      if(ctx.form.type !== 'data_source') {
        item.name = e.toUpperCase();
      }
    },
    addField() {
      const ctx = this;

      if (this.form.fields.length > 24) {
        ctx.$notify.error({
          title: "错误",
          message: "字段数量不能超过25个！",
        });
        return;
      }

      this.form.fields.unshift({
        createTime: new Date().getTime(),
        createUserName: "agreeOwner",
        code: "",
        desc: "",
        displayType: "",
        type: "string",
        length: null,
        name: "",
        primaryKey: "0",
        validations: [],
        id: "entity-field-" + ctx.randomChars(8),
        updateTime: new Date().getTime(),
        updateUserName: null,
      });
    },
    deleteFields() {
      const ctx = this;
      ctx.selectRow.forEach((row) => {
        let index = ctx.form.fields.findIndex(i=> i.id === row.id);
        ctx.form.fields.splice(index, 1);
      });
      // this.$refs.fieldTable.clearSelection();
    },
    handleSelectionChange(val) {
      this.selectRow = val;
    },
    selectFields(val) {
      for (let index = 0; index < val.length; index++) {
        const element = val[index];
        if(this.form.type !== 'data_source') element.name = element.name.toUpperCase();
        element.name = element.name.replaceAll(" ", "_");
        if (this.form.fields.length > 24) {
          this.$notify.error({
            title: "错误",
            message: "字段数量不能超过25个！",
          });
          continue;
        }
        this.form.fields.push({
          // dictId: element.id,
          // primaryKey: "0",
          // dictionaryItem: element,
          ...element,
          type: "string",
        });
      }
      // val.forEach((element) => {

      // });
    },
    entityInfoImport() {
      const ctx = this
      const toFieldsArr = (arr)=> {
        return arr.map(i=> {
          const { code, desc, name, primaryKey, type, validations  } = i
          return {
            id: "entity-field-" + ctx.randomChars(8), code, desc, name, primaryKey, type, validations: validations.map(i=> { delete i.id; return i })
          }
        });
      }
      ctx.openCustomDialog({
        title: "导入实体或者字段",
        path: "entityInfoImport",
        width: "500px",
        component: entityInfoImportDialog,
        confirmCallback($_dontCare, $el) {
          if (Array.isArray(JSON.parse($el.value))) {
            let fieldsArr = toFieldsArr(JSON.parse($el.value))
            
            ctx.form.fields = [ ...ctx.form.fields, ...fieldsArr ];
          }else {
            const { name, type, desc, fields, schemas } = JSON.parse($el.value)

            let trueSchemas = schemas.map(i=> {
              return ctx.$refs.schemaTypeSelect.list.find(sch=>sch.name === i.name)
            });
            let entityObj = { 
              name, type, desc, fields: toFieldsArr(fields), schemas: trueSchemas
            }
            ctx.$set(ctx, 'form', entityObj);
            console.log(entityObj);
          }
        },
      });
    },
    fieldsExport() {
      let columnList = [
        {
          header: "中文名称\n",
          field: "desc",
        },
        {
          header: "英文名称\n",
          field: "name",
        },
        {
          header: "展示类型\n",
          field: "displayType",
        },
        {
          header: "数据类型\n",
          field: "type",
        },
        {
          header: "字段长度\n",
          field: "length",
        },
        {
          header: "是否主键\n",
          field: "primaryKey",
        },
        {
          header: "标准码\n",
          field: "code",
        },
        {
          header: "校验条件\n",
          field: "validations",
        },
      ];

      const exportFormat = (value) => {
        console.log(value);
        value = value?.replace(/[\n]/, "");
        value = value?.replace(/,/, "，");
        return value;
      };
      let bodyList = this.form.fields;
      let excelList = [];

      for (var i = 0; i < columnList.length; i++) {
        // 一行一行数据分割开
        excelList.push(exportFormat(columnList[i].header) + ",");
      }
      excelList.push("\n");
      for (var i = 0; i < bodyList.length; i++) {
        excelList.push(exportFormat(bodyList[i].desc) + ",");
        excelList.push(exportFormat(bodyList[i].name) + ",");
        excelList.push('' + ",");
        excelList.push(exportFormat(bodyList[i].type) + ",");
        
        // excelList.push(exportFormat(bodyList[i].validations) + ",");
        // excelList.push(exportFormat(bodyList[i].primaryKey) + ",");
        excelList.push("\n");
      }

      var merged = excelList.join(""); //将上述得到的excel集合，转化为excel表格中的需要使用的字符串
      console.log('excelList', excelList);
      //## 导出操作
      // encodeURIComponent解决中文乱码
      const uri =
        "data:text/xlsx;charset=utf-8,\ufeff" + encodeURIComponent(merged);
      // 通过创建a标签实现
      let link = document.createElement("a");
      link.href = uri;

      link.download = "测试.xlsx"; //这里是最后下载下来的excel表格名称
      link.click();
    },
    // 怕数据中出现特殊字符和英文字符(会造成单元格分隔)的逗号所以这边过滤一下

    cancel() {
      this.$emit("reset");
    },
    changeType() {
      this.$forceUpdate();
    },
    update() {
      const ctx = this;
      if (this.form.desc == "") {
        this.$notify({
          title: "请填写中文名称",
          type: "warning",
        });
        return;
      } else if (this.form.name == "") {
        this.$notify({
          title: "请填写英文名称",
          type: "warning",
        });
        return;
      } else if (this.form.schemas.length == 0) {
        this.$notify({
          title: "请选择schemaType",
          type: "warning",
        });
        return;
      } else if (this.form.fields.length == 0 && this.form.type == "db") {
        this.$notify({
          title: "请新增字段",
          type: "warning",
        });
        return;
      }
      console.log(ctx.copyForm);

      let isNeedCreate = false;
      if (ctx.form.fields.length !== ctx.copyForm.fields.length) {
        isNeedCreate = true;
      } else {
        for (let index = 0; index < ctx.copyForm.fields.length; index++) {
          // console.log(`ctx.form.fields.some(
          //     (i) => i.length === ctx.copyForm.fields[index].length
          //   )`, ctx.form.fields.some(
          //     (i) => i.length === ctx.copyForm.fields[index].length
          //   ));
          if (
            !ctx.form.fields.some(
              (i) => i.name === ctx.copyForm.fields[index].name
            )
          ) {
            isNeedCreate = true;
          } else {
            let findField = ctx.form.fields.find(
              (i) => i.name === ctx.copyForm.fields[index].name
            );
            if (findField.length !== ctx.copyForm.fields[index].length)
              isNeedCreate = true;
          }
          if (isNeedCreate) break;
        }

        const copyKeyArr = ctx.copyForm.fields.map((i) => i.primaryKey);
        const keyArr = ctx.form.fields.map((i) => i.primaryKey);
        if (
          copyKeyArr.findIndex((i) => i === "1") !==
          keyArr.findIndex((i) => i === "1")
        ) {
          isNeedCreate = true;
        }
      }

      if (ctx.form.type !== "db") isNeedCreate = false;
      const _updateEntity = (flag) => {
        let form = { ...this.form };
        if (form.domainId) {
          form.interfaceId = form.domainId[1] || null;
          form.domainId = form.domainId[0] || null;
        }
        var params = JSON.stringify(form);
        updateEntity(params)
          .then(async (res) => {
            if (flag) {
              if (this.form.type == "db") {
                await this.createExistsTable(res);
              }
            } else {
              console.log("res.success", res);
              this.$notify({
                title: "成功",
                message: "实体修改成功",
                type: "success",
              });
            }

            this.$emit("reset");
          })
          .catch((error) => {
            this.$notify({
              title: "错误",
              message: error,
              type: "error",
            });
          });
      };

      if (isNeedCreate) {
        ctx.openCustomDialog({
          title: "提示",
          path: "deleteConfirm",
          width: "300px",
          component: {
            template: `<div>检测到字段关键信息修改, 将清空数据重新建表，是否继续?</div>`,
          },
          confirmCallback() {
            _updateEntity(true);
          },
        });
      } else {
        _updateEntity(false);
      }
    },
    updateDictItem(val) {
      this.form.fields = val;
    },
    updateSchema(val) {
      this.form.schemas = val;
    },
    // cancel() {
    //   this.$emit("update:visible", false);
    // },
    save() {
      const ctx = this;
      if (this.form.desc == "") {
        this.$notify({
          title: "请填写中文名称",
          type: "warning",
        });
        return;
      } else if (this.form.name == "") {
        this.$notify({
          title: "请填写英文名称",
          type: "warning",
        });
        return;
      } else if (this.form.schemas.length == 0) {
        this.$notify({
          title: "请选择schemaType",
          type: "warning",
        });
        return;
      } else if (this.form.fields.length == 0 && this.form.type == "db") {
        this.$notify({
          title: "请新增字段",
          type: "warning",
        });
        return;
      }
      this.form.tenantId = this.$store.getters["user/tenantId"];
      let form = { ...this.form };
      if (form.domainId) {
        form.interfaceId = form.domainId[1];
        form.domainId = form.domainId[0];
      } else {
        form.interfaceId = null;
        form.domainId = null;
      }
      var params = JSON.stringify(form);

      console.log(this.form);
      if (this.form.fields.length > 24) {
        this.$notify.error({
          title: "错误",
          message: "字段数量不能超过25个！",
        });
        return;
      }
      addEntity(params).then(async (res) => {
      console.log(res);
        if (this.form.type == "db") {
          await this.createTable(res);
        }else {
          ctx.$emit("reset", res.id);
          ctx.$notify({
            title: "实体添加成功！",
            type: "success",
          });
        }
      })
      .catch((error) => {
        this.$notify({
          title: error,
          type: "error",
        });
      });
    },
    async createTable(e) {
      const ctx = this;
      const { dbCreateTable } = window.getBffApi();
      let response = await dbCreateTable(e.id);
      if (!response.success) {
        ctx.$notify.error({
          message: response.msg,
          title: "实体创建表失败",
        });
      }else {
        ctx.$emit("reset", e.id);
        ctx.$notify({
          title: "实体添加成功！",
          type: "success",
        });
      }
    },
    async createExistsTable(e) {
      const ctx = this;
      const { dbCreateExistsTable } = window.getBffApi();
      let response = await dbCreateExistsTable(e.id);
      if (!response.success) {
        ctx.$notify.error({
          message: response.msg,
          title: "更新表失败",
        });
      } else {
        ctx.$notify.success({
          message: "实体修改成功",
          title: "成功",
        });
      }
    },
    primaryKeyChange(e, row) {
      const ctx = this;
      if (e === "1") {
        ctx.form.fields.forEach((i) => {
          if (i.id !== row.id) {
            i.primaryKey = "0";
          }
        });
      }
    },
  },
  filters: {
    primaryKeyFilter(val) {
      return val == "1" ? "是" : "否";
    },
  },
  watch: {
    entity: {
      immediate: true,
      handler: function (newval) {
        this.form = newval;
        if (newval.domainId) {
          this.$set(this.form, "domainId", [
            newval.domainId,
            newval.interfaceId,
          ]);
        } else {
          this.$set(this.form, "domainId", []);
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.form-container {
  padding: 20px;
  .operate-btn {
    text-align: right;
  }
  ::v-deep .el-form {
    .el-form-item {
      .el-form-item__content {
        .el-radio-group {
          // @apply bg-primary;
          // padding: 1px;
          border-radius: 22px;
          box-sizing: border-box;
          width: 138.35px;
          display: flex;
          align-items: center;

          .el-radio-button:nth-child(1) {
            .el-radio-button__inner {
              border-radius: 22px 0px 0px 22px;
            }
          }
          .el-radio-button:nth-child(2) {
            .el-radio-button__inner {
              border-radius: 0 22px 22px 0;
            }
          }
        }
      }
    }
  }
}
.domain-cascader {
  .el-cascader-menu {
    min-width: 157px;
  }
  .el-cascader-menu:nth-child(2) {
    min-width: 212px;
  }
}
</style>