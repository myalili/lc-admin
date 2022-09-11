<template>
  <el-dialog title="新增计算字段" :visible.sync="isShowDialog" :close-on-click-modal="false" @close="close" :close-on-press-escape="false">
    <div class="body">
      <div class="top-input">
        <div class="string-input">

          <el-input v-model="stringName" placeholder="请输入计算字段名称"></el-input>
          <el-select v-model="stringType">
            <el-option
              v-for="item in stringTypeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>

        <div class="expression">
          <div class="title">
            表达式=
          </div>

          <el-input v-model="expression" type="textarea" :rows="5"></el-input>
        </div>
      </div>

      <div class="bottom-select">
        <div class="variable">
          <el-input placeholder="搜索变量" prefix-icon="el-icon-search" v-model="searchVariable" />
          <div class="content">
            <div v-for="item in filterTableOptions" :key="item.name" @click="clickVariable(item)">
              <span>{{item.label}}</span>
              <span :class="'type-'+item.type" >{{item.type | getTextType}}</span>
            </div>
          </div>
        </div>

        <div class="function">
          <el-input placeholder="搜索函数" prefix-icon="el-icon-search" v-model="searchFunction" />
          <el-tree :data="funConf" :props="treeProps" @node-click="handleNodeClick" ref="funcTree" :filter-node-method="filterNode"></el-tree>
        </div>

        <div class="func-desp">
          <div class="title">
            {{selectFunction.label || ''}}
          </div>
          <div class="content" v-if="selectFunction.label">
            <div>{{selectFunction.desp}}</div>
            <div>用法：{{selectFunction.usage}}</div>
            <div>示例：{{selectFunction.examples}}</div>
            <a href="https://www.baidu.com/" target="_blank">了解详情</a>
          </div>
        </div>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="close">确 定</el-button>
  </div>
  </el-dialog>
</template>

<script>
// import funConf from '@/assets/conf/function.js'

export default {
  model:{
    prop: 'isShowDialog',
    event: 'change'
  },
  props: ['isShowDialog', 'tableOptions'],
  data(){
    return {
      stringTypeOption:[
        {value: "number", label: "数字类型"},
        {value: "text", label: "文本类型"}
      ],
      stringType: "number",
      stringName: "",
      expression: "",
      searchVariable: "",
      treeProps:{
        children: 'children',
        label: 'label'
      },
      funConf: funConf,
      searchFunction: "",
      selectFunction:{

      }
    }
  },
  computed:{
    filterTableOptions(){
      let arr = [];
      arr = this.tableOptions.filter(data => !this.searchVariable || data.label.toString().toLowerCase().includes(this.searchVariable.toString().toLowerCase()))
      return arr;
    },
  },
  methods:{
    clickVariable(item){
      console.log(item)
      this.expression += item.label;
    },
    close(){
      this.$emit("change", false)
    },
    handleNodeClick(data, node, doc){
      if(node.isLeaf){
        this.expression += data.label + '()';
        this.selectFunction = data
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.toString().toLowerCase().indexOf(value.toString().toLowerCase()) !== -1;
    }
  },
  filters: {
    getTextType: function (value) {
      console.log(value, "value")
      let label = ""
      // value === "text"?label = '文本': value === "number"? label = '数字':
      switch (value){
        case 'string': 
          label = '文本' 
          break;
        case 'number': 
          label = '数字' 
          break;
        case 'time': 
          label = '时间戳' 
          break;
      }
      return label
    }
  },
  mounted(){
    console.log(this.tableOptions)
  },
  watch: {
    isShowDialog(val){
      console.log(val, "isShowDialog")
    },
    searchFunction(val) {
      this.$refs.funcTree.filter(val);
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog{
  
  .body{
    padding: 20px 30px;

    .top-input{

      .string-input{
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;

        .el-input{
          width: 75%;
        }
      }

      .expression{
        display: flex;
        flex-flow: column nowrap;
        border: 1px solid #ccc;
        margin-top: 20px;

        .title{
          padding:10px 10px;
          background: #F3F8FB;
        }

        ::v-deep.el-textarea__inner{
          font-size: 16px;
          border: none;
        }
      }
    }

    .bottom-select{
      padding: 10 0px;
      display: flex;
      justify-content: space-between;
      margin-top: 10px;

      ::v-deep.el-input__inner{
        border: none;
        border-radius: 0px;
        border-bottom: 1px solid #dcdfe6;
      }

      & > div{
        height: 250px;
        border: 1px solid #ccc;
      }

      .variable{
        width: 300px;
        .content{
          display: flex;
          flex-flow: column nowrap;
          overflow: auto;
          div{
            padding: 5px;
            display: flex;
            justify-content: space-between;

            &:hover{
              background-color: #E6F6F4;
              cursor: pointer;
            }
          }

          .type-string{
            color: #1485F6;
            border-radius: 20px;
            padding: 2px 8px;
            background-color: rgba(20,133,246,.15);
          }

          .type-number{
            color: #F4B700;
            border-radius: 20px;
            padding: 2px 8px;
            background-color: rgba(244,183,0,.15);
          }

          .type-time{
            border-radius: 20px;
            color: #8E24F9;
            padding: 2px 8px;
            background-color: rgba(142,36,249,.15);
          }
        }
      }

      .function{
        width: 150px;
        overflow: auto;
      }

      .func-desp{
        width: 420px;
        .title{
          padding: 10px;
          border-bottom: 1px solid #dcdfe6;
          height: 18px;
        }

        .content{
          padding: 10px;
          overflow: auto;

          a{
            display: block;
            margin-top: 20px;
          }
        }
      }
    }
  }
}
</style>