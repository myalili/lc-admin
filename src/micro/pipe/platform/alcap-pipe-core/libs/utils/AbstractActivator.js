import {
    AbstractRegistry
} from "./AbstractRegistry";
// import $ from 'jquery'
// import Vue from 'vue'
// let MODEL_DIALOG = null;
// let MODEL_DIALOG_SUB = null;
export class AbstractActivator extends AbstractRegistry {
    constructor() {
        super();
        // this.componentRegistry = new AbstractRegistry();
        this.pageRegistry = new AbstractRegistry();
    }
    
    registPage() {
        this.pageRegistry.regist(...arguments);
    }
    getPage() {
        return this.pageRegistry.get(...arguments);
    }
    // registComponent() {
    //     this.componentRegistry.regist(...arguments);
    // }
    // closeDialog() {
    //     if (MODEL_DIALOG) {
    //         if(MODEL_DIALOG_SUB){
    //             $(MODEL_DIALOG_SUB.$el).remove();
    //             MODEL_DIALOG_SUB.$destroy();
    //             MODEL_DIALOG_SUB = null;
    //             let $sub = $('#__MODEL_DIALOG_SUB');
    //             $sub.remove();
    //         }else{
    //         $(MODEL_DIALOG.$el).remove();
    //         MODEL_DIALOG.$destroy();
    //         MODEL_DIALOG = null;
    //         $('#__MODEL_DIALOG').css({
    //             display: 'none',
    //         });
    //        }
    //     }
    //     // $('.ide_root').removeClass('blur')
    // }
    // /**
    //  * 打开一个全局的对话框，参数1为在Activator内注册的ComponentName，参数2为需要传入的props
    //  * @param {*} dialog 
    //  * @param {*} propsData 
    //  */
    //  openDialog(dialog, propsData, style = {} ,fatherStyle = {},isSub) {
    //     if(!$('#__MODEL_DIALOG').length){
    //         $('body').append($('<div id="__MODEL_DIALOG"></div>'))
    //       }
    //     let dialogCpt = dialog instanceof Object ? dialog : (this.componentRegistry.get(dialog) || Vue.component(dialog));
    //     let currentElMaxzIndex = 1999;
    //     if (dialogCpt) {
    //         let component = Vue.extend(dialogCpt);
    //         let c = new component({
    //             propsData

    //         });
    //         !isSub && this.closeDialog();
    //         if(!isSub){

    //             let t = $('<temp></temp>');
    //             $('#__MODEL_DIALOG').append(t);

    //             c.$mount(t.get(0));
    //             $('#__MODEL_DIALOG').css({
    //                 display: 'flex',
    //                 'justify-content': 'center',
    //                 'align-items': 'center',
    //                 position: 'fixed',
    //                 top: 0,
    //                 left: 0,
    //                 width: '100%',
    //                 height: '100%',
    //                 'z-index':currentElMaxzIndex,
    //                 background: 'rgba(0,0,0,.35)',
    //                 ...fatherStyle
    //             });
    //             if (propsData && propsData.__closeOnMask == true){  
            
    //                 $('#__MODEL_DIALOG').on('click', ev => {
    //                     // bad behaviour, would discard data unexpectedly
    //                     //功能必须，请详细说明原因（蔡羽）
    //                     this.closeDialog();
    //                 })
                
    //             }
            
    //             MODEL_DIALOG = c;
    //         }else{
    //             let $subCtn =  $('<div id=__MODEL_DIALOG_SUB></div>');
    //             $('#__MODEL_DIALOG').after($subCtn);

    //             let t = $('<temp></temp>');
    //             $('#__MODEL_DIALOG_SUB').append(t);
         
    //             c.$mount(t.get(0));
    //             $('#__MODEL_DIALOG_SUB').css({
    //                 display: 'flex',
    //                 'justify-content': 'center',
    //                 'align-items': 'center',
    //                 position: 'fixed',
    //                 top: 0,
    //                 left: 0,
    //                 width: '100%',
    //                 height: '100%',
    //                 'z-index': currentElMaxzIndex+1,
    //                 background: 'rgba(29,43,54,0.6)',
    //             });
    //             if (propsData && propsData.__closeOnMask == true){  
             
    //                    $('#__MODEL_DIALOG_SUB').on('click', ev => {
    //                     // bad behaviour, would discard data unexpectedly
    //                     //功能必须，请详细说明原因（蔡羽）
    //                     this.closeDialog();
    //                   })
                   
    //              }
                 
    //              MODEL_DIALOG_SUB = c;
    //         }
    //         let $modelSelector =  MODEL_DIALOG_SUB? $(MODEL_DIALOG_SUB.$el):$(MODEL_DIALOG.$el);
       
    //         $modelSelector.css({
    //             // position: 'absolute',
    //             // margin: '0 auto',
    //             // left: 0,
    //             // right: 0,
    //             // top: '10%',
    //             width: '80%',
    //             height: 'auto',
    //             background: 'white',
    //             'box-shadow':'0px 3px 6px rgba(0,0,0,0.16)',
    //             'border-radius':'4px',
    //             overflow:'hidden',
    //             // padding: '1rem',
    //             // 'box-shadow': '0 0 1px 1px lightgray',
    //             ...style,
    //         })
     
    //         $modelSelector.on('click', e => { 
    //             // e.stopPropagation();             
    //             // return false;     // 当绑定这个click事件后，弹窗上的页面的所有点击事件都无法触发 
           
    //             if (propsData && propsData.__closeOnMask == true) return false
    //         })
    //         if(MODEL_DIALOG_SUB){
                    
    //             MODEL_DIALOG_SUB.$on('close', e => {
    //                 if (MODEL_DIALOG_SUB && MODEL_DIALOG_SUB.beforeClose) {
    //                     MODEL_DIALOG_SUB.beforeClose();
    //                   }
    //                 this.closeDialog();
    //             });
    //             MODEL_DIALOG_SUB.$on('cancel', e => {
    //                 this.closeDialog();
    //             });
    //             MODEL_DIALOG_SUB.$on('save', e => {
    //                 this.closeDialog();
    //             });
      
    //             MODEL_DIALOG_SUB.$forceUpdate()
    
    //            }else{
    //                 MODEL_DIALOG.$on('close', e => {
    //                     this.closeDialog();
    //                 });
    //                 MODEL_DIALOG.$on('cancel', e => {
    //                     this.closeDialog();
    //                 });
    //                 MODEL_DIALOG.$on('save', e => {
    //                     this.closeDialog();
    //                 });
    //           }
    //     }
    // }
   
}