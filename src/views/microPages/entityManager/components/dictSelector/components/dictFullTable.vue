<template>
  <base-table :columns="columns" v-bind="$attrs" v-on="$listeners">
    <template slot="after-selection">
      <slot />
    </template>
  </base-table>
</template>

<script>
import baseTable from './baseTable.vue'
export default {
  name: 'DictTable',
  components: { baseTable },
  data() {
    return {
      columns: [
        {
          prop: 'name',
          minWidth: '160',
          label: '中文名称',
          sortable: true,
          showOverflowTooltip: true,
          render: (name, row) => {
            return (
              <span>
                <span
                  class={[
                    'dict-type-ctn',
                    row.projectId ? '' : 'is-public'
                  ].join(' ')}
                >
                  {row.projectId ? '私有' : '公有'}
                </span>
                <span>{row.desc}</span>
              </span>
            )
          }
        },
        {
          prop: 'engNameShort',
          minWidth: '110',
          label: '英文名称',
          sortable: true,
          showOverflowTooltip: true,
          render: (name, row) => {
            return (
              <span>
                <span>{row.name}</span>
              </span>
            )
          }
        },
        // {
        //   prop: 'engName',
        //   minWidth: '110',
        //   label: '英文全称',
        //   sortable: true,
        //   showOverflowTooltip: true
        // },
        // {
        //   prop: 'backendType',
        //   minWidth: '110',
        //   label: 'JAVA类型',
        //   sortable: true,
        //   showOverflowTooltip: true
        // },
        // {
        //   prop: 'type',
        //   minWidth: '120',
        //   label: '数据库类型',
        //   sortable: true,
        //   showOverflowTooltip: true
        // },
        // {
        //   prop: 'frontendType',
        //   minWidth: '110',
        //   label: '前端类型',
        //   sortable: true,
        //   showOverflowTooltip: true
        // },
        // {
        //   prop: 'charset',
        //   minWidth: '110',
        //   label: '字符集',
        //   sortable: true,
        //   showOverflowTooltip: true
        // },
        // {
        //   prop: 'validationRuleType',
        //   minWidth: '130',
        //   label: '校验规则类型',
        //   sortable: true,
        //   showOverflowTooltip: true
        // },
        // {
        //   prop: 'displayType',
        //   minWidth: '110',
        //   label: '展示类型',
        //   sortable: true,
        //   showOverflowTooltip: true
        // },
        // {
        //   prop: 'relateCode',
        //   minWidth: '140',
        //   label: '是否定义标准码',
        //   sortable: true,
        //   showOverflowTooltip: true,
        //   formatter(row) {
        //     return row.relateCode === 'Y' ? '是' : '否'
        //   }
        // },
        // {
        //   prop: 'version',
        //   minWidth: '110',
        //   label: '字典版本',
        //   sortable: true,
        //   showOverflowTooltip: true
        // },
        // {
        //   prop: 'defaultValue',
        //   minWidth: '110',
        //   label: '默认值',
        //   sortable: true,
        //   showOverflowTooltip: true
        // },
        // {
        //   prop: 'importance',
        //   minWidth: '110',
        //   label: '重要程度',
        //   sortable: true,
        //   showOverflowTooltip: true
        // },
        // {
        //   prop: 'desc',
        //   minWidth: '150',
        //   label: '描述',
        //   sortable: true,
        //   showOverflowTooltip: true
        // }
      ]
    }
  }
}
</script>

<style>
.dict-type-ctn {
  vertical-align: middle;
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    height: 18px;
    width: 38px;
    color: #fff;
    background: #384e72;
    border-radius: 20px;
    margin-right: 10px;
    zoom: .8;
    font-weight: 700;
    border: 1px solid #384e72;
}
.is-public {
  color: #384e72;
  background: #fff;
}
</style>