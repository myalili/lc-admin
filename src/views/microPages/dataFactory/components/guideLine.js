/**
 * 基准线
 */
import Uae from 'uaeengine';

Uae.component('guideLine', {
  props: ['data'],
  config: {
    zIndex: -1,
    offscreen: false
  },
  isHere() {
    return false;
  },
  draw() {
    let xs = (this.data || {}).x || [],
      xsm = {};
    xs.forEach(x => {
      if (!xsm[x]) {
        this._drawVerticalLine(x);
        xsm[x] = true;
      }
    });
    let ys = (this.data || {}).y || [],
      ysm = {};
    ys.forEach(y => {
      if (!ysm[y]) {
        this._drawHorizontalLine(y);
        ysm[y] = true;
      }
    });
  },
  methods: {
    _drawVerticalLine(x) {
      let ctx = this.$ctx;
      ctx.beginPath();
      ctx.moveTo(x, 0 - this.$root.$offsetY);
      ctx.lineTo(x, this.$root.$canvas.height - this.$root.$offsetY);
      ctx.strokeStyle = 'rgba(0, 144, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
    },
    _drawHorizontalLine(y) {
      let ctx = this.$ctx;
      ctx.beginPath();
      ctx.moveTo(0 - this.$root.$offsetX, y);
      ctx.lineTo(this.$root.$canvas.width - this.$root.$offsetX, y);
      ctx.strokeStyle = 'rgba(0, 144, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
});
