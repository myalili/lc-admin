import Vue from 'vue';
import VueI18n from 'vue-i18n';


//动态引入语言
const modulesFiles = require.context('./lang', true, /\.js$/);
const lang = {};
modulesFiles.keys().map(key => {
  const keys = key.replace(/(\.\/|\.js)/g, '')
  lang[keys.split('/').pop()] = modulesFiles(key).default
})


lang.en = {  ...lang.en };
lang.zh = { ...lang.zh };

Vue.use(VueI18n);

// 创建vue-i18n实例i18n
const i18n = new VueI18n({
  // 设置默认语言
  locale: localStorage.getItem('locale') || 'zh',  // 语言标识
  // 添加多语言（每一个语言标示对应一个语言文件）
  messages: lang
})
// 暴露i18n
export default i18n;
