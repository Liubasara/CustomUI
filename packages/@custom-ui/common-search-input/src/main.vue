<template>
  <div class="js-template">{{ JSTemplate }}</div>
</template>

<script>
export default {
  setup() {
    return {
      JSTemplate: 'JS Template'
    }
  }
}
</script>

<style lang="less">
.js-template {
  background: #000;
  color: blue;
}
</style>