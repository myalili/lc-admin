import Vuex from 'vuex'
export default () => {
    return new Vuex.Store({
        state: {
            modalIns: null,
            modalVisible: false
        },

        mutations: {
            set_modalIns(state, val) {
                state.modalIns = val;
            },
            set_modalVisible(state, val) {
                state.modalVisible = val
            }

        }
    })
}
