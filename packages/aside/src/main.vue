<template>
  <aside class="pang-aside" :style="{ width }">
    <slot></slot>
  </aside>
</template>

<script>
  export default {
    name: 'PANGAside',
    componentName: 'PANGAside',
    props: {
      width: {
        type: String,
        default: '300px'
      }
    }
  };
</script>
