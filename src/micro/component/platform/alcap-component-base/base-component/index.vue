<template>
  <component 
    :is="componentName"
    :obj="obj"
    :item="item"
    :option="option"
    size="mini"
  />
</template>

<script>
import arrayPage from '../type/array_page.vue';
import stringInput from '../type/string_input.vue';
import stringSelect from '../type/string_select.vue';
import boolean from '../type/boolean.vue';
import colorPicker from '../type/colorPicker.vue';
import stringDto from '../type/string_dto.vue';
import array from '../type/array.vue'
import stringPage from '../type/string_page';
import arrayDto from '../type/array_dto.vue';
import stringCode from '../type/string_code.vue';
import stringLabel from '../type/string_label.vue';
import objectInput from '../type/object.vue';
import dialogInput from '../type/dialog_input.vue';
import textareaInput from '../type/textarea.vue';


export default {
  name: 'baseComponent',
  components: {
    stringInput,
    stringSelect,
    boolean,
    colorPicker,
    stringDto,
    array,
    arrayPage,
    arrayDto,
    stringPage,
    stringCode,
    stringLabel,
    objectInput,
    dialogInput,
    textareaInput
  },
  props: {
    obj: {
      type: Object,
      default: ()=> {
        return {};
      }
    },
    option: {
      type: Array,
      default: ()=> {
        return [];
      }
    },
    item: {
      type: Object,
      default: ()=> {
        return {};
      }
    },
  },
  computed: {
    componentName() {
      const isMap = new Map([
        ['string_input', 'stringInput'],
        ['string_select', 'stringSelect'],
        ['boolean', 'boolean'],
        ['colorPicker', 'colorPicker'],
        ['dialog_input', 'dialogInput'],
        ['string_dto', 'stringDto'],
        ['array', 'array'],
        ['array_page', 'arrayPage'],
        ['string_page', 'stringPage'],
        ['array_dto', 'arrayDto'],
        ['string_code', 'stringCode'],
        ['string_label', 'stringLabel'],
        [ 'object', 'objectInput' ],
        [ 'textarea', 'textareaInput' ]
      ])
      console.log('22323', isMap.get(this.item.type));
      if(this.item.type === 'custom_component') {
        console.log('custom_component', this.item.component);
        return this.item.component;
      } else {
        
        return isMap.get(this.item.type);
      }
    },
    model() {
      return this.obj.model || {};
    },
  }

}
</script>

<style>

</style>