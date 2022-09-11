<template>
  <div class="string_input" v-if="isShow">
    {{ item.desp }}
    <el-select v-model="obj.model[item.name]" style="width: 180px;" size="mini">
      <el-option  
        v-for="i in list" 
        :value="i.value"
        :label="i.label"
        :key="i.value" 
        >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { require } from './mixins'
export default {
  mixins: [ require ],
  props: {
    obj: {
      type: Object,
      default: ()=> {
        return {};
      }
    },
    item: {
      type: Object,
      default: ()=> {
        return {};
      }
    }
  },
  data() {
    return {
      list: []
    }
  },
  computed: {

  },
  created() {
    msgHub.$on('entityChange', (e)=> {
      if (e.type === 'db' || e.type === 'data_source') {
        this.list = e.fields.map(i=> {
          return {
            label: i.dictionaryItem.name,
            value: i.dictionaryItem.engNameShort
          }
        })
        console.log( this.list);
      }else if (e.type === 'data_factory_sql') {
        this.list = JSON.parse(e.dataFactoryJson).selectItems.map(i=> {
          return {
            label: i.desc,
            value: i.name
          }
        })
        console.log( this.list);
      }
      
    });
  },
  methods: {
    change(e) {
      console.log(this.obj);
    }
  }
}
</script>

<style lang="less" scoped>
.string_input {
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  line-height: 27px;
  color: #333333;
}
</style>