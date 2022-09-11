/**
 * 结束节点
 */
import Uae from 'uaeengine';
import nodeMixin from './nodeMixin';

Uae.component('normalEnd', {
  mixins: [nodeMixin],
  created() {
    this.data.bounds.width = 46;
    this.data.bounds.height = 46;
  },
  methods: {
    drawShape() {
      let ctx = this.$ctx,
        data = this.data,
        bounds = data.bounds;
      ctx.roundRect(0, 0, bounds.width, bounds.height, 23);
      ctx.strokeStyle = data.status === 'notExecute' ? '#C0C4CC' : '#6cc5ff';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = data.status === 'notExecute' ? '#F5F7FA' : '#e8f6ff';
      ctx.fill();
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = data.status === 'notExecute' ? '#909399' : '#182932';
      ctx.fillText('结束', 24, 24);
    }
  }
});
