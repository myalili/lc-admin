<template>
  <div class="menu-management release-page-select-ctn codeless-border-radius">
    <div class="release-page-select-ctn-header">
      <el-input
        v-model="filterText"
        prefix-icon="el-icon-search"
        clearable
        placeholder="搜索关键字"
        size="mini"
        class="codeless-input-radius"
      ></el-input>
    </div>

    <div
      class="release-page-select-ctn-body"
      v-if="!loading && !options.length"
    >
      <el-empty description="暂无上架页面"></el-empty>
    </div>
    <div
      class="release-page-select-ctn-body flex codeless-custom-dialog"
      v-loading="loading"
      v-else
    >
      <div class="flex-1 item">
        <el-checkbox
          v-for="option in filterOptions"
          :key="option.id"
          v-model="option.checked"
          class="check-item codeless-hover"
          @change="changeHandler($event, option)"
          :disabled="exclusiveChoice && option.children"
        >
          <span @click="clickHandler(option, 'lv1')" class="inline-block label cursor-pointer">
            <codeless-icon
              :icon="option.icon"
              class="inline-block option-icon"
            ></codeless-icon>
            <span
              class="inline-block codeless-font-color-primary font-normal"
              >{{ option.name }}</span
            >
            <i v-if="option.children" class="el-icon-arrow-right"></i>
          </span>
        </el-checkbox>
      </div>
      <div class="flex-1 item">
        <el-checkbox
          v-for="option in optionsLv2"
          :key="option.id"
          v-model="option.checked"
          class="check-item codeless-hover"
          @change="changeHandler($event, option)"
          :disabled="exclusiveChoice && option.children"
        >
          <span @click="clickHandler(option, 'lv2')" class="inline-block label cursor-pointer">
            <codeless-icon
              :icon="option.icon"
              class="inline-block option-icon"
            ></codeless-icon>
            <span
              class="inline-block codeless-font-color-primary font-normal"
              >{{ option.name }}</span
            >
            <i v-if="option.children" class="el-icon-arrow-right"></i>
          </span>
        </el-checkbox>
      </div>
      <div class="flex-1 item">
        <el-checkbox
          v-for="option in optionsLv3"
          :key="option.id"
          v-model="option.checked"
          class="check-item codeless-hover"
          @change="changeHandler($event, option)"
        >
          <span @click="clickHandler(option, 'lv3')">
            <codeless-icon
              :icon="option.icon"
              class="inline-block option-icon"
            ></codeless-icon>
            <span class="codeless-font-color-primary font-normal">{{
              option.name
            }}</span>
          </span>
        </el-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:'codelessReleasePageSelectPanel',
  computed: {
    getStore(){
      if(this.store){
        return this.store
      }else{
        return this.$store
      }
    },
    tenantId() {
      return this.getStore.getters["user/tenantId"];
    }
  },
  watch: {
    filterText(val){
        let ret = JSON.parse(JSON.stringify(this.options));
        if(val && val.trim().length){
           
            this.filterOptions = this.getFilterOption(ret)
        }else{
            this.filterOptions = ret
        }
        this.unfold()
    }
  },
  props: {
    store:{
      type:Object,
      default(){
        return null
      }
    },
    exclusiveChoice: {
      type: Boolean,
      default: false,
    },
    selectedItem:{
      type: String,
      default: "",
    }
  },
  data() {
    return {
      filterOptions:[],
      flag: false,
      filterText: "",
      options: [],
      optionsLv2: [],
      optionsLv3: [],
      optionMap: {},
      currentCheck: {},
      selectedPages: [],
      loading: false,
    };
  },
  async mounted() {
    await this.getRleasePages();
    this.filterOptions = this.options;
    this.setChecked(this.selectedItem);
    if(!this.selectedItem){
        this.unfold();
    }
  },
  methods: {
    unfold(){
      this.optionsLv2 = this.filterOptions[0]?.children || [];
      this.optionsLv3 = this.optionsLv2[0]?.children || [];
    },
    getFilterOption(items) {
      let ret = [];
      let ctx = this;
      ret = items.filter((i) => {
        if (i.name.includes(ctx.filterText)) {
          return true;
        } else {
          if (i.children && i.children.length) {
            i.children = ctx.getFilterOption(i.children);
            if (i.children.length) {
              return true;
            }
          }
        }
      });
      return ret;
    },
    getPath() {
      let ctx = this;
      let checkList = [];
      Object.values(JSON.parse(JSON.stringify(ctx.optionMap))).forEach(
        (val) => {
          if (val.checked) {
            checkList.push(val);
          }
        }
      );

      return checkList;
    },
    changeHandler(e, opt) {
      if (opt.flag === undefined) {
        opt.checked = e;
      } else if (opt.flag === true) {
        opt.checked = !e;
        opt.flag = false;
      } else {
        opt.checked = !e;
        delete opt.flag;
      }
      this.optionMap[opt.id].checked = opt.checked;
      if (opt.checked) {
        this.$emit("select",opt.prototypeId,this.optionMap[opt.id]);
      }

      if (this.exclusiveChoice) {
        if (this.currentCheck.id !== opt.id) {
          if (this.currentCheck.checked) {
            // this.currentCheck.checked = false;
            this.optionMap[this.currentCheck.id].checked =
              this.currentCheck.checked = false;
            console.log(this.currentCheck);
          }
          this.currentCheck = opt;
        }
        // console.log(this.currentCheck)
      }
      if (!this.getPath().length) {
        this.$emit("select", "");
      }
      this.$forceUpdate();
    },
    clickHandler(item, level) {
      //点击label时不做勾选
      if (item.children) {
        if (item.flag === false) {
          delete item.flag;
        } else {
          item.flag = true;
        }
      }

      switch (level) {
        case "lv1":
          this.optionsLv2 = item.children || [];
          this.optionsLv3 = this.optionsLv2[0]?.children || [];
          break;

        case "lv2":
          this.optionsLv3 = item.children || [];
          break;
      }
      //   console.log(item,level)
    },
    setChecked(prototypeId) {
      let i = -1,
        ctx = this,
        item;
       

      let options = [].concat(this.options);
      while ((item = options[++i])) {
        //直接定位到被选择页面的位置
        if(prototypeId && (item.prototypeId === prototypeId)){
            let parents = [];
            item.checked = true;
            this.currentCheck = item;
            if(ctx.optionMap[item.parentId]){
                let p = ctx.optionMap[item.parentId];
                parents.push(p);
                if(ctx.optionMap[p.parentId]){
                    parents.push(ctx.optionMap[p.parentId])
                }
            }
            console.log(parents);
            switch(parents.length){ 
                case 0:
                    this.unfold();
                    break;
                case 1:
                    this.optionsLv2 = parents[0].children;
                    this.optionsLv3 = this.optionsLv2[0].children || []; 
                    break;

                case 2:
                    this.optionsLv2 = parents[1].children;
                    this.optionsLv3 = parents[0].children;
                    break
            }
        }else{
             item.checked = false;
        }
       
        ctx.optionMap[item.id] = item;
        let ms = item.children || [];
        if (ms.length) {
          options = [...options, ...ms];
        }
      }
    },
    async getRleasePages() {
      this.loading = true;
      let params = {
        tenantId: this.tenantId,
        parentId: "root",
      };
      this.options = await this.getStore.dispatch(
        "page/getReleasePageList",
        params
      );
      this.loading = false;
      console.log(this.options);
    },
  },
};
</script>

<style lang="less" scoped>
.menu-management {
  &.release-page-select-ctn {
    width: 600px;

    .release-page-select-ctn-header {
      text-align: right;
      padding-right: 12px;
      height: 38px;
      border-bottom: 1px solid var(--color-light-gray);
      ::v-deep .el-input {
        width: 200px;
        height: 22px;
        line-height: 22px;
        .el-input__inner {
          height: 22px;
          // line-height:22px;
        }
        .el-input__icon {
          line-height: 22px;
          color: var(--color-gray);
        }
      }
    }
    .release-page-select-ctn-body {
      .item {
        padding: 3px 0;
        overflow-y: overlay;
        height: 250px;
        border-right: 1px solid var(--color-light-gray);
        &:last-child {
          border: none;
        }
        ::v-deep .el-checkbox {
          margin-right: 0;
          .label {
            width: 151px;
            > span {
              width: 124px;
            }
          }
          // .el-checkbox__label{
          //     width:;

          // }
        }

        .check-item {
          height: 30px;
          padding: 0 12px;
          width: 100%;
          line-height: 30px;

          .option-icon {
            width: 12px;
            height: 12px;
            margin-right: 6px;
          }
        }
      }
    }
  }
}
</style>