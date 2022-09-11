<template>
  <div class="flex dcom">
    <div class="border-right container" >
      <div   class="flex-between">
        <div>输入源</div>
        <div class="tab" @click="$emit('showDialog')">更改输入源</div>
      </div>
      <p style="padding: 5px 0;">
          <i class="el-icon-info"></i> <span v-if="table">{{ selectNode.bindTable.name }}</span>
      </p>  
      <div>
        <p>已选字段</p>
        <div class="x-list-pane" v-if="table">
          <div class="x-list-item" :key="i" v-for="(item,i) in table.schema"><i class="el-icon-info"></i> {{item.label}}</div>
        </div>
      </div>
    </div>
    <d-table style="height:100%;overflow-y:scroll;" v-if="table" :table="table" />
  </div>
</template>

<script>
import dTable from "../dTable.vue";

export default {
  components: { dTable },
  props: ["table", "showDialog","selectNode"],
  created(){
      console.log(this.selectNode,'ccc');
  }
}; 
</script>

<style scoped lang="scss">
.x-list-item {
  padding: 0 4px;
  display: block;
  height: 26px;
  line-height: 26px;
  cursor: default;
  color: #1f2d3d;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dcom {
  width: 100%;
  height: 100%;
  color: #1f2d3d;
  overflow: hidden;
  .tab {
    color: var(--color-primary);
    cursor: pointer;
  }
  .container {
    width: 400px;
    padding: 9px;
    height:95%;
    overflow-y:scroll;
    .x-list-pane{
      padding-bottom: 50px;
    }
  }
}
</style>