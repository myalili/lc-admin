/**
 * 框选
 */
import Uae from 'uaeengine';

Uae.component('selRect', {
  props: ['data'],
  computed: {
    bounds() {
      return {
        x: this.data.x1 < this.data.x2 ? this.data.x1 : this.data.x2,
        y: this.data.y1 < this.data.y2 ? this.data.y1 : this.data.y2,
        width: Math.abs(this.data.x2 - this.data.x1),
        height: Math.abs(this.data.y2 - this.data.y1)
      };
    }
  },
  config: {
    x: um => um.bounds.x,
    y: um => um.bounds.y,
    width: um => um.bounds.width,
    height: um => um.bounds.height,
    zIndex: 99,
    offscreen: false
  },
  isHere() {
    return false;
  },
  draw() {
    if (this.bounds.width !== 0 || this.bounds.height !== 0) {
      this.$ctx.beginPath();
      this.$ctx.rect(0, 0, this.bounds.width, this.bounds.height);
      this.$ctx.fillStyle = 'rgba(100, 100, 100, .1)';
      this.$ctx.fill();
      this.$ctx.lineWidth = 0.5;
      this.$ctx.strokeStyle = 'rgba(100, 100, 100, .2)';
      this.$ctx.stroke();
    }
  }
});
