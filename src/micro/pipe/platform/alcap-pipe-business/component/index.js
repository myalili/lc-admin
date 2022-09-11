import Vue from "vue";
// const vm = new Vue();
// 获取组件列表，可根据类型获取
function getComponentList(type) {
  const comp = type
    ? window.alcapCoreUtils
        .getV2Comps()
        .filter((i) => JSON.parse(i.package).docs.type === type)
    : window.alcapCoreUtils.getV2Comps();
  const componentList = [];
  for (let index = 0; index < comp.length; index++) {
    const c = comp[index];
    const cPackage = JSON.parse(c.package);
    const _options = cPackage.docs;

    let props = [..._options.option.map((i) => i.name)];
    let propsData = {};
    _options.option.map((i) => {
      propsData[i.name] = i.defaultValue;
    });
    // if (_options.type === "edit") continue;

    // let typeMap = [];
    // console.log('_options.type', _options.type,_options.href );
    // if (type) {
    //   if (typeof type === 'string') {
    //     typeMap.push(type);
    //   }else {
    //     typeMap = type;
    //   }
    //   if (!typeMap.includes(_options.type)) continue;
    // }

    componentList.push({
      name: _options.name,
      type: _options.type,
      href: _options.href || "",
      component: _options.href || "",
      packageName: c.name,
      props,
      // option: [..._options.option],
      ...propsData,
      __editor: [],
      schemaType: _options.schemaType || "",
      accept: _options.accept || [],
      style: _options.style || null,
      wid: new Date().valueOf() + ((Math.random() * 100000) | 0)
    });
  }
  // console.log("最后返回的组件", comp, componentList);
  return componentList;
}

 function getComponentOptions(component) {
  if (!component.href) return
  const comps = window.alcapCoreUtils.getV2Comps();
  const comp = comps.find((i) => JSON.parse(i.package).docs.href === component.href);
  const docs = JSON.parse(comp.package).docs;
  let props = [...docs.option.map((i) => i.name)];
  let propsData = {};
  docs.option.map((i) => {
    propsData[i.name] = i.defaultValue;
  });
  component.name = docs.name;
  component.props = props
  for (const key in propsData) {
    if (!component.hasOwnProperty(key)) {
      component[key] = propsData[key];
    }
  }
  component.schemaType = docs.schemaType;
  return docs.option;
}
export default {
  getComponentList,
  // componentRegister,
  getComponentOptions,
};
