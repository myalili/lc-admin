
export const generate = (obj)=>{
    let ret = {};
    if(Object.prototype.toString.call(obj) === '[object Object]'){
        let properties = {};
        Object.keys(obj).forEach((key)=>{
            properties[key] = {
                type:'field',
            }
        })
        ret= {
            data:{
                type:'array',
                items:[{
                    type:'object',
                    properties:properties
                }]
            }
        }
    }
        return JSON.stringify(ret)
    
    
}