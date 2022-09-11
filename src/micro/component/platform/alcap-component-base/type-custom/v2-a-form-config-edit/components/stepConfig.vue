<template>
  <div class="step-config">
    <div class="flex-center flex-between">
      <span><i class="el-icon-caret-bottom" />流程配置：</span>
    </div>
    <div class="card-box">
      <div>
        <div class="sub-label">结果标题：</div>
        <el-input size="mini" v-model="config.resultTitle"></el-input>
      </div>
      <div class="mt-2">
        <div class="sub-label">结果详细描述：</div>
        <el-input size="mini" v-model="config.resultDetail"></el-input>
      </div>
      <div class="mt-2">
        <div class="sub-label">结果说明：</div>
        <el-input size="mini" v-model="config.resultDesc"></el-input>
      </div>
      <div class="mt-2">
        <div class="sub-label">交易详情标题：</div>
        <el-input size="mini" v-model="config.dealDesc"></el-input>
      </div>
      <div class="mt-2 flex items-center justify-between">
        <div class="sub-label">结果页步骤：</div>
        <el-switch size="mini" v-model="config.resultSteps"></el-switch>
      </div>
      <div class="mt-2 flex items-center justify-between">
        <div class="sub-label">结果页按钮：</div>
        <!-- <span class="btn-add" @click="addBtn">+</span> -->
        <el-button type="primary" size="mini" class="w-5 h-5" style="padding: 0" icon="el-icon-plus" circle @click="addBtn"></el-button>
      </div>
      <div class="mt-2 " v-for="item in config.resultBtn" :key="item.id">
        <el-input size="mini" v-model="item.title" placeholder="请输入按钮标题"></el-input>
        <div class="flex items-center justify-between mt-1">
          <page-select :value.sync="item.page" />
          <i class="el-icon-remove btn-del" @click="del(item)"></i>
        </div>
      </div>
      <div class="mt-2 flex items-center justify-between">
        <div class="sub-label">结果卡片：</div>
        <!-- <span class="btn-add" @click="addCard">+</span> -->
        <el-button type="primary" size="mini" class="w-5 h-5" style="padding: 0" icon="el-icon-plus" circle @click="addCard"></el-button>
      </div>
      <div class="mt-2 " v-for="item in config.resultCard" :key="item.id">
        <el-autocomplete
          v-model="item.engNameShort"
          :fetch-suggestions="querySearch"
          label="desc"
          value-key="desc"
          placeholder="请输入内容"
          size="mini"
          style="width: 50%"
          @select="fieldAutoComp($event, item)"
        ></el-autocomplete>
        <el-input style="width:50%" size="mini" v-model="item.desc" placeholder="请输入标题"></el-input>
        <div class="flex items-center justify-between mt-1">
           <codeless-dialog-icon :value.sync="item.icon" :operationEnable = "true"/>
          <i class="el-icon-remove btn-del" @click="delCard(item)"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    config: {},
    entity: {
      type: Object,
    },
  },

  data() {
    return {
      maxLimitShow: 4,
      categoriesTree: [],
      fields: []
    };
  },

  computed: {
    tenantId() {
      return this.$store.getters["user/tenantId"];
    },
    tenantList() {
      return this.$store.state.user.tenantList;
    },
  },

  created() {
    if (!this.config) {
      this.config = {
        resultTitle: '录入成功，等待授权',
        resultDetail: '您已成功录入',
        resultDesc: '尊敬的客户您好，您所提交的指令已发送至复核员/授权员，指令有效期为7个自然日，请及时联系复核员/授权员做处理。',
        dealDesc: '交易详情',
        resultBtn: [],
        resultCard: [],
        resultSteps: false
      }
    }
  },

  methods: {
    fieldAutoComp(e, row) {
      row.engNameShort = e.name
      row.desc = e.desc
    },
    async querySearch(queryString, cb) {
      const ctx = this;
      if (this.fields.length === 0) {
        let res = await pipe.entity.getEntityDetail(this.entity.id, false);
        if (!res) return
        ctx.fields = res.fields
      }
      var fields = ctx.fields
      var results = queryString ? fields.filter(this.createFilter(queryString)) : fields;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (field) => {
        return (field.desc.indexOf(queryString) > -1);
      };
    },
    addBtn() {
      const ctx = this;
      if (!ctx.config.resultBtn) {
        ctx.$set(ctx.config, 'resultBtn', [])
      }
      ctx.config.resultBtn.push(
        {
          id: new Date().getTime(),
          title: '',
          page: {}
        }
      )
    },
    delBtn(item) {
      const ctx = this;
      ctx.config.resultBtn.splice(
        ctx.config.resultBtn.findIndex((i) => i.id === item.id),
        1
      );
    },

    addCard() {
      const ctx = this;
      if (!ctx.config.resultCard) {
        ctx.$set(ctx.config, 'resultCard', [])
      }
      ctx.config.resultCard.push(
        {
          id: new Date().getTime(),
          icon: '',
          engNameShort: '',
          desc: ''
        }
      )
    },
    delCard(item) {
      const ctx = this;
      ctx.config.resultCard.splice(
        ctx.config.resultCard.findIndex((i) => i.id === item.id),
        1
      );
    },

  },
};
</script>

<style lang="scss" scoped>
.step-config {
  width: 100%;
}

.operate-wrap {
  position: absolute;
  right: 8px;
  top: 0;
}

.btn-del {
  font-size: 16px;
  color: #aabec8;
  margin-left: 12px;
  &:hover {
    cursor: pointer;
    color: #f65656;
  }
}

.card-box {
  position: relative;
  background: white;
  width: 100%;
  border: 1px solid #c8d0d4;
  border-radius: 5px;
  padding: 16px;
  margin-top: 16px;

  &:first-child {
    margin-top: 8px;
  }
  &:last-child {
    margin-bottom: 16px;
  }
}

.sub-label {
  font-weight: normal;
}

.flex-center {
  display: flex;
  align-items: center;
  white-space: nowrap;
}
.flex-between {
  justify-content: space-between;
}
</style>
