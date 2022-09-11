<template>
  <div class="module-form">
    <div
      class="mb-4 module-form-item"
      v-for="itemi in formData && formData.module"
      :key="itemi.id"
    >
      <div class="v2-form-module-title">
        <span>{{ itemi.name }}</span>
      </div>
      <!-- <el-divider v-if="formData.module && formData.module.length > 0" /> -->

      <div
        :class="{ 'v2-form-col-2': formData.col, 'flex': formData.col > 1 }"
        :style="{ '--col': (1 / formData.col) * 100 + '%' }"
        class="computedForms  items-start flex-wrap"
      >
        <template v-for="item in itemi.children">
          <el-form-item
            :prop="item.engNameShort"
            :label="itemDetail(item).dictionaryItem && itemDetail(item).dictionaryItem.name"
            :key="item.id"
            :label-width="labelWidth(itemDetail(item))"
            v-if="itemDetail(item) && !itemDetail(item).isHide"
          >
            <div class="w-full relative" v-if="!showFormContent">
              <!-- 第一步：可编辑表单 -->
              <component
                v-if="!showFormContent"
                :style="'width: 100%'"
                :is="
                  itemDetail(item) && itemDetail(item).component
                    ? itemDetail(item).component.href
                    : 'v2-a-input'
                "
                :page="item.engNameShort"
                :label="itemDetail(item).dictionaryItem && itemDetail(item).dictionaryItem.name"
                :enumCode="itemDetail(item) && itemDetail(item).enumCode"
                :value.sync="searchForm[item.engNameShort]"
                :AParams="AParams"
                :config="itemDetail(item)"
                @change="componentValue($event, itemDetail(item))"
                @getRecord="getRecordValue($event, itemDetail(item))"
              />
              <!-- 链接 -->
              <span class="absolute top-0 left-48">
                <el-button
                  style="margin-left: 8px"
                  type="text"
                  v-if="
                    itemDetail(item) &&
                    itemDetail(item).component &&
                    itemDetail(item).component.linkText &&
                    !showFormContent
                  "
                  @click="
                    replace({ page: itemDetail(item).component.linkPage })
                  "
                  >{{
                    itemDetail(item) && itemDetail(item).component.linkText
                  }}</el-button
                >
              </span>
            </div>
            <!-- 第二步：表单数据回显 -->
            <span v-if="showFormContent">
              <component
                v-if="
                  itemDetail(item) && itemDetail(item).echoComponent
                "
                :is="itemDetail(item).echoComponent.href"
                :enumCode="itemDetail(item) && itemDetail(item).enumCode"
                :value.sync="searchForm[item.engNameShort]"
                :AParams="AParams"
                :config="itemDetail(item)"
              />
              <span v-else>{{ searchForm[item.engNameShort] }}</span>
            </span>
          </el-form-item>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    formData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    searchForm: {
      type: Object,
      default: () => {
        return {};
      },
    },
    AParams: {
      type: Object,
      default: () => {
        return {};
      },
    },
    showFormContent: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    itemDetail() {
      return (item) => {
        const find = this.formData.forms.find(
          (i) => i.dictionaryItem.id === item.id
        );
        return find;
      };
    },

    labelWidth() {
      return (item=> {
        const ctx = this;
        if(item) {
          return item.dictionaryItem && item.dictionaryItem.name ? ctx.formData.labelWidth + 'px' : '0'
        }else {
          return ctx.formData.labelWidth? ctx.formData.labelWidth + 'px': '100px'
        }
      })
    }
  },
  methods: {
    componentValue(e, item) {
      this.$parent.$parent.componentValue(e, item);
    },
    getRecordValue(e, item) {
      this.$parent.$parent.getRecordValue(e, item);
    },
  }
};
</script>

<style lang="scss" scoped>
.module-form {
  .module-form-item {
    .v2-form-module-title {
      height: 30px;
      line-height: 30px;
      font-size: 16px;
      color: #000;
      /* border-left: 3px solid var(--color-primary); */
      padding-left: 20px;
      // background: rgb(236, 239, 244);
      background: #f0f7ff;
      margin: 0 0 16px;
      border-radius: 6px;
      span {
        border-left: 3px solid var(--color-primary);
        padding-left: 4px;
      }
    }
    .computedForms {
      width: 94%;
      margin: 0 auto;
    }
    .v2-form-col-2 {
      width: 94%;
      margin: 0 auto;
    }
    .v2-form-col-2 .el-form-item {
      width: var(--col);
      // width: 50%;
      display: inline-block;
    }
  }
}
</style>