<template>
<div class="default-dialog-head-ctn">
    <div class="title flex items-center" :class="titleLocation">{{title}}
        <slot name='title'></slot>
        <slot name="titleRight"></slot>
    </div>
    <div class="right-tool-ctn"><slot></slot><i class="iconfont icon-guanbi-danchuang" @click.stop="$emit('close')" v-if='!hide'></i></div>
</div>
</template>
<script>
export default {
    name:'dialogHeader',
    inheritAttrs: false,
    props:{
        titleLocation:{
            type:String,
            default:'left'
        },
        title:{
            type:String,
            default:''
        },
        hide:{
            type:Boolean,
            default:false
        }
    },
    methods:{

    }
}
</script>
<style lang="scss" scoped>
.default-dialog-head-ctn{
    width: 100%;
    height: 42px;
    // background: #F7FAFB;
    // position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #E6EAED;
   .title{
       font-size: 14px;
       color:#333333;
       margin-left: 20px;
       font-weight: 600;
       &.left{
           float: left;

       }
       &.center{
           text-align: center;
       }
   }
   .right-tool-ctn{
    //    position: absolute;
    //    right: 0;
    //    top: 0;
    //    bottom: 0;
    //    padding: 3px 20px;
       display: flex;
       align-items: center;
       margin-right:20px;
       >i{
           font-size: 13px;
           color: #7f8c93;
           cursor: pointer;
       }
       .icon-guanbi-danchuang{
            font-size: 13px;
            // width: 18px;
            // height: 18px;
            // text-align: center;
            // vertical-align: middle;
            // border-radius: 50%;
            // background: linear-gradient(316deg, #15C0FF 0%, #00DDAA 100%);
            // color: #ffffff;
            // line-height: 18px;

            // &::before{
            //     transform: scale(.7);
            //     display: inline-block;
            // }
       }
   }
}
</style>