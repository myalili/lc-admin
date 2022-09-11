/**
 * 分组
 */
import Uae from 'uaeengine';

Uae.component('group', {
  template: `<groupDrag :x="0" :y="0" @dragstart="handleDragstart1" @drag="handleDrag1" @dragend="handleDragend1"/>
    <groupDrag :x="bounds.width" :y="bounds.height" @dragstart="handleDragstart2" @drag="handleDrag2" @dragend="handleDragend2"/>`,
  props: ['data', 'flowContent', 'readonly'],
  data() {
    return {
      isSelected: false,
      isHover: false,
      dragstart1: false,
      dragstart2: false,
      dragx1: 0,
      dragy1: 0,
      dragx2: 0,
      dragy2: 0
    };
  },
  config: {
    x: um => um.bounds.x,
    y: um => um.bounds.y,
    width: um => um.bounds.width + 10,
    height: um => um.bounds.height + 10
  },
  draw() {
    this.drawRectShape();
    this.drawText();
    this.isHover && this.drawHoverShape();
    this.isSelected && this.drawSelectedShape();
  },
  computed: {
    groupNodes() {
      const nodeMap = this.listToMap(
        this.flowContent.nodes,
        item => item.nodeId,
        item => item
      );
      return this.data.nodeIds.map(nodeId => nodeMap[nodeId]).filter(item => item);
    },
    bounds() {
      const nodes = this.groupNodes;
      const databounds = this.data.bounds;
      const dragy1 = this.dragy1;
      const dragx1 = this.dragx1;
      const dragy2 = this.dragy2;
      const dragx2 = this.dragx2;
      let x = 0;
      let y = 0;
      let width = 0;
      let height = 0;
      if (nodes && nodes.length) {
        let node = nodes[0];
        let bounds = node.bounds;
        let x1 = bounds.x;
        let y1 = bounds.y;
        let x2 = x1 + bounds.width;
        let y2 = y1 + bounds.height;
        for (let i = 1; i < nodes.length; i++) {
          node = nodes[i];
          bounds = node.bounds;
          if (bounds.x < x1) {
            x1 = bounds.x;
          }
          if (bounds.y < y1) {
            y1 = bounds.y;
          }
          if (bounds.x + bounds.width > x2) {
            x2 = bounds.x + bounds.width;
          }
          if (bounds.y + bounds.height > y2) {
            y2 = bounds.y + bounds.height;
          }
        }
        x = x1 - 20;
        y = y1 - 40;
        width = x2 - x1 + 30;
        height = y2 - y1 + 50;
      } else if (databounds) {
        x = databounds.x;
        y = databounds.y;
        width = databounds.width;
        height = databounds.height;
      }
      if (this.dragstart1) {
        if (dragx1 < x + width - 70) {
          width = x - dragx1 + width;
          x = dragx1;
        } else {
          x = x + width - 70;
          width = 70;
        }
        if (dragy1 < y + height - 40) {
          height = y - dragy1 + height;
          y = dragy1;
        } else {
          y = y + height - 40;
          height = 40;
        }
      }
      if (this.dragstart2) {
        if (dragx2 > x + 70) {
          width = dragx2 - x;
        } else {
          width = 70;
        }
        if (dragy2 > y + 40) {
          height = dragy2 - y;
        } else {
          height = 40;
        }
      }
      return { x, y, width, height };
    }
  },
  methods: {
    drawRectShape() {
      let ctx = this.$ctx,
        bounds = this.bounds;
      ctx.beginPath();
      ctx.roundRect(5, 5, bounds.width, bounds.height, 4);
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = 'rgba(233, 233, 233, .4)';
      ctx.fill();
    },
    drawText() {
      let ctx = this.$ctx,
        data = this.data;
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = data.status === 'notExecute' ? '#909399' : '#182932';
      ctx.fillText(data.name, 20, 19);
    },
    drawHoverShape() {
      let ctx = this.$ctx,
        bounds = this.bounds;
      ctx.beginPath();
      ctx.roundRect(1, 1, bounds.width + 8, bounds.height + 8, 4);
      ctx.strokeStyle = 'rgba(0, 144, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
    },
    drawSelectedShape() {
      let ctx = this.$ctx,
        bounds = this.bounds;
      ctx.beginPath();
      ctx.roundRect(1, 1, bounds.width + 8, bounds.height + 8, 4);
      ctx.strokeStyle = 'rgba(24, 41, 50, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
    },
    handleDragstart1() {
      if (this.readonly) return;
      this.dragstart1 = true;
    },
    handleDrag1(e) {
      if (this.readonly) return;
      this.dragx1 = e.x;
      this.dragy1 = e.y;
    },
    handleDragend1() {
      if (this.readonly) return;
      this.addToGroup();
      this.dragstart1 = false;
    },
    handleDragstart2() {
      if (this.readonly) return;
      this.dragstart2 = true;
    },
    handleDrag2(e) {
      if (this.readonly) return;
      this.dragx2 = e.x;
      this.dragy2 = e.y;
    },
    handleDragend2() {
      if (this.readonly) return;
      this.addToGroup();
      this.dragstart2 = false;
    },
    addToGroup() {
      let x1 = this.bounds.x,
        y1 = this.bounds.y,
        x2 = this.bounds.x + this.bounds.width,
        y2 = this.bounds.y + this.bounds.height;
      this.flowContent.nodes.forEach(node => {
        let nodeId = node.nodeId,
          nodeType = node.nodeType;
        if (!['apiService', 'logicCode'].includes(nodeType)) {
          return;
        }
        if (this.includeNode(node, x1, y1, x2, y2)) {
          if (this.canInGroup(node)) {
            this.data.nodeIds.push(nodeId);
          }
        } else {
          let index = this.data.nodeIds.indexOf(nodeId);
          if (index !== -1) {
            this.data.nodeIds.splice(index, 1);
          }
        }
        delete node.willToGroup;
      });
    },
    includeNode(data, x1, y1, x2, y2) {
      if (x1 > x2) {
        let temp = x1;
        x1 = x2;
        x2 = temp;
      }
      if (y1 > y2) {
        let temp = y1;
        y1 = y2;
        y2 = temp;
      }
      if (
        x1 <= data.bounds.x &&
        x2 >= data.bounds.x + data.bounds.width &&
        y1 <= data.bounds.y &&
        y2 >= data.bounds.y + data.bounds.height
      ) {
        return true;
      }
    },
    isInGroup(nodeId) {
      for (let i = 0, group; i < this.flowContent.groups.length; i++) {
        group = this.flowContent.groups[i];
        if (group.nodeIds.includes(nodeId)) {
          return true;
        }
      }
      return false;
    },
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
    },
    listToMap(list, key, value) {
      let map = {};
      for (let i = 0, item; i < list.length; i++) {
        item = list[i];
        map[key(item)] = value(item);
      }
      return map;
    }
  }
});
