/**
 * 人工节点
 */
import Uae from 'uaeengine';
import nodeMixin from './nodeMixin';
import { measureWidth } from '../utils';

Uae.component('artificial', {
  mixins: [nodeMixin],
  template: '<anchor v-for="(item, index) in data.output" :output="item" :index="index"/><nodeIndex :index="data.nodeIndex" :x="-24" :y="10"/>',
  created() {
    this.data.bounds.width = measureWidth(this.$root.$ctx, this.data.nodeName);
    this.data.bounds.height = 36;
  },
  watch: {
    'data.nodeName'() {
      this.data.bounds.width = measureWidth(this.$root.$ctx, this.data.nodeName);
    }
  },
  methods: {
    drawShape() {
      const ctx = this.$ctx;
      const data = this.data;
      // 多边形
      this.createPath1();
      ctx.lineWidth = 4;
      ctx.strokeStyle = data.status === 'notExecute' ? '#C0C4CC' : '#606d74';
      ctx.stroke();
      ctx.fillStyle = data.status === 'notExecute' ? '#F5F7FA' : 'white';
      ctx.fill();

      // 节点图标
      this.createPath2();
      ctx.fillStyle = data.status === 'notExecute' ? '#C0C4CC' : '#606d74';
      ctx.fill();
      ctx.font = '14px iconfont';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white';
      ctx.fillText(eval('("\\ue748")'), 17, 18);

      // 节点文本
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = data.status === 'notExecute' ? '#909399' : '#182932';
      ctx.fillText(data.nodeName, 53, 19);
    },
    createPath1() {
      let ctx = this.$ctx;
      let bounds = this.data.bounds;
      let x = 0,
        y = 0,
        w = bounds.width,
        h = bounds.height;
      // 八边形边长 = 36 / (Math.sqrt(2) + 1)
      // 距离 = 边长 / Math.sqrt(2) = 36 / (2 + Math.sqrt(2))
      let temp2 = 36 / (2 + Math.sqrt(2));
      ctx.beginPath();
      ctx.lineJoin = 'round';
      ctx.moveTo(x + temp2, y);
      ctx.lineTo(x + w - temp2, y);
      ctx.lineTo(x + w, y + temp2);
      ctx.lineTo(x + w, y + h - temp2);
      ctx.lineTo(x + w - temp2, y + h);
      ctx.lineTo(x + temp2, y + h);
      ctx.lineTo(x, y + h - temp2);
      ctx.lineTo(x, y + temp2);
      ctx.closePath();
    },
    createPath2() {
      let ctx = this.$ctx;
      let bounds = this.data.bounds;
      let temp1 = 36 / (Math.sqrt(2) + 1),
        temp2 = 36 / (2 + Math.sqrt(2)),
        x = -2,
        y = -2,
        w = 2 * temp2 + temp1 + 2,
        h = bounds.height + 4;
      ctx.beginPath();
      ctx.lineJoin = 'round';
      ctx.moveTo(x + temp2, y);
      ctx.lineTo(x + w - temp2, y);
      ctx.lineTo(x + w, y + temp2);
      ctx.lineTo(x + w, y + h - temp2);
      ctx.lineTo(x + w - temp2, y + h);
      ctx.lineTo(x + temp2, y + h);
      ctx.lineTo(x, y + h - temp2);
      ctx.lineTo(x, y + temp2);
      ctx.closePath();
    }
  }
});
