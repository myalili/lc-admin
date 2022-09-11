<template>
  <el-container class="assignee-choose">
    <el-main>
      <div class="close-dialog-btn">
        <el-button icon="el-icon-close" @click="close()"></el-button>
      </div>
      <el-tabs v-model="tabName">
        <el-tab-pane label="用户中心" name="authCenter">
          <UserAndRoleChoose
            :type="AParams.type"
            :useronly="AParams.useronly"
            :value="AParams.value"
            :hideRoleTab="AParams.hideRoleTab"
          />
        </el-tab-pane>
        <el-tab-pane label="外部系统" name="systemApi">
          <SystemApiRespChoose
            :type="AParams.type"
            :useronly="AParams.useronly"
            :value="AParams.value"
            :hideRoleTab="AParams.hideRoleTab"
          />
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>

import UserAndRoleChoose from './components/UserAndRoleChoose';
import SystemApiRespChoose from './components/SystemApiRespChoose';
export default {
  mixins:[window.V8.mixins],
  name: 'AssigneeChoose',
  components: { UserAndRoleChoose, SystemApiRespChoose },
  data() {
    return {
      tabName: 'authCenter'
    };
  }
};
</script>

<style lang="scss">


.assignee-choose-dialog.aweb-dialog {
  > .aweb-dialog__header {
    display: none;
  }
  > .aweb-dialog__body {
    padding: 0;
    > .assignee-choose {
      position: relative;
      > .el-main {
        padding: 0;
        > .close-dialog-btn {
          position: absolute;
          right: 10px;
          z-index: 999;
          .el-button {
            border: none;
            background: transparent;
            font-size: 18px;
            height: 45px;
            line-height: 45px;
            padding: 0 10px;
          }
        }
        > .el-tabs {
          height: 100%;
          > .el-tabs__header {
            margin: 0;
            .el-tabs__nav-wrap {
              .el-tabs__item {
                padding: 0 20px;
                font-size: 14px;
                height: 45px;
                line-height: 45px;
              }
              &::after {
                height: 1px;
              }
            }
          }
          > .el-tabs__content {
            height: calc(100% - 46px);
            overflow: auto;
            box-sizing: border-box;
            padding: 0 !important;
            overflow: hidden;
          }
        }
      }
    }
  }
}
 .lynn{
    .aweb-dialog__wrapper {
    
        overflow:unset
    
    }
 }
</style>
