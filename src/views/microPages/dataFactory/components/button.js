/**
 * 按钮
 */
import Uae from 'uaeengine';

Uae.component('button', {
  config: {
    x: um => um.$parent.data.bounds.width - 30,
    y: 8,
    width: 20,
    height: 20
  },
  draw() {
    let ctx = this.$ctx;
    ctx.beginPath();
    ctx.roundRect(2, 2, 16, 16, 2);
    ctx.lineWidth = 2;
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = this.$parent.data.status === 'notExecute' ? '#C0C4CC' : '#888';
    ctx.stroke();
    ctx.font = '24px Arial';
    ctx.fillStyle = this.$parent.data.status === 'notExecute' ? '#C0C4CC' : '#888';
    if (this.$parent.isSpread) {
      ctx.fillText('-', 6, 16);
    } else {
      ctx.fillText('+', 3, 18);
    }
  }
});
