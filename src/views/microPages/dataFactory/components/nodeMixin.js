/**
 * 节点的mixin
 */
export default {
  props: ['data','hide','expand','image'],
  data() {
    return {
      isHover: false,
      isSelected: false,
      isNode: true,
      zIndex: 0
    };
  },
  config: {
      x: um => um.data.bounds.x,
      y: um => um.data.bounds.y,
      width: um => um.data.bounds.width + 10,
      height: um => um.data.bounds.height + 10,
      zIndex: um => um.zIndex,
      offsetX: 5,
      offsetY: 5,
      overflow: 'visible',
      offscreen: true
  },
  draw() {
    if(this.hide) return ;
    console.log(this.isSelected);
    this.drawShape();
    if (this.isHover) {
      this.drawHoverShape();
    }
    if (this.isSelected) {
      this.drawSelectedShape();
    }
  },
  methods: {
    drawHoverShape() {
      const ctx = this.$ctx;
      const bounds = this.data.bounds;
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(0, 144, 255, 0.5)';
      ctx.roundRect(-4, -4, bounds.width + 8, bounds.height + 8, 2);
      ctx.stroke();
    },
    drawSelectedShape() {
      const ctx = this.$ctx;
      const bounds = this.data.bounds;
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(24, 41, 50, 0.5)';
      ctx.roundRect(-4, -4, bounds.width + 8, bounds.height + 8, 2);
      ctx.stroke();
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
  },
  watch: {
    'data.output'() {
      this.$emit('outputChange', this.data);
    }
  }
};
