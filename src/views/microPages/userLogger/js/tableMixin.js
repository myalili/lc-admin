
const  {userLoggerApi} = window.getBffApi()
export default {
    /**
     * 
     *  此 Mixin 是对表格分页 增删改查 操作的封装
     *  并提供了以上操作的 前置、后置 hook
     *  能够自动适配表格搜索、分页、新增、编辑、单删、多删
     *  更改前先考虑是否会造成所有表格的数据操作问题
     * 
     */
    data() {
        return {
            loading: false,

            pageNumber: 1,
            pageSize: 15,
            totalPages: null,
            totalSize: 0,
            searchValue: '',
            tableData: [],
            multipleSelection: [],

            tips_title: '删除',
            tips_content: '是否确认删除？删除后将无法撤销',

            getDataPath: '',
            deleteDataPath: '',
            addDataPath: '',
            updateDataPath: '',


            API: userLoggerApi,
        }
    },
    methods: {
        //======== core event ========

        //初始化事件
        init() {
            if (!this.getDataPath) return;
            if (this.loading) return;
            console.log('[table mixin] init');
            this.loading = true
            const params = this.initParams()
            if (this.beforeInitHook(params)) {
                userLoggerApi.request(this.getDataPath, params, result => {
                    this.tableData = result?.obj?.content || [];
                    this.totalPages = result?.obj?.totalPages || 1;
                    this.totalSize = result?.obj?.totalElements || 0;
                    this.afterInitHook(result)
                    this.loading = false
                }, error => {
                    console.log(error);
                    this.loading = false
                    this.$message.error('加载失败！')
                })
            } else {
                this.loading = false
            }


        },

        scrollLoad() {
            if (this.totalPages != null && this.pageNumber == this.totalPages) {
                console.log('数据加载完成');
                return;
            }
            console.log('[table mixin] load');
            this.pageNumber++
            this.beforeScrollLoadHook()
            this.init()
        },


        //初始化函数事件请求参数
        initParams() {
            return {
                extra: {},
                pageNum: this.pageNumber,
                pageSize: this.pageSize,
                query: this.searchValue,
                orders: [
                    {
                        key: "createTime",
                        order: "desc",
                    },
                ],
            }
        },

        //表格多选事件
        multipleSelect(val) {
            this.multipleSelection = val;
        },

        //多选删除
        multipleDelete() {
            const self = this
            const params = self.multipleDeleteParams(...arguments)
            if (!self.multipleDeleteBefore(...arguments)) {
                return;
            }
            console.log('[table mixin] multipleDelete');
            self.tips(self.tips_title, self.tips_content, () => {
                self._delete(params, self.multipleDeleteAfter)
            })
        },

        //单选删除
        singleDelete() {
            const self = this
            const params = self.singleDeleteParams(...arguments)
            if (!self.singleDeleteBefore(...arguments)) {
                return;
            }
            console.log('[table mixin] singleDelete');
            self.tips(self.tips_title, self.tips_content, () => {
                self._delete(params, self.singleDeleteAfter)
            })
        },

        //核心删除事件
        _delete(params, cb) {
            const self = this
            self.loading = true
            userLoggerApi.request(self.deleteDataPath, params, res => {
                self.loading = false
                cb(res)
                self.init()
                self.$message.success('操作成功！')
            }, err => {
                self.loading = false
                console.log(err);
                self.$message.error('操作失败！')
            })
        },

        //添加数据
        add(params, cb) {
            const self = this
            userLoggerApi.request(self.addDataPath, params, res => {
                cb && cb(res)
                self.init()
                self.$message.success('操作成功！')
            }, err => {
                console.log(err);
                self.$message.error('操作失败！')
            })
        },

        //更新数据
        update(params, cb) {
            const self = this
            userLoggerApi.request(self.updateDataPath, params, res => {
                cb && cb(res)
                self.init()
                self.$message.success('操作成功！')
            }, err => {
                console.log(err);
                self.$message.error('操作失败！')
            })
        },

        // prompt 提示
        tips(title, content, confirm) {
            window.activator.openDialog(
                "promptDialog",
                {
                    title: title,
                    message: content,
                    onConfirm: confirm,
                },
                { width: "500px", height: "auto" }
            );
        },

        pageSizeChange(size) {
            this.pageSize = size
            this.init()
        },

        pageNumberChange(number) {
            this.pageNumber = number
            this.init()
        },



        //======== public methods =======
        formatDate(row) {
            if (row.createTime) {
                return userLoggerApi.request("formatDate", row.createTime);
            } else {
                return "无数据";
            }
        },


        //========= Hooks =========

        //页面初始化事件执行之前 返回值作为是否继续执行的标识
        beforeInitHook() { return true },
        //页面初始化事件执行之后
        afterInitHook() { },
        //滚动触发加载之前的钩子
        beforeScrollLoadHook() { },
        //自定义单个删除 参数
        singleDeleteParams(data) { return [data.id] },
        //自定义多个删除 参数
        multipleDeleteParams() { return this.multipleSelection.map(i => i.id) },
        // 执行单个删除的前提条件
        singleDeleteBefore() { return true },
        // 执行多个删除的前提条件
        multipleDeleteBefore() { return this.multipleSelection.length > 0; },
        //单个删除 成功钩子
        singleDeleteAfter() { },
        //多个删除 成功钩子
        multipleDeleteAfter() { },
    },
}