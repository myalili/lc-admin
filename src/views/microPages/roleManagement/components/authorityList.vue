<template>
  <div class="authorities-list h-full">
    <div class="authorities-list-header">
      <div class="authorities-list-header-title">权限设置</div>
      <!-- <role-icon />
      <div style="flex-grow: 1">
        <div class="authorities-list-header-text">{{ role.name }}</div>
        <div class="authorities-list-header-second-text">{{ role.desc }}</div>
      </div> -->
      <!-- <el-button
        v-if="platformList.includes('ASC')"
        type="primary"
        :disabled="isTenantOwner"
        @click.native.stop="openConfigService"
        >限制服务权限</el-button
      > -->
      <el-button
        class="authorities-list-header-save-button"
        type="primary"
        @click="save"
        icon='iconfont icon-baocun'
        size='mini'
        round
      >
        保存
      </el-button>
    </div>
    <el-collapse v-model="activeNames" class="authorities-list-body">
      <authority-tree
        v-for="item in authoritiesTree"
        :key="item.id"
        ref="tree"
        :data="item"
        :role="role"
        :baseSelectedList="roleAuthorityMap[item.name]"
      />
    </el-collapse>
    <!-- <config-service
      v-if="configServiceVisibled"
      title="限制服务权限"
      :visible.sync="configServiceVisibled"
      :data="role"
      append-to-body
      @close="closeConfigService"
      @confirm="closeConfigService"
    /> -->
  </div>
</template>

<script>
const { getAuthoritiesList, saveAuthorities } = window.getAacApi()
const { requestAuths } = window.getAacApi();
import authorityTree from './authorityTree.vue'
// import roleIcon from './roleIcon.vue'
// import configService from './configService/configService.vue'

const {baseInfoMixin} = window.aacMixins
const {
  intoAuthoritiesTree,
  classifyList
} = window.aacUtils
export default {
  name: 'AuthorityList',
  mixins: [baseInfoMixin],
  components: { 
    authorityTree, 
    // configService 
  },
  data() {
    return {
      authoritiesTree: [],
      roleAuthorityMap: {},
      activeNames: [],
      // configServiceVisibled: false
    }
  },
  watch: {
    role:{
      handler(val){
         if (!val.id) {
          return
        }
        this.getAuthoritiesList()
      },
      immediate:true
    },
    platform: {
      handler(val) {
        if (!val) {
          return
        }
        this.queryAuthorities()
      },
      immediate: true
    }
  },
  methods: {
    getAuthoritiesList() {
      getAuthoritiesList(this.role.id)
        .then(data => {
          this.roleAuthorityMap = classifyList(
            data.filter(item => this.platformList.includes(item.type))
          )
        })
        .catch(error => {
          this.roleAuthority = []
          this.$notify({
            title: error,
            type: 'error'
          })
        })
    },
    // openConfigService() {
    //   this.configServiceVisibled = true
    // },
    // closeConfigService() {
    //   this.configServiceVisibled = false
    // },
    queryAuthorities() {
      requestAuths(
        {
          params:{
            type:this.platformList.join(','),
            verbose:true
          }
        })
        .then(res => {
          let {content,success} = res;
          if(success){
            content = content.filter(auth=>{
              let {menus} = auth;
              if(menus && menus.length){
                return menus.some(menu=>{
                  return (
                    menu.codelessType === "devMenu" ||
                    menu.codelessType === "runtimeMenu"
                  );
                })
              }else{
                return auth.tenantId
              }
            })
             this.authoritiesTree = intoAuthoritiesTree(content)
             this.activeNames = this.authoritiesTree.map(item => item.name)
          }else{
            throw(res)
          }
         
        })
        .catch(err => {
          console.error(err)
          this.$notify({
            title: err,
            type: 'error'
          })
        })
    },
    save() {
      const list = []
      this.$refs.tree.forEach(tree => {
        list.push(...tree.getCheckedIdList())
      })
      saveAuthorities(this.role.id, this.platformList, list)
        .then(() => {
          this.getAuthoritiesList()
          this.$notify({
            title: '修改权限成功',
            type: 'success'
          })
        })
        .catch(error => {
          this.$notify({
            title: error,
            type: 'error'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>

.authorities-list {
  display: flex;
  flex-direction: column;
  padding: 0 20px 20px;
  height: 100%;
  width: 100%;
 
  &-header {
    display: flex;
    align-items: center;
    height: 60px;
    line-height: 60px;

    &-title {
      display: flex;
      font-size: 14px;
      color: #333;
      flex-grow: 1;
      font-weight: bold;
    }
    &-text {
      font-size: 14px;
      padding-left: 5px;
    }
    &-second-text {
      padding-left: 5px;
      color: rgb(153, 153, 153);
    }
    &-save-button {
      // background-color: #357aa0;
      // border-color: #357aa0;

      ::v-deep .icon-baocun {
        font-size: 12px;
      }
      // &:hover {
      //   background-color: rgb(87, 161, 201);
      // }
      // &:active {
      //   background-color: #357aa0;
      // }
    }
  }
  &-body {
    height: calc(100% - 60px);
    flex-grow: 1;
    overflow: auto;
    border:none;
    ::v-deep .el-tree-node__content{
      height:unset;
      line-height:unset;
      margin-bottom:unset;
    }

    ::v-deep .el-collapse-item__header {
          height: unset;
          line-height: unset;
          margin-bottom: 10px;
        }

     ::v-deep .el-collapse-item__arrow {
          display: none;
        }

     ::v-deep .el-collapse-item__wrap {
          border: none;
        }

  }
}



</style>
