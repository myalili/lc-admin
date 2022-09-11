/**
 * 锚点
 */
 import Uae from 'uaeengine';
 Uae.component('dcustom', {
    config: {
        x: um => um.data.bounds.x,
        y: um => um.data.bounds.y,
        zIndex: um => um.zIndex,
        offsetX: 5,
        offsetY: 5,
        overflow: 'visible',
        offscreen: true
    },
   props:['data'],
   template:'<danchor />',
   data() {
     return {
        isHover: false,
        isSelected: false,
        isNode: true,
        zIndex: 0
     }
   },

   draw() {
    let ctx = this.$ctx;
    ctx.beginPath();
     
    ctx.lineWidth = 2;
    ctx.fillStyle = 'white';
    if(this.isHover || this.isSelected){
      ctx.fillStyle = '#e2f5ff'
      ctx.strokeStyle = '#73b9ff'
      ctx.strokeRect(0,0,this.data.bounds.width,this.data.bounds.height)
    }
    ctx.fillRect(0,0,this.data.bounds.width,this.data.bounds.height)
    ctx.strokeStyle = 'black'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = '16px arial'
    ctx.fillStyle = 'black';
    let text = this.data.nodeName||'分组汇总'
    ctx.fillText(text, this.data.bounds.width/2, this.data.bounds.height/2);
   },
   methods:{
    isIncluded(x1, y1, x2, y2) {
        if (x1 > x2) {
          let temp = x1;
          x1 = x2;
          x2 = temp;
        }
        if (y1 > y2) {
          let temp = y1;
          y1 = y2;
          y2 = temp;
        }
        let bounds = this.data.bounds;
        if (x1 <= bounds.x && x2 >= bounds.x + bounds.width && y1 <= bounds.y && y2 >= bounds.y + bounds.height) {
          return true;
        }
        return false;
      },
      getLeft() {
        return this.data.bounds.x + this.$offsetX;
      },
      getCenter() {
        let bounds = this.data.bounds;
        return parseInt((2 * bounds.x + bounds.width) / 2) + this.$offsetX;
      },
      getRight() {
        let bounds = this.data.bounds;
        return bounds.x + bounds.width + this.$offsetX;
      },
      getTop() {
        return this.data.bounds.y + this.$offsetY;
      },
      getMiddle() {
        let bounds = this.data.bounds;
        return parseInt((2 * bounds.y + bounds.height) / 2) + this.$offsetY;
      },
      getBottom() {
        let bounds = this.data.bounds;
        return bounds.y + bounds.height + this.$offsetY;
      }
   }
 });
 