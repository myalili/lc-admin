<template>
  <el-collapse-item class="authority-tree" :name="data.name">
    <div class="authority-tree-title" slot="title">
      <el-checkbox
        :value="wrapSelected[data.id].checked"
        :indeterminate="wrapSelected[data.id].indeterminate"
        
        @click.native.stop
        @change="authorityChange(data)"
      >
        <span class="authority-tree-title-text">{{ platformMap[data.name] }}</span>
      </el-checkbox>
    </div>
    <div>
      <!-- <el-tree :data="data.children" default-expand-all>
        <span class="authority-tree-node" slot-scope="{ data }">
          <el-checkbox
            :value="wrapSelected[data.id].checked"
            :indeterminate="wrapSelected[data.id].indeterminate"
            :disabled="isTenantOwner"
            @click.native.stop
            @change="authorityChange(data)"
          ></el-checkbox>
          <span class="authority-tree-node-text">{{ data.name }}</span>
        </span>
      </el-tree> -->
      <authority-tree-base :data="data.children">
        <span class="authority-tree-node" slot-scope="{ data }">
          <el-checkbox
            :value="wrapSelected[data.id].checked"
            :indeterminate="wrapSelected[data.id].indeterminate"
            
            @click.native.stop
            @change="authorityChange(data)"
          >
            <span>{{ data.name }}</span>
          </el-checkbox>
        </span>
      </authority-tree-base>
    </div>
  </el-collapse-item>
</template>

<script>

import authorityTreeBase from './authorityTreeBase.vue'

const {baseInfoMixin} = window.aacMixins
const {
  authorityChange,
  intoSelectedWrapper
} = window.aacUtils

export default {
  name: 'AuthorityTree',
  mixins: [baseInfoMixin],
  components: { authorityTreeBase },
  props: {
    title: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default() {
        return {
          children: []
        }
      }
    },
    baseSelectedList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      selectedMap: {}
    }
  },
  watch: {
    baseSelectedList() {
      this.selectedMap = this.baseSelectedList
        .map(item => item.id)
        .reduce((result, item) => {
          result[item] = true
          return result
        }, {})
    }
    
  },
  computed: {
    wrapSelected() {
      return intoSelectedWrapper([this.data], this.selectedMap)
    }
  },
  mounted(){
    this.selectedMap = this.baseSelectedList
        .map(item => item.id)
        .reduce((result, item) => {
          result[item] = true
          return result
        }, {})
  },
  methods: {
    authorityChange(data) {
      const checked = !this.wrapSelected[data.id].checked
      this.selectedMap = authorityChange(data, this.selectedMap, checked)
    },
    getCheckedIdList() {
      return Object.keys(this.wrapSelected).filter(
        key =>
          key !== this.data.id &&
          (this.wrapSelected[key].checked ||
            this.wrapSelected[key].indeterminate)
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.authority-tree {
  &-title {
    & > * + * {
      margin-left: 5px;
    }
    &-text {
      font-weight: bold;
    }
  }
  &-node {
    &-text {
      padding-left: 5px;
    }
  }

  &::v-deep{
   .el-checkbox{
     color:#333333;
     font-weight:400;
    }
  }
}
</style>
