<template>
  <el-container v-loading="listLoading">
    <el-header style="height:auto">
      <el-form label-width="70" inline>
        <el-form-item label="租户">
          <AllTenantSelect v-model="query.tenantId" ref="allTenantSelect" queryAll clearable />
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model="query.keyword" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadList">搜索</el-button>
        </el-form-item>
      </el-form>
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
            <el-checkbox :value="selectedNames.includes(row.id)" @change="changeCbValue(row)" />
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
import AllTenantSelect from './AllTenantSelect';

import { mapActions } from 'vuex';

export default {
  store:window.aopsStore,
  name: 'UserTable',
  components: { AllTenantSelect },
  props: {
    type: {
      type: String,
      default: 'radio'
    },
    value: [Array, Object]
  },
  data() {
    return {
      list: [],
      listLoading: false,
      selected: null,
      query: {
        tenantId: window.store.getters["user/tenantId"],
        keyword: ''
      },
      page: {
        start: 0,
        size: 10,
        total: 0
      }
    };
  },
  computed: {
    selectedNames() {
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
        if (!this.selectedNames.includes(this.list[i].id)) {
          return false;
        }
      }
      return true;
    },
    isIndeterminate() {
      let all = true;
      let none = true;
      for (let i = 0; i < this.list.length; i++) {
        if (this.selectedNames.includes(this.list[i].id)) {
          none = false;
        } else {
          all = false;
        }
      }
      return !all && !none;
    }
  },
  created() {
    if (this.type === 'radio' && this.value) {
      this.selected = {
        name: this.value.userCode ?? this.value.roleCode,
        nickname: this.value.userName ?? this.value.roleName
      };
    }
    if (this.type === 'checkbox') {
      this.selected =
        this.value?.map(item => ({ name: item.userCode ?? item.roleCode, nickname: item.userName ?? item.roleName })) ??
        [];
    }
    this.loadList();
  },
  mounted() {
    this.bindEvent();
  },
  watch: {
    selected(val) {
      this.$emit('input', val);
    }
  },
  beforeDestroy() {
    // this.$eventBus.$off('user-search', this.handler);
    window.msgHub.$off('user-search', this.handler)
  },
  methods: {
    ...mapActions('tenant', ['getTenantUsers']),
    async loadList() {
      if (!this.query.tenantId) return;
      this.listLoading = true;
      let res;
      try {
        res = await this.getTenantUsers({
          id: this.query.tenantId,
          params: {
            pageNum: this.page.start + 1,
            pageSize: this.page.size,
            keyword: this.query.keyword
          }
        });
      } catch (err) {
        this.$message({ message: err, type: 'error' });
      }
      this.list = (res?.pageData ?? []).map(item => ({ ...item, tenant: this.$refs.allTenantSelect.currTenant }));
      this.page.total = res?.total ?? 0;
      this.listLoading = false;
    },
    bindEvent() {
      this.handler = () => {
        this.loadList();
      };
      // this.$eventBus.$on('user-search', this.handler);
      window.msgHub.$on('user-search',this.handler)
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
      const listNames = this.list.map(item => item.id);
      if (this.isAllSelected) {
        this.selected = this.selected?.filter(item => !listNames.includes(item.id));
      } else {
        this.selected = [...(this.selected?.filter(item => !listNames.includes(item.id)) ?? []), ...this.list];
      }
    },
    changeCbValue(row) {
      const index = this.selectedNames.indexOf(row.id);
      if (index === -1) {
        this.selected.push(row);
      } else {
        this.selected.splice(index, 1);
      }
    }
  }
};
</script>
