

const transformMenu = (list,pid) => {
    let menuObj = {},
      result = list || [];
    if (result.length) {
        result.forEach((i) => {
        menuObj[i.id] = i;
      });
      for (let i = -1, item; (item = result[++i]);) {
        if (menuObj[item.parentId]) {
          !menuObj[item.parentId].children &&
            (menuObj[item.parentId].children = []);
          menuObj[item.parentId].children.push(item);
        }
      }
  
      let data = Object.values(menuObj);
      return data.filter((item) => item.parentId===pid);
    } else {
      return [];
    }
  };
  export default {
    namespaced: true,
    state: {
      menus: [],
      // originMenus: []
    },
    mutations: {
   
      // set_origin_menus(state, menus) {
      //   state.originMenus = menus || [];
      // }
    },
    actions: {
      getReleasePageList(context,obj){
        return new Promise((resolve, reject) => {
          let {getReleasePages} = window.getBffApi();
          let {tenantId,parentId,origin} = obj;
          getReleasePages({
              tenantId
          })
          .then((res) => {
            if (res.success) {
              let data = Array.isArray(res.obj)?res.obj:[];
              console.log(data);
             
              if(!origin){
                data = transformMenu(data,parentId);
              }
              
             
              
              resolve(data);
            } else {
              throw res
            }
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
      },
      getAppMenus(context, obj) {
  
        return new Promise((resolve, reject) => {
            let {getPageList} = window.getBffApi();
            let {tenantId,parentId} = obj;
            getPageList({
                tenantId,
                parentId
            })
            .then((res) => {
              if (res.success) {
                let data = Array.isArray(res.obj)?res.obj:[];
                if(parentId){
                    data = transformMenu(data,parentId);
                }
                resolve(data);
              } else {
                throw res
              }
            })
            .catch((error) => {
              console.log(error);
              reject(error);
            });
        });
      },
    },
  };