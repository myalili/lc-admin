<template>
    <div class="mengnnuser-class">
        <div class="mengnnuser-class-seachbox">
          <i class="el-icon-search"></i>
          <input placeholder="搜素关键字" @input="seachboxfun"/>
        </div>
           <el-table ref="rolesTable" :reserve-selection="true" :data="showtable"
                    header-cell-class-name="user-content-table-header-cell-class-name"
                    cell-class-name="user-content-table-cell-class-name"
                    @select="roleSelectorsChange"
                    @select-all="roleSelectorsChange"
                   style="width: 100%"
                    height="542px"
                   >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID"  ></el-table-column>
            <el-table-column prop="name" label="角色" ></el-table-column>
            <el-table-column prop="desc" label="说明" ></el-table-column>
          </el-table>
    </div>
</template>
<script>
export default {
    props:{
        roleOptions:[],
        roleIds:[],
    },
    computed:{
      roleSelectors(){
        return this.allroleOptions.filter(v => !!v.checked);
      }
    },
    data(){
        return{
          eachboxfunkey:null,
          showtable:[],
          allroleOptions:[],
        }
    },
    mounted(){
      this.allroleOptions = this.roleOptions.map((v) =>{
        if(this.roleIds.includes(v.id)){
          v.checked =  true;
        }else{
          v.checked =  false;
        }
        return v;
      });
      this.showtable = JSON.parse(JSON.stringify(this.allroleOptions));
      this.$nextTick(()=>{
        this.showchecked();
      });
    },
    methods:{
      seachboxfun(event){
        clearTimeout(this.seachboxfunkey);
        this.seachboxfunkey = setTimeout(()=>{
          let value = event.target.value;
          let filter  =  this.allroleOptions.filter(v =>{
            if(!!v.name){
              return v.name.includes(value) || v.id.includes(value);
            }else{
              return false;
            }
          });
          this.showtable = JSON.parse(JSON.stringify(filter));
          this.$nextTick(()=>{
            this.showchecked();
          });
        },200)
      },
      roleSelectorsChange(data) {
        let dataid =  data.map(v => v.id);
        let flagarr_1 =  this.showtable.filter(v => !dataid.includes(v.id)).map(v => v.id);
        dataid.forEach(id =>{
          let i =  this.allroleOptions.findIndex(v => v.id == id);
          this.allroleOptions[i].checked = true;
          let ind =  this.showtable.findIndex(v => v.id == id);
          this.showtable[ind].checked = true;
        })
        flagarr_1.forEach(id =>{
          let i =  this.allroleOptions.findIndex(v => v.id == id);
          this.allroleOptions[i].checked = false;
          let ind =  this.showtable.findIndex(v => v.id == id);
          this.showtable[ind].checked = false;
        })
      },
      showchecked(){
        this.showtable.forEach((v)=>{ 
          if(!!v.checked){
            this.$refs.rolesTable.toggleRowSelection(v,v.checked);      
          }
        })
      },
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
        
        .el-icon-search {
            font-size: 14px;
            color:var( --color-gray);
            margin-left:12px;
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