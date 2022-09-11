/**
 * 聚合节点
 */
import Uae from 'uaeengine';
import nodeMixin from './nodeMixin';

Uae.component('gatherGateway', {
  mixins: [nodeMixin],
  template: '<anchor v-for="(item, index) in data.output" :output="item" :index="index"/><nodeIndex :index="data.nodeIndex" :x="-24" :y="10"/>',
  created() {
    this.data.bounds.width = 110;
    this.data.bounds.height = 34;
  },
  methods: {
    drawShape() {
      const ctx = this.$ctx;
      const data = this.data;
      // 节点图标
      this.createPath();
      ctx.fillStyle = data.status === 'notExecute' ? '#F5F7FA' : '#e8f6ff';
      ctx.fill();
      ctx.strokeStyle = data.status === 'notExecute' ? '#C0C4CC' : '#6cc5ff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 节点文本
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = data.status === 'notExecute' ? '#909399' : '#182932';
      ctx.fillText('聚 合', 39, 22);
    },
    createPath() {
      const ctx = this.$ctx;
      const bounds = this.data.bounds;
      let x = -2,
        y = -2,
        w = bounds.width + 4,
        h = bounds.height + 4;
      ctx.beginPath();
      ctx.lineJoin = 'round';
      ctx.moveTo(x + w / 2, y);
      ctx.lineTo(x + w, y + h / 2 - 5);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.lineTo(x, y + h / 2 - 5);
      ctx.closePath();
    }
  }
});
