// import { deepClone } from '@/components/formGenerator/utils';

import { jsonParse } from './index.js';
// export function handleSetNodeMicro(data, details) {
//   // data是服务任务的microService属性的实体对象 { api: Object, atsType: String, joinAts: Boolean, confirmApi: string }
//   if (details.params && JSON.parse(details.params).length) {
//     // 根据详情填写参数信息
//     for (let item of JSON.parse(details.params)) {
//       let param = getDefaultParams();
//       param.name = item.name ? item.name : undefined;
//       param.in = item.in ? item.in : undefined;
//       param.description = item.description ? item.description : undefined;
//       param.required = item.required ? item.required : false;
//       param.type = item.schema ? item.schema.type : undefined;
//       let copyParams = JSON.parse(JSON.stringify(param)) ? JSON.parse(JSON.stringify(param)) : deepClone(param);
//       data.api.params.push(copyParams);
//       delete param.value;
//       data.api.swagger.parameters.push(param);
//     }
//   }
//   data.api.timeout = details.timeout ? details.timeout : 0;
//   data.api.swagger.deprecated = details.deprecated ? details.deprecated : false;
//   data.api.swagger.responses = details.responses ? JSON.parse(details.responses) : getDefaultResponses();
// }
// export function getDefaultParams() {
//   let res = {
//     name: undefined, //一样的 参数名
//     in: undefined, //一样的 'query'
//     description: undefined, //一样的
//     required: false, //一样的
//     type: undefined, //schema.type 'string'
//     format: null,
//     collectionFormat: null,
//     items: null,
//     schema: null,
//     value: ''
//   };
//   return res;
// }
// export function getDefaultResponses() {
//   let res = {
//     200: {
//       description: 'OK',
//       schema: {
//         type: null,
//         items: null,
//         rf: undefined
//       }
//     },
//     401: { description: 'Unauthorized', schema: null },
//     403: { description: 'Forbidden', schema: null },
//     404: { description: 'Not Found', schema: null }
//   };
//   return res;
// }

export function getRequestBody(operationDetail) {
  if (!operationDetail || !operationDetail.requests) {
    return { mediaType: null, mediaValue: null };
  }
  const schemas = jsonParse(operationDetail.schemas, {});
  const requestBody = jsonParse(operationDetail.requests, {});
  const mediaType = Object.keys(requestBody.content)[0];
  const cache = {};
  const getMediaValue = schema => {
    const $ref = schema.$ref;
    if ($ref) {
      if (cache[$ref]) return { $ref };
      cache[$ref] = true;
      schema = schemas[$ref.substring($ref.lastIndexOf('/') + 1)];
    }
    let relVal;
    if (schema.type === 'string') {
      relVal = schema.example ?? 'string';
    }
    if (schema.type === 'integer') {
      relVal = schema.example ?? 0;
    }
    if (schema.type === 'number') {
      relVal = schema.example ?? 0;
    }
    if (schema.type === 'boolean') {
      relVal = schema.example ?? false;
    }
    if (schema.type === 'null') {
      relVal = schema.example ?? null;
    }
    if (schema.type === 'object') {
      relVal = {};
      Object.keys(schema.properties ?? {}).forEach(key => {
        relVal[key] = getMediaValue(schema.properties[key]);
      });
    }
    if (schema.type === 'array') {
      relVal = [];
      relVal.push(getMediaValue(schema.items));
    }
    return relVal;
  };
  let mediaValue = getMediaValue(requestBody.content[mediaType].schema);
  if (typeof mediaValue === 'object') {
    mediaValue = JSON.stringify(mediaValue, undefined, 2);
  }
  return { mediaType, mediaValue };
}
