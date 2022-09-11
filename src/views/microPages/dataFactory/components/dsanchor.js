/**
 * 锚点
 */
 import Uae from 'uaeengine';
 import { isPointInCircle } from 'uaeengine/src/utils';
 
 Uae.component('dsanchor', {
   props: ['show', 'output', 'index'],
   config: {
     x() {
       let data = this.$parent.data;
       return parseInt(-6);
     },
     y() {
       let data = this.$parent.data;
       return parseInt(data.bounds.height / 2 - 6);
     },
     width: 12,
     height: 12,
     offscreen: false
   },
   data() {
     return {
       isHover: false,
     }
   },
   isHere(cx, cy) {
     this.isHover = isPointInCircle(cx, cy, 6, 6, 6)
     return this.isHover;
   },
   draw() {
     let ctx = this.$ctx;
     ctx.beginPath();
     ctx.arc(6, 6, 4, 0, 2 * Math.PI);
     ctx.lineWidth = 2;
     ctx.fillStyle = 'white';
     ctx.fill();
     ctx.strokeStyle = '#ccc'
     ctx.stroke();
   }
 });
 