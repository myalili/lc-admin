<template>
  <div class="flex contentMargin mx-5 px-4 items-center">
    <div class="circular">
      <img src="../../img/script.png" alt="" srcset="">
    </div>
    <div class="flex w-full boxPadding">
      <div class="w-full">
        <div class="firstTitleMargin">
          <span class=" font-bold">{{ scriptCnName }}</span>
          <span class="divide1"></span>
          <span>{{ scriptEnName }}</span>
          <span class="divide2"></span>
          <span class="timeFont">{{ scriptCreateTime }}</span>
        </div>
        <div class="flex flex-wrap text-xs">
          <div
            v-for="(item, index) in descList"
            :key="index"
            class="secondTitleMargin"
          >
            <div class="descPadding w-max rounded-md">
              <span>{{ filterOperateName(item.operationType) }}</span>
              <span class="divide2"></span>
              <span>{{ item.desc }}</span>
              <span class="divide2"></span>
              <span>{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex operationMargin">
        <el-button type="text" @click="scriptEdit" class="btn">编辑</el-button>
        <el-button type="text" @click="editBaseInfo" class="btn">编辑基本信息</el-button>
        <el-button type="text" @click="scriptDelete" class="btn danger">删除</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    scriptCnName: {
      type: String,
      default: "脚本中文名称",
    },
    scriptEnName: {
      type: String,
      default: "ENGLISHNAME",
    },
    scriptCreateTime: {
      type: String,
      default: "agreeOwner更新于2020-05-27 15:22:32",
    },
    descList: {
      type: Array,
      default: [
        {
          name: "retrieve",
          chName: "中文名称",
          enName: "schemaname_value_info",
        },
        {
          name: "retrieve",
          chName: "中文名称",
          enName: "schemaname_value_info",
        },
        {
          name: "retrieve",
          chName: "中文名称",
          enName: "schemaname",
        },
        {
          name: "create",
          chName: "中文名称",
          enName: "schemaname_value_info",
        },
        {
          name: "update",
          chName: "中文名称",
          enName: "schematype-name_value_info",
        },
      ],
    },
  },

  data() {
    return {};
  },
  methods:{
    editBaseInfo(){
      this.$emit('editBaseInfo');
    },
    scriptDelete(){
      this.$emit('scriptDelete');
    },
    scriptEdit(){
      this.$emit('scriptEdit');
    },
    filterOperateName(name) {
      if (name == "retrieve") {
        return "查询";
      } else if (name == "create") {
        return "新增";
      } else if (name == "update") {
        return "修改";
      } else if (name == "delete") {
        return "删除";
      }
      return name;
    },
  }
};
</script>


<style lang="scss" scoped>
.contentMargin {
  padding-bottom: 4px;
  margin-bottom: 12px;
  border-bottom: 1px solid #e3f2fc;
  .circular {
    width: 38px;
    height: 38px;
    border-radius: 100%;
    text-align: center;
    .iconStyle {
      color: white;
      font-size: 20px;
      line-height: 38px;
    }
  }

  .boxPadding {
    padding-left: 20px;
    .firstTitleMargin {
      margin-bottom: 12px;
    }

    .secondTitleMargin {
      margin-right: 12px;
      margin-bottom: 10px;
      color: #333333;
    }
    .descPadding {
      padding: 5px 8px 4px;
      background: #E7ECEF;
      color: #333333;
    }
    .divide1 {
      border-right: solid #c8d0d4 1px;
      margin-left: 12px;
      margin-right: 12px;
    }
    .divide2 {
      border-right: solid #7f8c93 1px;
      margin-left: 12px;
      margin-right: 12px;
    }
    .timeFont {
      font-size: 12px;
      color: #7f8c93;
    }
  }
  .operationMargin {
    margin-left: 19px;
    .btn {
      color: #4769B3;
      &:hover {
        color: var(--color-primary);
      }
    }
    .danger:hover {
      color: var(--color-danger) !important;
    }
  }
}
</style>