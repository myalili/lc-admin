<template>
  <div class="code-editor" style="height: 100%; width: 100%;" :class="options.theme || defaultOptions.theme">
    <textarea ref="textarea" name="code" style="height: 100%; width: 100%;"></textarea>
  </div>
</template>

<script>
import * as CodeMirror from 'codemirror/lib/codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/mode/groovy/groovy';
import 'codemirror/mode/xml/xml';

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default: () => {
        return {};
      }
    },
    searchStr: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      myValue: this.value,
      defaultOptions: {
        lineNumbers: true,
        theme: 'monokai',
        readOnly: false
        // lineWrapping: true
      }
    };
  },
  methods: {
    init() {
      this.codemirror = CodeMirror.fromTextArea(
        this.$refs.textarea,
        Object.assign(
          {
            mode: 'groovy',
            theme: 'monokai'
          },
          this.defaultOptions,
          this.options
        )
      );
      this.codemirror.setSize('100%', '100%');
      this.codemirror.setValue(this.myValue);
      this.codemirror.on('change', () => {
        this.myValue = this.codemirror.getValue();
      });
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    value(val) {
      if (val === this.codemirror.getValue()) {
        return;
      }
      this.codemirror.setValue(val);
    },
    myValue(val) {
      this.$emit('input', val);
    }
  }
};
</script>
