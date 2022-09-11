<template>
  <div class="left-aside">
    <div class="left-aside-top" >
      <span>项目</span>
      <i title="创建项目" class="el-icon-circle-plus" @click="addprject"></i>
    </div>
    <div class="left-aside-bottom">
      <div
        :class="{ 'list-item': true, 'list-item-active': item.active }"
        v-for="(item, index) in list"
        :key="`'list-item'${index}${item.id}`"
        @click="checkeditem(item.id)"
      >
        <div class="item-icon">
          <svg class="icon svg-icon" aria-hidden="true">
            <use xlink:href="#icon-xiangmuxinxi"></use>
          </svg>
        </div>
        <div class="item-msg">
          <span :title="item.name">{{ item.name }}</span>
          <span :title="item.desc">{{ item.desc }}</span>
        </div>
        <div class="item-operation">
          <i title="编辑项目" class="el-icon-edit-outline"  @click.stop="edititem(item)"></i>
          <i title="删除项目" class="el-icon-delete"  @click.stop="deleteitem(item)"></i>
        </div>
      </div>
    </div>
    <el-dialog
      width="570px"
      :show-close="false"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="addprojectdialog"
      custom-class="no-header-and-footer-dailog left-aside-dialog-reset left-aside-add-preject-dialog"
    >
      <codeless-Dialog-Ctn
        :title="addprojectdialogtitle"
        @confirm="confirmaddproject"
        @cancel="closefun"
        @close="closefun"
      >
        <template v-slot:dialogContent>
          <div class="addproject-content">
            <div>
              <span><span>*</span>项目名称</span>
              <el-input
                size="small"
                class="project-content-Name"
                v-model="addprojectObj.name"
                placeholder="请输入"
              ></el-input>
            </div>
            <div>
              <span><span>&ensp;</span>项目描述</span>
              <el-input
                class="project-content-desc"
                type="textarea"
                :rows="2"
                placeholder="请输入"
                v-model="addprojectObj.desc"
              ></el-input>
            </div>
          </div>
        </template>
      </codeless-Dialog-Ctn>
    </el-dialog>
    <el-dialog
      width="400px"
      :show-close="false"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="deleteprojectdialog"
      custom-class="no-header-and-footer-dailog left-aside-dialog-reset left-aside-delete-preject-dialog"
    >
      <codeless-Dialog-Ctn
        title="删除项目"
        @confirm="confirmdeleteproject"
        @cancel="closedeletedialog"
        @close="closedeletedialog"
      >
        <template v-slot:dialogContent>
          <div class="deleteproject-content">
            <span>是否删除项目？</span>
          </div>
        </template>
      </codeless-Dialog-Ctn>
    </el-dialog>
  </div>
</template>
<script>
const {deleteTenant,addTenant,modifyTenant} = window.getAacApi();
export default {
  data() {
    return {
      //被选中的项目id
      checkedKey: null,
      //选中指定id的项目项目。
      savecheckedKey:null,
      addprojectdialogtitle: "创建项目",
      addprojectdialog: false,
      addprojectObj: {
        desc: "",
        name: "",
      },
      confirmaddproject: null,
      deleteprojectdialog: false,
      confirmdeleteproject: null,
      list:[],
    };
  },
  props: {
    projectList: {
      type: Array,
      default: [],
    },
  },
  
  watch: {
      //监听传入的项目数据
      projectList:{
          immediate:true,
          deep:true,
          handler(val){
            this.list = JSON.parse(JSON.stringify(val)).map((v)=>{
                // 每个项目添加active 字段
                v.active =  false;
                return v;
            });
            if(this.list.length > 0){
                // this.savecheckedkey 为再次选中已经选中的项目否则选中第一个
                this.checkeditem(this.savecheckedKey || this.list[0].id);
                this.savecheckedKey = null;
            }
          }
      }
  },
  methods: {
    // 新增项目
    addprject() {
      this.addprojectdialogtitle = "创建项目";
      this.addprojectObj = {
        desc: "",
        name: "",
      };
      this.confirmaddproject = () => {
        if(!this.addprojectObj.name.replace(/\s/g,'')){
            this.$message.error('填写项目名称')
            return;
        };
        this.$parent.$parent.Loading = true;
        this.addprojectdialog = false;
        addTenant({
          name: this.addprojectObj.name,
          desc: this.addprojectObj.desc,
          parentId: null,
        }).then((result)=>{
          console.log(result);
            this.$message.success('添加成功');
            // 将已经选中的项目id存储，在刷新列表在选中它。
            this.savecheckedKey = result.id;
            this.checkedKey = null;
            this.$parent.$parent.thatgetTenantList();

        }).catch((error) =>{
            this.$notify.error(error);
            this.$parent.$parent.Loading = false;
        })
      };
      this.addprojectdialog = true;
    },
    //关闭回调
    closefun() {
      this.addprojectdialog = false;
    },
    // 编辑项目
    edititem(item) {
      this.addprojectdialogtitle = "编辑项目";
      this.addprojectObj = JSON.parse(JSON.stringify(item));
      this.confirmaddproject = () => {
        if(!this.addprojectObj.name.replace(/\s/g,'')){
            this.$message.error('填写项目名称')
            return;
        };
        this.$parent.$parent.Loading = true;
        this.addprojectdialog = false;
        modifyTenant({
            name: this.addprojectObj.name,
            desc: this.addprojectObj.desc,
            id: this.addprojectObj.id
        }).then(() => {
            let i  = this.list.findIndex( v => v.id == this.addprojectObj.id);
            this.list[i].name = this.addprojectObj.name;
            this.list[i].desc = this.addprojectObj.desc;
            this.$message.success('修改成功');
            this.$parent.$parent.Loading = false;
        })
        .catch(error => {
            this.$notify.error(error);
            this.$parent.$parent.Loading = false;
        })
      };
      this.addprojectdialog = true;
    },
    //删除项目
    deleteitem(data) {
      this.deleteprojectdialog = true;
      let key = JSON.parse(JSON.stringify(data)).id;
      this.confirmdeleteproject = () => {
       this.$parent.$parent.Loading = true;
        this.deleteprojectdialog = false;
        deleteTenant(key).then(() => {
            
            let i = this.list.findIndex((v) => v.id == key);
            let active = this.list[i].active;
            this.list.splice(i, 1);
            this.$nextTick(() => {
                // 如果删除选中的项目则默认从新选中第一个
                if (!!active && this.list.length > 0) {
                    this.checkeditem(this.list[0].id);
                }
                this.$message.success('删除成功')
                this.$parent.$parent.Loading = false;
            });
        })
        .catch(error => {
          this.$notify.error(error);
          this.$parent.$parent.Loading = false;
        })
      };
    },
    //关闭删除
    closedeletedialog() {
      this.deleteprojectdialog = false;
    },
    //选中项目
    checkeditem(key) {
      if (this.checkedKey != key) {
        let oldi = this.list.findIndex((v) => v.id == this.checkedKey);
        let i = this.list.findIndex((v) => v.id == key);
        if (oldi > -1) {
          this.list[oldi].active = false;
        }
        this.list[i].active = true;
        this.checkedKey = key;
        this.$emit("change", JSON.parse(JSON.stringify(this.list[i])));
      }
    },
  },
};
</script>
<style scoped lang="scss">
.left-aside {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  &-top {
    width: 100%;
    height: 48px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #ebeef0;

    > span {
      font-size: 16px;
      font-weight: bold;
      color: var(--codeless-font-color-primary);
      margin-left: 20px;
    }

    > i {
      color: var(--color-primary);
      font-size: 20px;
      margin-right: 20px;
      cursor: pointer;
    }
  }

  &-bottom {
    width: 100%;
    height: calc(100% - 49px);
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    &::-webkit-scrollbar {
        display: none;
    }

    .list-item {
      height: 72px;
      width: 100%;
      border-bottom: 1px solid #ebeef0;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.2s ease-in-out 0s;
      &:hover {
        background: var(--color-hover-primary);

        .item-operation {
          pointer-events: auto;
          opacity: 1;
          font-size: 11px;
          color: var(--color-primary-dark-1);
        }
      }

      .item-icon {
        width: 56px;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        svg {
          width: 22px;
          height:22px;
          font-size: 22px;
        }
      }

      .item-msg {
        width: calc(100% - 112px);
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;

        span {
          display: inline-block;
          text-overflow: ellipsis;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
        }

        span:first-child {
          margin-top: 12px;
          font-size: 14px;
          font-weight: bold;
          color: var(--codeless-font-color-primary);
        }
        span:last-child {
          margin-top: 4px;
          font-size: 14px;
          font-weight: 400;
          color: var(--color-gray);
        }
      }

      .item-operation {
        width: 56px;
        height: 100%;
        display: flex;
        opacity: 0;
        transition: all 0.2s ease-in-out 0s;
        pointer-events: none;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
      }
    }

    .list-item-active {
      background: var(--color-hover-primary) !important;
    }
  }
}
</style>
<style lang="scss">
.left-aside-dialog-reset {
  border-radius: 8px;
  > .el-dialog__header {
    display: none !important;
  }
  > .el-dialog__body {
    padding: 0px !important;
  }

  .addproject-content {
    width: 100%;
    height: 139px !important;

    > div {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;

      > span {
        font-size: 14px;
        font-weight: 400;
        color: var(--codeless-font-color-primary);
        margin-left: 30px;
        > span {
          color: #f65656;
        }
      }

      .project-content-Name {
        width: 370px;
        margin-left: 16px;
      }

      .project-content-desc {
        width: 370px;
        margin-left: 16px;
      }
    }

    > div:last-child {
      margin-top: 16px;
    }
  }
  .deleteproject-content {
    width: 100%;
    height: 80px !important;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    span {
      font-size: 18px;
    }
  }
}
// 删除新增项目弹窗垂直居中
.left-aside-add-preject-dialog {
  margin-top:calc(50vh - 138px) !important;
}
.left-aside-delete-preject-dialog {
  margin-top:calc(50vh - 110px) !important;
}
</style>