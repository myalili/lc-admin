import Vue from 'vue'
export function getUrlSource(source, proxy) {
  let formatSource;
  
  proxy.map(i=>{
    if (i.source === source) {
      formatSource =  i.constant ? i.constant : (i.source.indexOf('-') > -1 ? 
        i.source.replace("/","").replace(/\-|\//g, '_') : 
        i.source.replace("/",""))
    }
  })
  return formatSource;
}

export function formatEntity(obj) {
  let formatObj = {};
  let component = null;

  if (obj.displayType) {
    const comps = pipe.component.getComponentList();
    for (const key in comps) {
      if (comps[key].hasOwnProperty('extendOptions') && comps[key].extendOptions.hasOwnProperty('_options')) {
        let _options = comps[key].extendOptions._options;
        if(_options.href === obj.displayType) {
          component = {
            name: _options.name,
            type: _options.type,
            href: _options.href,
            component: _options.href,
            option: [..._options.option],
            schemaType: _options.schemaType || '',
            accept: _options.accept || [],
          }
        }
      }
    }
  }

  formatObj = {
    component,
    code: obj.code || '',
    type: obj.type,
    dictionaryItem: {
      id: obj.id,
      name: obj.desc,
      engNameShort:  obj.name,
      validationRuleType: {
        validations: obj.validations || []
      }
    },
    id: obj.id,
    primaryKey: obj.primaryKey || '0',
  }
  return formatObj;
}
