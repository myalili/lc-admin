const {queryLongProcess,addLongProcess,queryLpDefinition} = window.getAopsApi()
  
export default{
    
    methods:{
      
         // 新增长流程
        async addLongProcess() {
            
            let name = "";
            const ctx = this;
            let $el = ctx.$refs[ctx.dialogInfo.component];
           
            const longProcess = await this.aopsChoreRequest(
                addLongProcess({
                    id: name + window.pipe.getRandomNum(5),
                    name: $el.form.title,
                    description: $el.form.title,
                    catalogId:$el.form.scene ? $el.form.scene : ctx.AParams.pId,
                }),
                '新增流程'
            );
            if (longProcess) {
                
                ctx.dialogInfo.visible = false;
                ctx.refresh();
                ctx.openPage({
                    title:longProcess.name,
                    id:longProcess.id,
                    codelessType:ctx.dialogInfo.currentType.codelessType,
                  });
            }
           
        },
        async getProcessList(){
            let list = await this.aopsChoreRequest(
                queryLongProcess(),
                '查询流程'
            );            
            return list.content
        },
        async publishProcess(longProcess) {
            let ctx = this;
            if (!longProcess.content) {
              this.$message({ message: '请完善流程后再部署', type: 'warning' });
              return;
            }
            let res = await window.aopsStore.dispatch('longProcess/publish',{clusterId:'aops-afoe',id:longProcess.id,catalogId:longProcess.parentId});
            if(res){
                this.$message.success('发布成功')
            }
            if(res){
                ctx.refresh();
            }
        },
        async getProcessData(){
            let processData = [];
            let ctx = this;
            switch(ctx.status){
              case 'unPublished':
                processData = await this.getProcessList();
                
                break;
      
              case 'published':
                const queryParams = {
                    start: 0,
                    size: 10000,
                    latest:true,
                  };
                const {trimQueryParams,getInvokeResponse} = window.aopsUtils;
                trimQueryParams(queryParams);
                let res = await getInvokeResponse(queryLpDefinition(queryParams), '查询流程管理列表');
                processData = res.data;
                processData = processData.map(item=>{
                    let {key,id} = item;
                    item.key = id;
                    item.id = key;
                    return item
                })
                break
            }

            console.log(processData);
            return processData
          },


    }
}