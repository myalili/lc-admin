<template>
    <div class="v2-a-work-agency-edit">
        <div class="flex-center margin-top-8">
            <span class="config-title">标题</span>
            <el-input size="mini" class="margin-left-8" v-model="obj.model[item.name].title"></el-input>
        </div>
        <div class="flex-center margin-top-8">
            <span class="config-title">标题图标</span>
            <!-- <el-input size="mini" class="margin-left-8" v-model="obj.model[item.name].titleIcon"></el-input> -->
            <span class="margin-left-8">
              <codeless-dialog-icon :value.sync="obj.model[item.name].titleIcon" :operationEnable = "true" />
            </span>
        </div>
        <div class="flex-center margin-top-8">
            <span class="config-title">“查看全部” 跳转</span>
            <page-select class="margin-left-8" :value.sync="obj.model[item.name].viewAllPage" :wid="obj.model.wid" />
        </div>
        <div class="flex-center margin-top-8">
            <span class="config-title">数据实体</span>
            <entity-select :wid="obj.model.wid" mode="id" :immedHandle="true" style="width: 100%" class="margin-left-8" schema-type="ALCAP_LIST" :value.sync="obj.model[item.name].entityId" @handleChange="entityChange" />
        </div>
        <div class="flex-center margin-top-8">
            <span class="config-title">显示标题字段：</span>
            <el-select class="margin-left-8" style="width: 100%" filterable value-key="id" v-model="obj.model[item.name].fields.titleField" placeholder="请选择" size="mini">
                <el-option v-for="field in fields" :key="field.id" :label="field.dictionaryItem.name" :value="field" />
            </el-select>
        </div>
        <div class="flex-center margin-top-8">
            <span class="config-title">状态字段：</span>
            <el-select class="margin-left-8" style="width: 100%" filterable value-key="id" v-model="obj.model[item.name].fields.statusField" placeholder="请选择" size="mini">
                <el-option v-for="field in fields" :key="field.id" :label="field.dictionaryItem.name" :value="field" />
            </el-select>
        </div>
        <div class="flex-center margin-top-8">
            <span class="config-title">任务描述字段：</span>
            <el-select class="margin-left-8" style="width: 100%" filterable value-key="id" v-model="obj.model[item.name].fields.taskDespField" placeholder="请选择" size="mini">
                <el-option v-for="field in fields" :key="field.id" :label="field.dictionaryItem.name" :value="field" />
            </el-select>
        </div>
        <div class="flex-center margin-top-8">
            <span class="config-title">创建时间字段：</span>
            <el-select class="margin-left-8" style="width: 100%" filterable value-key="id" v-model="obj.model[item.name].fields.createTimeField" placeholder="请选择" size="mini">
                <el-option v-for="field in fields" :key="field.id" :label="field.dictionaryItem.name" :value="field" />
            </el-select>
        </div>
    </div>
</template>

<script>
import pck from './package.json';
// import entitySelect from '@/views/codeLess/components/entitySelect';

export default {
    _options: pck.docs,
    name: 'v2AWorkAgencyEdit',

    // components: { entitySelect },

    props: {
        obj: {
            type: Object,
            default: () => {
                return {};
            }
        },
        item: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },

    data() {
        return {
            fields: []
        };
    },

    methods: {
        entityChange(e) {
            this.getSchemasAndFields(e);
        },
        getSchemasAndFields(e) {
            this.fields = e.fields;
        },

        // chooseMorePage(e) {
        //     this.obj.model[this.item.name].viewAllPage = e;
        // }
    }
};
</script>

<style lang="scss" scoped>
.v2-a-work-agency-edit {
    padding-bottom: 16px;
}

.config-title {
    font-weight: bold;
}

.flex-center {
    display: flex;
    align-items: center;
    white-space: nowrap;
}

.margin-top-8 {
    margin-top: 8px;
}
.margin-left-8 {
    margin-left: 8px;
}
</style>
