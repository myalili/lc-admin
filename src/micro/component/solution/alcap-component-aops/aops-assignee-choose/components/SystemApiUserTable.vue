<template>
  <el-container v-loading="listLoading">
    <el-header style="height:auto;padding:0 0 10px 0">
      <el-input v-model="query.keyword" placeholder="关键字" style="width:300px" @input="handleSearch" />
    </el-header>
    <el-main style="padding:0">
      <el-table :data="list" @selection-change="handleSelectionChange" @row-click="handleRowClick">
        <el-table-column v-if="type === 'radio'" width="50" align="center">
          <template slot-scope="scope">
            <el-radio :value="(selected || {}).id" :label="scope.row.id" class="label-hidden" />
          </template>
        </el-table-column>
        <el-table-column v-if="type === 'checkbox'" width="50">
          <template slot="header" slot-scope="{}">
            <el-checkbox :indeterminate="isIndeterminate" :value="isAllSelected" @change="changeAllCbValue" />
          </template>
          <template slot-scope="{ row }">
            <el-checkbox :value="selectedIds.includes(row.id)" @change="changeCbValue(row)" />
          </template>
        </el-table-column>
        <el-table-column label="用户id" prop="id" show-overflow-tooltip />
        <el-table-column label="用户名" prop="name" show-overflow-tooltip />
        <el-table-column label="用户昵称" prop="nickname" show-overflow-tooltip />
        <el-table-column label="描述" prop="desc" show-overflow-tooltip />
      </el-table>
    </el-main>
    <el-footer class="aops-footer-pagination">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-size="page.size"
        :total="page.total"
        :current-page="page.start + 1"
      />
    </el-footer>
  </el-container>
</template>

<script>
const { querySystemApiResp } = window.getAopsApi();
const { getChoreResponse } = window.aopsUtils;

export default {
  props: {
    systemApiId: String,
    systemApiType: String,
    type: {
      type: String,
      default: 'radio'
    },
    value: [Array, Object]
  },
  data() {
    return {
      query: { keyword: '' },
      page: {
        start: 0,
        size: 10,
        total: 0
      },
      selected: this.value,
      list: [],
      listLoading: false
    };
  },
  computed: {
    selectedIds() {
      if (this.type === 'checkbox') {
        return this.selected?.map(item => item.id) ?? [];
      }
      return this.selected ? [this.selected.id] : [];
    },
    isAllSelected() {
      if (!this.list.length) {
        return false;
      }
      for (let i = 0; i < this.list.length; i++) {
        if (!this.selectedIds.includes(this.list[i].id)) {
          return false;
        }
      }
      return true;
    },
    isIndeterminate() {
      let all = true;
      let none = true;
      for (let i = 0; i < this.list.length; i++) {
        if (this.selectedIds.includes(this.list[i].id)) {
          none = false;
        } else {
          all = false;
        }
      }
      return !all && !none;
    }
  },
  created() {
    this.loadList();
  },
  watch: {
    value(val) {
      this.selected = val;
    },
    selected(val) {
      this.$emit('input', val);
    }
  },
  methods: {
    async loadList() {
      this.listLoading = true;
      let res;
      try {
        res = await getChoreResponse(
          querySystemApiResp(this.systemApiId, {
            pageNum: this.page.start + 1,
            pageSize: this.page.size,
            keyword: this.query.keyword?.trim() || undefined
          })
        );
      } catch (err) {
        this.$message({ message: err, type: 'error' });
      }
      this.list = res?.content?.pageData ?? [];
      this.page.total = res?.content?.total ?? 0;
      this.listLoading = false;
    },
    handleSearch() {
      this.page.start = 0;
      this.loadList();
    },
    handleSizeChange(size) {
      this.page.start = 0;
      this.page.size = size;
      this.loadList();
    },
    handleCurrentChange(start) {
      this.page.start = start - 1;
      this.loadList();
    },
    handleSelectionChange(rows) {
      this.selected = rows;
    },
    handleRowClick(row) {
      if (this.type === 'radio') {
        this.selected = row;
      } else {
        this.changeCbValue(row);
      }
    },
    changeAllCbValue() {
      const listIds = this.list.map(item => item.id);
      if (this.isAllSelected) {
        this.selected = this.selected?.filter(item => !listIds.includes(item.id));
      } else {
        this.selected = [...(this.selected?.filter(item => !listIds.includes(item.id)) ?? []), ...this.list];
      }
    },
    changeCbValue(row) {
      const index = this.selectedIds.indexOf(row.id);
      if (index === -1) {
        this.selected = this.selected ?? [];
        this.selected.push(row);
      } else {
        this.selected.splice(index, 1);
      }
    }
  }
};
</script>
