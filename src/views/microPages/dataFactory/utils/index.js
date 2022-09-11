export function measureWidth(ctx, nodeName) {
  ctx.save();
  ctx.font = '14px Arial';
  const width = Math.max(150, parseInt(ctx.measureText(nodeName).width) + 70);
  ctx.restore();
  return width;
}


export function getJsonInfo({
  edges, nodes, nodeId
}) {

  function getMyInfo(nodeId) {
    const node = nodes.find(item => item.nodeId === nodeId);
    const obj = JSON.parse(JSON.stringify(node.bindSet || node.bindTable || {}))

    if (node.nodeType === 'djoin') {
      //join类型
      const nodeIds = edges.filter(edge => edge.eNode === nodeId).map(item => item.sNode)
      const left = getMyInfo(nodeIds[0])
      const right = getMyInfo(nodeIds[1])
      obj.left = left;
      obj.right = right
      console.log(left, right, 'debug');
      obj.selectItems = node.bindTable.schema.map(item => {
        return {
          name: item.value,
          desc: item.label,
          alias: item.alias,
          tablePosition: item.tablePosition
        }
      })
    } else if (node.nodeType === 'dmerge') {
      //追加合并类型
      const nodeIds = edges.filter(edge => edge.eNode === nodeId).map(item => item.sNode)
      obj.unionNodes = nodeIds.map(id => getMyInfo(id))
      obj.selectItems = node.bindTable.schema.filter(data => data.isCheck)
      console.log(obj.selectItems);
    } else if (node.nodeType === 'dcom') {
      //输入类型
      //输入类型没有前节点
      obj.table = obj.id;
      obj.tableAlias = ''
      obj.selectItems = obj.schema.filter(item=>!item.hide);
      delete obj.schema
      delete obj.data
      delete obj.id;
    } else if (node.nodeType === 'dgroup') {
      const id = edges.find(edge => edge.eNode === nodeId).sNode
      obj.prev = getMyInfo(id);
      obj.selectItems = node.bindTable.schema
    } else if (node.nodeType === 'dfilter') {
      const id = edges.find(edge => edge.eNode === nodeId).sNode
      obj.prev = getMyInfo(id);
      obj.selectItems = node.bindTable.schema
    } else if (node.nodeType === 'output'){
      const id = edges.find(edge => edge.eNode === nodeId).sNode
      obj.prev = getMyInfo(id);
      obj.selectItems = obj.prev.selectItems
    }

    obj.name = node.nodeName
    delete obj.vueData
    obj.selectItems = obj.selectItems.map(item => {
      const pobj = {
        name: item.value || item.name,
        alias: item.alias || '',
        desc: item.label || item.desc,
      }
      if (item.tablePosition) pobj.tablePosition = item.tablePosition
      return pobj
    })
    obj.selectItems.forEach(item => {
      const same = obj.selectItems.find(ele => ele.name === item.name && ele.tablePosition !== item.tablePosition && ele.alias === item.alias);
      if (same) {
        same.alias = (same.alias || same.name) + '-' + same.tablePosition
        item.alias = (item.alias || item.name) + '-' + item.tablePosition
        console.log(same);
      }
    })
    if (node.nodeType !== 'djoin') {
      obj.selectItems.forEach(item => {
        delete item.tablePosition
      })
    }
    if (!['djoin'].includes(node.nodeType)) {
      obj.selectItems.forEach(item => {
        if (item.alias) {
          item.name = item.alias;
          item.alias = ''
        }
      })
    }
    const map = {
      'dcom': 'input',
      'djoin': 'join',
      'dgroup': 'group',
      'dmerge': 'union',
      'dpro': 'select',
      'dfilter': 'filter',
      'output':'output',
      'dcusom':'script'  
    }
    obj.type = map[node.nodeType]
    return obj
  }

  return getMyInfo(nodeId)
}

export function getJsonScriptInfo({
  edges, nodes, nodeId
}) {
  function getMyInfo(nodeId) {
    const node = nodes.find(item => item.nodeId === nodeId);
    let obj = {
      
    }
    obj.name = node.nodeName;
    if(node.nodeType === 'dcustom'){
      const id = edges.find(edge => edge.eNode === nodeId).sNode;
      obj.prev = getMyInfo(id);
      obj.script = node?.bindSet?.script || 'function analyze(data){ return [{a:data}] }';
      obj.type = 'script'
      obj.selectItems = obj.prev.selectItems
    }else if(node.nodeType === 'dcom'){
      const  {entityId,schema} = node.bindTable 
      obj = {entityId}
      obj.selectItems = schema.map(item => {
        return {
          name: item.value,
          desc: item.label,
          alias: item.alias
        }
      })
      obj.name = node.nodeName;
      obj.type =  'input'
    }
    return obj;
  }
  return getMyInfo(nodeId)
}


export function getPrevTables({
  edges, nodes, nodeId
}) {
  const nodesId = edges.filter(edge => edge.eNode === nodeId).map(edge => edge.sNode);
  const tnodes = nodesId.map(id => nodes.find(item => item.nodeId === id));
  const tables = tnodes.map(node => node.bindTable).filter(item => item);
  tables.forEach(table=>table.schema=table.schema.filter(item=>!item.hide))
  return tables
}

export function mergeTable({ selectItems, data }) {
  const schema = selectItems.map(item => {
    return {
      label: item.desc,
      value: item.alias || item.name
    }
  })
  return {
    schema,
    data
  }
}

export function isCustomMode() {
  const url = window.location.href;
  const [one, two] = url.split('?');
  const arrs = (two || '').split('&')
  const obj = {}
  arrs.forEach(item => {
    const [pro, val] = item.split('=')
    obj[pro] = val
  })
  return obj['mode'] === 'custom'
}

export function limitCom({nodeId,edges,nodes}) {
  const node = nodes.find(item=>item.nodeId === nodeId);
  if(node.nodeType === 'djoin'){
    return limitDJoin({nodeId,edges})
  }
  if(node.nodeType === 'dgroup'){
    return limitDGroup({nodeId,edges})
  }
  if(node.nodeType === 'dfilter'){
    return limitDFilter({nodeId,edges})
  }
  if(node.nodeType === 'output'){
    return limitOutput({nodeId,edges})
  }
  if(node.nodeType === 'dcustom'){
    return limitCustom({nodeId,edges})
  }
  return false
}



function limitCustom({
  nodeId, edges, nodes
}) {
  const tedges = edges.filter(edge => edge.eNode === nodeId);
  if (tedges.length  - 1 === 1) {
    console.log(tedges,'tedges');
    return '节点输入连线超出限制'
  }
  return false;
}

function limitDJoin({
  nodeId, edges, nodes
}) {
  const tedges = edges.filter(edge => edge.eNode === nodeId);
  if (tedges.length  - 1 > 1) {
    console.log(tedges,'tedges');
    return '节点输入连线超出限制'
  }
  return false;
}

function limitDGroup({
  nodeId, edges
}) {
  const tedges = edges.filter(edge => edge.eNode === nodeId);
  if (tedges.length  - 1 === 1) {
    return '节点输入连线超出限制'
  }
  return false;
}

function limitDFilter({
  nodeId, edges
}) {
  const tedges = edges.filter(edge => edge.eNode === nodeId);
  if (tedges.length  - 1 === 1) {
    return '节点输入连线超出限制'
  }
  return false;
}

function limitOutput({
  nodeId, edges
}) {
  const tedges = edges.filter(edge => edge.eNode === nodeId);
  if (tedges.length  - 1 === 1) {
    return '节点输入连线超出限制'
  }
  return false;
}

export function horizenDivide({nodes}) {
  const bounds = nodes.map(node=>node.bounds);
  bounds.sort((a,b)=>a.x-b.x);
  const distance = bounds[bounds.length-1].x - bounds[0].x;
  const delta = distance/(bounds.length - 1);
  for (let index = 1; index < bounds.length; index++) {
    const bound = bounds[index];
    bound.x = bounds[0].x + index * delta;
  }
}

export function verticalDivide({nodes}) {
  const bounds = nodes.map(node=>node.bounds);
  bounds.sort((a,b)=>a.y-b.y);
  const distance = bounds[bounds.length-1].y - bounds[0].y;
  const delta = distance/(bounds.length - 1);
  for (let index = 1; index < bounds.length; index++) {
    const bound = bounds[index];
    bound.y = bounds[0].y + index * delta;
  }
}