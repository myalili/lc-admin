

export default{
    mixins:[window.V8.mixins],
    methods:{
        openCustomDialog(options){
            // console.log(options);
            this.open({
               path:options.path,
               component:Vue.options.components.codelessDialogCtn,
               type:'SUB',
               width: options.width||'',
               height: options.height||'',
               params:{
                   __inSPA:true,
                   ...options
               },
               hideCancelBtn:true,
               hideConfirmBtn:true,
               beforeConfirm:options.beforeConfirm,
               confirmCallback:options.confirmCallback,
               cancelCallback:options.cancelCallback,
               customClass:'codeless-custom-dialog'
            })
        },
       
        notifyError(title,e){
              console.log(e);
              this.$notify({
                message: e,
                title: `${title}失败`,
                type: "error",
              });
        },
        notifySuccess(title){
            this.$notify({
                title: `${title}成功`,
                type: "success",
              });
        },
        async openRenderPage(options){
            let ctx = this;
            const {getSource} = window.alcapCoreUtils;
            let component="";
            switch(options.type){
                case "SUB":
                    component =await getSource("@micro-page/appRender")
                    options.component = component
                    ctx.openCustomDialog(options)
                    break;

                default:
                   
                    component =await getSource("@micro-page/appRender",{
                        inSpaOpen:true
                    })
                    console.log('接下来跳转什么',component, options );
                    this.open({
                        ...component,
                        // component:async()=>await getSource("@micro-page/appRender"),
                        ...options,
                    })
                    break;
            }
           
        },
        v2ComponentOpen(page, type = '', custom) {
          if(!page) return;
          const ctx = this;
          let option = {
            title: page.title,
            layout:"backTop",
            type,
            path: page.path || 'openSinglePage/render',
            body: true,
            params: page.params || {},
            hideConfirmBtn: true,
            hideCancelBtn: true,
            beforeConfirm: ($el) => {
              //8.0.0版本以上 点击确定关闭前调用此方法，回调第一个参数$el是子页面的实例
              return true;
            },
            confirmCallback: ($el) => {
            },
            cancelCallback: ($el) => {
              console.log("点击取消");
            },
            ...custom
          }
          const subParams = {
            propsData: {
              pageRenderConfig: page.params || {}
            },
            height: page?.dialogInfo?.height + page?.dialogInfo?.heightUnit || "80%",
            width: page?.dialogInfo?.width + page?.dialogInfo?.widthUnit || "60%",
          }
          const jsParams = {
            pageType: 'js',
            path: '/js',
            type: "BLANK",
          }
          const typeMap = new Map([
            [ '', ()=> { ctx.openRenderPage(option) } ],
            [ 'SUB', ()=> { option = { ...option, ...subParams };  ctx.openRenderPage(option) } ],
            [ 'drawer', ()=> {  } ],
            [ 'WINDOW', ()=> { window.open(page.path, "_blank"); } ],
            [ 'js', ()=> {  option = { ...option, ...jsParams }; ctx.open(option); } ]
          ])
          console.log('typeMap.get(type)', typeMap.get(type));

          typeMap.get(type).call(ctx);
        }
    }
}