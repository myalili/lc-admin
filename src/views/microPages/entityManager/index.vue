<template>
  <div class="entity-manager">
    
    <div class="entity-manager-aside">
      <entity-list ref="entityList" @showEntityDetail="showEntityDetail"></entity-list>
    </div>

    <div class="entity-manager-content">
      <entity-content :entity="JSON.parse(JSON.stringify(entity))" :mode="mode" @reset="reset" @showEntityDetail="showEntityDetail"></entity-content>
    </div>
  </div>
</template>

<script>
import entityList from "./components/entityList"
import entityContent from "./components/entityContent"
export default {
  components: {
    entityList,
    entityContent
  },
  data(){
    return{
      entity:{},
      mode:"view",
      indexId:"",
    }
  },
  mounted() {
    // console.log(this.projectId);
  },
  methods:{
    reset(id){
      this.$refs.entityList.resetIndex(id?id:this.indexId,id?"create":"update")
    },
    showEntityDetail(item,indexId,mode){
      this.entity=JSON.parse(JSON.stringify(item));
      this.mode=mode
      this.indexId=indexId
    }
  }
}
</script>

<style lang="scss" scoped>
@import './styles/containerBase.scss';
.entity-manager {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
  &-aside {
    min-width: 300px;
    max-width: 300px;
    height: 100%;
    border-right: 1px solid #E7ECEF;
    background-color: white;
    
  }
  &-content {
    background-color: white;
    @extend #container-base;
  }
}
</style>