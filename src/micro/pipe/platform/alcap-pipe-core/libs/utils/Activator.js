
import { AbstractActivator } from './AbstractActivator';

class CodelessActivator extends AbstractActivator {

}
let activator = new CodelessActivator();

window.activator = activator;



const codeLessType = {
  //分类
  category: {
    id: "category",
    type: "0",
  },
  //通用页面
  pageRender: {
    id: "page",
    type: "1",
  },
  //配置表单
  textForm: {
    id: "textForm",
    type: "2",
  },
  //流程
  process: {
    id: "process",
    type: "3",
  },
  //微页面
  microPage: {
    id: "microPage",
    type: "4",
  },
  //视图
  view: {
    id: "view",
    type: "5",
  },
  //拓扑
  appTopo: {
    id: "appTopo",
    type: "6",
  },

  //工作台页面类型
  workbench: {
    id: "workbench",
    type: "10",
  },
};

if (window.activator) {
  //注册页面类型
  activator.registPage({
    workbench: {
      ...codeLessType.workbench,
      // component: "@micro-page/grid-layout-page-render",
      // toolBarCenter: [
      //   {
      //     //动态注册toolbar
      //     component: "comp-select",
      //     // showCondition:["preview","edit"],  「showCondition」,决定toolbar是否在预览或者编辑条件下显示,preview为预览状态，edit为编辑状态。该值为""、[]或者undefined时默认为['edit']
      //     run() {
      //       //通信可以用window.msgHub
      //     },
      //   },
      // ],
    },
    "page-render": {
      ...codeLessType.pageRender,

      component: "@micro-page/grid-layout-page-render",
      // props:["content","edit"],
      toolBarCenter: [
        // {
        //   //动态注册toolbar
        //   component: "comp-select",
        //   // showCondition:["preview","edit"],  「showCondition」,决定toolbar是否在预览或者编辑条件下显示,preview为预览状态，edit为编辑状态。该值为""、[]或者undefined时默认为['edit']
        //   run() {
        //     //通信可以用window.msgHub
        //   },
        // },

        {
          component: "codeless-page-css",
        },
        {
          component: "data-field-v2",
        },
      ],
      toolBarRightV2:[
        // {
        //   component: "data-field-v2",
        // },
      ],
      toolBarRightMore: [
        {
          component: "mobile-btn-v2",
        },
      ],
    },
    process: {
      ...codeLessType.process,
      component:"@micro-page/processV2",
      toolBarCenter: [
        {
          //动态注册toolbar
          component: "",
          run() {
            //通信可以用window.msgHub
          },
        },
      ],
      toolBarRightV2: [
        {
          component: "processToolbar",
          run() {},
        },
      ],
    },
    "text-form": {
      ...codeLessType.textForm,
      component: "@micro-page/text-form",

      toolBarCenter: [
        {
          //动态注册toolbar
          component: "",
          run() {
            //通信可以用window.msgHub
          },
        },
        {
          component: "data-field-v2",
        },
      ],
      toolBarRightV2:[
        // {
        //   component: "data-field-v2",
        // },
      ],
      toolBarRightMore: [
        {
          component: "mobile-btn-v2",
        },
      ],
    },

    "alcap-app-topo": {
      ...codeLessType.appTopo,
      component: "@micro-page/auae-app-editor-page",
      // component:"alcap-app-topo",
      toolBarCenter: [
        {
          //动态注册toolbar
          component: "",
          run() {
            //通信可以用window.msgHub
          },
        },
      ],
      toolBarRightV2:[
        {
          component: "exportPngBtn",
          run() {},
        },
        {
          component: "exportPPTBtn",
          run() {},
        },
      ],
    },
    microPage: {
      ...codeLessType.microPage,
      component: "@micro-page/microPageRender",
    },
  });

  //注册新建类型
  activator.regist("alcap.create", {
    pannel: [
      {
        icon: "icon-kuaijierukou7",
        name: "页面模板",
        desc: "用户可以基于模板新建页面，无需从零开发。",
        img: "/img/icon_module.png",
        width: "50%",
        background: "#EFF4FF",
      },
      "sp",
      {
        ...codeLessType.pageRender,

        icon: "icon-yemianmingcheng3",
        name: "通用页面",
        desc: "业务人员可以直接调用后端的数据接口和前端的页面/组件，对页面进行拼装",
        img: "/img/icon_page.png",
        width: "50%",
        background: "#ECF6FF",
      },
      {
        ...codeLessType.textForm,
        icon: "icon-peizhibiaodanmingcheng",
        name: "配置表单",
        desc: "用于查询或者提交某些信息的表单",
        img: "/img/icon_config.png",
        width: "33.3%",
        background: "#FFF9ED",
      },
      "sp",

      {
        ...codeLessType.process,
        icon: "icon-liuchengmingcheng1",
        name: "流程",
        desc: "提供可视化流程设计界面，通过简单托拉拽，连线操作，无需代码，配置即可轻松创建并管理业务流程应用",
        img: "/img/icon_process.png",
        width: "33.3%",
        background: "#EAFEF8",
      },
      {
        ...codeLessType.appTopo,
        icon: "icon-gonggongzuzhijigou",
        name: "拓扑",
        desc: "AUAE 数字空间可视化平台致力于将现实世界的物理实体进行数字实例化表达，并将他们内在的业务关系具象化，形成各类数字孪生关系图谱。我们不仅提供各类自研的关系可视化表达编辑工具，并且提供了简单灵活的BFF可消费API服务，从而能够快速灵活支撑各类应用场景，对接各类业务系统，避免重复建设、烟囱式建设，缩短应用交付周期，提高应用交付质量，加速组织级数字应用的创新速度，降低数字化转型成本。",
        img: "/img/icon_process.png",
        width: "33.3%",
        background: "#EAFEF8",
      },

      "sp",
      // {
      //   ...codeLessType.view,

      //   icon: "icon-yemianmingcheng1",
      //   name: "视图",
      //   desc: "通过简单的拖拽，制作出柱形图、折线图、饼图等图表，还可以自定义颜色等信息，对数据进行可视化展",
      //   img: "/img/icon_graphic.png",
      //   width: "33.3%",
      //   background: "#FFF4F5",
      // },
      {
        ...codeLessType.microPage,
        icon: "icon-yemianmingcheng2",
        name: "微页面",
        desc: "通过微页面的方式引入低代码平台",
        img: "/img/icon_page.png",
        width: "50%",
        background: "#ECF6FF",
      },

      "sp",
      {
        ...codeLessType.category,
        icon: "icon-fenlei",
        name: "分类",
        img: "/img/icon_page.png",
        width: "50%",
        background: "#ECF6FF",
      },
    ],
  });

  //注册流程api类型
  activator.regist("alcap.aopsUtilApi", {
    startProcessInstances: {
      desp: "启动流程实例",
      handler: async (body) => {
        let { startLpInstance } = window.getAopsApi();
        return await startLpInstance(body);
      },
    },
    // completeTask: {
    //   desp: "完成任务",
    //   handler: async (clusterId, taskId, params) => {
    //     let { completeTask } = window.getAopsApi();
    //     return await completeTask(clusterId, taskId, params);
    //   },
    // },
  });

  //注册表格字段格式化
  activator.regist("alcap.tableDataFilter", {
    "": {
      desc: "无",
      handler: (value) => {
        return value  
      },
    },
    dict: {
      desc: "字典",
      beforeHandler: async (code) => {
        let { codeList } = window.getBffApi();
        let params = {
          code,
          pageNum: 1,
          pageSize: 100000,
        };
        const res = await codeList(params);
        let pageData = res.pageData;
        return pageData;
      },
      handler: (value, item, ctx) => {
        return (
          (ctx.enumCodesObj[item.code].filter((i) => i.value === value)[0] &&
            ctx.enumCodesObj[item.code].filter((i) => i.value === value)[0]
              .name) ||
          value
        );
      },
    },
    timestamp: {
      desc: "时间戳",
      handler: (value)=> {
        return new Date(parseInt(value)).toLocaleDateString().replace(new RegExp("/", "g"), "-")
      }
    },
    uploadImg: {
      desc: "上传图片",
      handler: (jsonStr)=> {
        if (typeof jsonStr === 'string') {
          if (jsonStr.indexOf('{') > -1) {
            try {
              let str = jsonStr.replaceAll('&quot;', "\"")
              const jsonObj = JSON.parse(str);
              return `${axios.bff}${jsonObj.path}` || ''
              // return `${axios.bff}/file/download?filePath=${jsonObj.path}&token=${getToken()}` || '';
            } catch (error) {
              return '';
            }
          }else {
            return `${axios.bff}${jsonStr}`;
          }
        }
        return ''
      }
    },
    uploadDocs: {
      desc: "上传文档",
      handler: (jsonStr)=> {
        try {
          let str = jsonStr.replaceAll('&quot;', "\"")
          return JSON.parse(str).name;
        } catch (error) {
          return null;
        }
      }
    },
    money: {
      desc: "金额",
      handler: (value)=> {
        let formatValue = Number(value).toFixed(2);
        return formatValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    }
  });
}

// export default activator;
