<template>
  <el-collapse-item name="serviceTaskOption" class="service-task-option">
    <div slot="title" class="panel-tab__title"><i class="header-icon el-icon-question"></i> 服务配置</div>
    <el-form size="mini" :disabled="readonly" label-width="80px">
      <el-form-item label="类型">
        <el-select v-model="serviceType">
          <el-option label="微服务任务" value="micro" />
          <el-option label="HTTP任务" value="http" />
          <el-option label="AMQ任务" value="amq" />
          <el-option label="决策表" value="dmn" />
          <el-option label="邮件任务" value="mail" />
          <el-option label="无" value="" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="serviceType === 'http'" label="HTTP任务">
        <el-input :value="http ? http.name : ''" placeholder="未配置HTTP" readonly>
          <el-button slot="append" type="primary" @click="toHttpServiceConfig">配置</el-button>
        </el-input>
      </el-form-item>
      <el-form-item v-if="serviceType === 'micro'" label="微服务任务">
        <el-input :value="micro ? micro.name : ''" placeholder="未配置服务" readonly>
          <el-button slot="append" type="primary" @click="toMicroServiceConfig">配置</el-button>
        </el-input>
      </el-form-item>
      <el-form-item v-if="serviceType === 'http' || serviceType === 'micro'" label="成功校验">
        <el-input v-model="conditionExpression" placeholder="使用EL表达式校验" />
      </el-form-item>
      <el-form-item v-if="serviceType === 'amq'" label="AMQ任务">
        <el-input :value="amqName" placeholder="未配置AMQ" readonly>
          <el-button slot="append" type="primary" @click="toAmqServiceConfig">配置</el-button>
        </el-input>
      </el-form-item>
      <el-form-item v-if="serviceType === 'dmn'" label="决策表Key">
        <el-input :value="dmn.decisionTableReferenceKey" placeholder="决策表" readonly>
          <el-button slot="append" type="primary" @click="toDecisionChoose">选择</el-button>
        </el-input>
      </el-form-item>
      <el-form-item v-if="serviceType === 'mail'" label="邮件任务">
        <el-input :value="mail ? mail.subject : ''" placeholder="未配置邮件任务" readonly>
          <el-button slot="append" type="primary" @click="toEmailServiceConfig">配置</el-button>
        </el-input>
      </el-form-item>
    </el-form>
  </el-collapse-item>
</template>

<script>
const { serviceTaskClass,jsonParse} = window.aopsUtils;
// import { listToMap } from '@/utils';
import Field from '@uae/uae-bpmn-editor/definitions/processElements/common/field'
import MicroServiceConfig from '../../chore/MicroServiceConfig'
import MailServiceConfig from '../../chore/MailServiceConfig'
import AmqServiceConfig from '../../chore/AmqServiceConfig'
import DecisionChoose from '../../chore/DecisionChoose'
export default {
  mixins:[window.V8.mixins],
  name: 'ServiceConfig',
  props: {
    node: {
      type: Object,
      require: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      serviceType: '',
      micro: null,
      http: null,
      amq: null,
      mail: null,
      conditionExpression: ''
    };
  },
  created() {
    this.initServiceType();
    this.initConditionExpression();
    this.initMicro();
    this.initHttp();
    this.initAmq();
    this.initMail();
  },
  computed: {
    dmn() {
      return this.node.dmn;
    },
    amqName() {
      return `topic=${this.amq?.topic ?? ''}; tags=${this.amq?.tags ?? ''}; keys=${this.amq?.keys ?? ''}`;
    }
  },
  watch: {
    serviceType(val) {
      switch (val) {
        case 'http':
          this.node.class = serviceTaskClass.http;
          this.node.type = '';
          this.node.fields = this.getHttpFields();
          break;
        case 'micro':
          this.node.class = serviceTaskClass.micro;
          this.node.type = '';
          this.node.fields = this.getMicroFields();
          break;
        case 'amq':
          this.node.class = serviceTaskClass.amq;
          this.node.type = '';
          this.node.fields = this.getAmqFields();
          break;
        case 'mail':
          this.node.class = '';
          this.node.type = 'mail';
          this.node.fields = this.getMailFields();
          break;
        case 'dmn':
          this.node.class = '';
          this.node.type = 'dmn';
          this.node.fields = [];
          break;
        default:
          this.node.class = '';
          this.node.type = '';
          this.node.fields = [];
      }
    }
  },
  methods: {
    initServiceType() {
      const node = this.node;
      if (node.class === serviceTaskClass.http) {
        this.serviceType = 'http';
      } else if (node.class === serviceTaskClass.micro) {
        if (this.api?.url) {
          this.serviceType = 'http';
        } else {
          this.serviceType = 'micro';
        }
      } else if (node.class === serviceTaskClass.amq) {
        this.serviceType = 'amq';
      } else if (node.class) {
        this.serviceType = 'class';
      } else if (node.type === 'dmn') {
        this.serviceType = 'dmn';
      } else if (node.type === 'mail') {
        this.serviceType = 'mail';
      }
    },
    initConditionExpression() {
      this.conditionExpression = this.node.fields.filter(item => item.name === 'conditionExpression')[0]?.string;
    },
    initMicro() {
      if (this.serviceType !== 'micro') return;
      const string = this.node.fields.filter(item => item.name === 'microService')[0]?.string;
      const object = jsonParse(string);
      const api = object?.api;
      if (api?.url) {
        api.url = '';
      }
      this.micro = api;
    },
    initHttp() {
      if (this.serviceType !== 'http') return;
      const string = this.node.fields.filter(item => item.name === 'microService')[0]?.string;
      const object = jsonParse(string);
      const api = object?.api;
      if (api && !api.url) {
        api.url = `http://${api.appName}${api.treePath}`;
      }
      this.http = api;
    },
    initAmq() {
      if (this.serviceType !== 'amq') return;
      const amq = {};
      this.node.fields.forEach(item => {
        if (item.name === 'topic') amq.topic = item.value;
        if (item.name === 'tags') amq.tags = item.value;
        if (item.name === 'keys') amq.keys = item.value;
        if (item.name === 'message') amq.message = item.value;
        if (item.name === 'properties') amq.properties = jsonParse(item.value, {});
      });
      this.amq = amq;
    },
    initMail() {
      if (this.serviceType !== 'mail') return;
      const mail = {};
      this.node.fields.forEach(item => {
        if (item.name === 'to') mail.to = item.value;
        if (item.name === 'subject') mail.subject = item.value;
        if (item.name === 'cc') mail.cc = item.value;
        if (item.name === 'text') mail.text = item.value;
      });
      this.mail = mail;
    },
    getMicroFields() {
      if (this.serviceType !== 'micro' || !this.micro) return [];
      return [
        new Field({
          name: 'microService',
          type: 'string',
          string: JSON.stringify({ api: this.micro })
        }),
        new Field({
          name: 'conditionExpression',
          type: 'string',
          string: this.conditionExpression
        })
      ];
    },
    getHttpFields() {
      if (this.serviceType !== 'http' || !this.http) return [];
      return [
        new Field({
          name: 'microService',
          type: 'string',
          string: JSON.stringify({ api: this.http })
        }),
        new Field({
          name: 'conditionExpression',
          type: 'string',
          string: this.conditionExpression
        })
      ];
    },
    getAmqFields() {
      if (this.serviceType !== 'amq' || !this.amq) return [];
      const fields = [];
      fields.push(new Field({ name: 'topic', type: 'string', string: this.amq.topic }));
      fields.push(new Field({ name: 'tags', type: 'string', string: this.amq.tags }));
      fields.push(new Field({ name: 'keys', type: 'string', string: this.amq.keys }));
      fields.push(new Field({ name: 'message', type: 'string', string: this.amq.message }));
      fields.push(new Field({ name: 'properties', type: 'string', string: JSON.stringify(this.amq.properties) }));
      return fields;
    },
    getMailFields() {
      if (this.serviceType !== 'mail' || !this.mail) return [];
      return [
        new Field({ name: 'to', type: 'string', string: this.mail.to }),
        new Field({ name: 'subject', type: 'string', string: this.mail.subject }),
        new Field({ name: 'cc', type: 'string', string: this.mail.cc }),
        new Field({ name: 'text', type: 'string', string: this.mail.text })
      ];
    },
    toMicroServiceConfig() {
      this.open({
        title: '微服务配置',
        path: '/MicroServiceConfig',
        component:MicroServiceConfig,
        // page: 'microPages/process/components/lpUaeBpmn/properties/MicroServiceConfig',
        customClass: 'aops-el-common',
        width: '600px',
        type: 'SUB',
        hideCancelBtn:true,
        hideConfirmBtn:true,
        // hideFooter: true,
        params: {
          api: this.micro
        },
        confirmCallback: api => {
          this.micro = api;
          this.node.fields = this.getMicroFields();
        }
      });
    },
    toHttpServiceConfig() {
      this.open({
        title: 'Http服务配置',
        path: '/MicroServiceConfig',
        component:MicroServiceConfig,
        // page: 'microPages/process/components/lpUaeBpmn/properties/MicroServiceConfig',
        customClass: 'aops-el-common',
        width: '600px',
        type: 'SUB',
        hideCancelBtn:true,
        hideConfirmBtn:true,
        // hideFooter: true,
        params: {
          api: this.http
        },
        confirmCallback: api => {
          this.http = api;
          this.node.fields = this.getHttpFields();
        }
      });
    },
    toEmailServiceConfig() {
      this.open({
        title: '配置邮件',
        path: '/MailServiceConfig',
        component:MailServiceConfig,
        // page: 'microPages/process/components/chore/MailServiceConfig',
        customClass: 'aops-el-common',
        width: '700px',
        type: 'SUB',
        hideCancelBtn:true,
        hideConfirmBtn:true,
        // hideFooter: true,
        params: {
          mail: this.mail
        },
        confirmCallback: mail => {
          this.mail = mail;
          this.node.fields = this.getMailFields();
        }
      });
    },
    toAmqServiceConfig() {
      this.open({
        title: '配置AMQ',
        path: '/AmqServiceConfig',
        component:AmqServiceConfig,
        // page: 'microPages/process/components/chore/AmqServiceConfig',
        customClass: 'aops-el-common',
        width: '600px',
        type: 'SUB',
        hideCancelBtn:true,
        hideConfirmBtn:true,
        // hideFooter: true,
        params: {
          amq: this.amq
        },
        confirmCallback: amq => {
          this.amq = amq;
          this.node.fields = this.getAmqFields();
        }
      });
    },
    toDecisionChoose() {
      this.open({
        title: '选择决策表',
        path: '/DecisionChoose',
        component:DecisionChoose,
        // page: 'microPages/process/components/chore/DecisionChoose',
        customClass: 'aops-el-common',
        width: '600px',
        type: 'SUB',
        hideCancelBtn:true,
        hideConfirmBtn:true,
        // hideFooter: true,
        confirmCallback: data => {
          this.dmn.decisionTableReferenceKey = data.id;
          this.node.fields = [];
        }
      });
    }
  }
};
</script>
