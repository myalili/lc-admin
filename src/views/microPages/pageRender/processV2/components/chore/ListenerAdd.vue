<template>
  <el-container class="ListenerAdd">
    <el-main style="max-height:450px">
      <el-form size="mini" :model="listener" label-width="100px" ref="form1" label-suffix=":">
        <el-form-item label="监听器类型" required>
          <el-select v-model="listenerType" style="width:100%">
            <el-option label="HTTP请求" value="http" />
            <el-option label="微服务请求" value="micro" />
            <el-option label="AMQ" value="amq" />
            <el-option label="Java类" value="class" />
            <el-option label="表达式" value="expression" />
            <el-option label="委托表达式" value="delegateExpression" />
          </el-select>
        </el-form-item>
        <el-form-item label="事件类型" prop="event" required>
          <el-select v-model="listener.event" style="width:100%">
            <el-option label="start" value="start" v-show="isExecutionListener" />
            <el-option label="end" value="end" v-show="isExecutionListener" />
            <el-option label="create" value="create" v-show="isTaskListener" />
            <el-option label="assignment" value="assignment" v-show="isTaskListener" />
            <el-option label="complete" value="complete" v-show="isTaskListener" />
            <el-option label="delete" value="delete" v-show="isTaskListener" />
          </el-select>
        </el-form-item>
        <template v-if="listenerType === 'micro'">
          <template v-if="api && api.appName">
            <el-form-item label="请求方式" prop="api.httpMethod" required>
              <el-select v-model="api.httpMethod">
                <el-option label="GET" value="GET"></el-option>
                <el-option label="POST" value="POST"></el-option>
                <el-option label="PUT" value="PUT"></el-option>
                <el-option label="DELETE" value="DELETE"></el-option>
              </el-select>
              <el-button type="text" @click="toScOperationChoose" style="margin-left:14px">重新选择</el-button>
            </el-form-item>
            <el-form-item label="服务名称" prop="api.appName" required>
              <el-input v-model="api.appName" clearable />
            </el-form-item>
            <el-form-item label="请求路径" prop="api.treePath" required>
              <el-input v-model="api.treePath" clearable />
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="选择服务" prop="api.appName" required>
              <el-button type="text" @click="toScOperationChoose">选择</el-button>
            </el-form-item>
          </template>
        </template>
        <template v-else-if="listenerType === 'http'">
          <el-form-item label="请求方式" prop="api.httpMethod" required>
            <el-select v-model="api.httpMethod" style="width:100%">
              <el-option label="GET" value="GET"></el-option>
              <el-option label="POST" value="POST"></el-option>
              <el-option label="PUT" value="PUT"></el-option>
              <el-option label="DELETE" value="DELETE"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="请求URL" prop="api.url" required>
            <el-input v-model="api.url" clearable />
          </el-form-item>
        </template>
        <template v-else-if="listenerType === 'amq'">
          <el-form-item label="主题" prop="amq.topic" required>
            <el-input v-model="amq.topic" placeholder="topic" clearable />
          </el-form-item>
          <el-form-item label="标签" prop="amq.tags">
            <el-input v-model="amq.tags" placeholder="tags, 多个逗号分隔" clearable />
          </el-form-item>
          <el-form-item label="Keys" prop="amq.keys">
            <el-input v-model="amq.keys" placeholder="keys, 多个逗号分隔" clearable />
          </el-form-item>
          <el-form-item label="信息" prop="amq.message">
            <el-input
              v-model="amq.message"
              type="textarea"
              :rows="4"
              placeholder="message"
              style="width:100%"
              clearable
            />
          </el-form-item>
          <el-form-item label="自定义参数">
            <el-table :data="amq.properties" style="width:100%">
              <el-table-column label="属性名称" prop="name" show-overflow-tooltip />
              <el-table-column label="属性值" prop="value" show-overflow-tooltip />
              <el-table-column label="操作" width="90px">
                <template slot-scope="{ row, $index }">
                  <el-button size="mini" type="text" @click="toEditProperty(row)">编辑</el-button>
                  <el-button size="mini" type="text" @click="amq.properties.splice($index, 1)">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="opr_bottom_button">
              <el-button size="mini" type="primary" icon="el-icon-plus" @click="toAddProperty">添加字段</el-button>
            </div>
          </el-form-item>
        </template>
        <template v-else>
          <!-- 其他类型的配置项 -->
          <el-form-item label="Java类" prop="class" v-if="listenerType === 'class'" required>
            <el-input v-model="listener.class" clearable />
          </el-form-item>
          <el-form-item label="表达式" prop="expression" v-if="listenerType === 'expression'" required>
            <el-input v-model="listener.expression" clearable />
          </el-form-item>
          <el-form-item
            label="委托表达式"
            prop="delegateExpression"
            v-if="listenerType === 'delegateExpression'"
            required
          >
            <el-input v-model="listener.delegateExpression" clearable />
          </el-form-item>
        </template>
        <el-form-item v-if="listenerType === 'http' || listenerType === 'micro'" label="成功校验">
          <el-input v-model="conditionExpression" placeholder="使用EL表达式校验" />
        </el-form-item>
      </el-form>
      <template v-if="listenerType === 'micro'">
        <!-- micro 类型的参数配置 -->
        <HttpParamTable v-if="api.appName" :params="api.params" />
      </template>
      <template v-else-if="listenerType === 'http'">
        <!-- http 类型的参数配置 -->
        <HttpParamTable :params="api.params" />
      </template>
      <template v-else-if="listenerType === 'amq'"></template>
      <template v-else>
        <!-- 其他类型的字段配置 -->
        <FieldTable :fields="listener.fields" />
      </template>
    </el-main>
    <el-footer style="text-align:right">
      <el-button @click="close()">取消</el-button>
      <el-button @click="handleSave" type="primary">保存</el-button>
    </el-footer>
  </el-container>
</template>

<script>
import HttpParamTable from '../HttpParamTable';
import FieldTable from '../FieldTable';
const { listToMap,getRequestBody,taskListenerClass, executionListenerClass,jsonParse} = window.aopsUtils;

import Field from '@uae/uae-bpmn-editor/definitions/processElements/common/field';
import OperationChoose from '../../components/serverCatalog/OperationChoose'
import PropertyAdd from './PropertyAdd'
export default {
  mixins:[window.V8.mixins],
  name: 'ListenerAdd',
  components: {
    HttpParamTable,
    FieldTable
  },
  data() {
    return {
      listenerType: '',
      conditionExpression: '',
      listener: {
        event: 'start',
        class: '',
        expression: '',
        delegateExpression: '',
        fields: []
      },
      amq: {
        topic: '',
        tags: '',
        keys: '',
        message: '',
        properties: []
      },
      api: {
        httpMethod: 'GET',
        url: '',
        appName: '',
        treePath: '',
        timeout: 0,
        params: []
      }
    };
  },
  created() {
    if (this.isTaskListener) {
      this.listener.event = 'create';
    }
    if (this.AParams.listener) {
      this.listener = this.AParams.listener;
    }
    this.initListenerType();
    this.initConditionExpression();
    this.initApi();
    this.initAmq();
  },
  computed: {
    isTaskListener: um => um.AParams.type === 'task',
    isExecutionListener: um => um.AParams.type !== 'task',
    // isTaskListener: um => um.PageQuery.type === 'task',
    // isExecutionListener: um => um.PageQuery.type !== 'task',
    listenerClass: um => (um.isTaskListener ? taskListenerClass : executionListenerClass)
  },
  watch: {
    listenerType(value) {
      const api = this.api;
      const listener = this.listener;
      if (value === 'http') {
        api.url = api.url || `http://${api.appName}${api.treePath}`;
        listener.class = this.listenerClass.http;
      } else if (value === 'micro') {
        api.url = '';
        listener.class = this.listenerClass.micro;
      } else if (value === 'amq') {
        listener.class = this.listenerClass.amq;
      }
    }
  },
  methods: {
    initListenerType() {
      const listener = this.listener;
      const listenerClass = this.listenerClass;
      if (listener.class === listenerClass.amq) {
        this.listenerType = 'amq';
      } else if (listener.class === listenerClass.http) {
        this.listenerType = 'http';
      } else if (listener.class === listenerClass.micro) {
        if (this.api?.url) {
          this.listenerType = 'http';
        } else {
          this.listenerType = 'micro';
        }
      } else if (listener.class) {
        this.listenerType = 'class';
      } else if (this.expression) {
        this.listenerType = 'expression';
      } else if (this.delegateExpression) {
        this.listenerType = 'delegateExpression';
      } else {
        this.listenerType = 'micro';
      }
    },
    initConditionExpression() {
      this.conditionExpression = this.listener.fields.filter(item => item.name === 'conditionExpression')[0]?.string;
    },
    initApi() {
      const string = this.listener.fields.filter(item => item.name === 'microService')[0]?.string;
      const object = jsonParse(string);
      if (object?.api) {
        this.api = object.api;
      }
    },
    initAmq() {
      this.listener.fields.forEach(item => {
        if (item.name === 'topic') this.amq.topic = item.value;
        if (item.name === 'tags') this.amq.tags = item.value;
        if (item.name === 'keys') this.amq.keys = item.value;
        if (item.name === 'message') this.amq.message = item.value;
        if (item.name === 'properties') {
          const object = jsonParse(item.value, {});
          this.amq.properties = Object.keys(object).map(item => ({
            name: item,
            value: object[item]
          }));
        }
      });
    },
    handleSave() {
      const listenerType = this.listenerType;
      let fields = this.listener.fields;
      switch (listenerType) {
        case 'micro':
          this.api.url = '';
        // eslint-disable-next-line no-fallthrough
        case 'http':
          fields = [
            new Field({
              name: 'microService',
              string: JSON.stringify({ api: this.api })
            }),
            new Field({
              name: 'conditionExpression',
              type: 'string',
              string: this.conditionExpression
            })
          ];
          break;
        case 'amq':
          fields = [
            new Field({
              name: 'topic',
              string: this.amq.topic
            }),
            new Field({
              name: 'tags',
              string: this.amq.tags
            }),
            new Field({
              name: 'keys',
              string: this.amq.keys
            }),
            new Field({
              name: 'message',
              string: this.amq.message
            }),
            new Field({
              name: 'properties',
              string: JSON.stringify(
                listToMap(
                  this.amq.properties,
                  item => item.name,
                  item => item.value
                )
              )
            })
          ];
      }
      // this.$store.commit('callback', {
      //   name: 'success',
      //   arg: {
      //     ...this.listener,
      //     fields
      //   }
      // });
       this.$root.confirm({
          ...this.listener,
          fields
        })
      // this.close();
    },
    toScOperationChoose() {
      this.open({
        title: '选择服务',
        path: '/OperationChoose',
        component:OperationChoose,
        // page: 'microPages/process/components/serverCatalog/OperationChoose',
        customClass: 'aops-el-common',
        width: '600px',
        type: 'SUB',
        hideCancelBtn:true,
        hideConfirmBtn:true,
        // hideFooter: true,
        confirmCallback: ({ overview, operation, operationDetail }) => {
          const params = jsonParse(operationDetail?.params, []).map(item => ({ ...item, value: '' }));
          const requestBody = getRequestBody(operationDetail);
          if (requestBody.mediaType) {
            params.push({
              name: 'Content-Type',
              in: 'header',
              value: requestBody.mediaType
            });
            params.push({
              name: 'body',
              in: 'body',
              value: requestBody.mediaValue
            });
          }
          this.api = {
            name: operation.cnName,
            httpMethod: operation.method,
            protocol: operation.protocol,
            url: '',
            appName: overview.code,
            treePath: operation.url,
            timeout: 0,
            params,
            sc: { overview, operation, operationDetail }
          };
        }
      });
    },
    toAddProperty() {
      this.open({
        hideCancelBtn:true,
        hideConfirmBtn:true,
        title: '添加属性',
        path: '/PropertyAdd',
        component:PropertyAdd,
        // page: 'microPages/process/components/chore/PropertyAdd',
        type: 'SUB',
        customClass: 'aops-el-common',
        width: '600px',
        // hideFooter: true,
        hideCancelBtn:true,
        hideConfirmBtn:true,
        confirmCallback: data => {
          this.amq.properties.push(data);
        }
      });
    },
    toEditProperty(property) {
      this.open({
        title: '编辑属性',
        path: '/PropertyAdd',
        component:PropertyAdd,
        // page: 'microPages/process/components/chore/PropertyAdd',
        type: 'SUB',
        customClass: 'aops-el-common',
        width: '600px',
        hideCancelBtn:true,
        hideConfirmBtn:true,
        // hideFooter: true,
        params: {
          property
        },
        confirmCallback: data => {
          Object.assign(property, data);
        }
      });
    }
  }
};
</script>
