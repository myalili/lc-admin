let axios = window.axios;


export default async function (options,fileType,callback) {
    let config  = {
        responseType: 'blob',
        ...options
    }

        axios(config).then(res=>{

            let reader = new FileReader();
            reader.onload = fileObj => {
              let { result } = fileObj.target,// 得到字符串
                data; // 解析成json对象
              if (typeof result === 'string') {
                try {
                  data = JSON.parse(result);
                } catch (e) {
                  data = undefined;
                }
              } // 返回的数据
              if (data&& !data.success) {
                console.log(data);
                callback&&callback({
                    status:false,
                    msg:data.msg||''
                });
                return;
              }
              console.log(data);
                var blob = new Blob([res]),
                    url = window.URL.createObjectURL(blob),
                    aLink = document.createElement("a");
        
                aLink.style.display = "none";
                aLink.href = url;
                aLink.setAttribute("download", new Date().getTime()+'.'+fileType);
                document.body.appendChild(aLink);
                aLink.click();
                document.body.removeChild(aLink); //下载完成移除元素
                window.URL.revokeObjectURL(url);

                callback&&callback({
                    status:true,
                    data:res
                });
            } 
            reader.onerror = err => {
                console.log('fileError',err);
            } 
            reader.readAsText(res, 'utf-8') // 按照utf-8编码解析

        }).catch(error => {
            console.log('error:',error);
            callback&&callback({
                status:false,
                msg:error.msg||''
            });
        })
};