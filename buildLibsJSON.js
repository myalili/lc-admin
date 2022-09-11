//生成appearance.json，
//启动脚本：node buildLibsJSON.js --name1=v2Components --name2 = views/microPages --name3=micro
//脚本参数：name1、name2、name3为appearance.json的libs属性的生成来源文件夹（该文件夹必须在src下，如果有四个文件夹则脚本参数多加一个--name4，以此类推）

const path = require("path");
const fs = require("fs");
//获取配置
const getConfig = () => {
    let params = {};
    process.argv
      .filter(e => e.startsWith("--"))
      .forEach(e => {
        const f = e.replace(/^--/, "");
        const parts = f.split("=");
        if (parts.length && parts[0]) {
          params[parts[0]] = parts[1];
        }
      });
    return params;
  };
  
console.log(getConfig());
const preload=[
  "@v2-lib/vue.spa.plugin",
  "@micro-pipe-platform/alcap-request-axios",
  "@micro-pipe-platform/alcap-pipe-core",
  "@micro-pipe-platform/alcap-pipe-business",
  "@micro-pipe-platform/alcap-api-aac",
  "@micro-pipe-platform/alcap-api-bff",
  "@micro-pipe-platform/alcap-api-arm",
  "@micro-pipe-platform/alcap-pipe-aac",
  "@micro-pipe-platform/alcap-store-core",
  "@micro-component-solution/alcap-api-aops",
  "@micro-component-solution/alcap-pipe-aops",
  "@micro-component-solution/alcap-store-aops",
  "@micro-component-platform/alcap-component-core",
  "@micro-component-platform/alcap-component-base",
  "@micro-component-platform/alcap-component-aac",
  "@micro-style-solution/alcap-stytle-aops",
  "@micro-component-solution/alcap-component-aops"
]
  
const config = getConfig();
let libsPath = Object.keys(config).map(key=>{
    if(/^name(\d){0,1}$/.test(key)){
        return config[key]
    }
})
const destPath = "./public/script/alcapConfig.js"

console.log(__dirname)


const checkDirectory = file => {
        
        let path =  fs.readdirSync(file);
        let includePackageJson = path.some(item=>{
          return /package\.json$/.test(item)
        })
        if(includePackageJson){
          let _src = file.replace(/\\/g,"/") + "/package.json" ;
          let packageJSON = fs.readFileSync(_src).toString()
          let jsonConfig = JSON.parse(packageJSON);
          let {name,version,microSuppport,main} = jsonConfig;

          data.push({
            name,
            version,
            microSuppport:microSuppport?microSuppport:"",
            localPath:_src.replace(/^src/,"@").replace(/package\.json$/,main||"index.vue"),
            package:packageJSON
          })
        }else{
          path.forEach((fPath)=> {
            var _src = file + "/" + fPath;
            let stats = fs.statSync(_src);
            if (stats.isDirectory()) {
                //是目录则 递归
                checkDirectory(_src);
            }
          })
        }
       
        return data
  };
  

  let defaultAppearceJson = {
    env:"serve-dev",
    layout:"@micro-page/defaultLayout",
    login:"@micro-page/alcapDefaultLogin",
    logo:"",
    projectName:"",
    projectVersion:"",
    theme:"", 
    needArm:true,
    preload,
    libs:[]
  }

  let data = [];
  (() => {
   
      for(let i=0;i<libsPath.length;i++){
        let entryPath = path.join('./src', libsPath[i]);
        if (fs.existsSync(entryPath)) {
            let libs = checkDirectory(entryPath);
            // console.log(libs)
            defaultAppearceJson.libs = libs;
            fs.writeFileSync(destPath,`window.alcapConfig = ${JSON.stringify(defaultAppearceJson,"","\t")}`,'utf8');

        }else{
            console.log(`目标路径${entryPath}不存在`)
        }
      }
      console.log('appearance.js已生成')

  })();