# 使用文档
【导出】

## 参数
共【2】个参数:
- `【optsions】`,是axios的请求配置数据，必填
- `【fileType】`,数据导出的文件类型，必填
- `【callback】`,导出失败或成功的回调,回调参数data,成功时值为`{status:true,data:res}`,失败时值为`{status:false,msg:msg}`
## 使用方法

```
pipe.exportFile(options,fileType,callback)
```

## 使用例子

```
    window.pipe.exportFile({
        url:`${axios.server}//role/export/excel`, 
        data:JSON.stringify(rows),    //需要导出的数据
        method:'post',
        headers: {
            'Content-type':'application/json'
        },
    },'xlsx')
```