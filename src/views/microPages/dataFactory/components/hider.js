/**
 * 锚点
 */
 import Uae from 'uaeengine';
 import { isPointInCircle } from 'uaeengine/src/utils';
 
 Uae.component('hider', {
    props:['expand','hide'],
   config: {
     x() {
       let data = this.$parent.data;
       return parseInt(data.bounds.width - 6 );
     },
     y() {
       let data = this.$parent.data;
       return parseInt(0 - 6);
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
    if(this.hide) return;
    let ctx = this.$ctx;
    ctx.beginPath();
    // ctx.arc(5, 5, 3, 0, 2 * Math.PI);
    ctx.strokeStyle = '#21d0ca'
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.fillStyle = '#21d0ca';

    if(this.expand){
        ctx.fillRect(2,4,7,3);
    }else{
        ctx.fillRect(2,4,6,2);
        ctx.fillRect(4,2,2,6);
    }
    ctx.fill();
   
   }
 });
 