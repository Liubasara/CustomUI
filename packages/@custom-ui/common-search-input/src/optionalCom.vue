<template>
  <div class="js-template">{{ JSTemplate }}</div>
</template>

<script>
export default {
  data() {
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