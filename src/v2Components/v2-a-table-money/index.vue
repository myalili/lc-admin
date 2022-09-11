<template>
  <el-table :data="tableData" stripe style="width: 100%">
    <el-table-column
      v-for="item in compColumn"
      :key="item.key"
      :prop="item.dataIndex"
      :label="item.title"
      :width="item.dataIndex === 'amountRange' ? 400 : ''"
    >
      <template slot-scope="scope">
        <span v-if="item.dataIndex === 'amountRange'" class="flex items-center">
          <el-input
            v-model="scope.row.amountRange[0]"
            placeholder="0.00"
            style="width: 33%"
            disabled
            :formatter="
              (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            "
            :parser="(value) => value.replace(/\￥\s?|(,*)/g, '')"
            @change="onChange($event, scope.row, 0)"
          ></el-input>
          <span class="w-1/3 flex items-center justify-center">
            <i class="el-icon-arrow-left"></i>
            <span>金额区间</span>
            <i class="el-icon-arrow-left"></i>
            <span>=</span>
          </span>
          <el-input
            v-model="scope.row.amountRange[1]"
            placeholder="0.00"
            style="width: 33%"
            :formatter="
              (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            "
            :parser="(value) => value.replace(/\￥\s?|(,*)/g, '')"
            @change="onChange($event, scope.row, 1)"
          ></el-input>
        </span>
        <span class="flex flex-col" v-else>
          <el-input
            type="number"
            v-model="scope.row[item.dataIndex]"
            placeholder="0"
          ></el-input>
          <el-select
            style="margin-top: 8px;"
            multiple
            v-model="scope.row[`${item.dataIndex}Users`]"
            placeholder="请选择人员"
            @change="usersChange($event, item.dataIndex, scope.row)"
          >
            <el-option v-for="user in compUsers(item.dataIndex)" :value="user.value" :label="user.label" :key="user.value"></el-option>
          </el-select>
        </span>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="text"
          @click="handleAdd(tableData.length - 1, scope.row)"
          v-if="scope.$index === 0"
          >添加</el-button
        >
        <el-button
          size="mini"
          type="text"
          @click="handleDelete(scope.$index, scope.row)"
          v-else
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import pck from "./package.json";
const { listMixin } = window.codelessMixins;
export default {
  _options: pck.docs,
  mixins: [ listMixin, window.codelessMixins.customDialog ],
  inject: ["root", "searchForm"],
  name: "v2ATableMoney",
  props: {
    value: {
      type: String,
      default: "",
    },
    moneyMode: {
      type: String,
      default: "1",
    },
    config: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      dataValue: '',
      tableData: [
        {
          amountRange: ['0', '0'],
          level1: 0,
          level2: 0,
          level3: 0,
          level4: 0,
          level5: 0,
          level1Users: [],
          level2Users: [],
          level3Users: [],
          level4Users: [],
          level5Users: []
        },
      ],
      pck,

      column: [
        {
          title: "金额区间",
          key: "amountRange",
          dataIndex: "amountRange",
        },
        {
          title: "一级(人)",
          key: "level1",
          dataIndex: "level1",
        },
        {
          title: "二级(人)",
          key: "level2",
          dataIndex: "level2",
        },
        {
          title: "三级(人)",
          key: "level3",
          dataIndex: "level3",
        },
        {
          title: "四级(人)",
          key: "level4",
          dataIndex: "level4",
        },
        {
          title: "五级(人)",
          key: "level5",
          dataIndex: "level5",
        },
      ],

      level1Users: [
        {
          label: '审核员500',
          value: 'auditor500'
        },
        {
          label: '审核员501',
          value: 'auditor501'
        },
        {
          label: '审核员502',
          value: 'auditor502'
        }
      ],
      level2Users: [
        {
          label: '审核员503',
          value: 'auditor503'
        },
        {
          label: '审核员504',
          value: 'auditor504'
        },
      ],
      level3Users: [
        {
          label: '审核员505',
          value: 'auditor505'
        },
        {
          label: '审核员506',
          value: 'auditor506'
        },
      ],
      level3Users: [
        {
          label: '审核员505',
          value: 'auditor505'
        },
        {
          label: '审核员506',
          value: 'auditor506'
        },
      ],
      level4Users: [],
      level5Users: [],

      authModelType: null
    };
  },
  mounted() {
    if (this.value) {
      this.tableData = JSON.parse(this.value)
    }
    //'AUTHMODEL_TYPE'
    console.log('searchForm', this.searchForm);
  },
  computed: {
    compUsers() {
      return (dataIndex)=> {
        // console.log('该返回的选择数据', this[dataIndex + 'Users']);
        return this[dataIndex + 'Users']
      }
    },
    compMoneyMode() {
      return this.config.moneyMode || '1'
    },
    compColumn() {
      console.log('this.config.moneyMode', this.config.moneyMode);
      if (this.config.moneyMode && this.config.moneyMode === '2') {
        return [
          {
            title: "一级(人)",
            key: "level1",
            dataIndex: "level1",
          },
          {
            title: "二级(人)",
            key: "level2",
            dataIndex: "level2",
          },
          {
            title: "三级(人)",
            key: "level3",
            dataIndex: "level3",
          },
          {
            title: "四级(人)",
            key: "level4",
            dataIndex: "level4",
          },
          {
            title: "五级(人)",
            key: "level5",
            dataIndex: "level5",
          },
        ]
      }else {
        return this.column
      }
    }
  },
  watch: {
    dataValue: {
      handler(n) {
        if (this.$parent.config) {
          this.$parent.config.value = n;
        } else {
          this.$emit("update:value", n);
        }
      },
    },
    value: {
      handler(n) {
        this.dataValue = n;
      },
    },
    tableData: {
      handler(n) {
        const ctx = this
        let formatArr = n.map(i=> {
          return {
            ...i,
            amountRange: i.amountRange.map(e=>e)
          }
        })
        formatArr.forEach(e => {
          if(e.amountRange[0] != 0) e.amountRange[0] = ctx.strToNum(e.amountRange[0])
          if(e.amountRange[1] != 0) e.amountRange[1] = ctx.strToNum(e.amountRange[1])
        });
        console.log('转化后的', formatArr);
        ctx.dataValue = JSON.stringify(formatArr)
      },
      deep: true,
      immediate: true
    },
    searchForm: {
      handler(n) {
        if (JSON.stringify(n) !== '{}') {
          this.authModelType = n.AUTHMODEL_TYPE
        }
        console.log(this.authModelType);
      },
      deep: true,
      immediate: true
    },
  },
  methods: {
    usersChange(e, dataIndex,row) {
      const ctx = this;
      row[dataIndex] = e.length

    },
    handleAdd(index, row) {
      const ctx = this;
      console.log(this.config);
      const lastRow = ctx.tableData[index];
      ctx.strToNum(lastRow.amountRange[1])
      
      
      if (lastRow.amountRange[1] == 0 && ctx.config.moneyMode === '1') {
        ctx.$message.error("请填写结束金额");
        return;
      }

      if (
        lastRow.level1 === 0 &&
        lastRow.level2 === 0 &&
        lastRow.level3 === 0 &&
        lastRow.level4 === 0 &&
        lastRow.level5 === 0
      ) {
        ctx.$message.error("每个授权区间必须至少有一个授权人");
        return;
      }

      if (ctx.strToNum(lastRow.amountRange[1]) < ctx.strToNum(lastRow.amountRange[0]) && ctx.config.moneyMode === '1') {
        ctx.$message.error("区间起始金额应小于结束金额");
        return;
      }

      ctx.tableData.push({
        amountRange: [ ctx.config.moneyMode === '1' ? lastRow.amountRange[1]: '0', '0'],
        level1: 0,
        level2: 0,
        level3: 0,
        level4: 0,
        level5: 0,
        level1Users: [],
        level2Users: [],
        level3Users: [],
        level4Users: [],
        level5Users: []
      });
    },
    handleDelete(index, row) {
      const ctx = this;

      ctx.openCustomDialog({
        title: "提示",
        path: "deleteConfirm",
        width: "300px",
        component: {
          template: `<div>确定要删除此金额区间么？</div>`,
        },
        confirmCallback() {
          if (index !== ctx.tableData.length - 1) {
            ctx.$message.error("请从最后一行开始删除");
            return;
          } else {
            ctx.tableData.splice(index, 1);
            ctx.$message({
              type: "success",
              message: "删除成功!",
            });
          }
        },
      });
    },
    onChange(value, row, index) {
      const ctx = this;
      if (value.indexOf(",") > -1) {
        value = value.replace(/,/g, "");
      }
      if (isNaN(value)) {
        value = value.replace(/[^\d.]/g, "");
      }
      if (!value) {
        row.amountRange[index] = null;
        return;
      }

      value = Number(value).toFixed(2);
      ctx.$set(
        row.amountRange,
        index,
        value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );
    },
    strToNum(str) {
      const ctx = this;
      let num = null
      if (str.indexOf(",") > -1) {
        num = str.replace(/,/g, "");
      } else {
        num = Number(str)
      }
      // console.log(num, Number(num));
      return num
    }
  },
};
</script>

<style>
</style>