const getComponent = async (packageName) => {
    let { getSource } = window.alcapCoreUtils;
    return await getSource(packageName)
}
export const caseRouter = [
    {
        path:"/departmentManagement",
        name: "departmentManagement",
        component:async()=> await getComponent('@micro-page/departmentManagement'),
        meta: {
            title: "部门",
            icon: "anticon-dashboard"
        }
    },
       {
            path:"/tenantManagementV2",
            name: "tenantManagementV2",
            component:async()=> await getComponent('@micro-page/tenantManagementV2'),
            meta: {
                title: "项目管理",
                icon: "anticon-dashboard"
            }
        },
        {
            path:"/dataFactory",
            name: "dataFactory",
            component:async()=> await getComponent('@micro-page/dataFactory'),
            meta: {
                title: "数据工厂",
                icon: "anticon-dashboard"
            }
        },

        {
          path:"/myApp",
          name: "myApp",
          component:async()=> await getComponent('@micro-page/my-app'),
          meta: {
              title: "我的应用",
              icon: "anticon-dashboard"
          }
      },
      {
        path:"/auth",
        name: "auth",
        component:async()=> await getComponent('@micro-page/authManagement'),
        meta: {
            title: "权限管理",
            icon: "anticon-dashboard"
     }
    },
    {
        path:"/menu",
        name: "menu",
        component:async()=> await getComponent('@micro-page/menuManagement'),
        meta: {
            title: "菜单管理",
            icon: "anticon-dashboard"
     }
    },
 
        {
            path:"/icon",
            name: "icon",
            component:async()=> await getComponent('@micro-page/huaxingIconManagement'),
            meta: {
                title: "图标",
                icon: "anticon-dashboard"
            }
        },
       
    {
        "path": "IwbNUVJH",
        "name": "IwbNUVJH",
        "component": "/js/page-dkfKF3j4/dist/index.umd.min.js",
        "pageType":"js",
        "meta": {
            "title": "3D应用架构蓝图",
            "icon": "anticon-dashboard"
        }
    },
    {
        "path": "10ACuF8x",
        "name": "10ACuF8x",
        "component": "/js/page-10ACuF8x/dist/index.umd.min.js",
        "pageType":"js",
        "meta": {
            "title": "部署架构图",
            "icon": "anticon-dashboard"
        }
    },
    {
        "path": "jLrFCd0B",
        "name": "jLrFCd0B",
        "component": "/js/page-jLrFCd0B/dist/index.umd.min.js",
        "pageType":"js",
        "meta": {
            "title": "架构原则",
            "icon": "anticon-dashboard"
        }
    },
    {
        "path": "apDjTEkU",
        "name": "apDjTEkU",
        "component": "/js/page-apDjTEkU/dist/index.umd.min.js",
        "pageType":"js",
        "meta": {
            "title": "业务领域地图",
            "icon": "anticon-dashboard"
        }
    },

     {
            "path": "/flow",
            "name": "flow",
            "meta": {
                "title": "流程图",
                "icon": "anticon-dashboard"
            },
            "pageType":"js",
            "component":"/js/flow/index.umd.min.js"
        },
        {
            "path": "/form",
            "name": "form",
            "meta": {
                "title": "表单",
                "icon": "anticon-dashboard"
            },
            "pageType":"js",
            "component":"/js/form/index.umd.min.js"
        },
    {
        "path": "/codeless",
        "name": "codeless",
        "component": "codeLess/application",
        "meta": {
            "title": "低代码",
            "icon": "anticon-dashboard"
        }
    },
        {
            "path":"/authCenter/menuManagement",
            "name": "menuManagement",
            "component": "microPages/menuManagement/index",
            "meta": {
                "title": "菜单管理",
                "icon": "anticon-dashboard"
            }
        },
       {
            "path":"/authCenter/authManagement",
            "name": "authManagement",
            "component": "microPages/authManagement/index",
            "meta": {
                "title": "权限管理",
                "icon": "anticon-dashboard"
            }
        },{
            "path":"/authCenter/operateRecord",
            "name": "operateRecord",
            "component": "microPages/operateRecord/index",
            "meta": {
                "title": "操作记录",
                "icon": "anticon-dashboard"
            }
        },{
            "path":"/authCenter/menuManagement",
            "name": "menuManagement",
            "component": "microPages/menuManagement/index",
            "meta": {
                "title": "菜单管理",
                "icon": "anticon-dashboard"
            }
        },{
            "path":"/authCenter/roleManagement",
            "name": "roleManagement",
            "component": "microPages/roleManagement/index",
            "meta": {
                "title": "角色管理",
                "icon": "anticon-dashboard"
            }
        },{
            "path":"/authCenter/tenantManagement",
            "name": "tanantManagement",
            "component": "microPages/tenantManagement/index",
            "meta": {
                "title": "租户管理",
                "icon": "anticon-dashboard"
            }
        },{
            "path":"/authCenter/userPage",
            "name": "userPage",
            "component": "microPages/userPage/index",
            "meta": {
                "title": "用户管理",
                "icon": "anticon-dashboard"
            }
        },
        {
            "path": "structure",
            "name": "structure",
            "component": "structure/structureList",
            "meta": {
                "title": "数据结构",
                "icon": "anticon-dashboard"
            }
        },
        {
            "path": "entityManager",
            "name": "entityManager",
            "component": "microPages/entityManager/index",
            "meta": {
                "title": "实体管理",
                "icon": "anticon-dashboard"
            }
        },
    {
        "path": "/demo2",
        "name": "demo2",
        "meta": {
            "title": "测试2",
            "icon": "anticon-dashboard"
        },
        children:[{
            "path": "demo_c2",
            "name": "demo_c2",
            "meta": {
                "title": "测试2_1",
                "icon": "anticon-dashboard"
            },
            children:[{
                "path": "demo_c_2",
                "name": "demo_c_2",
                "component":"case/test2",
                "meta": {
                    "title": "测试2_1_1",
                    "icon": "anticon-dashboard"
                }
            }]
        }]
    },
    {
        "path": "user",
        "name": "user",
        "component": "user/userList",
        "meta": {
            "title": "用户管理",
            "icon": "anticon-dashboard"
        }
    },
    {
        "path": "menu",
        "name": "menu",
        "component": "menu/menuList",
        "meta": {
            "title": "菜单管理",
            "icon": "anticon-dashboard"
        }
    },
    {
        "path": "dept",
        "name": "dept",
        "component": "dept/deptList",
        "meta": {
            "title": "部门管理",
            "icon": "anticon-dashboard"
        }
    },
    {
        "path": "shema",
        "name": "shema",
        "component": "shema/shemaList",
        "meta": {
            "title": "数据格式",
            "icon": "anticon-dashboard"
        }
    },
    

]