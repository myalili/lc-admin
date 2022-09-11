/**
 * 路径控制线
 */
import Uae from 'uaeengine';

Uae.component('ctrlLine', {
  props: ['data'],
  isHere(cx, cy) {
    return cx >= 0 && cx <= this.$width && cy >= 0 && cy <= this.$height;
  },
  computed: {
    bounds() {
      let x1, x2, y1, y2;
      if (this.data.x1 === this.data.x2) {
        x1 = this.data.x1 - 4;
        x2 = this.data.x1 + 4;
        y1 = this.data.y1 < this.data.y2 ? this.data.y1 : this.data.y2;
        y2 = this.data.y1 > this.data.y2 ? this.data.y1 : this.data.y2;
      } else {
        x1 = this.data.x1 < this.data.x2 ? this.data.x1 : this.data.x2;
        x2 = this.data.x1 > this.data.x2 ? this.data.x1 : this.data.x2;
        y1 = this.data.y1 - 4;
        y2 = this.data.y1 + 4;
      }
      return {
        x1,
        y1,
        x2,
        y2
      };
    }
  },
  config: {
    x: um => um.bounds.x1,
    y: um => um.bounds.y1,
    width: um => um.bounds.x2 - um.bounds.x1,
    height: um => um.bounds.y2 - um.bounds.y1
  }
});
