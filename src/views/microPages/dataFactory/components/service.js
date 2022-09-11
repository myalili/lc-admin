/**
 * 子流程节点
 */
import Uae from 'uaeengine';
import nodeMixin from './nodeMixin';
import { measureWidth } from '../utils';

Uae.component('service', {
  mixins: [nodeMixin],
  template: `<anchor v-for="(item, index) in data.output" :output="item" :index="index"/>
    <button v-if="data.spreadable" @click="handleSpread"/>
    <group v-if="isSpread" v-for="item in flowContent.groups" :id="item.groupId" :data="item" :flowContent="flowContent" :readonly="readonly"></group>
    <edge v-if="isSpread" v-for="item in flowContent.edges" :id="item.edgesId" :data="item" :nodes="flowContent.nodes"></edge>
    <component v-if="isSpread" v-for="item in flowContent.nodes" :id="item.nodeId" :is="item.nodeType" :data="item" :groups="flowContent.groups" @outputChange="outputChange"></component>`,
  data() {
    return {
      isHover: false,
      isSelected: false,
      isSpread: false,
      flowContent: {
        groups: [],
        nodes: [],
        edges: []
      }
    };
  },
  beforeMount() {
    // 计算长度
    this.data.bounds.width = measureWidth(this.$root.$ctx, this.data.nodeName);
    this.data.bounds.height = 36;
    // 子节点
    this.oriw = this.data.bounds.width;
    this.orih = this.data.bounds.height;
    if (!this.data.flowContent) {
      return;
    }
    const flowContent = this.data.flowContent;
    const childBounds = this.childFlowBounds(flowContent.nodes);
    if (flowContent.nodes) {
      flowContent.nodes.forEach(item => {
        item.bounds.x -= childBounds.x - 100;
        item.bounds.y -= childBounds.y - 30;
        this.flowContent.nodes.push(item);
      });
    }
    if (flowContent.edges) {
      flowContent.edges.forEach(item => this.flowContent.edges.push(item));
    }
    if (flowContent.groups) {
      flowContent.groups.forEach(item => this.flowContent.groups.push(item));
    }
  },
  watch: {
    'data.nodeName'() {
      this.data.bounds.width = measureWidth(this.$root.$ctx, this.data.nodeName);
    }
  },
  beforeDestroy() {
    this.isSpread && this.handleSpread();
  },
  methods: {
    drawShape() {
      const ctx = this.$ctx;
      const data = this.data;
      const bounds = data.bounds;
      // 长方形
      ctx.roundRect(0, 0, bounds.width, bounds.height, 4);
      ctx.lineWidth = 4;
      ctx.strokeStyle = data.status === 'notExecute' ? '#C0C4CC' : '#457ce2';
      ctx.stroke();
      ctx.fillStyle = data.status === 'notExecute' ? '#F5F7FA' : 'white';
      ctx.fill();
      // 节点图标
      ctx.fillStyle = data.status === 'notExecute' ? '#C0C4CC' : '#457ce2';
      ctx.fillRect(0, 0, 36, bounds.height);
      ctx.font = '14px iconfont';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white';
      ctx.fillText(eval('("\\ue73b")'), 17, 18);

      // 节点文本
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = data.status === 'notExecute' ? '#909399' : '#182932';
      ctx.fillText(data.nodeName, 53, 19);
    },
    handleSpread() {
      if (this.isSpread && this.$children) {
        this.$children.forEach(child => {
          if (child.$tag === 'service' && child.isSpread) {
            child.handleSpread();
          }
        });
      }
      this.isSpread = !this.isSpread;
      this.update();
    },
    childFlowBounds(nodes) {
      let min1 = nodes[0].bounds.x;
      let max1 = nodes[0].bounds.x + nodes[0].bounds.width;
      let min2 = nodes[0].bounds.y;
      let max2 = nodes[0].bounds.y + nodes[0].bounds.height;
      nodes.forEach(item => {
        if (item.bounds.x < min1) {
          min1 = item.bounds.x;
        }
        if (item.bounds.x + item.bounds.width > max1) {
          max1 = item.bounds.x + item.bounds.width;
        }
        if (item.bounds.y < min2) {
          min2 = item.bounds.y;
        }
        if (item.bounds.y + item.bounds.height > max2) {
          max2 = item.bounds.y + item.bounds.height;
        }
      });
      let width = max1 - min1;
      let height = max2 - min2;
      return {
        x: min1,
        y: min2,
        width,
        height
      };
    },
    update() {
      let neww, newh;
      if (this.isSpread) {
        let childBounds = this.childFlowBounds(this.flowContent.nodes);
        neww = childBounds.width + this.oriw;
        newh = childBounds.height + this.orih;
      } else {
        neww = this.oriw;
        newh = this.orih;
      }
      let dw = neww - this.data.bounds.width;
      let dh = newh - this.data.bounds.height;

      let children = this.$parent ? this.$parent.$children : this.$root.$children;
      this.data.bounds.width += dw;
      this.data.bounds.height += dh;
      children.forEach(item => {
        if (item.data && item.data.bounds) {
          if (item.data.bounds.y > this.data.bounds.y) {
            item.data.bounds.y += dh;
          }
        }
      });
      if (this.$parent && this.$parent.$tag === 'service') {
        this.$parent.update();
      }
    }
  }
});
