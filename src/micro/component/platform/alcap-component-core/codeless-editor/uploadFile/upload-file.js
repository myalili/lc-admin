  import { Transforms, Range, Editor } from 'slate'
  import {  createUploader } from '@wangeditor/core'
  import { replaceSymbols } from '../utils/util'

 
 // 存储 editor uppy 的关系 - 缓存 uppy ，不重复创建
 const EDITOR_TO_UPPY_MAP = new WeakMap()
 
 /**
  * 获取 uppy 实例（并通过 editor 缓存）
  * @param editor editor
  */
 function getUppy(editor) {
   // 从缓存中获取
   let uppy = EDITOR_TO_UPPY_MAP.get(editor)
   if (uppy != null) return uppy
 
   const menuConfig = getMenuConfig(editor)
   const { onSuccess, onProgress, onFailed, customInsert, onError } = menuConfig
 
   // 上传完成之后
   const successHandler = (file, res) => {
     // 预期 res 格式：
     // 成功：{ errno: 0, data: { url, alt, href } } —— 注意，旧版的 data 是数组，要兼容一下
     // 失败：{ errno: !0, message: '失败信息' }
 
     if (customInsert) {
       // 用户自定义插入图片，此时 res 格式可能不符合预期
       customInsert(res, (url, text) => insertFileNode(editor, url, text))
       return
     }
 
     let { errno = 1, data = {} } = res
     if (errno !== 0) {
       console.error(`'${file.name}' upload failed`, res)
 
       // failed 回调
       onFailed(file, res)
       return
     }
 
     if (Array.isArray(data)) {
       // 返回的数组（旧版的，兼容一下）
       data.forEach((item) => {
         const { url = '', alt = '', href = '' } = item
         // 使用 basic-module 的 insertFileNode 方法插入图片，其中有用户配置的校验和 callback
         insertFileNode(editor, url, text)
       })
     } else {
       // 返回的对象
       const { url = '', alt = '', href = '' } = data
       insertFileNode(editor, url, text)
     }
 
     // success 回调
     onSuccess(file, res)
   }
 
   // progress 显示进度条
   const progressHandler = (progress) => {
     editor.showProgressBar(progress)
 
     // 回调函数
     onProgress && onProgress(progress)
   }
 
   // onError 提示错误
   const errorHandler = (file, err, res) => {
     const fileName = file.name
     console.error(`'${fileName} upload error`, err, res)
 
     // 回调函数
     onError && onError(file, err, res)
   }
 
   // 创建 uppy
   uppy = createUploader({
     ...menuConfig,
     onProgress: progressHandler,
     onSuccess: successHandler,
     onError: errorHandler,
   })
   // 缓存 uppy
   EDITOR_TO_UPPY_MAP.set(editor, uppy)
 
   return uppy
 }
 
 function getMenuConfig(editor) {
   return editor.getMenuConfig('uploadFile')
 }
 
 /**
  * 上传图片文件
  * @param editor editor
  * @param file file
  */
 async function uploadFile(editor, file) {
   const uppy = getUppy(editor)
 
   const { name, type, size } = file
   uppy.addFile({
     name,
     type,
     size,
     data: file,
   })
   await uppy.upload()
 }

 function insertFileNode(editor, url, text) {
  // 新建一个 file node
  const file = {
    type: 'link',
    url: replaceSymbols(url),
    children: url ? [{ text }] : [],
  }

  // 如果 blur ，则恢复选区
  if (editor.selection === null) editor.restoreSelection()

  // 插入文件
  Transforms.insertNodes(editor, file)
  // 回调
  const { onInsertedImage } = editor.getMenuConfig('insertImage')
  if (onInsertedImage) onInsertedImage(file)
}
 
 /**
  * 上传图片
  * @param editor editor
  * @param file files
  */
 export default async function (editor, file) {
   
   if (file == null) return

   const { customUpload } = getMenuConfig(editor)

   if (customUpload) {
    // 自定义上传
    await customUpload(file, (url, text) => insertFileNode(editor, url, text))
  } else {
    // 默认上传
    await uploadFile(editor, file)
  }
 }
 