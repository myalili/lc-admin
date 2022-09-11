/**
 * 开始节点
 */
import Uae from 'uaeengine';
import nodeMixin from './nodeMixin';

Uae.component('start', {
  mixins: [nodeMixin],
  template: '<anchor v-for="(item, index) in data.output" :output="item" :index="index"></anchor>',
  created() {
    this.data.bounds.width = 46;
    this.data.bounds.height = 46;
  },
  methods: {
    drawShape() {
      let ctx = this.$ctx,
        data = this.data,
        bounds = data.bounds;
      // 矩形
      ctx.roundRect(0, 0, bounds.width, bounds.height, 23);
      ctx.strokeStyle = data.status === 'notExecute' ? '#C0C4CC' : '#6cc5ff';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = data.status === 'notExecute' ? '#F5F7FA' : '#e8f6ff';
      ctx.fill();
      // 文本
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = data.status === 'notExecute' ? '#909399' : '#182932';
      ctx.fillText('开始', 24, 24);
    }
  }
});
