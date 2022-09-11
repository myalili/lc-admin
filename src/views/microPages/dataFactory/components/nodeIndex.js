/**
 * 节点下标
 */
import Uae from 'uaeengine';

Uae.component('nodeIndex', {
  props: ['index', 'x', 'y'],
  config: {
    x: um => um.x,
    y: um => um.y,
    width: 20,
    height: 14
  },
  isHere() {
    return false;
  },
  draw() {
    const ctx = this.$ctx;
    ctx.font = '13px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#182932';
    ctx.fillText(this.index, 0, 0);
  }
});
