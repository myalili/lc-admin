export class AbstractRegistry {
    map = {}
    /**
     * 注册Action支持以下写法:
     * regist({key:value})
     * regist(scope,{key:value})
     * regist('scope:key',value);
     * 
     * 不支持 regist(action)
     * @param {*} scope 
     * @param {*} v 
     */
    regist(scope, v, merge = false) {
        if (typeof (scope) == "object") {
            /**
             * 適合regist({key:value})
             */
            v = scope;
            scope = 'GLOBAL';
        } else if (v == null) return;
        //regist("scope:key",value);
        if (typeof (scope) == "string" && scope.indexOf(':') != -1) {
            let temp = scope.split(':')
            scope = temp[0];
            let key = temp[1];
            if (scope && key) {
                if (!this.map[scope]) {
                  this.map[scope] = {};
                }
                if (merge && this.map[scope][key] instanceof Array) {
                    //merge为true时，尝试合并数组
                    if (v instanceof Array)
                        this.map[scope][key] = this.map[scope][key].concat(v);
                    else
                        this.map[scope][key].push(v);
                } else {
                    this.map[scope][key] = v
                }
            }
            return;
        }

        //regist("scope:key",value);
        let old = this.map[scope];
        if (old === undefined) {
            this.map[scope || 'GLOBAL'] = v;
        } else {
            for (let k in v) {
                if (merge && old[k] instanceof Array) {
                    old[k] = old[k].concat(v[k]);
                } else
                    old[k] = v[k];
            }
        }
    }
    /**
     * 支持：
     * 1、get(key)，直接获取对应的value
     * 2、get(scope)，获取scope的全部内容+global的全部内容，重复内容scope优先
     * 3、get(scope,key)，获取scope中对应的key
     * 
     * @param {*} scope 
     * @param {*} key 
     */
    get(scope, key) {
        if (!this.map.GLOBAL) this.map.GLOBAL = {};

        if (scope && scope.indexOf(':') != -1) {
            let temp = scope.split(':')
            scope = temp[0];
            key = temp[1];
        }
        //具备scope和key时，严格查找
        if (scope && key) {
            let group = this.map[scope] || this.map.GLOBAL;
            return group && group[key] || this.map.GLOBAL[key];
        }
        //只具备scope时，等价于GLOBAL[key] || group+GLOBAL，
        if (scope) {
            if (scope == "GLOBAL")
                return this.map.GLOBAL;
            let x;
            //适应 get(key)，从全局获取数据
            if (x = this.map.GLOBAL[scope])
                return x;
            //适应get()情况，返回全局数据
            if (scope === null || scope === undefined) {
                return this.map.GLOBAL;
            }

            let group = this.map[scope];
            if (!group) return null;

            //适应 get(scope)情况，获取全局+指定範圍值
            return {
                ...(this.map.GLOBAL ? this.map.GLOBAL : {}),
                ...group
            }
        }
        //只提供key，视为在全局组查找指定项目，效果等同get(key)
        if (key) {
            return this.map.GLOBAL[key];
        }
        //不提供参数则返回全局组
        return this.map.GLOBAL;
    }
}