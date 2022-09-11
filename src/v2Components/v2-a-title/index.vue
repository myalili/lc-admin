<template>
  <div class="v2-a-title">
    <div class="mode1" v-if="titleMode === '1'">
      <span :style="{'font-size': titleStyle.fontSize}">{{ titleStyle.length }}</span>
      <component :is="titleType" :style="{ 'color': color }">
        {{ title }}
      </component>
      <span :style="{'font-size': titleStyle.fontSize}" >{{ titleStyle.length }}</span>
    </div>
    <div class="mode2" v-if="titleMode === '2'">
      <codeless-icon :icon="icon" v-if="dialogType === 'icon'" :style="{ 'width': titleStyle.iconSize, 'height': titleStyle.iconSize}"></codeless-icon>
      <img :src="pic" v-if="dialogType === 'picture'" alt="" :style="{ 'width': titleStyle.iconSize, 'height': titleStyle.iconSize}">
      <component :is="titleType" :style="{ 'color': color }">
        {{ title }}
      </component>
    </div>
  </div>
</template>

<script>
// import '../../fonts/icon/iconfont.css'
// import '../../fonts/icon/iconfont.js'
import pck from "./package.json";
export default {
  _options: pck.docs,
  name: 'v2ATitle',
  props: {
    titleType: {
      type: String,
      default: ()=> {
        return 'h1'
      }
    },
    title: {
      type: String,
      default: ()=> {
        return ''
      }
    },
    titleMode: {
      type: String,
      default: ()=> {
        return '2'
      }
    },
     pic: {
      type: String,
      default: ()=> {
        return ''
      }
    },
    icon: {
      type: String,
      default: ()=> {
        return ''
      }
    },
    dialogType: {
      type: String,
      default: ()=> {
        return 'icon'
      }
    },
    color: {
      type: String,
      default: ()=> {
        return '#000000'
      }
    }

  },
  computed: {
    titleStyle() {
      const styleMap = new Map([
        [ 'h1', { fontSize:'20px', length: '————', iconSize: '34px' } ],
        [ 'h2', { fontSize:'17px', length: '———', iconSize: '24px' } ],
        [ 'h3', { fontSize:'14px', length: '——', iconSize: '14px' } ]
      ])
      return styleMap.get(this.titleType);
    }
  },
  mounted() {
  },
}
</script>

<style lang="less" scoped>
.v2-a-title {
  .mode1 {
    display: flex;
    align-items: center;
  }
  .mode2 {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
}
h1, h2, h3, h4, h5, h6 {
  margin: 0 10px;
  font-weight: bold;
}
h1 {
  font-size: 2em;
}
h2 {
  font-size: 1.5em;
}
h3 {
  font-size: 1em;
}
</style>