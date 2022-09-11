  <template>
    <div class="d-custom">

      <div v-show="mode === 'normal'" id="code-editor" style="width:100%;height:90%;border:1px solid #ccc">

      </div>

      <d-table v-show="mode === 'log'" v-if="scriptResult && scriptResult.success" :table="scriptResult.table" id="preTable">
      
      </d-table>

      <section style="width:100%" class="flex flex-center h-full" v-if="!scriptResult && mode === 'log'">
              <div  v-loading="!scriptResult" class="loading">

              </div>
      </section>

      <section  v-show="mode === 'log'" v-if="scriptResult && !scriptResult.success"  id="error-log">
        <span class="error-title">错误日志：</span> 
          <p class="error">
          {{scriptResult.log}}
        </p>
      </section>

    </div>
  </template>

  <script>
  import * as monaco from 'monaco-editor'
  import dTable from '../dTable.vue'

  export default {
    components: { dTable },
    data(){
      return {
        editor:{},
      }
    },
    props:['selectNode','getPreview','mode','scriptResult'],
    watch:{
      'selectNode'(){
        this.editor.setValue(this.selectNode?.bindSet?.script || "function analyze(data){\n    \n}")
      }
    },
    mounted(){
      this.editor = monaco.editor.create(
        this.$el.querySelector('#code-editor'),
        {
          value: this.selectNode?.bindSet?.script || "function analyze(data){\n    \n}",
          language: 'javascript',
          theme: 'vs',
          automaticLayout: true
        }
      );
      this.editor.onDidChangeModelContent(()=>{
        this.setBindSet()
      })
    },
    methods:{
      setBindSet(){
        this.selectNode.setBindSet({
          script :this.editor.getValue()
        })
      },
      run(){
        console.log(this.editor.getValue());
        this.selectNode.setBindSet({
          script :this.editor.getValue()
        })
        this.getPreview()
      }
    }
  }
  </script>

  <style lang="scss" scoped>
    .loading{
      height: 100px;
      width: 100px;
    }
  .d-custom{
    width: 100%;
    height: 100%;
    display: flex;
  }
  #error-log{
    padding: 10px;
  .error-title{
    margin-right: 10px;
  }
  .error{
    color:red;
  }
  }

  </style>