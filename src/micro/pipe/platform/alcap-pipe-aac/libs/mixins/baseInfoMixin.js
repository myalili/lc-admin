export default {
    inject: ['baseInfo'],
    props: {
      role: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    computed: {
      platform() {
        return this.baseInfo.platform
      },
      platformList() {
        return Object.keys(this.platformMap)
      },
      platformMap() {
        if (!Array.isArray(this.platform)) {
          return {
            [this.platform]: this.platform
          }
        }
        return this.platform.reduce((result, item) => {
          if (typeof item === 'object') {
            result[item.id] = item.name || item.id
          } else {
            result[item] = item
          }
          return result
        }, {})
      },
      isTenantOwner() {
        return this.role.type === '1' //ROLE_TENANT_OWNER
      },
      isShareRole() {
        return !this.role.tenantId
      },
      roleType() {
        return this.isTenantOwner  ? 'owner' : this.isShareRole ? 'share' : ''
      },
      global() {
        return this.baseInfo.global
      }
    },
  }