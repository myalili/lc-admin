
export default function (options) {
  let { url, params, data, headers, method, config } = options;

  method = (method || config.method || 'get').toLowerCase();


  return new Promise((resolve, reject) => {
    let opt = {
      url,
      method
    }

    try {
      params && (JSON.stringify(params) !== '{}') && (opt.params = params);
      headers && (JSON.stringify(headers) !== '{}') && (opt.headers = headers);
      data && (JSON.stringify(data) !== '{}') && (opt.data = data);
    } catch (e) {

    }

    window.axios(opt).then(async (res) => {
      resolve(res);
    }).catch(async (err) => {
      reject(err)
    })
  })
}
