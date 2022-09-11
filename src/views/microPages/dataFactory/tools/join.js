/**
 * @description 
 * @param {object} leftData 左表
 * @param {object} rightData 右表
 * @param {string} mode 模式
 * @param {Array} constrins 约束关键词[]
 * @reference 
 */
export function join({ leftData, rightData, mode, constrins }) {
    let retData = {
        name : `${leftData.name}-${rightData.name}`,
        schema: [],
        data: []
    }
    let left = leftData;
    let right = rightData
    if(mode === 'right'){
        mode = 'left';
        left = rightData;
        right = leftData;
    }
    
    //合并schema
    let schema = [...left.schema, ...right.schema]
    let data = []
    //从约束关键字，左右表数据找到符合条件的数据
    for (let i = 0; i < left.data.length; i++) {
        let leftItem = left.data[i];
        console.log(leftItem);
        let targetItem = right.data.find(item => {
            let bool = true;
            for (let j = 0; j < constrins.length; j++) {
                let prop = constrins[j];
                if (item[prop] !== leftItem[prop]) {
                    bool = false;
                    break;
                }
            }
            return bool
        })
      if(mode === 'inner') {
         if(targetItem)  data.push({ ...leftItem, ...targetItem || {} })
      }else{
        data.push({ ...leftItem, ...targetItem || {} })
      }
    }
    retData.schema = schema 
    retData.data = data
  
 
    return retData;
}