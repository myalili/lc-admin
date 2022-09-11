export function translateNodeName(name) {
  let type = name.toLowerCase();
  switch(type) {
    // 任务
    case 'usertask': {
      return '用户任务'
    }
    case 'manualtask': {
      return '手动任务'
    }
    case 'receivetask': {
      return '接收任务'
    }
    case 'sendtask': {
      return '发送任务'
    }
    case 'scripttasl': {
      return '脚本任务'
    }
    case 'businessruletask': {
      return '业务规则任务'
    }
    case 'servicetask': {
      return '服务任务'
    }
    case 'callactivity': {
      return '调用任务'
    }
    case 'intermediatecatchevent': {
      return '中间捕获事件'
    }
    case 'intermediatethrowevent': {
      return '中间抛出事件'
    }
    case 'subprocess': {
      return '子流程'
    }
    case 'sequenceflow': {
      return '顺序流(连线)'
    }
    case 'startevent': {
      return '开始'
    }
    case 'endevent': {
      return '结束'
    }
    case 'boundaryevent': {
      return '边界事件'
    }
    // 网关
    case 'exclusivegateway': {
      return '排他网关'
    }
    case 'parallelgateway': {
      return '并行网关'
    }
    case 'complexgateway': {
      return '复杂网关'
    }
    case 'inclusivegateway': {
      return '相容网关'
    }
    case 'eventbasedgateway': {
      return '事件网关'
    }
    case 'participant': {
      return '池'
    }
    case 'datastorereference': {
      return '数据存储引用'
    }
    default: {
      return name
    }
  }
}