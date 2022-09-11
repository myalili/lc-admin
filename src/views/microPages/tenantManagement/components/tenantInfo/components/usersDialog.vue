<template>
  <el-dialog
    class="users-dialog"
    :title="title"
    v-bind="$attrs"
    v-on="$listeners"
    @open="dialogOpen"
  >
    <div class="users-dialog-title" slot="title">
      <span class="users-dialog-title-text">{{ title }}</span>
      <div>
        <el-input
          class="users-dialog-title-input"
          v-model="searchText"
          prefix-icon="el-icon-search"
          placeholder="关键字查询"
          clearable
          @input="search"
        />
      </div>
      <div></div>
    </div>
    <div class="users-dialog-body">
      <div class="users-dialog-body-table">
        <base-table
          :data="userList"
          :columns="userColumns"
          :showSelection="false"
          @row-click="changeSelected"
        >
          <el-table-column slot="after-selection" width="30">
            <div slot-scope="{ row }">
              <el-checkbox
                :value="selectedMap[row[selectedField]]"
                @change.native.capture.stop="changeSelected(row)"
              />
            </div>
          </el-table-column>
        </base-table>
      </div>
      <div class="users-dialog-body-pagination">
        <custom-pager
          :total="totalCount"
          :currentPage="currentPage"
          :pageSize="pageSize"
          @current-change="currentChange"
          @size-change="sizeChange"
        ></custom-pager>
      </div>
    </div>
    <div slot="footer">
      <el-popover
        v-if="selectedList.length > 0"
        placement="top"
        trigger="hover"
      >
        <div class="selected-list">
          <div
            class="selected-list-item"
            v-for="item in selectedList"
            :key="item.name"
          >
            <el-checkbox
              :value="selectedMap[item[selectedField]]"
              @change.native.stop="changeSelected(item)"
            >
              {{ item.nickname }}
            </el-checkbox>
          </div>
        </div>
        <el-tag slot="reference" style="margin-right: 20px">
          <span>已选中：</span>
          <span v-if="type === 'owner'">{{ selectedList[0].nickname }}</span>
          <span v-else>{{ selectedList.length }} 个</span>
        </el-tag>
      </el-popover>

      <el-button @click="closeDialog">取消</el-button>
      <el-button
        :disabled="selectedList.length === 0"
        :loading="loading"
        type="primary"
        @click="submit"
      >
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import baseTable from './baseTable.vue'
import userColumns from '../../../js/utils/userColumns'
const { getAllUser }  = window.getAacApi()
import customPager from './pagination.vue'
import { throttle } from 'lodash'

const {
  listToMap
} = window.codelessUtils
export default {
  name: 'UsersDialog',
  inheritAttrs: false,
  components: { baseTable, customPager },
  props: {
    type: {
      type: String,
      default: 'user'
    },
    defaultSelectedList: {
      type: Array,
      default() {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      userList: [],
      userColumns: userColumns(),
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      selectedList: [],
      searchText: '',
      search: () => {}
    }
  },
  computed: {
    title() {
      return this.type === 'user' ? '关联用户' : '关联所有者'
    },
    selectedMap() {
      return listToMap(this.selectedList, this.selectedField, () => true)
    },
    selectedField() {
      return this.type === 'user' ? 'id' : 'name'
    }
  },
  mounted() {
    this.search = throttle(() => {
      this.currentPage = 1
      this.getUserList()
    }, 600)
  },
  methods: {
    closeDialog() {
      this.$emit('update:visible', false)
    },
    dialogOpen() {
      this.selectedList = [...this.defaultSelectedList]
      if (this.userList.length === 0) {
        this.getUserList()
      }
    },
    getUserList() {
      getAllUser({
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.searchText || undefined,
      })
        .then(res => {
          let { success, content} = res;
          if(success){
            const { total, pageData } = content
            this.userList = pageData
            this.totalCount = total
          }else{
            throw(res)
          }
          
        })
        .catch(error => {
          this.$notify.error(error)
        })
    },
    currentChange(pageNum) {
      this.currentPage = pageNum
      this.getUserList()
    },
    sizeChange(pageSize) {
      this.currentPage = 1
      this.pageSize = pageSize
      this.getUserList()
    },
    submit() {
      this.$emit('submit', this.selectedList)
    },
    changeSelected(row) {
      const isSelected = this.selectedMap[row[this.selectedField]]
      if (this.type === 'owner') {
        if (isSelected) {
          this.selectedList = []
        } else {
          this.selectedList = [row]
        }
      } else {
        if (isSelected) {
          const index = this.selectedList.findIndex(item => item.id === row.id)
          if (index >= 0) {
            this.selectedList.splice(index, 1)
          }
        } else {
          this.selectedList.push(row)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.users-dialog {
  ::v-deep {
    .el-dialog {
      width: 80vw;
    }
    .el-dialog__body {
      padding: 0;
    }
  }
  &-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-text {
      font-size: 13px;
      color: #333;
      margin-right: 10px;
    }
    &-input {
      ::v-deep {
        .el-input__inner {
          border-radius: 15px;
        }
      }
    }
  }
  &-body {
    display: flex;
    flex-direction: column;
    height: 55vh;
    width: 100%;
    &-table {
      height: 100%;
      // width: 100%;
      // flex-grow: 1;
      overflow: hidden;
    }
    &-pagination {
      padding: 10px 10px 5px;
    }
  }
}
.selected-list {
  max-height: 40vh;
  overflow: auto;
  &-item {
    padding: 10px;
  }
}
</style>