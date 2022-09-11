/**
 * 连线
 */
 import Uae from 'uaeengine';
//  import { isPointInPath, isPointInRoundRect } from 'uaeengine/src/utils';
//  function LightenDarkenColor(col, amt) {
   
//    var usePound = false;
    
//    if (col[0] == "#") {
//    col = col.slice(1);
//    usePound = true;
//    }
    
//    var num = parseInt(col,16);
    
//    var r = (num >> 16) + amt;
    
//    if (r > 255) r = 255;
//    else if (r < 0) r = 0;
    
//    var b = ((num >> 8) & 0x00FF) + amt;
    
//    if (b > 255) b = 255;
//    else if (b < 0) b = 0;
    
//    var g = (num & 0x0000FF) + amt;
    
//    if (g > 255) g = 255;
//    else if (g < 0) g = 0;
    
//    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
    
//   }
 Uae.component('edge', {
   template: `<ctrlLine v-for="item in ctrlLines" :data="item" @dragstart="dragstart" @drag="drag"/>
    `,
   props: ['data', 'nodes','starLink','mouseDown','hide','isDelete'],
   data() {
     return {
       isSelected: false,
       isHover: false,
       zIndex: 0,
       paddingV: 4,
       paddingH: 12
     };
   },
   config: {
     x: um => 0,
     y: um => 0,
    //  width: um => um.bounds.width,
    //  height: um => um.bounds.height,
     zIndex: um => um.zIndex,
     solid: false,
     offsetX: 5,
     offscreen: false
   },
   computed: {
 
     start() {
       const nodes = this.nodes;
       const length = nodes.length;
       const nodeId = this.data.sNode;
       for (let i = 0, node; i < length; i++) {
         node = nodes[i];
         if (node.nodeId === nodeId) {
           return node;
         }
       }
     },
     startBounds() {
       return (this.start || {}).bounds;
     },
     startAnchorIndex() {
       const output = (this.start || {}).output || [];
       const anchorIndex = output.findIndex(item => item.id === this.data.output.id);
       return anchorIndex;
     },
     startPoint() {
       const sBounds = this.startBounds;
       if (sBounds) {
         const x = sBounds.x +  sBounds.width / 2;
         const y = sBounds.y + sBounds.height / 2 + 2;
         return {
           x,
           y
         };
       } else {
         return {
           ...this.data.sPoint
         };
       }
     },
     end() {
       const nodes = this.nodes;
       const length = nodes.length;
       const nodeId = this.data.eNode;
       for (let i = 0, node; i < length; i++) {
         node = nodes[i];
         if (node.nodeId === nodeId) {
           return node;
         }
       }
     },
     endBounds() {
       return (this.end || {}).bounds;
     },
     endPoint() {
       const eBounds = this.endBounds;
       if (eBounds) {
         const x = eBounds.x +  eBounds.width / 2;
         const y = eBounds.y + eBounds.height / 2 + 4;
         return {
           x,
           y
         };
       } else {
         return {
           ...this.data.ePoint
         };
       }
     },
     originPath() {
       if (this.end) {
         return this.getToNodePath();
       } else {
         return this.getToPointPath();
       }
     },
     path() {
       return this.originPath.map(item => ({
         x: item.x ,
         y: item.y 
       }));
     },
     originTextBounds() {
       let x, y;
       if (this.originPath.length === 2) {
         x = this.originPath[0].x;
         y = (this.originPath[0].y + this.originPath[1].y) / 2;
       } else if (this.originPath.length === 4) {
         x = (this.originPath[1].x + this.originPath[2].x) / 2;
         y = this.originPath[1].y;
       } else if (this.originPath.length === 6) {
         x = this.originPath[2].x;
         y = (this.originPath[2].y + this.originPath[3].y) / 2;
       } else {
         x = (this.originPath[0].x + this.originPath[this.originPath.length - 1].x) / 2;
         y = (this.originPath[0].y + this.originPath[this.originPath.length - 1].y) / 2;
       }
       const ctx = this.$root.$ctx;
       ctx.save();
       ctx.font = '12px Arial';
       const width = ctx.measureText(this.data?.output?.name || '').width;
       const height = 12;
       ctx.restore();
       x = x - width / 2;
       y = y - height / 2;
       return {
         x,
         y,
         width,
         height
       };
     },
     bounds() {
       let minX = this.originTextBounds.x;
       let minY = this.originTextBounds.y;
       let maxX = this.originTextBounds.x + this.originTextBounds.width;
       let maxY = this.originTextBounds.y + this.originTextBounds.height;
       this.originPath.forEach(item => {
         if (item.x < minX) {
           minX = item.x;
         }
         if (item.x > maxX) {
           maxX = item.x;
         }
         if (item.y < minY) {
           minY = item.y;
         }
         if (item.y > maxY) {
           maxY = item.y;
         }
       });
       return {
         x: minX ,
         y: minY - 5,
         width: maxX - minX + 10,
         height: maxY - minY + 10
       };
     },
     ctrlLines() {
       const ctrlLines = [];
       const pathLength = this.path.length;
       this.path.forEach((item, index) => {
         if (index > 0 && index < pathLength - 2) {
           const nextItem = this.path[index + 1];
           ctrlLines.push({
             index,
             x1: item.x,
             y1: item.y,
             x2: nextItem.x,
             y2: nextItem.y
           });
         }
       });
       return ctrlLines;
     }
   },
   draw() {
     this.drawShape();
   },
  //  isHere(cx, cy) {
  //    const data = this.data;
  //    let x, y;
  
  //    x= (this.path[0].x + this.path[1].x) / 2,
  //    y= (this.path[0].y + this.path[1].y) / 2
  //    const textWidth = data?.output?.name?.length * 12
  //    const textHeight = 12;
  //    const paddingV = this.paddingV;
  //    const paddingH = this.paddingH;
     
  //    return isPointInRoundRect(
  //      cx,
  //      cy,
  //      x - textWidth / 2 - paddingH,
  //      y - textHeight / 2 - paddingV,
  //      textWidth + paddingH * 2,
  //      textHeight + paddingV * 2,
  //      3) ||
  //     isPointInPath(cx, cy, this.path, 4);
  //  },
   methods: {
     drawShape() {
       let ctx = this.$ctx,
         data = this.data;
       // 绘制连线
       this.createLinePath();
       ctx.lineWidth = 2;
       ctx.strokeStyle =  '#4a8bfd'
       ctx.stroke(); 
       this.drawText();
       // 绘制箭头
      // this.createArrowPath();
    //    ctx.fillStyle = data.status === 'notExecute' ? '#C0C4CC' : data?.output?.color;
    //    ctx.fillStyle = LightenDarkenColor(ctx.fillStyle,40)
    //    if(this.isDelete){
    //      ctx.fillStyle = 'red'
    //    }
    //    ctx.fill();
     },
     drawText() {
       const ctx = this.$ctx;
       const data = this.data;
 
       let x, y;
  
       x= (this.path[0].x + this.path[1].x) / 2,
       y= (this.path[0].y + this.path[1].y) / 2
 
       const paddingV = this.paddingV;
       const paddingH = this.paddingH;
 
       // 绘制文本背景
       if (data?.output?.name) {
         const textWidth = ctx.measureText(data.output.name).width;
         const textHeight = 12;
 
         ctx.roundRect(
           x - textWidth / 2 - paddingH,
           y - textHeight / 2 - paddingV,
           textWidth + paddingH * 2,
           textHeight + paddingV * 2,
           3);
         ctx.fillStyle = '#1FD0CA';
         ctx.fill()
 
         // 绘画文本
         ctx.font = '12px Arial';
         ctx.strokeStyle = 'white';
         ctx.fillStyle = 'white';
         ctx.textAlign = 'center';
         ctx.textBaseline = 'middle';
 
         // ctx.strokeText(data.output.name, x, y);
         ctx.fillText(data.output.name, x, y);
       }
     },
     drawSelectedShape() {
       // 绘画选中效果图形
       const ctx = this.$ctx;
       ctx.globalAlpha = 1
       const data = this.data;
       this.createLinePath();
       ctx.lineWidth = 8;
       ctx.strokeStyle = 'rgba(138, 209, 255, 0.3)';
       ctx.stroke();
       ctx.lineWidth = 2;
       ctx.strokeStyle =  '#4a8bfd'
       ctx.stroke();
     },
     createLinePath() {
       // 创建连线路径
       let ctx = this.$ctx,
         path = this.path;
       if (!path || path.length < 2) {
         return;
       }
       let start = path[0];
       let end = path[1]
       ctx.beginPath();
       ctx.moveTo(start.x, start.y);
       let minx = Math.min(start.x,end.x);
       let miny = Math.min(start.y,end.y);
       let deltax = Math.abs(end.x - start.x)/2;
       let deltay = Math.abs(end.y - start.y)/2;
       let middle = {x:minx + deltax,y:start.y}
       let middle2 =  {x:minx + deltax,y:end.y}
       ctx.lineTo(middle.x,middle.y)
       ctx.lineTo(middle2.x,middle2.y)
       ctx.lineTo(end.x,end.y)
     },
     createArrowPath() {
       // 根据方向生成箭头
       const direction = this.data?.output?.direction
       // 创建箭头路径
       let ctx = this.$ctx,
         path = this.path;
       if (!path || path < 2) {
         return;
       }
       // TODO:可以用 3 X 3矩阵运算
 
       // 起点终点位置
       let temp1 = path[path.length - 2],
         x1 = temp1.x,
         y1 = temp1.y,
         temp2 = path[path.length - 1],
         x2 = temp2.x,
         y2 = temp2.y;
       
 
       if (direction === 'up') {
         x1 = temp2.x
         y1 = temp2.y
         x2 = temp1.x
         y2 = temp1.y
       }
 
       let lan = 35; //箭头距离终点的距离
       let headlen = 10;//自定义箭头线的长度
       let width = 5; // 箭头宽度
 
       // 箭头尾部拐点
       let arrowEndX = 0
       let arrowEndY = 0
 
       // 箭头上半边拐点
       let arrowTopX = 0
       let arrowTopY = 0
 
       // 箭头下半边拐点
       let arrowBottomX = 0
       let arrowBottomY = 0
       // 垂直线
       if (x1 === x2) {
         const yVector = -Math.sign(y2 - y1)
         arrowEndX = x2
         arrowEndY = y2 + yVector * lan
 
         arrowTopX = x2 - width
         arrowTopY = arrowEndY + yVector * headlen
 
         arrowBottomX = x2 + width
         arrowBottomY = arrowEndY + yVector * headlen
 
          // 水平线
       } else if (y1 === y2) {
         const xVector = -Math.sign(x2 - x1)
         arrowEndX = x2 + xVector * lan
         arrowEndY = y2
 
         arrowTopX = arrowEndX + xVector *  headlen
         arrowTopY = y2 - width
 
         arrowBottomX = arrowEndX + xVector *  headlen
         arrowBottomY = y2 + width
 
       // 斜线
       } else {
       // 直线公式 y = ax + b a为斜率
       // y1 = a * x1 + b
       // y2 = a * x2 + b
 
       // b = y1 - (a * x1)
       // y2 = (a * x2) + y1 - (a * x1)
       // y2 = (a * x2) - (a * x1) + y1
       // y2 = a * (x2 - x1) + y1
       // a = (y2 - y1) / (x2 - x1)
 
       const a = (y2 - y1) / (x2 - x1)
       const b = y1 - (a * x1)
       const aRad = Math.atan(a) // 弧度
       const yVector = -Math.sign(y2 - y1)
 
       // 计算箭头在线上的起点
       const arrowStartX = x2 + yVector * Math.sign(a) * ((lan + headlen) * Math.cos(aRad))
       const arrowStartY = a * arrowStartX + b
 
       // 计算箭头在线上的终点
       arrowEndX = x2 + yVector *  Math.sign(a) * lan * Math.cos(aRad)
       arrowEndY = a * arrowEndX + b
 
       // 2直线为互相垂直 k1 * k2 = -1 带点求b 
       const va = -1 / a
       const vb = arrowStartY - va * arrowStartX 
       const vaRad = Math.atan(va) // 弧度
       // 箭头上半边
       arrowTopX = arrowStartX + width * Math.cos(vaRad)
       arrowTopY = va * arrowTopX + vb
 
       // 箭头下半边
       arrowBottomX = arrowStartX - width * Math.cos(vaRad)
       arrowBottomY = va * arrowBottomX + vb
       }
 
       ctx.beginPath();
 
       ctx.moveTo(arrowTopX, arrowTopY)
       ctx.lineTo(arrowBottomX, arrowBottomY)
       ctx.lineTo(arrowEndX, arrowEndY)
       ctx.lineTo(arrowTopX, arrowTopY)
     },
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
 
       let path = this.originPath;
       for (let i = 0, item; i < path.length; i++) {
         item = path[i];
         if (item.x < x1 || item.x > x2 || item.y < y1 || item.y > y2) {
           return false;
         }
       }
       return true;
     },
     getToNodePath() {
       const x2 = this.endPoint.x;
       const y2 = this.endPoint.y;
       const ctrl1 = this.data.ctrl.ctrl1;
       const ctrl2 = this.data.ctrl.ctrl2;
       const ctrl3 = this.data.ctrl.ctrl3;
       // 下方出
       const x1 = this.startPoint.x;
       const y1 = this.startPoint.y;
       let mx = (x1 + x2) / 2;
       let my = (y1 + y2) / 2;
 
       // 开始坐标
       const path = [{ x: x1, y: y1 }];
       // if (x1 == x2 && y2 > y1) {
       //   // 正下方
       // } else if (y2 > y1 + 26) {
       //   // 下右下
       //   if (ctrl1 && ctrl1 >= y1 + 13 && ctrl1 <= y2 - 13) {
       //     my = ctrl1;
       //   }
       //   path.push({ x: x1, y: my });
       //   path.push({ x: x2, y: my });
       // } else {
       //   // 下右上右下
       //   const sBounds = this.startBounds;
       //   const eBounds = this.endBounds;
       //   if (sBounds && eBounds) {
       //     const left1 = sBounds.x;
       //     const right1 = sBounds.x + sBounds.width;
       //     const left2 = eBounds.x;
       //     const right2 = eBounds.x + eBounds.width;
       //     if (left1 > right2) {
       //       mx = (left1 + right2) / 2;
       //     } else if (right1 < left2) {
       //       mx = (right1 + left2) / 2;
       //     } else if (mx > left1 && mx < right1) {
       //       if (Math.abs(x1 - left1) > Math.abs(x1 - right1) - 5) {
       //         mx = right1 + 10;
       //       } else {
       //         mx = left1 - 10;
       //       }
       //     }
       //   }
       //   let bottom = y1 + 13;
       //   if (ctrl1 && ctrl1 > bottom) {
       //     bottom = ctrl1;
       //   }
       //   path.push({ x: x1, y: bottom });
       //   if (ctrl2) {
       //     mx = ctrl2;
       //   }
       //   path.push({ x: mx, y: bottom });
       //   let top = y2 - 13;
       //   if (ctrl3 && ctrl3 < top) {
       //     top = ctrl3;
       //   }
       //   path.push({ x: mx, y: top });
       //   path.push({ x: x2, y: top });
       // }
       path.push({ x: x2, y: y2 });
       return path;
     },
     getToPointPath() {
       const x2 = this.endPoint.x;
       const y2 = this.endPoint.y;
       // 下方出
       const x1 = this.startPoint.x;
       const y1 = this.startPoint.y;
       const path = [{ x: x1, y: y1 }];
       // if (y2 < y1 + 15) {
       //   path.push({ x: x1, y: y1 + 15 });
       //   const sBounds = this.startBounds;
       //   if (sBounds && x2 < x1 + sBounds.width / 2 + 15 && x2 > sBounds.x + -15) {
       //     // 下右上左
       //     if (x2 > x1) {
       //       path.push({ x: x1 + sBounds.width / 2 + 15, y: y1 + 15 });
       //       path.push({ x: x1 + sBounds.width / 2 + 15, y: y2 });
       //     } else {
       //       path.push({ x: sBounds.x - 15, y: y1 + 15 });
       //       path.push({ x: sBounds.x - 15, y: y2 });
       //     }
       //   } else {
       //     // 下右上
       //     path.push({ x: x2, y: y1 + 15 });
       //   }
       // } else {
       //   // 下右
       //   path.push({ x: x1, y: y2 });
       // }
       path.push({ x: x2, y: y2 });
       return path;
     },
     dragstart(e) {
       if (this.$root.readonly) {
         return;
       }
       if (e.comp.data.x1 === e.comp.data.x2) {
         this.originCtrl = e.x;
       } else {
         this.originCtrl = e.y;
       }
     },
     drag(e) {
       if (this.$root.readonly) {
         return;
       }
       let newCtrl;
       const originCtrl = this.originCtrl;
       if (e.comp.data.x1 === e.comp.data.x2) {
         newCtrl = originCtrl + e.dx;
       } else {
         newCtrl = originCtrl + e.dy;
         const startY = this.originPath[0].y;
         const endY = this.originPath[this.originPath.length - 1].y;
         // 不能超过极限
         if (originCtrl > startY && newCtrl < startY + 13) {
           newCtrl = startY + 13;
         }
         if (originCtrl < endY && newCtrl > endY - 13) {
           newCtrl = endY - 13;
         }
       }
       this.data.ctrl[`ctrl${e.comp.data.index}`] = newCtrl;
     }
   }
 });
 