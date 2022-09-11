
// export const getAppearanceJson = async()=>{
//     let {libs} = window.alcapConfig;
//     libs.forEach(lib=>{
//         appearanceLibsMap[lib.name] = lib
//     })
// }
  
export const getV2Comps = ()=>{
    let {libs} = window.alcapConfig;
    return libs.filter(lib=>{
        return lib.name && /^@alcap-component\//.test(lib.name)
    })
}


//获取当前项目所处环境
export const getEnvironment = ()=>{
    if(!window.alcapConfig){
        return ""
    }
    return window.alcapConfig.env
  }

export const getAlcapPlatformVersion = (type)=>{
    let ver = window.alcapVersion;
    let verSplits = ver.split(".");
    console.log("低代码平台版本",ver)
    switch(type){
        //type表示精确到哪个版本分隔符，
        //为1时 返回`大版本号.x.x`，
        //为2时 返回`主版本号.子版本号.x`，
        //为空时 返回`主版本号.子版本号.修正版本号`
        case 1:
           return `${verSplits[0]}.x.x`
        case 2:
           return `${verSplits[0]}.${verSplits[1]}.x`
        default:
           return ver
    }
    
}

let appearanceLibsMap = window.appearanceLibsMap||{};

export const getAppearanceLibsMap = ()=>{
    return appearanceLibsMap
}

export const getAppearanceLibs = async()=>{
    let env = getEnvironment();
    switch(env){
        case "serve-dev":
        case "dev":
            let scopes = ["@alcap","@micro"];
            const {getNpmLibs} = window.getArmApi();
            let result = [];
            let fetchLibs = (scopes)=>{
                let res  = scopes.map((s)=>{
                    return getNpmLibs({
                        version:getAlcapPlatformVersion(2),
                        scope:s
                    })
                    
                })
                res.push(getNpmLibs({
                    version:"9.x.x",
                    scope:"@v2-lib/vue.spa.plugin"
                }))
                return Promise.all( res );
            }
             
            let res = await fetchLibs(scopes);
            
            res.forEach(r=>{
                if(r.success){
                    // console.log(r)
                    result = result.concat(r.content);
                }
            })

            // console.log(result);
            result.forEach(r=>{
                let {name,menu,version} = r;
                let microSupport = "";
                if(r.package){
                    microSupport  = JSON.parse(r.package).microSupport
                }
              
                
                if(!appearanceLibsMap[name]){
                    let lib = {
                        ...r,
                        microSupport,
                        localPath:'',
                    };
                    window.alcapConfig.libs.push(lib)
                    appearanceLibsMap[name] = lib;
                }else{
                    let lib = appearanceLibsMap[name];
                    
                    if(env==="serve-dev"){
                        lib.menu = menu
                    }else{
                        Object.assign(lib,{
                            microSupport,
                            package:r.package,
                            version,
                            menu
                        })
                    }
                }
                
            })
            // console.log(appearanceLibsMap);
          break;
        
        case "pro":
           break;
    }  
}

export const getSource = async(packageName,options={})=>{
    let {
        useLocalPath,//使用的本地路径，dev环境有此属性时优先使用该属性填写的路径
        ver//版本
        ,inSpaOpen//是否通过spa打开，需要特殊处理方便存路由对应的页面
        ,isCss//是否为样式文件
        ,isMicroPipe//是否为公共方法包
    } = options;
    let pck = appearanceLibsMap[packageName];
    if(!pck){
        console.log(`appearanceLibsMap不存在${packageName}的相关信息`)
        return packageName
       
        // return ''
    }
    let {version,localPath,microSupport} = pck;

    //加载微页面公共包，目前先递归，后面根据需要改成for循环
    if(microSupport && microSupport.js && microSupport.js.length){
        
       let promises =  microSupport.js.map(js => {
            return getSource(js,{
                isMicroPipe:/^@micro\-pipe/.test(js)
            })
       })
       
      await Promise.all(promises)
       
    }
    if(microSupport && microSupport.css && microSupport.css.length){
       let promises = microSupport.css.map(css=>{
            return getSource(css,{
                isCss:true,
            })
        })
        await Promise.all(promises)
    }
    
    let env = getEnvironment();
    //url默认拿资源市场路径
    let url = `${axios.unpkg}/${packageName}@${ver?ver:version}/dist/index.umd.min.js`;
    switch(env){
        case "serve-dev":
            //有本地路径获取本地路径
            // if(userLocalPath){
            //     url = `files/${packageName}@${ver?ver:version}/dist/index.umd.min.js`
            // }else{
                localPath && (url = localPath)
            // }
            
            break;
        case "dev":
        //拿资源市场路径
        if(useLocalPath){
            url = `files/${packageName}@${ver?ver:version}/dist/index.umd.min.js`
        }
          break;
              
        case "pro":
          //生产环境
          //拿本地下载好的文件路径
           url = `files/${packageName}@${ver?ver:version}/dist/index.umd.min.js`;
          break;
    }
    // console.log(url)
    let res ="";

     //公共包（css,js)
    if(isCss||isMicroPipe){
       
        if(isCss){
          url = url.replace(/dist\/index\.umd\.min\.js$/,"index.css");
        }
        res = await window.systemjs.import(`${url}`)

    //本地vue文件
    }else if(/\.vue$/.test(url)){ 
       
        if(inSpaOpen){
            res = {
                component:url.replace(/^@\/views\//,""),
                pageType:'vue'
            }
        }else if(/^@\/views\//.test(url)){
                res =  await window.V8._import(url.replace(/^@\/views\//,""))();
        }else if(/^@\/v2Components\//.test(url) && window.V8._import_V2Comps){
            res = await window.V8._import_V2Comps(url);
        } 

      //打包好的微页面文件
    }else if(/\.js$/.test(url)){
        if(inSpaOpen){
            res = {
                component:url,
                pageType:'js'
            }
        }else{
            res = await window.V8._require(url)();
            // console.log(res);
        }
        // console.log(url)
    
    }
  //  console.log(url,res)
    return res;
 
    
}



