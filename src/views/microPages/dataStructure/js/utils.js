/** schemaToStructure  START*/
let keysNeed = ["type","valueType","properties","items"];

let dataCleaning = (data)=>{
    if(Object.prototype.toString.call(data)==="[object Object]"){
        Object.keys(data).forEach(key=>{
            if(!keysNeed.includes(key)){
              delete data[key];
            }
          })
    }
}

let getStructureType = (data)=>{
    let type = "string";
    switch(data.type){
        case "array":
        case "map":
        case "object":
            type = data.type
            break;

        case "field":
            if(data.valueType==="bool"){
                type="boolean"
            }
            break
    }
    return type;
}

let getArrayTypeChildren = (data)=>{
    if(!Array.isArray(data)){
        return []
    }
    
    // dataCleaning(data);
    
    let ret = data.map(item=>{
       
        let structure = getStructure(item);
        return {
            name:'',
            ...structure
        }
    })
    return ret;
}
let getObjectTypeChildren = (data)=>{
   
    let ret = [];
    if(Object.prototype.toString.call(data) === "[object Object]"){
       
        for(let key in data){

            let structure = getStructure(data[key]);
    
            ret.push({
                name:key,
                ...structure
            })
        } 
    }
    

    return ret 

}

let getStructure = (data)=>{
    dataCleaning(data);
    let type = getStructureType(data);
    let structure = {
        type
    };
    switch(type){
        case "array":
        case "map":
            structure.children = getArrayTypeChildren(data.items)
            break;

        case "object":
            structure.children = getObjectTypeChildren(data.properties)
            break

    }

    return structure
    
    
}
/** schemaToStructure  END*/



/** structureToSchema  START*/
let strutureToArray = (structure)=>{
   
  return structure.map(item=>{
        switch(item.type){
            case "array":
            case "map":
                return{
                    type:item.type,
                    items:Array.isArray(item.children)?strutureToArray(item.children):[]
                }
              
            
            case "object":
                return {
                    type:item.type,
                    properties:Array.isArray(item.children)?strutureToObj(item.children):{}
                }
                
            case "string":
                return {
                    type:"field"
                }
                
            case "boolean":
                return {
                    type:"field",
                    valueType:'bool'
                }
        }
  })
   
}
let strutureToObj = (structure)=>{
    let schema = {};
    structure.forEach(item=>{
            switch(item.type){
                case "array":
                case "map":
                    schema[item.name] = {
                        type:item.type,
                        items:Array.isArray(item.children)?strutureToArray(item.children):[]
                    }
                    break;
                
                case "object":
                    schema[item.name] = {
                        type:item.type,
                        properties:Array.isArray(item.children)?strutureToObj(item.children):{}
                    }
                    break; 
                    
                case "string":
                    schema[item.name] ={
                        type:"field"
                    }
                    break;
                case "boolean":
                    schema[item.name] ={
                        type:"field",
                        valueType:'bool'
                    }
                    break
            }
      })
    return schema
}
/** structureToSchema  END*/



export const structureToSchema = (structure) => {  
    return strutureToObj(structure);  
}


export const  schemaToStructure = (schema)=> {
    let ret = getObjectTypeChildren(schema)
    return ret;  
}




 