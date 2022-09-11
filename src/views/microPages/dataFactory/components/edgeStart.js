/**
 * 连线开始
 */
import Uae from 'uaeengine';

Uae.component('edgeStart', {
  props: ['x', 'y'],
  config: {
    x: um => um.x - 7,
    y: um => um.y,
    width: 14,
    height: 10
  },
  isHere(cx, cy) {
    return cx >= 0 && cx <= this.$width && cy >= 0 && cy <= this.$height;
  }
});
