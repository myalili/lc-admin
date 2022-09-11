//默认打开的窗口
export function setOpenTabs(tabs) {
    try {
        tabs = JSON.stringify(tabs) || []
    } catch (e) {
        tabs = [];
    }
    window.sessionStorage.setItem('openTabs', tabs)
}

export function removeOpenTabs() {
    return window.sessionStorage.removeItem('openTabs')
}

export function getOpenTabs() {

    let data = window.sessionStorage.getItem('openTabs');
    try {
        data = JSON.parse(data) || []
    } catch (e) {
        data = [];
    }

    return data;


}

const state = {
    openedTabs: getOpenTabs(),
    activeTab: '', //激活状态

}
const mutations = {
    SET_TABS(state, tabs) {
        state.openedTabs = tabs;
        setOpenTabs(state.openedTabs);
    },
    ADD_TABS(state, tab) {
        state.openedTabs.push(tab);
        state.activeTab = tab.path;
        setOpenTabs(state.openedTabs);

    },
    ADD_SELF_TABS(state, tab) {
        for (const [i, v] of state.openedTabs.entries()) {
            if (v.path === state.activeTab) {
                state.openedTabs.splice(i, 1, tab);
                state.activeTab = tab.path;
                break;
            }
        }
        setOpenTabs(state.openedTabs);

    },
    DELETE_TABS(state, route) {
        for (const [i, v] of state.openedTabs.entries()) {
            if (v.path === route) {
                state.openedTabs.splice(i, 1);
                if (v.path === state.activeTab && i) {
                    state.activeTab = state.openedTabs[i - 1].path || '';
                }

                break;
            }
        }
        setOpenTabs(state.openedTabs);

    },
    DELETE_LEFT_TABS(state, tab) {
        let cIdx = state.openedTabs.findIndex(item => item.path === tab);//查找选中的index
        let leftTabs = state.openedTabs.filter((item, i) => i < cIdx);//左边打开的tabs
        let leftFixedTabs = leftTabs.filter(item => item.meta && item.meta.fixed);//帅选左边打开的固定tabs
        let inLeftTabs = leftTabs.some(item => item.path === state.activeTab);//关闭左边的窗口是否在激活的状态下
        state.openedTabs.splice(0, cIdx);
        state.openedTabs = [...leftFixedTabs, ...state.openedTabs];//把固定的窗口恢复回来
        if (inLeftTabs) state.activeTab = tab;//是在激活的状态下，关闭后激活选中的状态
        setOpenTabs(state.openedTabs);

    },

    DELETE_RIGHT_TABS(state, tab) {
        let cIdx = state.openedTabs.findIndex(item => item.path === tab);//查找选中的index
        let rightTabs = state.openedTabs.filter((item, i) => i > cIdx);//右边打开的tabs
        let rightFixedTabs = rightTabs.filter(item => item.meta && item.meta.fixed);//帅选右边打开的固定tabs
        let inRightTabs = rightTabs.some(item => item.path === state.activeTab);//关闭右边的窗口是否在激活的状态下
        let num = state.openedTabs.length - cIdx
        state.openedTabs.splice(cIdx + 1, num);
        state.openedTabs = [...state.openedTabs, ...rightFixedTabs,];//把固定的窗口恢复回来
        if (inRightTabs) state.activeTab = tab;//是在激活的状态下，关闭后激活选中的状态

        setOpenTabs(state.openedTabs);


    },
    DELETE_ALL_TABS(state) {
        state.openedTabs = state.openedTabs.filter(item => item.meta && item.meta.fixed);
        let openedTabs = state.openedTabs[state.openedTabs.length - 1];
        state.activeTab = (openedTabs && openedTabs.path) || '';
        setOpenTabs(state.openedTabs);

    },
    EMPTY_TABS(state) {
        state.openedTabs = []
        setOpenTabs(state.openedTabs);

    },
    SET_ACTIVE_TAB(state, tab) {
        state.activeTab = tab

    }

}
const actions = {

}


export default {
    namespaced: true,
    state,
    mutations,
    actions,

}