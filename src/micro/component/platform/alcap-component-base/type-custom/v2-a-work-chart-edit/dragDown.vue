!<template>
<span style="position: relative;display: inline-block;" @click.stop>
  <i class="el-icon-close" style="position: absolute;top: 7px;right: 1px;color: #878d9f;cursor: pointer;z-index: 99999;" @click="removeItem" />
  <el-dropdown trigger="click" size="mini" @command="(param) =>changeConfig(param)">
    <span class="el-dropdown-link">
      <el-tag size="small" class="item-axis" type="info" style="padding-right:16px">
        <span style="float: left">
          <el-icon class="el-icon-arrow-down"></el-icon>
        </span>
        <span class="item-span-style">{{ itemConfigList.showName ? itemConfigList.showName : itemConfigList.name }}</span>
        <!-- <i class="el-icon-arrow-down el-icon--right" style="position: absolute;top: 0px;right: 10px;" /> -->
      </el-tag>
    </span>
    <el-dropdown-menu slot="dropdown">
      <!-- 排序 -->
      <el-dropdown-item v-if="isShowSelectItem">
        <el-dropdown placement="right-start" size="mini" style="width: 100%" @command="(param) =>changeConfig(param)">
          <span class="el-dropdown-link inner-dropdown-menu">
            <span>
              <span>排序</span>
            </span>
            <i class="el-icon-arrow-right el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="{type:'sort',value:'default'}">
              默认
              <el-icon class="el-icon-check" v-show="itemConfigList.sort==='default'"></el-icon>
            </el-dropdown-item>
            <el-dropdown-item :command="{type:'sort',value:'asc'}">
              升序
              <el-icon class="el-icon-check" v-show="itemConfigList.sort==='asc'"></el-icon>
            </el-dropdown-item>
            <el-dropdown-item :command="{type:'sort',value:'desc'}">
              降序
              <el-icon class="el-icon-check" v-show="itemConfigList.sort==='desc'"></el-icon>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-dropdown-item>

      <el-dropdown-item v-if="isShowSelectItem">
        <el-dropdown placement="right-start" size="mini" style="width: 100%"  @command="(param) =>changeConfig(param)">
          <span class="el-dropdown-link inner-dropdown-menu">
            <span>
              <span>高级计算</span>
            </span>
            <i class="el-icon-arrow-right el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="{type:'compute',value:'percentage'}">
              占比
              <el-icon class="el-icon-check" v-show="itemConfigList.compute==='percentage'"></el-icon>
            </el-dropdown-item>
            <el-dropdown-item :command="{type:'compute',value:'default'}">
              无
              <el-icon class="el-icon-check" v-show="itemConfigList.compute==='default'"></el-icon>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-dropdown-item>

      <el-dropdown-item v-if="isShowSelectItem">
        <el-dropdown placement="right-start" size="mini" style="width: 100%"  @command="(param) =>changeConfig(param)">
          <span class="el-dropdown-link inner-dropdown-menu">
            <span>
              <span>汇总方式</span>
            </span>
            <i class="el-icon-arrow-right el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="{type:'duplicate',value:'summary'}">
              求和
              <el-icon class="el-icon-check" v-show="itemConfigList.duplicate==='summary'"></el-icon>
            </el-dropdown-item>
            <el-dropdown-item :command="{type:'duplicate',value:'count'}">
              计数
              <el-icon class="el-icon-check" v-show="itemConfigList.duplicate==='count'"></el-icon>
            </el-dropdown-item>
            <el-dropdown-item :command="{type:'duplicate',value:'duplicate'}">
              去重计数
              <el-icon class="el-icon-check" v-show="itemConfigList.duplicate==='duplicate'"></el-icon>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-dropdown-item>

      <el-dropdown-item :command="{type:'change', value:'changeName'}">
        修改显示名
      </el-dropdown-item>

      <el-dropdown-item :command="{type:'remove', value:'remove'}">
        删除字段
      </el-dropdown-item>
    </el-dropdown-menu>
    </el-dropdown>
</span>
</template>

<script>
export default {
  components: {},
  props: {
    info: Object,
    config: Array,
    quote: String
  },
  data() {
    return {
    };
  },
  watch: {},
  computed: {
    itemConfigList() {
      let res = {}
      for(let i=0; i<this.config.length; i++){
        if(this.config[i].id === this.info.value){
          res =  this.config[i]
        }
      }
      if(!res){
        res = {
          id: this.info.value,
          name: this.info.name,
          showName: '',
          value: this.info.value,
          sort: 'default', //排序
          duplicate: 'summary', //去重
          compute: 'default', //高级计算
        }
      }
      return res
    },
    isShowSelectItem() {
      if(this.quote === 'dimension') {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    removeItem() {
      this.$emit('removeItem')
    },
    changeShowName(index) {
      this.$emit('changeShowName', index)
    },
    changeConfig(param) {
      this.config.forEach((item, index) => {
        if(item.id === this.info.value) {
          switch (param.type) {
            case 'sort':
              item.sort = param.value
              break
            case 'duplicate':
              item.duplicate = param.value
              break
            case 'compute':
              item.compute = param.value
              break
            case 'change':
              this.changeShowName(index)
              break
            case 'remove':
              this.removeItem()
              break
            default:
              break
          }
          
          return
        }
      })
      this.$emit('update:config', this.config)
    }
  },
  created() {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
</style>
