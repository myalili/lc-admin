<template>
  <el-submenu :key="subMenu.id" :index="subMenu.id">
        <template slot="title">
            <codeless-icon
                :icon="subMenu.meta.icon"
                class="inline-block codeless-sub-menu-icon"
            ></codeless-icon>
            <span :title="subMenu.meta.title">{{ subMenu.meta.title }}</span>
        </template>
        <template v-for="menu in subMenu.children">
            <template v-if="menu.children && menu.children.length" >
                 <sub-menu-item :subMenu="menu"  :key="menu.id"></sub-menu-item>
            </template>
            <template v-else>
              <menu-item :menu="menu" :key="menu.id" ></menu-item>
            </template>
        </template>
    </el-submenu>
</template>

<script>
import menuItem from './menuItem'
export default {
    props:['subMenu'],
    name:'subMenuItem',
    components:{
        menuItem,
    },
    mounted(){
        // console.log(this.subMenu)
    }
}
</script>

<style>

</style>