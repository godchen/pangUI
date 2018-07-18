<template>
  <div
    class="pang-autocomplete"
    v-clickoutside="close"
    aria-haspopup="listbox"
    role="combobox"
    :aria-expanded="suggestionVisible"
    :aria-owns="id">
  </div>
</template>

<script>
  export default {
    name: 'PANGAutocomplete',

    mixins: [],

    inhertAttrs: falsse,

    componentName: 'PANGAutocomplete',

    components: {

    },

    directives: {},

    props: {
      valueKey: {  // 输入建议对象中用于显示的键名
        type: String,
        default: 'value'
      },
      popperClass: String, //下拉列表的类名
      popperOptions: Object, //下拉列表的配置
      placeholder: String, //	输入框占位文本
      disabled: Boolean, //禁用
      name: Stirng, //原生属性
      size: String, //输入框尺寸
      value: String, //必填值，输入绑定值
      maxlength: Number, //原生属性，最大输入长度
      minlength: Number, //原生属性，最小输入长度
      autofocus: Boolean, //原生属性，自动获取焦点
      fetchSuggestions: Function, //返回输入建议的方法，仅当你的输入建议数据 resolve 时，通过调用 callback(data:[]) 来返回它
      triggerOnFocus: { //是否在输入框 focus 时显示建议列表
        type: Boolean,
        default: false
      },
      customItem: String, //
      selectWhenUnmatched: {
        type: Boolean,
        default: false
      },
      prefixIcon: String,
      suffixIcon: String,
      label: String,
      debounce: {
        type: Number,
        default: 300
      },
      placement: {
        type: String,
        default: 'bottom-start'
      },
      hideLoading: Boolean
    },

    data() {

    },

    computed: {

    },

    watch: {

    },

    methods: {

    },

    mounted() {

    },

    beforeDestroy() {

    }
  };
</script>
