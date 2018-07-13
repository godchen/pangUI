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
      <!-- 前置内容 -->
      <span class="pang-input__prefix" v-if="$slots.prefix || prefixIcon" :style="prefixOffset">
        <slot name="prefix"></slot>
        <i class="pang-inpit__icon" v-if="prefixIcon" :class="prefixIcon"></i>
      </span>
      <!-- 后置内容 -->
      <span class="pang-input__suffix"
            v-if="$slots.suffix || suffixIcon || showClear || validateState && needStatusIcon"
            :style="suffixOffset">
      </span>
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
      autoComplete: {
        type: String,
        default: 'off'
      },
      clearable: {
        type: Boolean,
        default: false
      },
      disabled: Boolean,
      label: String,
      prefixIcon: String,
      suffixIcon: String,
      size: String,
      tabindex: String,
      type: {
        type: String,
        default: 'text'
      },
      validateEvent: {
        type: Boolean,
        default: true
      },
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
      },
      showClear() {
        return this.clearable &&
          !this.disabled &&
          !this.readonly &&
          this.currentValue !== '' &&
          (this.focused || this.hovering);
      },
    },

    watch: {

    },

    methods: {
      handleBlur(event) {
        this.focused = false;
        this.$emit('blur', event);
        if (this.validateEvent) {
          this.dispatch('PangFormItem', 'pang.form.blur', [this.currentValue]);
        }
      },
      handleChange(event) {
        this.$emit('change',event.target.value);
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
      handleFocus(event) {
        this.focused = true;
        this.$emit('focus', event);
      },
      handleInput(event) {
        const value = event.target.value;
        this.setCurrentValue(value);
        if (this.isOnComposition) {
          return;
        }
        this.$emit('input', value);
      },
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
          this.dispatch('PangFormItem', 'pang.form.change', [value]);
        }
      }
    },

    created() {

    },

    mounted() {

    }
  }
</script>
