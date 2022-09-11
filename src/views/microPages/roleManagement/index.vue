<template>
  <div class="role-manager">
    <div class="role-manager-aside">
      <role-list :title="title" :value="role.id" @change="roleChange" />
    </div>
    <div class="role-manager-content">
      <authority-list v-if="role.id" :role="role" />
    </div>
  </div>
</template>

<script>
import roleList from './components/roleList.vue'
import authorityList from './components/authorityList.vue'
export default {
  name: 'RoleManager',
  provide() {
    return {
      baseInfo: this.baseInfo
    }
  },
  components: {
    roleList,
    authorityList
  },
  props: {
    platform: {
      type: [String, Array],
      default:()=>{
        return [{
          id:window.platform,
          name:'低代码平台'
        }]
      }
    },
    global: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '角色'
    }
  },
  data() {
    return {
      role: { id: '' }
    }
  },
  computed: {
    baseInfo() {
      return {
        platform: this.platform,
        // tenantOwner: this.tenantOwner,
        global: this.global
      }
    }
  },
  methods: {
    roleChange(role) {
      this.role = role
    }
  }
}
</script>

<style lang="scss" scoped>
.role-manager {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  // border-radius: 6px;
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
  &-aside {
    min-width: 272px;
    max-width: 272px;
    height: 100%;
  }
  &-content {
    background-color: white;
    height: 100%;
    flex:1;
    // width: 100%;
    // flex-grow: 1;
    overflow: hidden;
  }
}
</style>