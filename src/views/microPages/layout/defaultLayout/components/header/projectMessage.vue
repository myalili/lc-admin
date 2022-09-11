<template>
    <div  class="project" ref="project">
       <div v-if="tenantList.length>1">
           <div v-for="(item,index) in tenantList" :key="index" >
            <div class="projectItem" @click="chooseProject(item)">
                <div class="icon">
                    <codeless-icon icon="icon-xiangmuxinxi" style="width:25px;height:25px" ></codeless-icon>
                </div>
                <div style="flex:1">
                    <div class="title" style="height:30px;margin-top:5px">{{item.name}} </div>
                    <div class="desc" style="height:30px">{{item.desc}}</div>
                </div>
                <div class="current">
                     <span v-if="item.id==tenantId.tenantId">当前</span>
                </div>
                <div class="icon-right">
                   <span class="el-icon-arrow-right" style=""></span>
                </div>
                
               
            </div>
        </div>
       </div>
       <div v-else class="alongProj">
          <div >
              <div class="icon"><codeless-icon icon="icon-xiangmuxinxi" style="width:42px;height:42px"  ></codeless-icon></div>
              <div class="name">{{tenantList[0].name}}</div>
              <div class="desc">{{tenantList[0].desc}}</div>
          </div>
       </div>
    </div>
</template>
<script>
export default {
    mixins:[window.V8.mixins],
    props:{
        tenantList:[],
        tenantId:{}
    },
    data(){
        return{

        }
    },
    methods:{
        chooseProject(item){
            if(item.id==this.tenantId.tenantId){
              this.$root.close()
            }else{
              this.$root.confirm(item.id)  
            }
             
        }
    }
}
</script>
<style lang="less" scoped>
.project{
    // height:360px;
    padding:0 30px;
    margin-bottom:10px;
    .projectItem{
        display:flex;
        border-bottom:1px solid #E6EAED;
        height:75px;
        padding-left:30px;
.icon{
    width:40px;
    height:100%;
    display: flex;
    align-items: center
}
.current{
   align-items: center;
    display: flex;
    width:75px;
    span{
        width: 52px;
        height: 18px;
        line-height: 18px;
        text-align:center;
        font-size:12px;
        color:#fff;
        background: #97AEBA;
        opacity: 1;
        border-radius: 22px;
    }
}
.icon-right{
    width:40px;
    span{
      line-height:75px
    }
}
.title{
    color:#333333;
    font-size:14px;
    font-weight: bold;
}
.desc{
    color:#7F8C93;
    font-size:14px;
}
}
.projectItem:hover{
    background:#E3F2FC;
    cursor:pointer
    
}
.alongProj{
    width:100%;
    height: 300px;
    display: flex; 
    text-align: center;
    justify-content: center
    ;align-items: center;
    .icon{
        width:516px;
        display: flex;
        justify-content: center;
    }
    .name{
        width:100%;
        text-align:center;
        color:#333333;
        font-size:16px;
        font-weight: bold;
        margin-top:19px
    }
    .desc{
        color:#7F8C93;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        line-height: 24px;
        color: #7F8C93;
        opacity: 1;
    }
}
}
</style>