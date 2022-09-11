<template>
  <div class="list">
    <div class="list-item" v-for="item in dataOptions" :key="item[label]">
      <div class="item-content">
        <h4 class="item-title notice-title">{{ item[label] }}</h4>
        <p class="item-time">{{ item.time || '' }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import pck from "./package.json";
const { listMixin } = window.codelessMixins;
export default {
  _options: pck.docs,
  name: 'v2AList',
  mixins: [listMixin],
  props: {
    label: {
      type: String,
      default: ()=>{
        return 'title';
      }
    },
  },
  data() {
    return {
      dataOptions: [],
      pck
    }
  },
  methods: {
    aa() {
      console.log(this.dataOptions,this.entityId,this.label);
    }
  },
}
</script>

<style lang="less" scoped>
.list {
    width: 100%;
    height: calc(100% - 60px);
    overflow-y: scroll;
    box-sizing: border-box;
    padding: 0 16px;
    &::-webkit-scrollbar {
      display:none;
    }
    .list-item {
      width: 100%;
      height: 72px;
      padding: 12px 0;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #e8e8e8;
      .item-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
        h4, p{
          margin-bottom: 0;
        }
        p {
          margin-top: 5px;
          color: #A4AEB4;
        }
      }
      &:nth-last-child(1) {
        border-bottom: 0;
      }
    }
    .notice-title {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      cursor: pointer;
      &:hover {
        color: var(--color-primary);
      }
    }
  }
</style>