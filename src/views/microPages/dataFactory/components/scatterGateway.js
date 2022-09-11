/**
 * 分散节点
 */
import Uae from 'uaeengine';
import nodeMixin from './nodeMixin';

Uae.component('scatterGateway', {
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
      this.cratePath();
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
      ctx.fillText('分 散', 39, 16);
    },
    cratePath() {
      let ctx = this.$ctx;
      let bounds = this.data.bounds;
      let x = -2,
        y = -2,
        w = bounds.width + 4,
        h = bounds.height + 4;
      ctx.beginPath();
      ctx.lineJoin = 'round';
      ctx.moveTo(x, y);
      ctx.lineTo(x + w, y + 0);
      ctx.lineTo(x + w, y + h / 2 + 3);
      ctx.lineTo(x + w / 2, y + h);
      ctx.lineTo(x, y + h / 2 + 3);
      ctx.closePath();
    }
  }
});
