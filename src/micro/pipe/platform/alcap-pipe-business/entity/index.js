import Vue from "vue";
const { formatEntity } = window.alcapCoreUtils;
const vm = new Vue();

async function getEntityData(entityId, schemaType, params) {
  let operationType = "";
  let entityUrl = {};
  const {
    dbCreateRecord,
    dbDeleteRecord,
    dbExportExcel,
    dbExportTemplate,
    dbExportUpload,
    dbRetrieveRecord,
    dbUpdateRecord,

    dataSourceCreateRecord,
    dataSourceDeleteRecord,
    dataSourceExportExcel,
    dataSourceExportTemplate,
    dataSourceExportUpload,
    dataSourceRetrieveRecord,
    dataSourceUpdateRecord,

    dataFactoryRetrieveRecord,
  } = window.getBffApi();
  const dbData = {
    retrieve: {
      ALCAP_PAGEING: {
        url: dbRetrieveRecord,
        type: "db",
        body: {
          entityId: "string",
          orders: [],
          pageNum: 1,
          pageSize: 10,
          query: {},
          ranges: [],
          retrieveId: "paging",
        },
      },
      ALCAP_LIST: {
        url: dbRetrieveRecord,
        type: "db",
        body: {
          entityId: "string",
          orders: [],
          query: {},
          ranges: [],
          retrieveId: "list",
        },
      },
      ALCAP_SINGLE_PAGE: {
        url: dbRetrieveRecord,
        type: "db",
        body: {
          entityId: "string",
          orders: [],
          pageNum: 1,
          pageSize: 10,
          query: {
            recordId: "string",
          },
          ranges: [],
          retrieveId: "list",
        },
      },
    },
    create: {
      url: dbCreateRecord,
      type: "db",
      body: {
        entityId: "string",
        fields: [
          {
            entityFieldId: "string",
            value: "string",
          },
        ],
      },
    },
    delete: {
      url: dbDeleteRecord,
      type: "db",
      query: ["entityId", "recordId"],
    },
    update: {
      url: dbUpdateRecord,
      type: "db",
      body: {
        entityId: "string",
        fields: [
          {
            entityFieldId: "string",
            value: "string",
          },
        ],
      },
    },
    export: {
      url: dbExportExcel,
      type: "db",
      body: {
        entityId: "string",
        orders: [],
        pageNum: 1,
        pageSize: 10,
        query: {},
        ranges: [],
        retrieveId: "paging",
      },
    },
    upload: {
      url: dbExportUpload,
      type: "db",
      body: {
        entityId: "string",
        file: "file",
      },
    },
    template: {
      url: dbExportTemplate,
      type: "db",
      query: ["entityId"],
    },
  };
  const data_sourceData = {
    create: {
      url: dataSourceCreateRecord,
      type: "data_source",
      body: {
        entityId: "string",
        fields: [
          {
            entityFieldId: "string",
            value: "string",
          },
        ],
      },
    },
    delete: {
      url: dataSourceDeleteRecord,
      type: "data_source",
      body: {
        entityId: "string",
        fields: [
          {
            entityFieldId: "string",
            value: "string",
          },
        ],
      },
    },
    retrieve: {
      url: dataSourceRetrieveRecord,
      type: "data_source",
      body: {
        entityId: "string",
        fields: [
          {
            entityFieldId: "string",
            value: "string",
          },
        ],
      },
    },
    update: {
      url: dataSourceUpdateRecord,
      type: "data_source",
      body: {
        entityId: "string",
        fields: [
          {
            entityFieldId: "string",
            value: "string",
          },
        ],
      },
    },
    export: {
      url: dataSourceExportExcel,
      type: "data_source",
      body: {
        entityId: "string",
      },
    },
    upload: {
      url: dataSourceExportUpload,
      type: "data_source",
      body: {
        entityId: "string",
        file: "file",
      },
    },
    template: {
      url: dataSourceExportTemplate,
      type: "data_source",
      query: ["entityId"],
    },
  };
  const data_factory = {
    retrieve: {
      url: dataFactoryRetrieveRecord,
      type: "data_factory",
      query: ["entityId"],
    },
  };
  // db：数据库 data_factory：数据工厂 data_source：三方
  const typeMap = new Map([
    ["db", dbData],
    ["data_factory_sql", data_factory],
    ["data_factory_script", data_factory],
    ["data_source", data_sourceData],
  ]);

  let entity = await getEntityDetail(entityId, false);

  if (!entity) return;

  if (!entity.schemas.find((i) => i.name === schemaType)) {
    operationType = schemaType;
  } else {
    operationType = entity.schemas.find(
      (i) => i.name === schemaType
    ).operationType;
  }
  let type = entity.type;

  if (operationType === "retrieve" && type === "db") {
    entityUrl = typeMap.get(type)[operationType][schemaType] || typeMap.get(type)[operationType]['ALCAP_LIST'];
  } else {
    entityUrl = typeMap.get(type)[operationType];
  }
  console.log('实体接口', entityUrl);

  if (!entityUrl) {
    vm.$notify.error({
      message: "查询不到接口！",
      title: "失败",
    });
    return;
  }

  let paramsFormat =
    typeof params.get === "function" ? params.get(entity.type) : params;

  console.log("当前接口", entityUrl);

  if (entityUrl.query) {
    let paramsQuery = "";

    entityUrl.query.forEach((e, i) => {
      if (i === 0) {
        paramsQuery += `?${e}=${paramsFormat[e]}`;
      } else {
        paramsQuery += `&${e}=${paramsFormat[e]}`;
      }
    });
    return new Promise((resolve, reject) => {
      if (schemaType === "template") {
        // window.axios.post(`${window.axios.bff}${entityUrl.url}`,paramsFormat,{responseType:'blob'})
        entityUrl
          .url(paramsFormat, { responseType: "blob" })
          .then((res) => {
            entityDownload(res, `${entity.desc}导入模板`);
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        // window.axios.post(`${window.axios.bff}${entityUrl.url}${paramsQuery}`)
        entityUrl
          .url(paramsQuery)
          .then((response) => {
            console.log('返回的res', response);
            resolve({ response: response && response.obj, entityUrl });
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  } else {
    if (schemaType === "export") {
      return new Promise((resolve, reject) => {
        // window.axios.post(`${window.axios.bff}${entityUrl.url}`,paramsFormat,{responseType:'blob'})
        entityUrl
          .url(paramsFormat, { responseType: "blob" })
          .then((res) => {
            entityDownload(
              res,
              `${entity.desc}第${paramsFormat.pageNum}页${paramsFormat.pageSize}条记录`
            );
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
    return new Promise((resolve, reject) => {
      // window.axios.post(`${window.axios.bff}${entityUrl.url}`, paramsFormat)
      entityUrl
        .url(paramsFormat)
        .then((response) => {
          if (entity.type === 'data_source' && typeof response === 'string') {
            response = JSON.parse(response);
          }
          resolve({ response, entityUrl, entity });
        })
        .catch((err) => {
          reject(err);
          vm.$notify.error({
            message: err.msg || err,
            title: "失败",
          });
        });
    });
  }
}

function getEntityDetail(id, flag = true) {
  return new Promise(async (resolve, reject) => {
    const { getEntity } = window.getBffApi();
    let res = await getEntity({ id });
    if (!res) {
      vm.$notify.error({
        message: "该实体不存在！",
        title: "失败",
      });
      reject(res);
    } else {
      if (flag) {
        res.fields = res.fields.map((i) => {
          return formatEntity(i);
        });
      }
      resolve(res);
    }
  });
}

function entityDownload(res, name) {
  const content = res;
  const blob = new Blob([content]); //构造一个blob对象来处理数据
  const fileName = name + new Date().getTime() + ".xlsx";
  //对于<a>标签，只有 Firefox 和 Chrome（内核） 支持 download 属性
  //IE10以上支持blob但是依然不支持download
  if ("download" in document.createElement("a")) {
    //支持a标签download的浏览器
    const link = document.createElement("a"); //创建a标签
    link.download = fileName; //a标签添加属性
    link.style.display = "none";
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click(); //执行下载
    URL.revokeObjectURL(link.href); //释放url
    document.body.removeChild(link); //释放标签
  } else {
    //其他浏览器
    navigator.msSaveBlob(blob, fileName);
  }
}

export default {
  getEntityData,
  getEntityDetail,
};
