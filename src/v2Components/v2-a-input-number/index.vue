<template>
    <el-input-number v-model="num" controls-position="right" @change="handleChange"></el-input-number>
</template>

<script>
export default {
    model: {
        prop: 'value',
        event: 'change'
    },

    props: {
        value: {
            type: Number
        }
    },

    data() {
        return {
            num: this.value
        };
    },

    watch: {
        value(v) {
            this.num = v;
        }
    },

    methods: {
        handleChange(value) {
            this.$emit('change', value);
        }
    }
};
</script>
