
const getChartType = (char)=>{
  // 数字可按照排序的要求进行自定义，我这边产品的要求是
  // 数字（0->9）->大写字母（A->Z）->小写字母（a->z）->中文拼音（a->z）
  if (/^[\u4e00-\u9fa5]$/.test(char)) {
      return ['zh', 300]
  }
  if (/^[a-zA-Z]$/.test(char)) {
      return ['en', 200]
  }
  if (/^[0-9]$/.test(char)) {
      return ['number', 100]
  }
  return ['others', 999]
}

  function sortName(str1, str2) {
    
    let res = 0
    str1 = str1.toLowerCase()
    str2 = str2.toLowerCase()
    for (let i = 0; ; i++) {
        if (!str1[i] || !str2[i]) {
            res = str1.length - str2.length
            break
        }
        const char1 = str1[i]
        const char1Type = getChartType(char1)
        const char2 = str2[i]
        const char2Type = getChartType(char2)
        // 类型相同的逐个比较字符
        if (char1Type[0] === char2Type[0]) {
            if (char1 === char2) {
                continue
            } else {
                if (char1Type[0] === 'zh') {
                    res = char1.localeCompare(char2)
                } else if (char1Type[0] === 'en') {
                    res = char1.charCodeAt(0) - char2.charCodeAt(0)
                } else {
                    res = char1 - char2
                }
                break
            }
        } else {
            // 类型不同的，直接用返回的数字相减
            res = char1Type[1] - char2Type[1]
            break
        }
    }
    return res
  }
  
  export default sortName