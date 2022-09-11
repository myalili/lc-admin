let axios  = window.axios;


export const getBffTableData = (data) => {
  let divider = '?'
  let str = ''
  if (Object.prototype.toString.call(data) === '[object Object]') {
    for (let prop in data) {
      str += divider + prop + '=' + data[prop];
      if (divider === '?') {
        divider = '&'
      }
    }
  }
  return axios.get('/bff/entity/list' + str);
}

export const getPreviewData = (data) => {
  return axios.post('/bff/data-factory/entity/sql/preview', data);
}


export const dataFactoryApi = {
  addEntity: (data) => {
    return axios.post('/bff/entity/add',data);
  },
  saveEntity: (data) => {
    return axios.post('/bff/entity/sql/save',data);
  },
  saveScriptEntity: (data) => {
    return axios.post('/bff/entity/script/save',data);
  },
  getEntity : (id) => {
      return axios.get('/bff/entity/get/'+id)
  },
  removeEntity : (data) => {
    let divider = '?'
    let str = ''
    if(Object.prototype.toString.call(data) === '[object Object]'){
        for(let prop in data){
          str += divider + prop + '=' + data[prop];
          if(divider === '?') {
            divider = '&'
          }
        }
    }
      return axios.post('/bff/entity/delete'+str);
  }
}