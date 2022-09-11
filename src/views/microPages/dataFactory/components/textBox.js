/**
 * 字体盒子
 */
 import Uae from 'uaeengine';
 
 Uae.component('textBox', {
  props: ['textBox'],
  data() {
    return {
      isHover: false,
      isSelected: false,
      zIndex: 0
    };
  },
  methods: {
  
  },
  draw() {
    let ctx = this.$ctx,
        data = this.$parent.data,
        bounds = data.bounds,
        textBox = this.textBox;

    ctx.beginPath()
    ctx.rect(textBox.x, textBox.y, textBox.width, textBox.height);
    ctx.strokeStyle = '#8BCCF2';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.font = `${textBox.fontSize} Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle ='#66B6F3';
    ctx.fillText(data.nodeName, bounds.width / 2, textBox.y + textBox.height / 2 + 2);
    ctx.closePath()
    ctx.beginPath();
    /*获取文本的宽度*/
    if (this.isHover) {
      ctx.strokeStyle = '#8BCCF2';
      ctx.lineWidth = 1;
      const textWidth = ctx.measureText(data.nodeName).width;
      const textUnderLineStart =  {
        x: bounds.width / 2 - textWidth / 2,
        y: textBox.y + textBox.height / 2 + parseInt(textBox.fontSize) / 2
      }
  
      ctx.moveTo(textUnderLineStart.x ,textUnderLineStart.y);
      ctx.lineTo(textUnderLineStart.x + textWidth,textUnderLineStart.y);
      ctx.stroke();
    }

  }
 });
 