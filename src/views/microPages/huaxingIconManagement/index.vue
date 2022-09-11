<template>
  <codelessIconSelectCtn :showOperation = "true" headerTitle="图标管理" class="codeless-icon-management"></codelessIconSelectCtn>
</template>
<script>
export default {
  data() {
    return {};
  },
  components:{
      
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>
<style lang="less" scoped>
.codeless-icon-management{
  height:100%;
  ::v-deep .right-tool-ctn{
      .icon-guanbi-danchuang{
        display:none
      }
    }
    ::v-deep .codeless-custom-dialog-body-ctn{
      height:calc(100% - 62px);
      .codeless-icon-select-ctn{
        height: 100%;
        .h-400px{
          height:100%
        }
        .icon-content{
          height:168px;
          width:156px;
          margin-right: 6px;
          margin-bottom:6px;
          background-color:#ffffff;
          &:hover{
            background-color:#E3F2FC;
          }
        }
      }
    }
  ::v-deep .codeless-custom-dialog-footer-ctn{
    display:none
  }

  
  

}
</style>