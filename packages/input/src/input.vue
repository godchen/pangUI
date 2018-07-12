<template>
  <div :class="[type === 'textarea' ? 'pang-textarea' : 'pang-input',
  inputSize ? 'pang-input--' + inputSize : '',
  {
    'is-disabled': inputDisabled,
    'pang-input-group': $slots.prepend || $slots.append,
    'pang-input-group--append': $slots.append,
    'pang-input-group--prepend': $slots.prepend,
    'pang-input--prefix': $slots.prefix || prefixIcon,
    'pang-input--suffix': $slots.suffix || suffixIcon || clearable
  }
  ]"
  @mouseenter="hovering = true"
  @mouseleave="hovering = false"
  >
    <template v-if="type !== 'textarea'">
      <!-- 前置元素 -->
      <div class="pang-input-group__prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <input
        :tabindex="tabindex"
        v-if="type !== 'textarea'"
        class="pang-input__inner"
        v-bind="$attrs"
        :type="type"
        :disabled="inputDisabled"
        :autocomplete="autoComplete"
        :value="currentValue"
        ref="input"
        @compositionstart="handleComposition"
        @compositionupdate="handleComposition"
        @composotionend="handleComposition"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        :aria-label="label"
      >
    </template>
  </div>
</template>

<script>
  import { isKorean } from '/src/utils/shared';
  import calcTextareaHeight from './calcTextareaHeight';

  export default {
    name: 'PANGInput',
    componentName: 'PANGInput',
    mixins: [],

    inheritAttrs: false,

    inject: {
      pangForm: {
        default: ''
      },
      pangFormItem: {
        default: ''
      }
    },

    data() {
      return {
        currentValue: this.value === undefined || this.value === null ? '' : this.value,
        focused: false,
        hovering: false,
        isOnComposition: false,
        textareaCalcStyle: {},
        valueBeforeComposition: null,
      };
    },

    props: {
      size: String,
      disabled: Boolean,
      type: {
        type: String,
        default: 'text'
      },
      autoComplete: {
        type: String,
        default: 'off'
      },
      validateEvent: {
        type: Boolean,
        default: true
      },
      prefixIcon: String,
      suffixIcon: String,
      clearable: {
        type: Boolean,
        default: false
      },
      tabindex: String
    },

    computed: {
      _pangFormItemSize() {
        return (this.pangFormItem || {}).pangFormItemSize;
      },
      inputSize() {
        return this.size || this._pangFormItemSize || (this.$PANG || {}).size;
      },
      inputDisabled() {
        return this.disabled || (this.pangForm || {}).disabled;
      }
    },

    watch: {

    },

    methods: {
      resizeTextarea() {
        if (this.$isServer) {
          return;
        }
        const { autosize, type} = this;
        if (type !== 'textarea') {
          return;
        }
        if (!autosize) {
          this.texrareaCalcStyle = {
            minHeight: calcTextareaHeight(this.$refs.textarea).minHeight
          };
          return;
        }
        const minRows = autosize.minRows;
        const maxRows = autosize.maxRows;

        this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
      },
      handleFocus(event) {
        this.focused = true;
        this.$emit('focus', event);
      },
      handleComposition(event) {
        if (event.type === 'compositionend') {
          this.isOnComposition = false;
          this.currentValue = this.valueBeforeComposition;
          this.valueBeforeComposition = null;
          this.handleInput(event);
        } else {
          const text = event.target.value;
          const lastCharacter = text[text.length - 1] || '';
          this.isOnComposition = !isKorean(lastCharacter);
          if (this.isOnComposition && event.type === 'compositionstart'){
            this.valueBeforeComposition = text;
          }
        }
      },
      handleInput(event) {
        const value = event.target.value;
        this.setCurrentValue(value);
        if (this.isOnComposition) {
          return;
        }
        this.$emit('input', value);
      },
      setCurrentValue(value) {
        if (this.isOnComposition && value === this.valueBeforeComposition) {
          return;
        }
        this.currentValue = value;
        if (this.isOnComposition) {
          return;
        }
        this.$nextTick( _ => {
          this.resizeTextarea();
        });
        if (this.validateEvent) {
          this.dispatch('PangFormItem', 'el.form.change', [value]);
        }
      }
    },

    created() {

    },

    mounted() {

    }
  }
</script>
