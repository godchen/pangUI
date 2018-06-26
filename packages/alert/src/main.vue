<template>
  <div
    class="pang-alert"
    :class="typeClass"
    v-show="visible"
    role="alert"
  >
    <i class="pang-alert__icon" :class="[ iconClass ]"></i>
    <div class="pang-alert__content">
      <span class="pang-alert__title" v-if="title">{{ title }}</span>
      <slot>
        <p class="pang-alert__description" v-if="description">{{ description }}</p>
      </slot>
      <i class="pang-alert__closebtn" v-show="closable" @click="close()">{{closeText}}</i>
    </div>
  </div>
</template>

<script type="text/babel">
  const TYPE_CLASSES_MAP = {
    'success': 'pang-icon-success',
    'warning': 'pang-icon-warning',
    'error': 'pang-icon-error'
  };
  export default {
    name: 'PANGAlert',

    props: {
      title: {
        type: String,
        default: '',
        required: true
      },
      description: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'info'
      },
      closable: {
        type: Boolean,
        default: true
      },
      closeText: {
        type: String,
        default: ''
      },
      center: Boolean
    },

    data() {
      return {
        visible: true
      };
    },

    methods: {
      close() {
        this.visible = false;
        this.$emit('close');
      }
    },

    computed: {
      typeClass() {
        return `pang-alert--${ this.type }`;
      },

      iconClass() {
        return TYPE_CLASSES_MAP[this.type] || 'pang-icon-info';
      }
    }
  };
</script>
