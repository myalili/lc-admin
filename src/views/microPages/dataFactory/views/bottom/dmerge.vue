<template>
    <div style="height:100%">
        <div v-if="tables.length > 1" class="body">
            <div :style="{width:180*mergeTableSchema.length + 'px'}">
                <section class="merge-list">
                    <div class="merge-cell" style="flex-shrink:0">
                        合并结果
                    </div>
                    <!-- <div class="merge-cell"  v-for="(item,i) in mergeTableSchema" :key="i">
                        {{item.label}}
                    </div> -->
                    <draggable  @change="log"  :style="{width:182   *(mergeTableSchema.length - 1) + 'px'}" class="flex" v-model="mergeTableSchema">
    
                        <div class="merge-cell can_mover"  v-for="(item,i) in mergeTableSchema" :key="i">
                            <div v-if="item.isShowMsg">
                                <el-tooltip tip class="item" effect="dark" :content="item.originLabel" placement="top">
                                    <div>
                                        <i class="el-icon-tickets"></i>
                                        <span class="ml-5">{{ item.label }}</span>
                                    </div>
                                </el-tooltip>
                                <i class="el-icon-edit pointer" @click="changeLabel(item, i, false)"></i>
                            </div>
                            <el-input v-model="changeText" ref="inputlabel" @blur="changeLabel(item, i, true)" v-else></el-input>
                        </div>
                    </draggable>
                </section>
        
                <section :key="ii" class="merge-list" v-for="(table,ii) in tables">
                    <div class="merge-cell">
                        {{table.name}}
                        <select-field v-model="table.schema" @isChange="selectSchemas">
                            <i class="el-icon-circle-plus"></i>
                        </select-field>

                    </div>
                    <div class="merge-cell gray" :class="{'col-cell':item}" v-for="(item,i) in conTables[ii]" :key="i">
                        {{ item ? item.label : '' }}

                        <i class="el-icon-close show-close" v-if="item" @click="delField(item, ii)"></i>
                    </div>
                </section>
            </div>
        </div>

        <div v-else class="flex flex-center error-text" style="height: 100%">
            请将2-10个已配置好的节点接连至本节点
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import selectField from './components/common/selectField.vue'
export default {
    props:['selectNode'],
     components: {
        draggable,
        selectField
    },
    computed:{
        tables(){
            return this.selectNode.tables||[]
        }
    },
    watch:{
        'tables.length'(){
            this.init()
        }
    },
    methods:{
        changeLabel(item, i, state){
            item.isShowMsg = state;
            if(state){
                this.changeText && (item.label = this.changeText);
                this.changeText = "";
            }else{
                this.changeText = item.label;
                this.$nextTick(() => {
                // 输入框聚焦
                setTimeout(() => {
                    let input = this.$refs.inputlabel[0];
                    input.focus();
                }, 100)
                })
            }
        },
        delField(item, ii){
            let option = this.tables[ii].schema.find(data => data.value === item.value);
            this.$set(option, "isCheck", false);
            this.selectSchemas();
        },
        log(e){
            console.log(e);
           const  {moved} =  e ;
           let i = moved.newIndex;
           let j = moved.oldIndex;
           this.conTables.forEach(table=>{
               let old = JSON.parse(JSON.stringify(table[j])) 
               table.splice(j,1);
               console.log(old);
               table.splice(i,0,old)
           })
           //this.conTables = JSON.parse(JSON.stringify(this.conTables))

            console.log(this.mergeTableSchema);
            // this.selectSchemas();
            this.setBindSet()
        },
        setBindSet(){
            let name = ''
            this.tables.forEach(table=>name+= (table.name + '-'))
            const bindTable = {
                name:name,
                schema:this.mergeTableSchema
            }
            this.selectNode.setBindTable(bindTable)
        },
        selectSchemas(){
            let schema = []
            this.tables.forEach(table=>{
                table.schema.forEach(data => {
                    if(!data.hasOwnProperty("isCheck")){
                    data.isCheck = true
                    }
                    if(!data.hasOwnProperty("originLabel")){
                        data.originLabel = data.label
                    }
                 })
                let showSchema = table.schema.filter(data => data.isCheck)
                schema = [...schema,...showSchema]
            })
            schema.forEach(item => {
                if(!item.hasOwnProperty("isShowMsg")){
                    item.isShowMsg = true;
                }
            })
            this.mergeTableSchema = JSON.parse(JSON.stringify(schema))

            let conTables = [];
            let index = 0;
            for(let i = 0 ; i < this.tables.length ; i++){
                let table = [];
                table.length = this.mergeTableSchema.length;
                table.fill(null)
                for(let j = 0 ; j < this.tables[i].schema.length ; j++){
                    if(this.tables[i].schema[j].isCheck){
                        table[index] = JSON.parse(JSON.stringify(this.tables[i].schema[j]))
                        index++;
                    }
                }
                conTables.push(table)
            }
            this.conTables = conTables;
            this.setBindSet();
        },
        init(){
            this.selectSchemas();
            // this.setBindSet()
        }
    },
    created(){
        this.init()
        //
    },
    data(){
        return {
            list:[1,2,3,4,5],
            conTables:[],
            mergeTableSchema:[

            ],
            changeText: ""
        }
    }
}
</script>


<style lang="scss" scoped>
    .body{
        height: 89%;
        width: 100%;
        overflow-x:auto;
    }

    .merge-list{
        display: flex;
        margin: 8px 0 ;
        .gray{
            background: #F4F6F9;
        }
        .col-cell{
            background-color: var(--color-primary-light-8);
        }
        .merge-cell{
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            min-width: 160px;
            max-width: 160px; 
            height: 50px;
            border: 1px solid #D9D9D9;
            text-align: center;
            font-size: 12px;
            line-height: 50px;
            flex: 1;
            i{
                color: var(--color-primary);
            }
            .el-icon-circle-plus{
                position: absolute;
                right: 10px;
                top: 16px;
                font-size: 20px;
                // color: var(--color-primary);
                cursor: pointer;
            }

            .el-icon-edit{
                display: none;
                font-size: 14px;
                position: absolute;
                right: 10px;
                top: 20px;
            }

            &.can_mover{
                cursor: move;
            }
            
            &:hover{
                .show-close{
                    display: inline-block !important;
                    position: absolute;
                    cursor: pointer;
                    right: 10px;
                    top: 16px;
                    font-size: 20px;
                    // color: var(--color-primary);
                }

                .el-icon-edit{
                    display: block;
                    // color: var(--color-primary);
                }
            }
            .show-close{
                display: none;
            }
        }
    }
</style>>