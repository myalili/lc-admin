const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path')
const {
  exec
} = require('child_process');

const fs = require('fs');
const topoComUrl = path.resolve(__dirname,'./src/v2Components');


const readdir = (file) => {
    return new Promise((resolve, reject) => {
        
          fs.readdir(file, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
      
        
    });
}


(async () => {
  let seed = []
  

    const v2AuaeComps = await readdir(topoComUrl);
   let fList = v2AuaeComps.filter(item=>item.indexOf('.')==-1)
    fList.forEach((item) => {
      // if(["basic-pattern","er-pattern","flow-pattern","uml-pattern"].includes(item)){
      //   const subNodes = fs.readdirSync(path.join(topoComUrl, item,'nodes'));
      //   console.log('ddd',subNodes)
      //   seed = seed.concat(subNodes);
      // }else{
        seed.push(item)
      // }
    })

  
  console.log(seed);
  fs.writeFileSync("./output.json",JSON.stringify(seed))

   
})()



