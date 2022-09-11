<template>
  <div class="dpro">
      <div class="header">
        <select-field v-model="tableOptions">
            <el-button size="small">显示原始字段</el-button>
        </select-field>
        <span class="text-primry add-computed" @click="showDialog">+ 添加计算字段</span>
      </div>

      <div class="body">
        <el-table 
        :data="tableData"
        height="386"
        border
        style="width: 100%"
        v-if="showTable"
        >

        <el-table-column
          v-for="(item, i) in showTableCol"
          :key="i"
          :prop="item.value"
          width="180">
          <template slot="header" slot-scope="scope">
            <div  :class="item.isShowMsg? 'header-cell': ''">
              <div class="flex-between " v-if="item.isShowMsg">
                <el-tooltip class="item" effect="dark" :content="'原名：'+ originLabel[i]" placement="top">
                  <div>
                    <i class="el-icon-tickets"></i>
                    <span class="ml-5">{{ item.label }}</span>
                  </div>
                </el-tooltip>

                <div class="icon-item">
                  <i class="el-icon-edit pointer" @click="changeLabel(scope.$index, false, item)"></i>
                  <i class="el-icon-view pointer ml-5" @click="hidden(scope.$index)"></i>
                </div>
              </div>

              <el-input v-model="changeText" ref="inputlabel" @blur="changeLabel(scope.$index, true, item)" v-else></el-input>
            </div>
          </template>
        </el-table-column>

        </el-table>
      </div>


      <add-computed-dialog v-model="isShowDialog" size="small" :tableOptions="tableOptions"></add-computed-dialog>
  </div>
</template>

<script>
import addComputedDialog from './dialog/dpro/addComputed.vue'
import selectField from './components/common/selectField.vue'

export default {
  props:["selectNode"],
  data(){
    return {
      tableData: [],
      searchString: "",
      tableOptions: [],
      showTable: true,
      isShowDialog: false,
      originLabel: [],
      changeText: ""
    }
  },
  methods:{
    changeLabel(index, state, item){
      let option = this.tableOptions.find(data => data.value === this.showTableCol[index].value);
      option.isShowMsg = state;
      if(state){
        this.changeText && (option.label = this.changeText);
        this.changeText = "";
      }else{
        this.changeText = item.label;
        this.$nextTick(() => {
          // 输入框聚焦
          setTimeout(() => {
            let input = this.$refs.inputlabel[0];
            input.focus();
          }, 100)
        })
      }
    },
    showDialog(){
      this.isShowDialog = true
    },
    hidden(index){
      let option = this.tableOptions.find(data => data.value === this.showTableCol[index].value);
      option.isCheck = false
    }
  },
  computed:{
    filterOption(){
      let arr = [];
      arr = this.tableOptions.filter(data => !this.searchString || data.label.toString().toLowerCase().includes(this.searchString.toString().toLowerCase()))
      return arr;
    },
    showTableCol(){
      let arr = [];
      arr = this.tableOptions.filter(data => {
        return data.isCheck === true
      });
      return arr
    }
  },
  watch:{
    tableOptions:{
      deep: true,
      handler(val){
        this.showTable = false;
        val.forEach(item => {
          if(item.isCheck){
            this.originLabel.push(item.label)
          }
        })

        this.$nextTick(() => {
          this.showTable = true;
        })
      }
    },
    "selectNode.tables":{
      deep: true,
      immediate: true,
      handler(val){
        if(val[0]){
          JSON.parse(JSON.stringify(val[0].data))
          this.tableData = JSON.parse(JSON.stringify(val[0].data));
          let tableOptions = JSON.parse(JSON.stringify(val[0].schema));
          tableOptions.forEach(item => {
            item.isCheck = true
            item.isShowMsg = true
          })
          this.tableOptions = tableOptions;
        }
      }

    }
  },
  mounted(){
  },
  components:{
    addComputedDialog,
    selectField
  }
}
</script>

<style lang="scss" scoped>
.select-list{
  display: flex;
  flex-flow: column nowrap;
  .el-checkbox{
    margin: 5px;
  }
}
.search-input{
  ::v-deep.el-input__inner{
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #ccc;
  }
}

.dpro{
  height: 100%;
  width: 100%;

  .header{
    padding: 5px 10px;
    display: flex;
    align-items: center;
    .el-button{
      border-radius: 20px;
      margin-right: 20px;
    }

  }

  .add-computed{
    cursor: pointer;
  }

  .body{
    width: 100%;
    height: 100%;
    .el-table{
      width: 100%;
      height: 100%;

      .header-cell{
        padding: 12px 0px;
        .icon-item{
          display: none;

          i:hover{
            color: var(--color-primary);
          }
        }

        &:hover{
          .icon-item{
            display: block;
          }
        }
      }



      & ::v-deep th{
        padding: 0px !important;
      }
    }
  }
}
</style>