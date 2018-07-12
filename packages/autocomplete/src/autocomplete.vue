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
  };
</script>
