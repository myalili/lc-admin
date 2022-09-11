<template>
    <div class="mengnnuser-class"  v-loading="loading">
    <div class="mengnnuser-class-seachbox">
        <i class="icon iconfont icon-sousuo1"></i>
        <input placeholder="搜素关键字" @input="seachboxfun"/>
    </div>
    <el-table
        :data="tableuer"
        style="width: 100%"
        height="500px"
        size="medium"
        header-cell-class-name="user-content-table-header-cell-class-name"
        cell-class-name="user-content-table-cell-class-name"
        @select="selectallfun"
        @select-all="selectallfun"
        ref="eltabledata"
    >
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="name" label="用户名" width="180">
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="phone" label="手机号"> </el-table-column>
        <el-table-column prop="desc" label="描述"> </el-table-column>
    </el-table>
    <pagination
        v-if="paginationreload"
        style="margin-top:16px;"
        class="user-content-pagination"
        @current-change="handleCurrentChange"
        :total="total"
        :currentPage="page"
        :pageSizes="[10, 20, 30, 40, 50, 100]"
        :pageSize="size"
        @size-change="handleSizeChange"
        >
    </pagination>
    </div>
</template>
<script>
const {
  requestUser,
} = window.getAacApi();
export default {
    data(){
        return {
            alluser:[],
            tableuer:[],
            filteruser:[],
            paginationreload: false,
            total:10,
            size:10,
            page:1,
            loading:true

        }
    },
    props:{
        departmentuser:[],
    },
    mounted(){
        requestUser({}).then((res)=>{
            if(!!res.success){
                let arrkey = this.departmentuser.map(v => v.id);
                res.content.forEach((v) =>{
                    if(arrkey.includes(v.id)){
                        v.check =  true;
                    }else{
                        v.check = false;
                    }
                })
                this.alluser =  res.content;
                this.filteruser = JSON.parse(JSON.stringify(this.alluser));
                this.tableuer = this.filteruser.slice((this.page-1)*this.size,this.page*this.size);
                this.total =  this.filteruser.length;
                this.page = 1;
                this.size = 10;
                this.$nextTick(()=>{
                    this.loading = false;
                    this.paginationreload = true;
                    this.showchecked();
                });  
            }else{
                this.loading = false;
                this.paginationreload = true; 
            }
        });
    },
    methods:{
        handleCurrentChange(page){
            this.page = page;
            this.tableuer = this.filteruser.slice((this.page-1)*this.size,this.page*this.size); 
            this.$nextTick(()=>{
                this.showchecked();
            })
        },
        handleSizeChange(size){
          this.page = 1;
          this.size = size;
          this.tableuer = JSON.parse(JSON.stringify(this.filteruser.slice((this.page-1)*this.size,this.page*this.size)));  
            this.$nextTick(()=>{
                this.showchecked();
            })
        },
        seachboxfun(event){
            this.paginationreload = false;
            let key = event.target.value;
            this.filteruser =  JSON.parse(JSON.stringify(this.alluser.filter((v) =>{
                if(!!v.name && !!v.id){
                   return v.name.includes(key) || v.id.includes(key);
                }else{
                   return false;
                }
            })))
            this.tableuer = JSON.parse(JSON.stringify(this.filteruser.slice((this.page-1)*this.size,this.page*this.size)));
            this.total =  this.filteruser.length;
            this.page = 1;
            this.size = 10;
            this.$nextTick(()=>{
                this.showchecked();
                this.paginationreload = true;
            })

        },
        // 回显选中效果
        showchecked(){
            this.tableuer.forEach((v)=>{ 
                if(!!v.check){
                    this.$refs.eltabledata.toggleRowSelection(v,v.check)      
                }
            })
        },
        
       async selectallfun(flag){
           let flagarr = flag.map(v => v.id);
           let flagarr_1 =  this.tableuer.filter(v => !flagarr.includes(v.id)).map(v => v.id);
            flagarr.forEach(v =>{
                let indexf =  this.filteruser.findIndex(val => val.id == v);
                this.filteruser[indexf].check = true;
                let indexa =  this.alluser.findIndex(val => val.id == v);
                this.alluser[indexa].check = true;
            })
            flagarr_1.forEach(v =>{
                let indexf =  this.filteruser.findIndex(val => val.id == v);
                this.filteruser[indexf].check = false;
                let indexa =  this.alluser.findIndex(val => val.id == v);
                this.alluser[indexa].check = false;
            })
        }
    }
}

</script>
<style lang="scss" scoped>
.mengnnuser-class {
    width: 100%;
    height: 542px;
    position: relative;
    
    .mengnnuser-class-seachbox {
        width: 200px;
        height: 28px;
        border: 1px solid var(--codeless-border-color-gray);
        opacity: 1;
        border-radius: 222px;
        position: fixed;
        top:7px;
        right:60px;
        z-index: 999;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        
        .icon-sousuo1 {
            font-size: 14px;
            color:var( --color-gray);
            margin-left:10px;
        }
        
        input {
            width: 150px;
            margin-left:6px;
            outline: none;
            height: 100%;
            
            &::placeholder{
                font-size: 12px;
                font-weight: 400;
                color: #C0C4CC;
            }
        }

    }
}
</style>