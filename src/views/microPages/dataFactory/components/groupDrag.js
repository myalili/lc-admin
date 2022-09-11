/**
 * 分组控制点
 */
import Uae from 'uaeengine';

Uae.component('groupDrag', {
  props: ['x', 'y'],
  config: {
    x: um => um.x,
    y: um => um.y,
    width: 10,
    height: 10
  },
  isHere(cx, cy) {
    return cx >= 0 && cx <= this.$width && cy >= 0 && cy <= this.$height;
  }
});
