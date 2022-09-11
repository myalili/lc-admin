<template>
  <div class="dictionary-list">
    <dict-full-table
      class="dictionary-list-table"
      :data="dictionaryList"
      :showSelection="false"
      @row-click="changeSelected"
    >
      <el-table-column width="30">
        <div slot-scope="{ row }">
          <el-radio
            v-if="singleSelect"
            :value="selectedMap[row.id]"
            :label="true"
            @change.native.capture.stop="changeSelected(row)"
          />
          <el-checkbox
            v-else
            :value="selectedMap[row.id]"
            @change.native.capture.stop="changeSelected(row)"
          />
        </div>
      </el-table-column>
    </dict-full-table>
    <div class="dictionary-list-footer">
      <custom-pager
        class="custom-pager"
        :total="totalCount"
        :currentPage="currentPage"
        :pageSize="pageSize"
        @current-change="currentChange"
        @size-change="sizeChange"
      ></custom-pager>
    </div>
  </div>
</template>

<script>
const {query} = window.getBffApi();
import customPager from './pagination.vue'
import { throttle } from 'lodash'
import dictFullTable from './dictFullTable.vue'
const {listToMap}=window.codelessUtils
export default {
  name: 'DictionaryList',
  components: { customPager, dictFullTable },
  props: {
    dictId: {
      type: String,
      default: ''
    },
    filterText: {
      type: String,
      default: ''
    },
    selectedList: {
      type: Array,
      default() {
        return []
      }
    },
    singleSelect: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dictionaryList: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      searchFn: () => {}
    }
  },
  computed: {
    selectedMap() {
      return listToMap(this.selectedList, 'id', () => true)
    }
  },
  watch: {
    dictId: {
      handler(val) {
        this.dictionaryList = []
        this.totalCount = 0
        this.currentPage = 1
        if (!val) {
          return
        }
        this.getDictionaryList()
      },
      immediate: true
    },
    filterText: {
      handler() {
        this.searchFn()
      }
    }
  },
  mounted() {
    this.searchFn = throttle(() => {
      this.dictionaryList = []
      this.totalCount = 0
      this.currentPage = 1
      this.getDictionaryList()
    }, 600)
  },
  methods: {
    getDictionaryList() {
      query({
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        dictId: this.dictId,
        name: this.filterText
      })
        .then(res => {
          const { pageData = [], total } = res
          this.dictionaryList = pageData
          this.totalCount = total
        })
        .catch(err => {
          this.$notify.error(err)
        })
    },
    currentChange(pageNum) {
      this.currentPage = pageNum
      this.getDictionaryList()
    },
    sizeChange(pageSize) {
      this.currentPage = 1
      this.pageSize = pageSize
      this.getDictionaryList()
    },
    changeSelected(row) {
      const isSelected = this.selectedMap[row.id]
      let selectedList = this.selectedList
      if (isSelected) {
        const index = this.selectedList.findIndex(item => item.id === row.id)
        if (index >= 0) {
          selectedList.splice(index, 1)
        }
      } else {
        if (this.singleSelect) {
          selectedList = [row]
        } else {
          selectedList.push(row)
        }
      }
      this.$emit('selection-change', selectedList)
    },
    clearSelection() {
      this.selectedList = []
    }
  }
}
</script>

<style lang="scss" scoped>
.dictionary-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  ::v-deep {
    .el-table__header-wrapper {
      border-bottom: 1px solid #ebeef5;
    }
  }
  &-table {
    flex-grow: 1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    ::v-deep {
      .el-table__row:hover {
        cursor: pointer;
      }
    }
    .dict-type-ctn {
      vertical-align: middle;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 18px;
      width: 38px;
      color: #fff;
      background: #384e72;
      border-radius: 20px;
      margin-right: 10px;
      zoom: 0.8;
      font-weight: bold;
      border: 1px solid #384e72;
      &.is-public {
        color: #384e72;
        background: #fff;
      }
    }
  }
  &-footer {
    padding: 10px;
    display: flex;
    .custom-pager {
      flex-grow: 1;
    }
  }
}
</style>
