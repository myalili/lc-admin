<template>
    <svg xmlns="http://www.w3.org/2000/svg" @click="adddepartmentfun" :width="width" :height="width" viewBox="0 0 12 12">
        <path id="circle-plus-outline" class="cls-1" d="M5.857,7.571h4.286a.429.429,0,1,1,0,.857H5.857a.429.429,0,1,1,0-.857Zm1.714,2.571V5.857a.429.429,0,1,1,.857,0v4.286a.429.429,0,1,1-.857,0Zm.429,3a5.145,5.145,0,1,0-3.636-1.507A5.12,5.12,0,0,0,8,13.143ZM8,14a6.012,6.012,0,1,1,4.239-1.761A5.987,5.987,0,0,1,8,14Z" transform="translate(-2 -2)"/>
    </svg>
</template>
<script>
export default {
    props:{
        width:12,
        height: 12,
        dataid:null
    },
    methods:{
        adddepartmentfun(){
            this.$emit('adddepartmentfun',this.dataid);
        }
    }
}
</script>
<style lang="scss" scoped>
    .cls-1 {
        fill: var(--color-primary-dark-1);
    }
</style>