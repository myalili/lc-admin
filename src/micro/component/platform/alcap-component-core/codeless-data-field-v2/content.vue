<template>
  <div class="h-full overflow-scroll flex data-field-content">
    <div class="w-64 h-full overflow-scroll data-field-left">
      <div
        class="
          flex
          items-center
          justify-between
          my-2
          leading-none
          data-field-left-top
        "
      >
        <el-input
          v-model="filterText"
          size="mini"
          style="width: 80%"
          placeholder="搜索关键词"
        >
          <codeless-icon
            icon="icon-sousuo"
            style="margin-top: 0px; width: 14px; height: 14px"
            slot="prefix"
          ></codeless-icon>
        </el-input>
        <!-- <span class="btn-add" @click="entityAdd">+</span> -->
        <el-button type="primary" size="mini" class="w-5 h-5" style="padding: 0" icon="el-icon-plus" circle @click="entityAdd"></el-button>
      </div>
      <el-tree
        class="filter-tree"
        :data="selectEntities"
        :props="defaultProps"
        node-key="id"
        ref="tree"
        @node-click="getCurrentEntity"
        :filter-node-method="filterNode"
      >
        <span
          class="tree-node flex items-center justify-between w-full"
          slot-scope="{ node, data }"
        >
          <span>{{ data.desc }}</span>
          <entity-select
            v-if="!data.desc"
            :no-shema="true"
            :value.sync="data.id"
            size="mini"
            mode="id"
            @handleChange="entityChange($event, data)"
          />
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)"
            v-if="data.desc"
          >
            <i class="el-icon-close"></i>
          </el-button>
        </span>
      </el-tree>
    </div>
    <div class="w-px h-full bg-gray-300"></div>
    <div
      class="
        h-full
        pl-5
        pr-4
        overflow-scroll
        flex-1 flex
        justify-center
        items-center
      "
    >
      <el-table
        :data="currentEntity.children"
        height="100%"
        size="mini"
        v-if="isSelected"
      >
        <el-table-column prop="id" label="英文名称">
          <template slot-scope="scope">
            <el-autocomplete
              v-model="scope.row.id"
              :fetch-suggestions="querySearch"
              label="desc"
              value-key="desc"
              placeholder="请输入内容"
              size="mini"
              style="width: 100%"
              @select="fieldAutoComp($event, scope.row)"
            ></el-autocomplete>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="中文描述">
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-model="scope.row.name"
              placeholder="请输入"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="初始值">
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-model="scope.row.initialValue"
              placeholder="请输入"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" width="100">
          <template slot="header">
            <el-button size="mini" type="primary" @click="tableAdd"
              >添加字段</el-button
            >
          </template>
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleDelete(scope.$index, scope.row)"
            >
              <i class="el-icon-delete"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span v-else style="color: #909399">请选择或者添加一个实体</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['params'],
  data() {
    return {
      defaultProps: {
        children: "child",
        label: "name",
      },

      selectEntities: [],

      fields: [],
      currentEntity: {},

      isSelected: false,

      dataList: [],
      formatObj: {}
    };
  },
  mounted() {
    console.log("this.root", this.params);
    const ctx = this;
    ctx.selectEntities = ctx.params.root.argsArr || [];
  },
  methods: {
    entityChange(e, data) {
      data.name = e.name;
      data.id = e.id;
      data.desc = e.desc;
      console.log(data);
    },
    entityAdd() {
      const ctx = this;
      ctx.selectEntities.push({
        id: "",
        name: "",
        desc: "",
        children: [
          {
            id: "",
            name: "",
            initialValue: "",
            isEdit: true,
            no: 0
          },
        ],
      });
    },
    remove(node, data) {
      const ctx = this;
      const index = ctx.selectEntities.findIndex((d) => d.id === data.id);
      ctx.selectEntities.splice(index, 1);
    },
    async getCurrentEntity(data) {
      const ctx = this;
      let res = await pipe.entity.getEntityDetail(data.id, false);
      if (!res) return;
      console.log(res);
      ctx.currentEntity = data;
      ctx.fields = res.fields;
      ctx.isSelected = true;
    },
    tableAdd() {
      const ctx = this;
      ctx.currentEntity.children.push({
        id: "",
        name: "",
        initialValue: "",
        isEdit: true,
        no: ctx.currentEntity.children.length
      });
    },
    fieldChange(e, row) {
      const ctx = this;
      row.name = ctx.fields.filter((i) => i.name === e)[0].desc;
    },
    fieldAutoComp(e, row) {
      row.id = e.name;
      row.name = e.desc;
    },
    querySearch(queryString, cb) {
      var fields = this.fields;
      var results = queryString
        ? fields.filter(this.createFilter(queryString))
        : fields;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (field) => {
        return field.desc.indexOf(queryString) > -1;
      };
    },
    handleEdit(scope, row) {
      const ctx = this;
      row.isEdit = !row.isEdit;
    },
    handleDelete(scope, row) {
      const ctx = this;
      console.log(
        scope,
        row,
        ctx.currentEntity.children.findIndex((i) => i.id === row.id)
      );
      ctx.currentEntity.children.splice(
        ctx.currentEntity.children.findIndex((i) => i.id === row.id),
        1
      );
    },
    save() {
      const ctx = this;
      console.log(ctx.currentEntity);
      console.log(ctx.selectEntities);
      let formatObj = {};
      ctx.selectEntities.forEach((entity) => {
        if (entity.id && entity.children.length > 0 && entity.children.some(i=>i.id)) {
          formatObj[entity.name] = {};
          let needDel = []
          entity.children.forEach((child) => {
            
            if (child.id) {
              formatObj[entity.name][child.id] = child.initialValue;
            }else {
              needDel.push(child.no)
            }
          });
          console.log('要删除得', needDel);
          needDel.forEach(e => {
            entity.children.splice(entity.children.findIndex(l=>l.no === e), 1)
          });
          if (JSON.stringify(formatObj[entity.name]) === '{}') {
            delete formatObj[entity.name];
          }
        }else {
          ctx.selectEntities.splice(ctx.selectEntities.findIndex(i=>i.name === entity.name), 1)
        }
      });
      console.log("最后返回的", formatObj, ctx.selectEntities);
      
      ctx.formatObj = formatObj
      console.log(this.root);
    },
    define(data) {
      Object.keys(data).forEach((key) => {
        let value = data[key];
        Object.defineProperty(data, key, {
          set(newValue) {
            console.log("监听" + key + "改变 ");
            value = newValue;
          },
          get() {
            console.log("获取" + key + "对应的值");
            return value;
          },
        });
      });
    },
  }
};
</script>

<style lang="scss" scoped>
  .data-field-content {
    .data-field-left {
      .data-field-left-top {
        width: 100%;
        ::v-deep .el-input {
          .el-input__inner {
            border-radius: 222px;
          }
          .el-input__prefix {
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }
</style>