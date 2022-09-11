/**
 * 连线结束
 */
import Uae from 'uaeengine';

Uae.component('edgeEnd', {
  props: ['x', 'y'],
  config: {
    x: um => um.x - 7,
    y: um => um.y - 14,
    width: 14,
    height: 14
  },
  isHere(cx, cy) {
    return cx >= 0 && cx <= this.$width && cy >= 0 && cy <= this.$height;
  }
});
