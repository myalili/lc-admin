
const state = {
    extraIconCss: [],
    extraIconJs:[]
}
const mutations={
    loadIconCss(state,url) {
        let link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
        state.extraIconCss.push(link);
    },
    loadIconJs(state,url){
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
        state.extraIconJs.push(script);
    },
    unloadIconJs(state){
        console.log(state.extraIconJs)
        let {extraIconJs} = state;
        let node =  document.getElementsByTagName("head")[0];
        if(node && extraIconJs.length){
            for(let i = extraIconJs.length - 1; i >= 0; i--){
                extraIconJs[i] && extraIconJs[i].parentNode && extraIconJs[i].parentNode.removeChild(extraIconJs[i]);
              }
        }
        state.extraIconJs = [];
    },
    unloadIconCss(state) {
        console.log(state.extraIconCss)
        let {extraIconCss} = state;
        let node =  document.getElementsByTagName("head")[0];
        if(node && extraIconCss.length){
            for(let i = extraIconCss.length - 1; i >= 0; i--){
                extraIconCss[i] && extraIconCss[i].parentNode && extraIconCss[i].parentNode.removeChild(extraIconCss[i]);
              }
        }
        
        state.extraIconCss = [];
    }
}

const actions = {
    unloadIcon(ctx){
        ctx.commit('unloadIconJs');
        ctx.commit('unloadIconCss');
    },
    reloadIcon(ctx,tenantId){
        ctx.commit('unloadIconJs');
        ctx.commit('unloadIconCss');
        ctx.dispatch('getIconResource',tenantId);
    },
    getIconResource(ctx,tenantId){
            let {getIconList}  = window.getBffApi();
            getIconList(tenantId).then(res=>{
                if(res.success){
                    let {obj} = res;
                    // console.log(obj)
                    obj.forEach(item=>{
                        ctx.commit('loadIconCss',`${axios.bff}${item.url}/${item.name}/iconfont.css`);
                        ctx.commit('loadIconJs',`${axios.bff}${item.url}/${item.name}/iconfont.js`)
                    })

                }else{
                   throw(res)
                }
                
            }).catch(e=>{
              
                // window.Vue.$notify.error({
                //     message:e.msg||e,
                //     title:'获取图标资源失败'
                // })
                console.log('获取图标资源失败',e)
            })
    }
}


export default {
    namespaced: true,
    state,
    mutations,
    actions
}