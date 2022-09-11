<template>
  <div
    class="role-list-item"
    :class="{ 'is-active': isActive, [roleType]: true }"
    :key="role.id"
    :label="role.id"
    @click="itemClick"
  >
    <!-- <i class="iconfont iconman"></i> -->
    <role-icon :type="roleType" />
    <span class="role-list-item-text truncate">
      <!-- {{ role.name }} -->
      {{name(role)}}
    </span>
    <i
      v-if="!(isTenantOwner || isShareRole)"
      class="el-icon-delete role-list-item-delete"
      @click.stop="deleteRole"
    ></i>
  </div>
</template>

<script>
import roleIcon from './roleIcon.vue'
const {baseInfoMixin} = window.aacMixins

export default {
  name: 'RoleListItem',
  mixins: [baseInfoMixin,window.codelessMixins.customDialog],
  components: {roleIcon},
  props: {
    role: {
      type: Object,
      default() {
        return {}
      }
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  computed:{
    tenantId() {
      //console.log('tenantId',this.$store.getters["user/tenantId"])
      return this.$store.getters["user/tenantId"];
    },
    tenantList() {
      //console.log('tenantId',this.$store.state.user.tenantList)
      return this.$store.state.user.tenantList;
    },
    name(){
      return (role)=>{
        let ret = `${role.name}`;
        if(role.tenantId!==this.tenantId){

         for(let i=0;i<this.tenantList.length;i++){
           let item = this.tenantList[i];
           if(item.id===role.tenantId){
            ret += `(${item.name})`
             break
           }
         }
           
        }
        return ret
      }
      
    }
  },
  methods: {
    deleteRole() {
           let self = this;
           self.openCustomDialog({
            title:`提示`,
            path:'deleteConfirm',
            width:"300px",
            component:{
              template:`<div>确定删除该角色吗?</div>`,
            },
            confirmCallback(){
              self.$emit('delete', this.role)
            }
      })
    
      // this.$confirm('确定删除该角色吗？', '删除角色', {
      //     distinguishCancelAndClose: true,
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     cancelButtonClass: 'message-box-cancel-btn',
      //     confirmButtonClass: 'message-box-confirm-btn',
      //     type: 'warning'
      //   }).then(() => {
      //     this.$emit('delete', this.role)
      //   })
      },
    itemClick() {
      this.$emit('click', this.role)
    }
  }
}
</script>

<style lang="scss" scoped>
.role-list-item {
  // border: none;
  // padding: 0;
  height: 40px;
  line-height: 40px;
  padding-left: 20px;
  // border-radius: 0;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  // border-radius: 8px;
  // padding: 8px 16px;
  //border-bottom: 1px solid rgb(231, 236, 239);
  cursor: pointer;
  transition: background 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

  &-text {
    font-size: 14px;
    padding: 0 10px;
    flex-grow: 1;
    color:#333333;
  }

  &-delete {
    display: none;
    margin-right: 10px;
    color: var(--color-primary);
  }

  &:hover {
     background-color: #f0f4f7;
  }
  &:hover &-delete {
    display: block;
  }
  &.is-active {
    background-color: #e3f2fc;
    border-image: linear-gradient(180deg, #22d5e6 0%, #3b8bf5 100%) 3;
    border-right: 3px solid #ffffff;
    font-weight:500;
  }
}
</style>
