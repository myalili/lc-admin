/**
 * 拼接url
 * @param  {...String} path 
 */
 export const join=(...path) =>{
  let protocol = ''
  if (path.length > 0 && /^[A-Za-z]+:\/\//.test(path[0])) {
    const first = path[0] + ''
    protocol = first.match(/^[A-Za-z]+:\/\//)
    path[0] = first.replace(protocol, '')
  }
  return protocol + path.join('/').replace(/\/{2,}/g, '/')
}


