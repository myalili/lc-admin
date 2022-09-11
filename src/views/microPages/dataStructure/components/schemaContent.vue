<template>
  <div class="content overflow-hidden relative p-5">
    <div class="content-head h-5" v-if="showContent">
      <div
        style="
          border-radius: 50%;
        "
        class="
          content-head-add
          w-5
          h-5
          text-center
          leading-5
          text-white
          cursor-pointer
          float-left
          bg-primary
        "
        @click="addList"
        v-show="!isPlatform"
      >
        <!-- <i class="iconfont icon-jiahao inline-block"></i> -->
         <i class="el-icon-plus inline-block font-bold" title='新增子项'></i>
      </div>
      <div
        class="
          content-head-save
          bg-primary
          float-right
          text-center
          h-7
          leading-7
          rounded-full
          text-white
          w-16
          cursor-pointer
        "
        @click="save"
        v-show="!isPlatform"
      >
        保存
      </div>
    </div>
    <div class="w-full overflow-auto content-inner" v-if="showContent">
      <div class="content-list relative px-4">
        <list-item
          :form="form"
          :disabled="isPlatform"
          ref="listItem"
        ></list-item>

        <div>
          <!-- <div > -->
          <test-item
            v-for="(item, index) in structure"
            :key="index"
            :structure="item"
            :disabled="isPlatform"
            @delItem ="delchildren(index)"
          ></test-item>
          <!-- </div> -->
        </div>
      </div>
      <div>
        <div
          style="
            margin-top: 20px;
            padding-top: 12px;
            border-top: 1px solid #ececec;
          "
          class="flex justify-between items-center"
        >
          <span style="color: #333333; font-size: 14px" class="font-medium"
            >json解析</span
          >
          <el-button
            icon="el-icon-refresh"
            type="primary"
            round
            size="mini"
            @click="strTojson"
            >刷新</el-button
          >
        </div>
        <!-- <el-button @click="strTojson" style="width:100px; margin: 20px auto;cursor: pointer;">json解析</el-button> -->
        <json-viewer
          v-loading="spinning"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          theme="my-awesome-json-theme"
          :expand-depth="5"
          :value="JsonString"
          style="line-height: 18px; margin-top: 12px"
        >
        </json-viewer>
      </div>
    </div>
    <div v-if="!showContent" class="empty-box flex h-full">
      <img data-v-3904da1b="" width="100%" src="img/empty.svg" alt="" />
    </div>
  </div>
</template>

<script>
import listItem from "./listItem.vue";
import testItem from "./testItem.vue";
import JsonViewer from "vue-json-viewer";
import {schemaToStructure,structureToSchema} from "../js/utils.js"

let {
  getExampleJson,
  addSchema,
  updateSchema
} = window.getBffApi()

export default {
  components: {
    listItem,
    testItem,
    JsonViewer,
  },
  data() {
    return {
      saveDisabled: false,
      structure: [],
      form: {
        name: "",
        desc: "",
      },
      projectId:"",
      count:1,
      JsonString: "",
      contentList: [],
      spinning: false,
      currentSchema:'',
      showContent: false,
    };
  },
  mounted() {
    let self = this;
    window.msgHub.$off("ds_showEmpty").$on("ds_showEmpty", (val) => {
      self.showContent = !val;
    });
    window.msgHub.$off("ds_currentSchema").$on("ds_currentSchema", (val) => {
      console.log(val)
      self.setCurrentSchema(val);
    });
  },
  computed: {
    isPlatform() {
        return this.projectId === "public"?true:false 
    },
  },
  methods: {
    setCurrentSchema(schema) {
      console.log(this.projectId);
      this.currentSchema = schema;
      this.form.name = schema.name;
      this.form.desc = schema.desc;
      this.projectId = schema.tenantId;
      let structure = JSON.parse(schema.structure);
    //   console.log(structure);
      this.structure = schemaToStructure(JSON.parse(JSON.stringify(structure)));
    //   console.log(this.structure);
      this.strTojson();
      this.count = 1;
    },
    strTojson() {
      this.spinning = true;
      let json = JSON.stringify(structureToSchema(this.structure))
      
      //console.log(JSON.stringify(this.structure));
      getExampleJson({
        json
      }).then((res) => {
          this.JsonString = JSON.parse(res.obj);
          this.spinning = false;
        });
    },
    delchildren(index) {
        this.structure.splice(index,1);
    },
    addList() {
      let newItem = {
          name:`newKey${this.count}`,
          type:'string'
      }
      this.count++

    
      this.structure.push(newItem)
   
    //  console.log(this.structure)
    },
    saveHandler(){
      this.saveDisabled = true;
      let obj = JSON.stringify(structureToSchema(this.structure))
      let data = {
          desc: this.form.desc,
          name: this.form.name,
          operationType: this.currentSchema.operationType,
          id:  this.currentSchema.id,
          tenantId: this.currentSchema.tenantId,
          structure: obj,
      }
      let api = updateSchema;
      
      if (!this.currentSchema.id) {
        api = addSchema;
      }
    //   console.log(str, "str");
    //   console.log(this.listId);
      api(data)
        .then((res) => {
          if (res.success) {
            this.$notify({
              title: "保存成功",
              message: "保存成功",
              type: "success",
            });
            if(!this.currentSchema.id){
               window.msgHub.$emit("ds_refresh",this.form.name)
            }else{
               this.strTojson();
               window.msgHub.$emit("ds_refresh")
            }
            
          } else {
            this.$notify({
              title: "保存失败",
              message: "保存失败",
              type: "error",
            });
            console.log(res);
          }
          this.saveDisabled = false;
        })
        .catch((err) => {
          this.$notify.error({
            title: "失败",
            message: err.msg,
          });
           this.saveDisabled = false;
        });
    },
    save() {
      if (this.saveDisabled) {
        return;
      }

      let self = this;
      this.$refs.listItem.$refs.form.validate((valid) => {
        if (valid) {
          self.saveHandler();
        }
      });
    },
  },
};
</script>

<style lang='scss' scoped>
@import "../assets/styles/theme.scss";

.content {
  flex: 1;
  //   padding: 20px;

  &-head {
    top: 20px;
    right: 20px;
    height: 28px;
    z-index: 1;
    &-add {
      border-radius: 50%;
      margin-right: 10px;
      cursor: pointer;
      i{
        font-size: 12px;
      }
    }
    &-save {
      margin-left: auto;
      cursor: pointer;
    }
  }
  .content-inner {
    height: calc(100% - 30px);
  }
}
</style>