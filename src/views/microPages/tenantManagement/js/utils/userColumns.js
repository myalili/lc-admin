export default function () {
  return [
    {
      prop: 'name',
      label: '用户名',
      minWidth: 100,
      sortable: true,
      showOverflowTooltip: true
    },
    {
      prop: 'nickname',
      label: '昵称',
      minWidth: 100,
      sortable: true,
      showOverflowTooltip: true
    },
    {
      prop: 'phone',
      label: '手机号',
      width: 120,
      sortable: true,
      showOverflowTooltip: true
    },
    {
      prop: 'email',
      label: '邮箱',
      minWidth: 160,
      sortable: true,
      showOverflowTooltip: true
    },
    {
      prop: 'desc',
      label: '描述',
      minWidth: 160,
      showOverflowTooltip: true
    }
  ]
}