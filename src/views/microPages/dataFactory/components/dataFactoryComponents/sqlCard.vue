<template>
  <div
    class="
      cardStyle
      rounded-md
      flex flex-col
      divide-y
    "
  >
    <div class="flex items-center justify-between">
      <div class="leftBox-padding flex items-center space-x-4">
        <div class="sqlcircular rounded-full flex items-center justify-center ">
          <!-- <i class="icon-SQL sqlIcon"></i> -->
          <codeless-icon icon="icon-SQL" />
        </div>
        <div>
          <div class="text-sm font-bold">{{ desc }}</div>
          <p class="text-sm">{{ name }}</p>
        </div>
      </div>
      <div class="flex justify-between pb-4">
        <div
          class="
            editIcon
            rounded-full
            flex
            items-center
            justify-center
            border
            bg-white
            hover:bg-primary hover:text-white
            mr-2
          "
          @click="edit()"
        >
          <i class="el-icon-edit-outline"></i>
        </div>

        <el-dropdown @command="handleCommand" trigger="click">
          <div
            class="
              moreIcon
              rounded-full
              flex
              items-center
              justify-center
              border
              hover: bg-white hover:text-primary
              transform
              rotate-90
            "
          >
            <i class="el-icon-more"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="editBaseInfo">编辑基本信息</el-dropdown-item>
            <el-dropdown-item command="remove">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <div class="updateTime text-xs" style="color: #7f8c93">
      {{ updateUserName }}更新于{{ updateTime }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
    };
  },
  props: {
    desc: {
      type: String,
      default: "审核流程",
    },
    name: {
      type: String,
      default: "VERIFYFLOW",
    },
    updateUserName: {
      type: String,
      default: "",
    },
    updateTime: {
      type: String,
      default: "",
    },
  },
  methods: {
    more() {
      console.log("aa");
    },
    edit(row) {
      this.$emit("edit");
    },
    remove() {
      this.$emit("remove");
    },
    editBaseInfo() {
      this.$emit("editBaseInfo");
    },
    handleCommand(command) {
      this[command]();
    }
  },
};
</script>

<style lang="scss" scoped>
.cardStyle {
  width: 100%;
  height: 121px;
  background-color: #f2f8fa;
  padding: 20px 20px 0px 20px;
  .leftBox-padding {
    padding-bottom: 16px;
  }
  .sqlcircular {
    width: 38px;
    height: 38px;
    text-align: center;
    background: #D8E3EB;
    .sqlIcon {
      color: black;
      font-size: 20px;
      line-height: 38px;
    }
  }
  .editIcon {
    width: 28px;
    height: 28px;
    cursor: pointer;
    border-color: #4769B3;
    color: #4769B3;
    &:hover {
      border-color: var(--color-primary);
      color: white;
    }
  }
  .moreIcon {
    width: 28px;
    height: 28px;
    cursor: pointer;
    border-color: #4769B3;
    color: #4769B3;
    &:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
  }
  .updateTime {
    padding-bottom: 9px;
    padding-top: 14px;
  }
}
</style>