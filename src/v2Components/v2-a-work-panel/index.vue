<template>
  <div class="v2-a-work-panel">
    <div class="panel-head flex-between">
      <div style="font-weight: bold">{{ config.title }}</div>
      <div class="flex-center click-pointer" @click="openMorePage">
        更多<i style="font-size: 10px; margin-left: 2px"
          ><i class="el-icon-arrow-right" /><i class="el-icon-arrow-right"
        /></i>
      </div>
    </div>
    <div class="tabs-container">
      <el-tabs v-model="config.active">
        <el-tab-pane
          :name="tab.value"
          v-for="(tab, value) in config.tabs"
          :key="value"
        >
          <span slot="label">{{
            tab.label + "（" + tab.businessData.totalNum + "）"
          }}</span>
          <template v-if="tab.businessData.dataList.length">
            <div
              class="row-item flex-center"
              v-for="(data, dIdx) of tab.businessData.dataList"
              :key="dIdx"
            >
              <template v-for="field of tab._column">
                <div class="col-item" :key="field.id">
                  <component
                    :is="field.component.href"
                    :params="{ row: data, column: field }"
                    v-if="field.component && field.component.href"
                  />
                  <span v-else>{{
                    enumCodesFilter(
                      data[field.dictionaryItem.engNameShort],
                      field.code
                    )
                  }}</span>
                </div>
              </template>
            </div>
          </template>
          <el-empty description="暂无数据" v-else />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import pck from "./package.json";

export default {
  mixins: [window.codelessMixins.customDialog],
  _options: pck.docs,
  name: "v2AWorkPanel",

  props: {
    config: {},
  },

  data() {
    return {
      enumCodesObj: {},
    };
  },

  computed: {
    enumCodesFilter() {
      return (value, code) => {
        if (!code || !value) return value;
        if (!this.enumCodesObj[code]) return value;
        return this.enumCodesObj[code].filter((i) => i.value === value)[0].name;
      };
    },
  },

  mounted() {
    this.getData();
  },

  methods: {
    getData() {
      this.config.tabs.forEach(async (tab) => {
        try {
          this.$set(
            tab,
            "_column",
            tab.fields
              .filter((i) => i.dictionaryItem)
              .map((i) => {
                const key = i.key || i.dictionaryItem.engNameShort;
                i.key = key === "title" ? "dataTitle" : key;
                i.scopedSlots = {
                  customRender: key === "title" ? "dataTitle" : key,
                };
                i.code && this.searchEnums(i.code);
                return {
                  ...i,
                  dataIndex: key,
                  align: "center",
                  scopedSlots: { customRender: key },
                  title: i.dictionaryItem.name || i.dictionaryItem.desc,
                };
              })
          );

          const res = await pipe.entity.getEntityData(
            tab.entity,
            "ALCAP_PAGEING",
            {
              entityId: tab.entity,
              orders: [],
              pageNum: 1,
              pageSize: 5,
              query: {},
              ranges: [],
              retrieveId: "paging",
            }
          );
          if (res.response) {
            tab.businessData.dataList = res.response.content;
            tab.businessData.totalNum = res.response.totalElements;
          }

          // ...
        } catch (error) {
          console.error(error);
        }
      });
    },

    async searchEnums(enumCode) {
      const { codeList } = window.getBffApi();
      try {
        const res = await codeList({ code: enumCode, pageNum: 1, pageSize: 100000 })
        if (res) {
          this.enumCodesObj[enumCode] = res.pageData;
        }
      } catch (error) {
        console.error(error);
      }
    },

    openMorePage() {
      if (!this.config.morePage) return;
      const item = this.config.morePage;
      let params = {
        title: '',
        pageId: item.prototypeId,
        prototypeId: item.prototypeId,
        runtime: true,
        syncParamsObj
      };

      let option = {
        title: item.title || '',
        path: 'openSinglePage/render',
        params
      }

      ctx.v2ComponentOpen(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.flex-center {
  display: flex;
  align-items: center;
}
.flex-between {
  display: flex;
  justify-content: space-between;
}
.flex-around {
  display: flex;
  justify-content: space-around;
}

.panel-head {
  padding: 8px 0;
}

.tabs-container {
  border-top: 1px solid #e0e0e0;

  ::v-deep .el-tabs {
    .el-tabs__header {
      margin-bottom: 0;

      .el-tabs__nav-wrap {
        &::after {
          display: none;
        }

        .el-tabs__active-bar {
          display: none;
        }
      }
    }

    .el-empty {
      padding: 16px 0;

      .el-empty__image {
        width: 120px;
      }
    }
  }
}

.row-item {
  height: 32px;
}

.col-item {
  &:first-child {
    width: 50%;
    min-width: 450px;
  }

  &:not(:first-child) {
    margin-left: 16px;
  }
}

.click-pointer {
  cursor: pointer;
}

.v2-a-work-panel {
  width: 100%;
  padding: 8px;
  background: white;
  border-radius: 4px;
}
</style>
