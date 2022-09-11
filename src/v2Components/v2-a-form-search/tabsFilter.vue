<template>
    <div class="v2-a-tabs-filter">
        <el-tabs :class="[dropdownActive.name && 'dropdown-active']" v-model="active" tab-position="top" size="mini" @tab-click="tabClick">
            <el-tab-pane label="全部" name="all" />
            <template v-for="(item, idx) in renderList">
                <template v-if="idx < config.maxShowLimit">
                    <el-tab-pane :label="getLabel(item)" :name="item.name + ':' + item.value" :key="item.name + ':' + item.value" />
                </template>
            </template>
            <el-tab-pane :label="dropdownActive.name" :name="dropdownActive.name + ':' + dropdownActive.value" v-if="dropdownActive.name" />
        </el-tabs>

        <el-dropdown :class="[dropdownActive.name && 'is-active']" trigger="click" @command="tabClick" v-if="renderList.length > config.maxShowLimit">
            <span class="el-dropdown-link">{{ dropdownActive.name || '更多' }}<i class="el-icon-arrow-down el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
                <template v-for="(item, idx) of renderList">
                    <template v-if="idx >= config.maxShowLimit">
                        <el-dropdown-item :command="item.name + ':' + item.value" :key="idx">{{ item.name }}</el-dropdown-item>
                    </template>
                </template>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
export default {
    props: {
        config: {},
        entityId: {}
    },

    data() {
        return {
            active: 'all',
            dropdownActive: {
                name: '',
                value: ''
            },

            renderList: []
        };
    },

    computed: {
        getLabel() {
            return item => {
                return this.config.showRecordNum ? `${item.name}(${item.recordNum || 0})` : item.name;
            };
        }
    },

    mounted() {
        this.getRenderList();
    },

    methods: {
        getRenderList() {
            const renderList = [];
            this.config.options.forEach(async cur => {
                if (cur.enumSelected.length) {
                    cur.enumSelected.forEach(async t => {
                        if (this.config.showRecordNum) {
                            this.getRecordNum(t);
                        }
                        renderList.push(t); // name value
                    });
                } else if (cur.presetData && cur.presetData.label) {
                    const t = {
                        name: cur.label,
                        value: cur.presetData.key
                    };
                    if (this.config.showRecordNum) {
                        this.getRecordNum(t);
                    }
                    renderList.push(t);
                }
            });
            this.renderList = renderList;
        },

        /**
         * 重置
         */
        reset() {
            this.active = 'all';
            this.dropdownActive.name = '';
            this.dropdownActive.value = '';
        },

        tabClick(ctx) {
            // 点击 Dropdown
            if (typeof ctx === 'string') {
                const [ctxName] = ctx.split(':');
                const { field, option } = this.findSearchField(ctxName);
                field && this.$emit('search', field);

                this.active = option.value;
                this.dropdownActive.name = option.name;
                this.dropdownActive.value = option.value;

                // 点击 Tab
            } else {
                if (ctx.name === 'all') {
                    this.$emit('all');
                } else {
                    const { field } = this.findSearchField(ctx.name.split(':')[0]);
                    field && this.$emit('search', field);
                }
                this.dropdownActive.name = '';
                this.dropdownActive.value = '';
            }
        },

        async getRecordNum(item) {
            try {
                const { field } = this.findSearchField(item.name);
                if (field) {
                    const res = await pipe.entity.getEntityData(this.entityId, 'ALCAP_PAGEING', {
                        orders: [],
                        pageNum: 1,
                        ranges: [],
                        pageSize: 10000,
                        retrieveId: 'paging',
                        entityId: this.entityId,
                        query: {
                            [field.dictionaryItem.engNameShort]: field.value
                        }
                    });
                    if (res && res.response) {
                        this.$set(item, 'recordNum', res.response.totalElements || 0);
                    } else {
                        this.$set(item, 'recordNum', 0);
                    }
                } else {
                    this.$set(item, 'recordNum', 0);
                }

                // ...
            } catch (error) {
                this.$set(item, 'recordNum', 0);
                console.error(error);
                return Promise.reject(error);
            }
        },

        findSearchField(label) {
            let field = null;
            let option = null;

            this.config.options.forEach(f => {
                if (f.enumSelected.length) {
                    const target = f.enumSelected.find(s => s.name === label);
                    if (target) {
                        option = target;
                        field = { ...f.fields };
                        field.value = target.value;
                    }
                } else if (f.presetData && f.label === label) {
                    field = { ...f.fields };
                    const { presetData } = f;
                    switch (presetData.key) {
                        case 'loginUserName': {
                            field.value = this.$store.state.user.userName;
                            break;
                        }
                    }
                    option = {
                        name: f.label,
                        value: f.presetData.key
                    };
                }
            });

            return { field, option };
        }
    }
};
</script>

<style lang="scss" scoped>
.v2-a-tabs-filter {
    display: flex;
    align-items: center;
    width: min-content;

    ::v-deep .el-tabs {
        height: 42px;

        .el-tabs__nav-wrap::after {
            display: none;
        }

        .el-tabs__item {
            height: 32px;
            padding: 0 16px 0 0;

            &:last-child {
                padding: 0;
            }
        }

        &.dropdown-active {
            .el-tabs__item {
                &:last-child {
                    visibility: hidden;
                    pointer-events: none;
                }
            }
        }
    }

    ::v-deep .el-dropdown {
        z-index: 2;
        margin-left: 16px;
        height: 42px;
        padding-top: 10px;

        .el-dropdown-link {
            white-space: nowrap;
        }

        &.is-active {
            transform: translateX(-100%);

            .el-dropdown-link {
                color: var(--color-primary);
            }
        }
    }
}
</style>
