  //学生信息
export const studentData = {
    name:'学生信息',
    id:'student_table',
    schema:[
        {
            label:'姓名',
            value:'name',
            type:'string'
        },
        {
            label:'id',
            value:'id',
            type:'string'
            
        },
        {
            label:'班级',
            value:'class',
            type:'string'
        },
        {
            label:'分数',
            value:'score',
            type:'string'
        }
    ],
    data:[
        {id:1,name:'sam',class:'24',score:99},
        {id:2,name:'hyc1',class:'24',score:56},
        {id:3,name:'lazy1',class:'23',score:99},
        {id:4,name:'lazy2',class:'23',score:20},
    ]
}
//人基本信息
export const peopleData = {
    name:'人基本信息',
    id:'man_table',
    schema:[
        {
            label:'姓名',
            value:'name',
            type:'string'
        },
        {
            label:'id',
            value:'id',
            type:'string'
        },
        {
            label:'性别',
            value:'sex',
            type:'string'
        },
        {
            label:'年龄',
            value:'age',
            type:'string'
        }
    ],
    data:[
        {id:1,name:'sam',sex:'男',age:2},
        {id:2,name:'hyc1',sex:'男',age:10},
        {id:3,name:'lazy1',sex:'女',age:20},
        {id:4,name:'lazy2',sex:'女',age:30},
    ]
}
//顾客消费信息
export const consumerData = {
    name:'顾客消费数据',
    id:'consumer_table',
    schema:[
        {
            label:'姓名',
            value:'name',
            type:'string'
        },
        {
            label:'id',
            value:'id',
            type:'string'
        },
        {
            label:'消费金额',
            value:'pay',
            type:'number'
        },
        {
            label:'商品',
            value:'item',
            type:'string'
        },
        {
            label:'时间',
            value:'paytime',
            type:'time'
        }
    ],
    data:[
        {id:1,name:'sam',pay:100,item:'iphone'},
        {id:2,name:'hyc1',pay:10000,item:'jeans'},
        {id:3,name:'lazy1',pay:999,item:'rings'},
        {id:4,name:'lazy2',pay:877,item:'cake'},
    ]
}
