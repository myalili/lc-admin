<script>
import ElTable from 'element-ui/lib/table';
import ElPopover from 'element-ui/lib/popover';
import ElCheckbox from 'element-ui/lib/checkbox';
import ElButton from 'element-ui/lib/button';

export default {
  name: 'AopsTable',
  props: {
    hideLabels: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      columns: []
    };
  },
  created() {
    this.columns = this.$slots.default.map(item => ({
      ...item.componentOptions.propsData,
      show: !this.hideLabels.includes(item.componentOptions.propsData.label)
    }));
    console.log(this.columns)
  },
  computed: {
    showColumnLabels: vm => vm.columns.filter(item => item.show).map(item => item.label)
  },
  render(createElement) {
    // 设置按钮和下拉多选框
    const elPopover = createElement(
      ElPopover,
      {
        props: {
          popperClass: 'aops-table-settings-popover',
          placement: 'bottom',
          title: '表格字段定制',
          width: '150',
          trigger: 'click'
        }
      },
      [
        ...this.columns.map(item =>
          createElement(
            'div',
            {
              class: 'checkbox-ctn'
            },
            [
              createElement(
                ElCheckbox,
                {
                  props: {
                    value: item.show
                  },
                  on: {
                    input: val => (item.show = val)
                  }
                },
                item.label
              )
            ]
          )
        ),
        createElement(ElButton, {
          class: ['settings-button'],
          props: {
            icon: 'el-icon-s-tools',
            circle: true,
            size: 'mini'
          },
          slot: 'reference'
        })
      ]
    );
    // element-ui 表格
    // 过滤不显示的列
    const elTableColumnList = this.$slots.default.filter(item =>
      this.showColumnLabels.includes(item.componentOptions.propsData.label)
    );
    elTableColumnList.forEach(item => (item.key = item.key ?? item.componentOptions.propsData.label));
    const elTable = createElement(
      ElTable,
      {
        props: this.$attrs,
        on: this.$listeners
      },
      elTableColumnList
    );
    // 外层容器，包裹主表格和设置按钮
    return createElement('div', { class: 'aops-table' }, [elTable, elPopover]);
  },
  methods: {
    setShowColumn() {}
  }
};
</script>

<style lang="scss">
.aops-table {
  position: relative;
  /** 设置按钮定位到右上角 */
  .settings-button {
    position: absolute;
    right: 5px;
    top: 10px;
    border: none;
    z-index: 99;
    font-size: 14px;
  }
}
/** 下拉面板样式 */
.aops-table-settings-popover {
  .el-popover__title {
    color: #7f8c93;
    font-size: 12px;
    margin-bottom: 8px;
  }
}
</style>
