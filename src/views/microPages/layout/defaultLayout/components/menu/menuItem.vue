<template>
  <el-menu-item :key="menu.id" :index="menu.id" >
        <codeless-icon
            :icon="menu.meta.icon"
            class="inline-block codeless-sub-menu-icon"
        ></codeless-icon>
        <span slot="title" :title="menu.meta.title">{{
            menu.meta.title
        }}</span>
  </el-menu-item>
</template>

<script>
export default {
    props:['menu']
}
</script>

<style>

</style>