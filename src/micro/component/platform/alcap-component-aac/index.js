
import Vue from 'vue';
import codelessCodeEditor from './codeless-code-editor/index.vue';

import codelessPagination from './codeless-pagination/index.vue';
import codelessSearch from './codeless-search/index.vue';

Vue.component(codelessCodeEditor.name, codelessCodeEditor);
Vue.component(codelessPagination.name, codelessPagination);
Vue.component(codelessSearch.name, codelessSearch);
