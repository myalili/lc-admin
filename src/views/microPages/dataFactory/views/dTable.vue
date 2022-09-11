<template>
  <div style="width: 100%">
    <el-table size="mini" :data="list" stripe border style="width: 100%;padding-bottom:50px">
      <el-table-column
        v-for="(item, i) in listHeader"
        :key="i"
        :prop="item.value"
        :label="item.label"
      >
      </el-table-column>
    </el-table>
 
    <!-- <div style="display:flex;width:100%;">
          <div class="border cell" style="width:100%" v-for="(item,i) in listHeader" :key="i">
              {{item.label}} 
          </div>
      </div>
       <div style="display:flex;width:100%;" v-for="(item,i) in list" :key="i">
          <div class="border cell" style="width:100%" v-for="(value,i) in item" :key="i">
              {{value}} 
          </div>
      </div> -->
  </div>
</template>
    
<script>
export default {
  props: ["table"],
  mounted() {
    console.log(this.listHeader);
    console.log(this.list);
  },
  computed: {
    listHeader() {
      return this.table.schema;
    },
    list() {
      let data = [];

      this.table.data.forEach((item) => {
        let obj = {};
        this.listHeader.forEach((head) => {
          obj[head.value] = item[head.value];
        });
        data.push(obj);
      });
      return data;
    },
  },
};
</script>

<style scoped lang="scss">
.border {
  border: 1px solid #e2e2e2;
}
.cell {
  padding: 8px;
  position: relative;
  vertical-align: middle;
  white-space: nowrap;
  color: #6e85a1;
}
.spacer{
    height:50px
}
</style>