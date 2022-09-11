/**
 * 脚本节点
 */
import Uae from 'uaeengine';
import nodeMixin from './nodeMixin';
import { measureWidth } from '../utils';

Uae.component('script', {
  mixins: [nodeMixin],
  template: '<anchor v-for="(item, index) in data.output" :output="item" :index="index"/><nodeIndex :index="data.nodeIndex" :x="-24" :y="10"/>',
  created() {
    this.data.bounds.width = measureWidth(this.$root.$ctx, this.data.nodeName);
    this.data.bounds.height = 36;
  },
  watch: {
    'data.nodeName'() {
      this.data.bounds.width = measureWidth(this.$root.$ctx, this.data.nodeName);
    }
  },
  methods: {
    drawShape() {
      const ctx = this.$ctx;
      const data = this.data;
      const bounds = data.bounds;
      // 长方形
      ctx.roundRect(0, 0, bounds.width, bounds.height, 18);
      ctx.lineWidth = 4;
      ctx.strokeStyle = data.status === 'notExecute' ? '#C0C4CC' : '#6cc5ff';
      ctx.stroke();
      ctx.fillStyle = data.status === 'notExecute' ? '#F5F7FA' : 'white';
      ctx.fill();

      // 节点图标
      ctx.roundRect(0, 0, 36, 36, 18);
      ctx.stroke();
      ctx.fillStyle = data.status === 'notExecute' ? '#EBEEF5' : '#d6efff';
      ctx.fill();
      if (data.scriptVersion) {
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = data.status === 'notExecute' ? '#909399' : '#457ce2';
        ctx.fillText(data.scriptVersion.type.toLowerCase().substring(0, 4), 18, 25);
        ctx.font = '12px iconfont';
        ctx.fillText(eval('("\\ue7b4")'), 18, 12);
      }

      // 风险等级图标
      if (data.scriptVersion && data.scriptVersion) {
        ctx.font = '16px iconfont';
        if (data.scriptVersion.level == 1) {
          ctx.fillStyle = '#8ad1ff';
        } else if (data.scriptVersion.level == 2) {
          ctx.fillStyle = '#0090ff';
        } else if (data.scriptVersion.level == 3) {
          ctx.fillStyle = '#0756e7';
        } else if (data.scriptVersion.level == 4) {
          ctx.fillStyle = '#ff6b23';
        } else if (data.scriptVersion.level == 5) {
          ctx.fillStyle = '#f12626';
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0)';
        }
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeText(eval('("\\ue7b6")'), 5, 5);
        ctx.fillText(eval('("\\ue7b6")'), 5, 5);
      }

      // 有可更新图标
      if (data.newVersions) {
        ctx.font = '16px iconfont';
        ctx.fillStyle = '#f12626';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeText(eval('("\\ue703")'), bounds.width - 5, 10);
        ctx.fillText(eval('("\\ue703")'), bounds.width - 5, 10);
      }
      // 资源丢失图标
      if (data.resourceLose) {
        ctx.font = 'bold 20px element-icons';
        ctx.fillStyle = '#f12626';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.textAlign = 'right';
        ctx.strokeText(eval('("\\ue6db")'), bounds.width, 10);
        ctx.fillText(eval('("\\ue6db")'), bounds.width, 10);
      }

      // 已配置执行服务器信息图标
      if (data.servers && data.servers.length > 0) {
        ctx.font = 'bold 20px element-icons';
        ctx.fillStyle = '#67c23a';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.textAlign = 'right';
        ctx.strokeText(eval('("\\ue74a")'), bounds.width, bounds.height - 5);
        ctx.fillText(eval('("\\ue74a")'), bounds.width, bounds.height - 5);
      }

      // 节点文本
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = data.status === 'notExecute' ? '#909399' : '#182932';
      ctx.fillText(data.nodeName, 53, 19);
    }
  }
});
