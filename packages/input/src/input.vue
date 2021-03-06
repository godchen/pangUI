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
        <span class="pang-input__suffix-inner">
          <template v-if="!showClear">
            <slot name="suffix"></slot>
            <i class="pang-input__icon"
              v-if="suffixIcon"
              :class="suffixIcon">
            </i>
          </template>
          <i v-else
            class="pang-input__icon pang-icon-circle-close pang-input__clear"
            @click="clear"></i>
        </span>
        <i class="pang-input__icon"
           v-if="validateState"
           :class="['pang-input__validateIcon', validateIcon]"></i>
      </span>
      <!-- 后置元素 -->
      <div class="pang-input-group__append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>
    <textarea
      v-else
      :tabindex="tabindex"
      class="pang-textarea__inner"
      :value="currentValue"
      @compositionstart="handleComposition"
      @compositionupdate="handleComposition"
      @composotionend="handleComposition"
      @input="handleInput"
      ref="textarea"
      v-bind="$attrs"
      :disabled="inputDisabled"
      :style="textareaStyle"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      :aria-label="label"
    >
    </textarea>
  </div>
</template>

<script>
  import calcTextareaHeight from './calcTextareaHeight';
  import emitter from '/src/mixins/emitter';
  import Migrating from '/src/mixins/migrating';
  import merge from '/src/utils/merge';
  import { isKorean } from '/src/utils/shared';

  export default {
    name: 'PANGInput',
    componentName: 'PANGInput',
    mixins: [emitter, Migrating],

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
        prefixOffset: null,
        suffixOffset: null,
        textareaCalcStyle: {},
        valueBeforeComposition: null,
      };
    },

    props: {
      autoComplete: {
        type: String,
        default: 'off'
      },
      autosize: {
        type: [Boolean, Object],
        default: false
      },
      clearable: {
        type: Boolean,
        default: false
      },
      disabled: Boolean,
      form: String,
      label: String,
      prefixIcon: String,
      resize: String,
      suffixIcon: String,
      size: String,
      tabindex: String,
      type: {
        type: String,
        default: 'text'
      },
      value: {
        String, Number
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
      isGroup() {
        return this.$slots.prepend || this.$slots.append;
      },
      needStatusIcon() {
        return this.pangForm ? this.pangForm.statusIcon : false;
      },
      showClear() {
        return this.clearable &&
          !this.disabled &&
          !this.readonly &&
          this.currentValue !== '' &&
          (this.focused || this.hovering);
      },
      textareaStyle() {
        return merge({}, this.textareaCalcStyle, { resize: this.resize});
      },
      validateState() {
        return this.pangFormItem ? this.pangFormItem.validateState : '';
      },
      validateIcon() {
        return {
          validating: 'pang-icon-loading',
          success: 'pang-icon-circle-check',
          error: 'pang-icon-circle-close'
        }[this.validateState]
      },
    },

    watch: {
      'value'(val, oldValue) {
        this.setCurrentValue(val);
      }
    },

    methods: {
      blur() {
        (this.$refs.input || this.$refs.textarea).blur();
      },
      calcIconOffset(place) {
        const pendantMap = {
          'suf': 'append',
          'pre': 'prepend'
        };

        const pendant = pendantMapp[place];

        if(this.$slots[pendant]) {
          return { transform: `translateX(${place === 'suf' ? '-' : ''}${this.$el.querySelector(`.pang-input-group__${pendant}`).offsetWidth}px)`};
        }
      },
      clear() {
        this.$emit('input', '');
        this.$emit('change', '');
        this.$emit('clear');
        this.setCurrentValue('');
        this.focus();
      },
      focus() {
        (this.$refs.input || this.$refs.textarea).focus();
      },
      getMigratingConfig() {
        return {
          props: {
            'icon': 'icon is removed, use suffix-icon / prefix-icon instead.',
            'on-icon-click': 'on-icon-click is removed.'
          },
          events: {
            'click': 'click is removed.'
          }
        }
      },
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
      select() {
        (this.$refs.input || this.$refs.textarea).select();
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
      this.$on('inputSelect', this.select);
    },

    mounted() {
      this.resizeTextarea();
      if (this.isGroup) {
        this.prefixOffset = this.calcIconOffset('pre');
        this.suffixOffset = this.calcIconOffset('suf');
      }
    }
  }
</script>
