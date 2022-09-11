<template>
  <div class="content overflow-hidden relative p-5">
    <!-- <div class="content-head h-5" v-if="showContent">
      
    </div> -->
    <div class="w-full overflow-auto content-inner mt-5" v-if="showContent">
      <div class="content-list relative px-4">
        <list-item
          :form="form"
          :disabled="isPlatform"
          ref="listItem"
          @save="save"
        ></list-item>
      </div>
    </div>
    <div v-if="!showContent" class="empty-box flex h-full">
      <img data-v-3904da1b="" width="100%" src="img/empty.svg" alt="" />
    </div>
  </div>
</template>

<script>
import listItem from "./listItem.vue";

let { domainAdd, domainDel, domainUpdate } = window.getBffApi();

export default {
  components: {
    listItem,
  },
  data() {
    return {
      saveDisabled: false,
      structure: [],
      form: {
        name: "",
        desc: "",
        domain: "",
        port: "",
        https: true,
        interfaces: [
          {
            id: "1",
            if: "",
            name: "",
          },
        ],
      },
      projectId: "",
      count: 1,
      JsonString: "",
      contentList: [],
      spinning: false,
      currentDataSource: "",
      showContent: false,
    };
  },
  mounted() {
    let self = this;
    window.msgHub.$off("ds_showEmpty").$on("ds_showEmpty", (val) => {
      self.showContent = !val;
    });
    window.msgHub
      .$off("ds_currentDataSource")
      .$on("ds_currentDataSource", (val) => {
        console.log(val);
        self.setCurrentDataSource(val);
      });
  },
  computed: {
    isPlatform() {
      return this.form.id ? true : false;
    },
  },
  methods: {
    setCurrentDataSource(dataSource) {
      this.currentDataSource = dataSource;
      this.form.desc = dataSource.desc;
      this.form.name = dataSource.name;
      this.form.https = dataSource.https;
      this.form.interfaces = dataSource.interfaces;
      // this.form.id = dataSource.id || '';
      this.$set(this.form, 'id', dataSource.id);

      if (dataSource.domain.indexOf(":") > 1) {
        this.form.domain = dataSource.domain.substring(
          0,
          dataSource.domain.indexOf(":")
        );
        this.form.port = dataSource.domain.substring(
          dataSource.domain.indexOf(":") + 1
        );
      } else {
        this.form.domain = dataSource.domain;
        this.form.port = "";
      }
    },
    delchildren(index) {
      this.structure.splice(index, 1);
    },
    addList() {
      let newItem = {
        name: `newKey${this.count}`,
        type: "string",
      };
      this.count++;

      this.structure.push(newItem);
    },
    async saveHandler() {
      this.saveDisabled = true;
      let data = {
        desc: this.form.desc,
        name: this.form.name,
        https: this.form.https,
        domain: this.form.domain + (this.form.port ? ':' : '') + this.form.port,
        interfaces: this.form.interfaces,
        id: this.currentDataSource.id,
      };
      let api = domainUpdate;

      if (!this.currentDataSource.id) {
        api = domainAdd;
      }
      let res = await api(data);
      if (res.id) {
        this.$notify({
          title: "保存成功",
          message: "保存成功",
          type: "success",
        });
        window.msgHub.$emit("ds_refresh");
      } else {
        this.$notify({
          title: "保存失败",
          message: "保存失败",
          type: "error",
        });
        console.log(res);
      }
      this.saveDisabled = false;
    },
    save() {
      // if (this.saveDisabled) {
      //   return;
      // }

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
      i {
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