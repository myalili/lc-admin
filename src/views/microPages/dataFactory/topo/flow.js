import { Notification } from 'element-ui';
import Uae from 'uaeengine';
import '../components'
import { horizenDivide, limitCom,verticalDivide } from '../utils';
// 布局插件

let clickTimer = null
// Uae.config.guide = process.env.NODE_ENV !== 'production';
// Uae.config.immediate = true;

export default class dAopsFlow {
  constructor(canvas, flowContent, readonly) {
    // flowContent.edges && flowContent.edges.forEach(edge => {
    //   edge.starLink = true
    // })
    // flowContent.nodes && flowContent.nodes.forEach(node => {
    //   node.expand = true
    // })
    this.canvas = canvas;
    this.flowContent = flowContent;
    this.readonly = readonly;
    this.selecteds = [];
    this.historys = [];
    this.historyLow = -1;
    this.historyHigh = -1;
    this.zoom = 1;
    this._initFlowContent();
    this._initUae();
    this._bindEvent();
  }
  _initFlowContent() {
    this.flowContent.nodes = this.flowContent.nodes || [];
    this.flowContent.edges = this.flowContent.edges || [];
    this.flowContent.groups = this.flowContent.groups || [];
    this.flowContent.edges.forEach(edge => {
      edge.ctrl = edge.ctrl || {};
      edge.ctrl.ctrl1 = edge.ctrl.ctrl1 || '';
      edge.ctrl.ctrl2 = edge.ctrl.ctrl2 || '';
      edge.ctrl.ctrl3 = edge.ctrl.ctrl3 || '';
      edge.ePoint = edge.ePoint || {};
      edge.ePoint.x = edge.ePoint.x || 0;
      edge.ePoint.y = edge.ePoint.y || 0;
      edge.sPoint = edge.sPoint || {};
      edge.sPoint.x = edge.sPoint.x || 0;
      edge.sPoint.y = edge.sPoint.y || 0;
    });
  }
  selectSource(sou) {
    console.log(this.selecteds);
    //this.selecteds[0].data.bindTable = sou
    //this.flowContent.nodes[0].bindTable = sou
  }
  _initUae() {
    const flowContent = this.flowContent;
    console.log('inituae', flowContent);
    const readonly = this.readonly;
    this.uae = new Uae({
      canvas: this.canvas,
      template: `
        <edge v-for="item in flowContent.edges" :mouseDown="mouseDown"  :starLink="item.starLink" :id="item.edgesId" :data="item" :isDelete="item.isDelete" :hide="item.hide" :nodes="flowContent.nodes"/>
        <component v-for="item in flowContent.nodes" :expand="item.expand" :hide="item.hide" :id="item.nodeId" :is="item.nodeType || 'apiService'" :data="item" :groups="flowContent.groups" @outputChange="outputChange"/>
        <selRect :data="selRect"/>`,
      data() {
        return {
          flowContent,
          readonly,
          mouseDown: false,
          selRect: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
          },
          guideLine: {
            x: [],
            y: []
          },
          scale: 1
        };
      },
      config: {
        scale: um => um.scale
      },
      methods: {
        getCompsByRect(x1, y1, x2, y2) {
          const comps = [];
          this.$children.forEach(comp => {
            if (comp.isIncluded && comp.isIncluded(x1, y1, x2, y2)) {
              comps.push(comp);
            }
          });
          return comps;
        },
        outputChange(node) {
          const nodeId = node.nodeId;
          const edges = [];
          const nodeOutputIds = node.output.map(item => item.id);
          for (let i = 0, edge; i < this.flowContent.edges.length; i++) {
            edge = this.flowContent.edges[i];
            if (edge.sNode === nodeId) {
              if (nodeOutputIds.includes(edge.output.id)) {
                edges.push(edge);
              } else {
                this.flowContent.edges.splice(i--, 1);
              }
            }
          }
          node.output.forEach((output, index) => {
            output.id = `output${index}`;
          });
          edges.forEach(edge => {
            edge.anchorIndex = parseInt(edge.output.id.substring('output'.length), 10);
          });
        }
      }
    });
    window.uae = this.uae;
  }
  _bindEvent() {
    const uae = this.uae;
    const flowContent = this.flowContent;
    uae.$on('contextmenu', e => this.trigger('contextmenu', e));
    uae.$on('dblclick', e => this.trigger('dblclick', e.comp));
    uae.$on('mousemove', e => {
      const comp = e.comp;
      const tag = (comp || {}).$tag;
      if (!tag) {
        this.canvas.style.cursor = 'default';
      } else if (tag === 'danchor') {
        this.canvas.style.cursor = 'crosshair';
      } else if (tag === 'ctrlLine') {
        this.canvas.style.cursor = comp.data.x1 === comp.data.x2 ? 'col-resize' : 'row-resize';
      } else if (tag === 'groupDrag') {
        this.canvas.style.cursor = 'nwse-resize';
      } else if (tag === 'edgeStart') {
        this.canvas.style.cursor = 'move';
      } else if (tag === 'edgeEnd') {
        this.canvas.style.cursor = 'move';
      } else {
        this.canvas.style.cursor = 'pointer';
      }
      if (comp !== this.hoverComp) {
        if (this.hoverComp) {
          this.hoverComp.isHover = false;
        }
        this.hoverComp = comp;
        if (this.hoverComp) {
          this.hoverComp.isHover = true;
        }
      }
      this.trigger('mousemove', e);
    });
    uae.$on('mousedown', e => {
      console.log('mousedown')
      let comp = e.comp;
      let tag = ''
      const selecteds = this.selecteds 
      if (comp) {
        tag = (comp.$tag)
        if (['danchor', 'button', 'ctrlLine', 'groupDrag', 'edgeStart', 'edgeEnd'].includes(comp.$tag)) {
          comp = comp.$parent;
        }
        if (tag === 'hider') {
          comp.expand = !comp.expand
          this.trigger('hiderClick', comp)
          return;
        }
        if (!comp.isSelected) {
          const isCtrlDown = navigator.platform.match('Mac') ? e.e.metaKey : e.e.ctrlKey;
          if (!isCtrlDown) {
            selecteds.forEach(item => {
              item.zIndex = 0;
              item.isSelected = false;
            });
            selecteds.splice(0, selecteds.length);
          }
          comp.isSelected = true;
          this.flowContent.nodes.forEach(item => item.isSelected = false)
          this.flowContent.edges.forEach(item => item.starLink = !item.starLink)
          this.uae.mouseDown = true
          comp.data.isSelected = true;

          console.log(comp);
          comp.zIndex = 1;
          selecteds.push(comp);
        }
      } else {
        console.log(selecteds);
        selecteds.forEach(item => {
          item.zIndex = 0;
          item.isSelected = false;
        });
        selecteds.splice(0, selecteds.length);
      }
      clickTimer = setTimeout(() => {
        this.trigger('click', comp);
      }, 100);
    });
    uae.$on('mouseenter', e => {
      if (this.readonly) {
        return;
      }
      if (this.readyAddNode) {
        const node = this.readyAddNode;
        const index = this._getUsableNodeIndex();
        node.nodeId = `node${index}`;
        node.nodeIndex = index;
        node.bounds = {
          ...node.bounds || {},
          x: e.x - 33,
          y: e.y - 15,
        };
        flowContent.nodes.push(node);
        this.uae.$nextTick(() => {
          this.selecteds.forEach(item => {
            item.isSelected = false;
          });
          const comp = this.uae.$findCompById(node.nodeId);

          this.selecteds = [comp];
          comp.isSelected = true;
          this.trigger('addnode', comp);
          // 拖动节点
          this.movingNodeComps = this.selecteds.filter(item => item.isNode);
          this.oldNodeBounds = this.movingNodeComps.map(item => JSON.parse(JSON.stringify(item.data.bounds)));
          this.calcMovingGuidePoints();
          this.calcGuidePoints();
          // 鼠标移动
          const mousemove = ev => {
            this.moveNode(ev.x - e.x, ev.y - e.y);
          };
          // 鼠标松开
          const mouseup = () => {
            this.uae.guideLine.x.splice(0, this.uae.guideLine.x.length);
            this.uae.guideLine.y.splice(0, this.uae.guideLine.y.length);
            uae.$off('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);
            // 是否可以放进分组
            if (this.canInGroup(comp.data)) {
              const groups = this.uae.$children.filter(item => item.$tag === 'group');
              for (let i = groups.length - 1, group, bounds; i >= 0; i--) {
                group = groups[i];
                bounds = group.bounds;
                if (comp.isIncluded(bounds.x, bounds.y, bounds.x + bounds.width, bounds.y + bounds.height)) {
                  group.data.nodeIds.push(comp.data.nodeId);
                  break;
                }
              }
            }
            this.addHistory({
              type: 'add',
              nodes: [
                {
                  data: node,
                  index: flowContent.nodes.length - 1
                }
              ]
            });
          };
          uae.$on('mousemove', mousemove);
          document.addEventListener('mouseup', mouseup);
        });
      } else if (this.readyAddGroup) {
        const group = this.readyAddGroup;
        const index = this._getUsableGroupIndex();
        group.groupId = `group${index}`;
        group.bounds = {
          x: e.x - 33,
          y: e.y - 15,
          width: 200,
          height: 100
        };
        flowContent.groups.push(group);
        this.uae.$nextTick(() => {
          const comp = this.uae.$findCompById(group.groupId);
          this.selecteds.forEach(item => {
            item.isSelected = false;
          });
          this.selecteds = [comp];
          comp.isSelected = true;
          this.trigger('addgroup', comp);
          // 拖动分组
          this.movingGroupComp = comp;
          this.oldGroupBound = JSON.parse(JSON.stringify(comp.data.bounds));
          this.calcMovingGuidePoints();
          this.calcGuidePoints();
          // 鼠标移动
          const mousemove = ev => {
            this.moveGroup(ev.x - e.x, ev.y - e.y);
          };
          // 鼠标松开
          const mouseup = () => {
            uae.$off('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);
            this.addHistory({
              type: 'add',
              groups: [
                {
                  data: group,
                  index: flowContent.groups.length - 1
                }
              ]
            });
            const nodeIds = this.uae
              .getCompsByRect(
                comp.bounds.x,
                comp.bounds.y,
                comp.bounds.x + comp.bounds.width,
                comp.bounds.y + comp.bounds.height
              )
              .filter(item => item.isNode && this.canInGroup(item.data))
              .map(node => node.data.nodeId);
            group.nodeIds.push(...nodeIds);
          };
          // 绑定事件
          uae.$on('mousemove', mousemove);
          document.addEventListener('mouseup', mouseup);
        });
      }
    });
    uae.$on('dragstart', e => {
      clearTimeout(clickTimer)
      if (this.readonly) {
        return;
      }
      console.log('uae dragstart')
      const comp = e.comp;
      this.dcomp = comp;
      if (!comp) {
        // todo
      } else if (comp.isNode) {
        // 拖动节点
        this.movingNodeComps = this.selecteds.filter(item => item.isNode);
        this.oldNodeBounds = this.movingNodeComps.map(item => JSON.parse(JSON.stringify(item.data.bounds)));
        this.calcMovingGuidePoints();
        this.calcGuidePoints();
      } else if (comp.$tag === 'group') {
        // 拖动分组
        this.movingGroupComp = comp;
        this.oldGroupBound = JSON.parse(JSON.stringify(comp.data.bounds));
        this.movingNodeComps = comp.data.nodeIds.map(nodeId => this.uae.$findCompById(nodeId));
        this.oldNodeBounds = this.movingNodeComps.map(item => JSON.parse(JSON.stringify(item.data.bounds)));
        this.calcMovingGuidePoints();
        this.calcGuidePoints();
      } else if (comp.$tag === 'danchor') {
        // 拖出连线
        const startNodeComp = comp.$parent;
        const index = this._getUsableEdgeIndex();
        const edge = {
          edgesId: `edge${index}`,
          edgeIndex: index,
          sNode: startNodeComp.data.nodeId,
          eNode: '',
          output: comp.output,
          anchorIndex: comp.index,
          sPoint: {
            x: 0,
            y: 0
          },
          ePoint: {
            x: e.x,
            y: e.y
          },
          ctrl: {
            ctrl1: '',
            ctrl2: '',
            ctrl3: ''
          }
        };
        this.currentEdge = edge;
        this.flowContent.edges.push(edge);
      } else if (comp.$tag === 'edgeEnd') {
        comp.$parent.zIndex = 0;
        this.currentEdge = comp.$parent.data;
        this.currentEdgeENode = this.currentEdge.eNode;
      } else if (comp.$tag === 'edgeStart') {
        comp.$parent.zIndex = 0;
        this.currentEdge = comp.$parent.data;
        this.currentEdgeOuput = this.currentEdge.output;
        this.currentEdgeSNode = this.currentEdge.sNode;
      }
    });
    uae.$on('drag', e => {
      if (this.readonly) {
        return;
      }
      if (!this.dcomp) {
        // 框选
        const x1 = e.x - e.dx;
        const y1 = e.y - e.dy;
        const x2 = e.x;
        const y2 = e.y;
        this.uae.selRect.x1 = x1;
        this.uae.selRect.y1 = y1;
        this.uae.selRect.x2 = x2;
        this.uae.selRect.y2 = y2;
        this.selecteds.forEach(item => {
          item.isSelected = false;
        });
        this.selecteds = this.uae.getCompsByRect(x1, y1, x2, y2);
        this.selecteds.forEach(item => {
          item.isSelected = true;
        });
      } else if (this.dcomp.isNode) {
        // 拖动节点
        this.moveNode(e.dx, e.dy);
      } else if (this.dcomp.$tag === 'group') {
        // 拖动分组
        this.moveNode(e.dx, e.dy);
        this.moveGroup(e.dx, e.dy);
      } else if (['danchor', 'edgeEnd'].includes(this.dcomp.$tag)) {
        // 拖动连线尾巴
        if (this.currentEdge) {
          if (this.hoverComp && this.hoverComp.isNode) {
            this.currentEdge.eNode = this.hoverComp.data.nodeId;
          } else {
            this.currentEdge.eNode = '';
            this.currentEdge.ePoint.x = e.x;
            this.currentEdge.ePoint.y = e.y;
          }
        }
      } else if (this.dcomp.$tag === 'edgeStart') {
        // 拖动连线开头
        if (this.currentEdge) {
          if (
            this.hoverComp &&
            this.hoverComp.isNode &&
            this.hoverComp.data.output &&
            this.hoverComp.data.output.length
          ) {
            this.currentEdge.sNode = this.hoverComp.data.nodeId;
            this.currentEdge.output = this.hoverComp.data.output[0];
            this.currentEdge.anchorIndex = 0;
          } else if (this.hoverComp && this.hoverComp.$tag === 'danchor') {
            this.currentEdge.sNode = this.hoverComp.$parent.data.nodeId;
            this.currentEdge.output = this.hoverComp.output;
            this.currentEdge.anchorIndex = this.hoverComp.index;
          } else {
            this.currentEdge.sNode = '';
            this.currentEdge.sPoint.x = e.x;
            this.currentEdge.sPoint.y = e.y;
          }
        }
      }
    });
    uae.$on('dragend', () => {
      if (this.readonly) {
        return;
      }
      if (!this.dcomp) {
        // 多选框
        this.uae.selRect.x1 = 0;
        this.uae.selRect.y1 = 0;
        this.uae.selRect.x2 = 0;
        this.uae.selRect.y2 = 0;
        return;
      }
      if (this.dcomp.$tag === 'danchor') {
        if (!this.currentEdge) {
          return;
        }
        if (this.isPossible(this.currentEdge)) {
          console.log(this.currentEdge)
          this.addHistory({
            type: 'add',
            edges: [
              {
                data: this.currentEdge,
                index: flowContent.edges.length - 1
              }
            ]
          });
          this.trigger('addEdge', this.currentEdge)
        } else {
          this.flowContent.edges.splice(this.flowContent.edges.indexOf(this.currentEdge), 1);
        }
        this.currentEdge = null;
      }
      // this.uae.guideLine.x.splice(0, this.uae.guideLine.x.length);
      // this.uae.guideLine.y.splice(0, this.uae.guideLine.y.length);
    });
    document.addEventListener(
      'keydown',
      (this.dockeydown = e => {
        if (this.readonly) {
          return;
        }
        if (!this.uae.focus) {
          return;
        }
        const isCtrlDown = navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey;
        if (e.keyCode === 46) {
          // delete
          this.deleteSelected();
        }
        if (e.keyCode === 90 && isCtrlDown) {
          // ctrl + z
          if (this.historyLow >= 0) {
           
    
    const history = this.historys[this.historyLow--];
    if (history.type === 'delete') {
      const nodes = history.nodes || [];
      for (let i = nodes.length - 1, item; i >= 0; i--) {
        item = nodes[i];
        flowContent.nodes.splice(item.index, 0, item.data);
      }
      const id2node = this.listToMap(
        this.flowContent.nodes,
        item => item.nodeId,
        item => item
      );
      const edges = history.edges || [];
      for (let i = edges.length - 1, item; i >= 0; i--) {
        item = edges[i];
        if (id2node[item.data.sNode].output.map(o => o.id).indexOf(item.data.output.id) !== -1) {
          flowContent.edges.splice(item.index, 0, item.data);
        }
      }
      const groups = history.groups || [];
      for (let i = groups.length - 1, item; i >= 0; i--) {
        item = groups[i];
        flowContent.groups.splice(item.index, 0, item.data);
      }
    } else if (history.type === 'move') {
      for (let i = 0, item; i < history.data.length; i++) {
        item = history.data[i];
        item.data.bounds.x = item.origin.x;
        item.data.bounds.y = item.origin.y;
      }
    } else if (history.type === 'add') {
      let hasLose = false;
      const nodes = history.nodes || [];
      for (let i = nodes.length - 1, item; i >= 0; i--) {
        item = nodes[i];
        if (!flowContent.nodes.splice(item.index, 1).length) {
          hasLose = true;
        }
      }
      const edges = history.edges || [];
      for (let i = edges.length - 1, item; i >= 0; i--) {
        item = edges[i];
        if (!flowContent.edges.splice(item.index, 1).length) {
          hasLose = true;
        }
      }
      const groups = history.groups || [];
      for (let i = groups.length - 1, item; i >= 0; i--) {
        item = groups[i];
        if (!flowContent.groups.splice(item.index, 1).length) {
          hasLose = true;
        }
      }
      if (hasLose) {
        this.historyHigh--;
      }
    }
  
 
          }
        }
        if (e.keyCode === 89 && isCtrlDown) {
          // ctrl + y
          if (this.historyLow < this.historyHigh) {
            const history = this.historys[++this.historyLow];
            if (history.type === 'delete') {
              const nodes = history.nodes || [];
              for (let i = 0, item; i < nodes.length; i++) {
                item = nodes[i];
                flowContent.nodes.splice(item.index, 1);
              }
              const edges = history.edges || [];
              for (let i = 0, item; i < edges.length; i++) {
                item = edges[i];
                flowContent.edges.splice(item.index, 1);
              }
              const groups = history.groups || [];
              for (let i = 0, item; i < groups.length; i++) {
                item = groups[i];
                flowContent.groups.splice(item.index, 1);
              }
            } else if (history.type === 'move') {
              for (let i = 0, item; i < history.data.length; i++) {
                item = history.data[i];
                item.data.bounds.x = item.target.x;
                item.data.bounds.y = item.target.y;
              }
            } else if (history.type === 'add') {
              const nodes = history.nodes || [];
              for (let i = nodes.length - 1, item; i >= 0; i--) {
                item = nodes[i];
                flowContent.nodes.splice(item.index, 0, item.data);
              }
              const edges = history.edges || [];
              for (let i = edges.length - 1, item; i >= 0; i--) {
                item = edges[i];
                flowContent.edges.splice(item.index, 0, item.data);
              }
              const groups = history.groups || [];
              for (let i = groups.length - 1, item; i >= 0; i--) {
                item = groups[i];
                flowContent.groups.splice(item.index, 0, item.data);
              }
            }
          }
        }
        if (e.keyCode === 69 && isCtrlDown) {
          // ctrl + e
          this.setAlign('center');
          e.preventDefault();
        }
        if (e.keyCode === 82 && isCtrlDown) {
          // ctrl + r
          this.setAlign('right');
          e.preventDefault();
        }
        if (e.keyCode === 76 && isCtrlDown) {
          // ctrl + l
          this.setAlign('left');
          e.preventDefault();
        }
        if (e.keyCode === 65 && isCtrlDown) {
          // ctrl + a
          this.selectAll();
          e.preventDefault();
        }
        if (e.keyCode === 67 && isCtrlDown) {
          // ctrl + c
          this.copy();
        }
        if (e.keyCode === 86 && isCtrlDown) {
          // ctrl + v
          this.paste();
        }
        if (e.keyCode === 37) {
          // left
          e.preventDefault();
          this.moveSelected('left');
        }
        if (e.keyCode === 38) {
          // up
          e.preventDefault();
          this.moveSelected('up');
        }
        if (e.keyCode === 39) {
          // right
          e.preventDefault();
          this.moveSelected('right');
        }
        if (e.keyCode === 40) {
          // down
          e.preventDefault();
          this.moveSelected('down');
        }
      })
    );
    document.addEventListener(
      'mouseup',
      (this.docmousedown = () => {
        this.readyAddNode = null;
        this.readyAddGroup = null;
      })
    );
  }

  setScale(scale) {
    this.scale = scale
  }
  moveNode(dx, dy) {
    if (this.movingNodeComps && this.movingNodeComps.length) {
      dx = Math.min(...this.movingGuidePoints.x.map(item => this.getDx(item, dx)));
      dy = Math.min(...this.movingGuidePoints.y.map(item => this.getDy(item, dy)));
      this.movingNodeComps.forEach((comp, index) => {
        comp.data.bounds.x = this.oldNodeBounds[index].x + dx;
        comp.data.bounds.y = this.oldNodeBounds[index].y + dy;
      });
      this.calcGuideLine();
    }
  }
  moveGroup(dx, dy) {
    if (this.movingGroupComp) {
      this.movingGroupComp.data.bounds.x = this.oldGroupBound.x + dx;
      this.movingGroupComp.data.bounds.y = this.oldGroupBound.y + dy;
    }
  }
  moveSelected(direction) {
    if (!['up', 'down', 'left', 'right'].includes(direction)) {
      return;
    }
    const moveDatas = [];
    for (let i = 0, comp; i < this.selecteds.length; i++) {
      comp = this.selecteds[i];
      if (comp.data.nodeId) {
        const moveData = {
          data: comp.data,
          origin: {
            x: comp.data.bounds.x,
            y: comp.data.bounds.y
          }
        };
        switch (direction) {
          case 'up':
            comp.data.bounds.y -= 1;
            break;
          case 'down':
            comp.data.bounds.y += 1;
            break;
          case 'left':
            comp.data.bounds.x -= 1;
            break;
          case 'right':
            comp.data.bounds.x += 1;
            break;
          default:
            break;
        }
        moveData.target = {
          x: comp.data.bounds.x,
          y: comp.data.bounds.y
        };
        moveDatas.push(moveData);
      }
    }
    this.addHistory({
      type: 'move',
      data: moveDatas
    });
  }
  selectAll() {
    this.selecteds = [];
    this.uae.$children.forEach(comp => {
      if (comp && comp.data && (comp.data.nodeId || comp.data.edgesId || comp.data.groupId)) {
        comp.isSelected = true;
        this.selecteds.push(comp);
      }
    });
  }
  copy() {
    window.copyEdges = JSON.stringify(this.selecteds.filter(comp => comp.data && comp.data.edgesId).map(o => o.data));
    window.copyNodes = JSON.stringify(this.selecteds.filter(comp => comp.data && comp.data.nodeId).map(o => o.data));
    window.copyGroups = JSON.stringify(this.selecteds.filter(comp => comp.data && comp.data.groupId).map(o => o.data));
  }
  paste() {
    this.selecteds.forEach(comp => {
      comp.isSelected = false;
    });
    this.selecteds = [];
    const edges = JSON.parse(window.copyEdges);
    const nodes = JSON.parse(window.copyNodes);
    const flowContent = this.flowContent;
    if (!edges || !nodes || (!edges.length && !nodes.length)) {
      return;
    }
    const addEdges = [];
    const addNodes = [];
    for (let i = 0, item, index; i < nodes.length; i++) {
      item = nodes[i];
      index = this._getUsableNodeIndex();
      for (let j = 0, temp; j < edges.length; j++) {
        temp = edges[j];
        if (temp.sNode === item.nodeId) {
          temp.sNode = `_node${index}`;
        }
        if (temp.eNode === item.nodeId) {
          temp.eNode = `_node${index}`;
        }
      }
      item.nodeId = `node${index}`;
      item.nodeIndex = index;
      item.bounds.x += 10;
      item.bounds.y += 10;
      flowContent.nodes.push(item);
      addNodes.push({
        index: flowContent.nodes.length - 1,
        data: item
      });
      this.uae.$nextTick(() => {
        const comp = this.uae.$findCompById(item.nodeId);
        if (comp) {
          comp.isSelected = true;
          this.selecteds.push(comp);
        }
      });
    }
    edges.forEach(edge => {
      if (edge.sNode.startsWith('_')) {
        edge.sNode = edge.sNode.substring(1);
      }
      if (edge.eNode.startsWith('_')) {
        edge.eNode = edge.eNode.substring(1);
      }
    });

    let sNodeExist = false;
    let eNodeExist = false;
    for (let i = 0, item, index; i < edges.length; i++) {
      item = edges[i];
      index = this._getUsableEdgeIndex();
      item.edgesId = `edge${index}`;
      item.edgeIndex = index;

      sNodeExist = false;
      eNodeExist = false;
      for (let j = 0, temp; j < nodes.length; j++) {
        temp = nodes[j];
        if (item.sNode === temp.nodeId) {
          sNodeExist = true;
        }
        if (item.eNode === temp.nodeId) {
          eNodeExist = true;
        }
      }
      if (sNodeExist && eNodeExist) {
        for (let j = 0, temp; j < item.connection.path.length; j++) {
          temp = item.connection.path[j];
          temp.x += 10;
          temp.y += 10;
        }
        flowContent.edges.push(item);
        addEdges.push({
          index: flowContent.edges.length - 1,
          data: item
        });
        this.uae.$nextTick(() => {
          const comp = this.uae.$findCompById(item.edgesId);
          if (comp) {
            comp.isSelected = true;
            this.selecteds.push(comp);
          }
        });
      }
    }
    this.addHistory({
      type: 'add',
      nodes: addNodes,
      edges: addEdges
    });
  }
  createNode(node) {
    if (node.output) {
      node.output.forEach((item, index) => {
        item.id = `output${index}`;
      });
    }
    this.readyAddNode = node;
  }
  createGroup(group) {
    if (group && !group.nodeIds) {
      group.nodeIds = [];
    }
    this.readyAddGroup = group;
  }
  on(name, fn) {
    if (typeof fn !== 'function') {
      return;
    }
    this.events = this.events || {};
    this.events[name] = this.events[name] || [];
    this.events[name].push(fn);
  }
  trigger(name, comp) {
    if (this.events && this.events[name]) {
      this.events[name].forEach(item => item(comp));
    }
  }
  _getUsableEdgeIndex() {
    const tempIds = this.flowContent.edges.map(item => parseInt(item.edgeIndex, 10));
    let index = 0;
    while (tempIds.includes(index)) {
      index++;
    }
    return index;
  }
  _getUsableNodeIndex() {
    const tempIds = this.flowContent.nodes.map(item => parseInt(item.nodeIndex, 10));
    let index = 0;
    while (tempIds.includes(index)) {
      index++;
    }
    return index;
  }
  _getUsableGroupIndex() {
    const tempIds = this.flowContent.groups.map(item => parseInt(item.groupId.substring('group'.length), 10));
    let index = 0;
    while (tempIds.includes(index)) {
      index++;
    }
    return index;
  }
  hasSelected() {
    return !!this.selecteds.length;
  }
  getSelectedNode() {
    return this.selecteds.filter(comp => comp.isNode);
  }
  deleteSelected() {
    const flowContent = this.flowContent;
    const deletedData = {
      nodes: [],
      edges: [],
      groups: []
    };
    if (this.selecteds) {
      this.selecteds.forEach(comp => {
        if (comp.data.edgesId) {
          const index = flowContent.edges.indexOf(comp.data);
          flowContent.edges.splice(index, 1);
          deletedData.edges.push({
            data: comp.data,
            index: index
          });
        }
        if (comp.data.nodeId) {
          const index = flowContent.nodes.indexOf(comp.data);
          flowContent.nodes.splice(index, 1);
          deletedData.nodes.push({
            data: comp.data,
            index: index
          });
          // eslint-disable-next-line space-in-parens
          for (let i = 0, edge; i < flowContent.edges.length;) {
            edge = flowContent.edges[i];
            if (edge.sNode === comp.data.nodeId || edge.eNode === comp.data.nodeId) {
              flowContent.edges.splice(i, 1);
              deletedData.edges.push({
                data: edge,
                index: i
              });
            } else {
              i++;
            }
          }
          flowContent.groups.forEach(group => {
            for (let i = 0; i < group.nodeIds.length; i++) {
              if (group.nodeIds[i] === comp.data.nodeId) {
                group.nodeIds.splice(i--, 1);
              }
            }
          });
        }
        if (comp.data.groupId) {
          const index = flowContent.groups.indexOf(comp.data);
          flowContent.groups.splice(index, 1);
          deletedData.groups.push({
            data: comp.data,
            index: index
          });
        }
      });
    }
    this.selecteds = [];
    this.addHistory({
      type: 'delete',
      ...deletedData
    });
    this.trigger('deleted', deletedData);
  }
  setAlign(algin) {
    const nodes = [];
    const points = [];
    for (let i = 0, comp; i < this.selecteds.length; i++) {
      comp = this.selecteds[i];
      if (comp.data && comp.data.nodeType) {
        nodes.push(comp);
        points.push({
          x: comp.data.bounds.x,
          y: comp.data.bounds.y
        });
      }
    }
    if (nodes.length) {
      const bounds = nodes[0].data.bounds;
      const left = bounds.x;
      const center = bounds.x + bounds.width / 2;
      const right = bounds.x + bounds.width;
      const movingData = [];
      for (let i = 0, data; i < nodes.length; i++) {
        data = nodes[i].data;
        if (algin === 'left') {
          data.bounds.x = left;
        } else if (algin === 'right') {
          data.bounds.x += right - data.bounds.x - data.bounds.width;
        } else {
          data.bounds.x += parseInt(center - (data.bounds.x + data.bounds.width / 2), 10);
        }
        movingData.push({
          data: data,
          origin: {
            x: points[i].x,
            y: points[i].y
          },
          target: {
            x: data.bounds.x,
            y: data.bounds.y
          }
        });
      }
      this.addHistory({
        type: 'move',
        data: movingData
      });
    }
  }
  // eslint-disable-next-line class-methods-use-this
  listToMap(list, key, value) {
    const map = {};
    for (let i = 0, item; i < list.length; i++) {
      item = list[i];
      map[key(item)] = value(item);
    }
    return map;
  }
  calcMovingGuidePoints() {
    const nodeComps = this.movingNodeComps || [];
    const x = [];
    const y = [];
    nodeComps.forEach(comp => {
      const left = comp.getLeft();
      const center = comp.getCenter();
      const right = comp.getRight();
      const top = comp.getTop();
      const middle = comp.getMiddle();
      const bottom = comp.getBottom();
      if (!x.includes(left)) x.push(left);
      if (!x.includes(center)) x.push(center);
      if (!x.includes(right)) x.push(right);
      if (!y.includes(top)) y.push(top);
      if (!y.includes(middle)) y.push(middle);
      if (!y.includes(bottom)) y.push(bottom);
    });
    this.movingGuidePoints = { x, y };
  }
  calcGuidePoints() {
    let nodeComps = this.uae.$children.filter(comp => comp.isNode && !comp.isSelected);
    const x = [];
    const y = [];
    if (this.dcomp && this.dcomp.$tag === 'group') {
      const nodeIds = this.dcomp.data.nodeIds;
      nodeComps = nodeComps.filter(comp => !nodeIds.includes(comp.data.nodeId));
    }
    nodeComps.forEach(comp => {
      const left = comp.getLeft();
      const center = comp.getCenter();
      const right = comp.getRight();
      const top = comp.getTop();
      const middle = comp.getMiddle();
      const bottom = comp.getBottom();
      if (!x.includes(left)) x.push(left);
      if (!x.includes(center)) x.push(center);
      if (!x.includes(right)) x.push(right);
      if (!y.includes(top)) y.push(top);
      if (!y.includes(middle)) y.push(middle);
      if (!y.includes(bottom)) y.push(bottom);
    });
    this.guidePoints = { x, y };
  }
  calcGuideLine() {
    this.uae.guideLine.x.splice(0, this.uae.guideLine.x.length);
    this.uae.guideLine.y.splice(0, this.uae.guideLine.y.length);
    this.movingNodeComps.forEach(comp => {
      this.pushGuideLine(
        comp.getLeft(),
        comp.getCenter(),
        comp.getRight(),
        comp.getTop(),
        comp.getMiddle(),
        comp.getBottom()
      );
    });
  }
  pushGuideLine(left, center, right, top, middle, bottom) {
    let temp;
    const x = this.uae.guideLine.x;
    const y = this.uae.guideLine.y;
    // eslint-disable-next-line no-cond-assign
    if ((temp = this.guidePoints.x.filter(item => item === center)).length) {
      x.push(...temp);
    } else {
      x.push(...this.guidePoints.x.filter(item => item === left || item === right));
    }
    // eslint-disable-next-line no-cond-assign
    if ((temp = this.guidePoints.y.filter(item => item === middle)).length) {
      y.push(...temp);
    } else {
      y.push(...this.guidePoints.y.filter(item => item === top || item === bottom));
    }
  }
  getDx(x, dx) {
    let next = x + dx;
    next = this.guidePoints.x.filter(item => next > item - 7 && next < item + 7)[0];
    if (next) {
      return next - x;
    }
    return dx;
  }
  getDy(y, dy) {
    let next = y + dy;
    next = this.guidePoints.y.filter(item => next > item - 7 && next < item + 7)[0];
    if (next) {
      return next - y;
    }
    return dy;
  }
  canInGroup(node) {
    if (!['logicCode', 'apiService'].includes(node.nodeType)) {
      return false;
    }
    if (node.api && node.api.invokeId === 'SYNC') {
      return false;
    }
    if (this.isInGroup(node.nodeId)) {
      return false;
    }
    return true;
  }
  isInGroup(nodeId) {
    for (let i = 0, group; i < this.flowContent.groups.length; i++) {
      group = this.flowContent.groups[i];
      if (group.nodeIds.includes(nodeId)) {
        return true;
      }
    }
    return false;
  }
  addHistory(data) {
    this.historys[++this.historyLow] = data;
    this.historyHigh = this.historyLow;
  }
  removeNodes( ){
      const ids = this.selecteds.filter(node=>node.isNode).map(item=>item.data.nodeId)
      console.log(ids);
      let nodes = this.flowContent.nodes;
      let edges = this.flowContent.edges
      for(let i = 0 ; i < edges.length ; i++){
        if( ids.includes(edges[i].sNode) || ids.includes(edges[i].eNode) ){
          edges.splice(i,1);
          i--;
        }
      }
      for(let i = 0 ; i < nodes.length ; i++){
        if(ids.includes(nodes[i].nodeId)){
          nodes.splice(i,1);
          i--;
        }
      }
  }
  // 前进/取消撤回 事件
  forWardFlow() {
    
    const history = this.historys[this.historyLow--];
    const flowContent = this.flowContent;
    if (history.type === 'delete') {
      const nodes = history.nodes || [];

      for (let i = nodes.length - 1, item; i >= 0; i--) {
        item = nodes[i];
        flowContent.nodes.splice(item.index, 0, item.data);
      }
      const id2node = this.listToMap(
        this.flowContent.nodes,
        item => item.nodeId,
        item => item
      );
      const edges = history.edges || [];
      for (let i = edges.length - 1, item; i >= 0; i--) {
        item = edges[i];
        if (id2node[item.data.sNode].output.map(o => o.id).indexOf(item.data.output.id) !== -1) {
          flowContent.edges.splice(item.index, 0, item.data);
        }
      }
      const groups = history.groups || [];
      for (let i = groups.length - 1, item; i >= 0; i--) {
        item = groups[i];
        flowContent.groups.splice(item.index, 0, item.data);
      }
    } else if (history.type === 'move') {
      for (let i = 0, item; i < history.data.length; i++) {
        item = history.data[i];
        item.data.bounds.x = item.origin.x;
        item.data.bounds.y = item.origin.y;
      }
    } else if (history.type === 'add') {
      let hasLose = false;
      const nodes = history.nodes || [];
      for (let i = nodes.length - 1, item; i >= 0; i--) {
        item = nodes[i];
        if (!flowContent.nodes.splice(item.index, 1).length) {
          hasLose = true;
        }
      }
      const edges = history.edges || [];
      for (let i = edges.length - 1, item; i >= 0; i--) {
        item = edges[i];
        if (!flowContent.edges.splice(item.index, 1).length) {
          hasLose = true;
        }
      }
      const groups = history.groups || [];
      for (let i = groups.length - 1, item; i >= 0; i--) {
        item = groups[i];
        if (!flowContent.groups.splice(item.index, 1).length) {
          hasLose = true;
        }
      }
      if (hasLose) {
        this.historyHigh--;
      }
    }
  
  } 
  horizenDivide(){
    console.log('selectds',this.selecteds);
      horizenDivide({nodes:this.selecteds.filter(item=>item.isNode).map(item=>item.data)})
  }
  verticalDivide(){
    console.log('selectds',this.selecteds);
    verticalDivide({nodes:this.selecteds.filter(item=>item.isNode).map(item=>item.data)})
  }
  isPossible(edge) {
    const id2node = this.listToMap(
      this.flowContent.nodes,
      item => item.nodeId,
      item => item
    );
    let nodeId = edge.eNode;
    let nodes = this.flowContent.nodes;
    let edges = this.flowContent.edges;
    const isPossibleDataFactory = limitCom({
      nodeId,nodes,edges
    })
    if(isPossibleDataFactory){
      Notification.warning(isPossibleDataFactory)
    }
    const possible =
      // 有来源节点
      edge.sNode &&
      // 有目标节点
      edge.eNode &&
      // 不是指向自己
      edge.eNode !== edge.sNode &&
      // 不存在相同连线
      this.flowContent.edges.filter(
        item =>
          // 不是本身
          // eslint-disable-next-line implicit-arrow-linebreak
          item !== edge &&
          // 同一个起点
          item.sNode === edge.sNode &&
          // 同一个锚点
          item.anchorIndex === edge.anchorIndex &&
          // 相同终点
          (item.eNode === edge.eNode)
      ).length === 0;
    return possible && !isPossibleDataFactory;
  }
  destroy() {
    document.removeEventListener('mousedown', this.docmousedown);
    document.removeEventListener('keydown', this.dockeydown);
    this.uae.$destroy();
    Object.keys(this).forEach(key => {
      this[key] = null;
    });
  }
  exportImage() {
    return this.canvas.toDataURL("image/jpeg");
  }
}