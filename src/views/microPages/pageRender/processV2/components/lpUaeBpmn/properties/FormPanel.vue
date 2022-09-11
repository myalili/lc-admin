<template>
  <el-collapse-item name="FormPanel">
    <div slot="title" class="panel-tab__title"><i class="header-icon el-icon-s-order"></i> 表单配置</div>
    <!-- <el-form size="mini" label-suffix="：" label-width="80px" v-if='formType!=="3"'>
      <el-form-item label="类型">
        <el-select v-model="formType" clearable :disabled="readonly">
          <el-option label="动态表单" value="0" />
          <el-option label="全局表单" value="1" />
        </el-select>
      </el-form-item>
    </el-form>
    <el-form label-suffix="：" v-if="formType === '1'" label-width="80px">
      <el-form-item label="表单key">
        <el-input v-model="node.formKey" clearable readonly placeholder="请选择">
          <el-button slot="append" @click="handleToGlobalFormChoose()" :disabled="readonly">选择</el-button>
        </el-input>
      </el-form-item>
    </el-form>
    <div v-show="formType === '0'">
      <el-divider><i class="el-icon-coin"></i> 动态表单属性</el-divider>
      <el-table :data="node.formProperties" size="mini" max-height="240" fit>
        <el-table-column label="字段名称" prop="name" min-width="80px" show-overflow-tooltip />
        <el-table-column label="字段类型" prop="type" min-width="80px" show-overflow-tooltip />
        <el-table-column label="默认值" prop="default" min-width="80px" show-overflow-tooltip />
        <el-table-column label="操作" width="90px">
          <template slot-scope="{ row, $index }">
            <el-button size="mini" type="text" @click="editFormField(row)" :disabled="readonly">编辑</el-button>
            <el-button
              size="mini"
              type="text"
              style="color: #ff4d4f"
              :disabled="readonly"
              @click="node.formProperties.splice($index, 1)"
              >移除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="opr_bottom_button">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="toAddFormField" :disabled="readonly"
          >添加字段</el-button
        >
      </div>
    </div> -->
     <el-form size="mini" label-suffix="：" label-width="80px">
     <el-form-item
        label="微页面id"
      >
        <page-select :value='{prototypeId:id}' :disabled="readonly"  @select="choosePage" v-if='isShow' :store ='$store'/>
      </el-form-item>
    </el-form>
  </el-collapse-item>
</template>

<script>
// const {getPageDetails} = window.getBffApi()
// import ExecutionListener  from  '@uae/uae-bpmn-editor/definitions/d.js';
// import FormProperty from '@uae/uae-bpmn-editor/definitions/processElements/common/formProperty.js';
export default {
  name: 'FormPanel',
  store:window.store,
  props: {
    node: {
      require: true,
      type: Object
    },
    readonly: {
      type: Boolean,
      default: false
    },
    
    // type: {
    //   type: String,
    //   default: 'form' // form \ micro
    // },
  },
  data() {
    return {
      isShow:true,
      id:'',
      // title:''
      // formData: {
      //   microPageUrl: '',
      //   formKey: '',
      //   fields: []
      // },
      // formType: '3',
      // formTypeArr: [
      //   {
      //     id: '1',
      //     type: '全局表单'
      //   },
      //   {
      //     id: '2',
      //     type: '微页面'
      //   }
      // ]
    };
  },

  // computed: {
  //   list() {
  //     if(this.formType === '1') {
  //       return this.node.formProperties
  //     } else {
  //       return []
  //     }
  //   }
  // },
  
  mounted(){
    this.id = this.node.pageUrl
    console.log(this.id)
    // this.id && this.getMenusTitle()
  },

  watch:{
    node(val){
      this.id = val.pageUrl;
      // this.title = '';
      // if(this.id){
      //   this.getMenusTitle()
      // }
      
    },
  },
  methods: {
    // async getMenusTitle(){
    //   let ctx = this;
    //    await getPageDetails({
    //      id:ctx.id
    //    })
    //       .then((res) => {
    //         if (res.success && res.obj) {
    //           let {name} = res.obj;
    //           console.log(name)
    //           ctx.title = name;
             
    //         }

           
    //       })
    //       .catch((e) => {
    //         console.log(e)
    //       });
    // },
    choosePage(e){
      this.node.pageUrl = e.prototypeId;
      console.log(this.node.pageUrl)
    },
    // handleToGlobalFormChoose() {
    //   this.open({
    //     status: true,
    //     title: '选择全局表单',
    //     path: '/GlobalFormChoose',
    //     page: 'chore/longProcess/GlobalFormChoose',
    //     class: 'aops-el-common',
    //     width: '800px',
    //     type: 'SUB',
    //     hideFooter: true,
    //     confirm: form => {
    //       this.node.formKey = form?.id;
    //     }
    //   });
    // },
    // handleToApiChoose() {
    //   this.open({
    //     status: true,
    //     title: '选择微页面',
    //     path: '/MicroPageFormChoose',
    //     page: 'chore/longProcess/MicroPageFormChoose',
    //     class: 'aops-el-common',
    //     width: '700px',
    //     type: 'SUB',
    //     hideFooter: true,
    //     confirm: api => {
    //       this.formData.microPageUrl = api.url;
    //     }
    //   });
    // },
    // toAddFormField() {
    //   this.open({
    //     title: '添加表单字段',
    //     path: '/FormFieldAdd',
    //     page: 'chore/longProcess/FormFieldAdd',
    //     type: 'SUB',
    //     class: 'aops-el-common',
    //     width: '600px',
    //     hideFooter: true,
    //     success: data => {
    //       this.node.formProperties.push(new FormProperty(data));
    //     }
    //   });
    // },
    // editFormField(field) {
    //   this.open({
    //     title: '编辑表单字段',
    //     path: '/FormFieldAdd',
    //     page: 'chore/longProcess/FormFieldAdd',
    //     type: 'SUB',
    //     class: 'aops-el-common',
    //     width: '600px',
    //     hideFooter: true,
    //     params: {
    //       field
    //     },
    //     success: data => {
    //       Object.assign(field, data);
    //     }
    //   });
    // }
  }
};
</script>
<style lang="scss"></style>
