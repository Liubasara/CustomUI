<template>
  <div class="js-template">{{ JSTemplate }}</div>
</template>

<script>
import { ref } from '@vue/composition-api'
export default {
  setup() {
    const JSTemplate = ref('JS Template')
    return {
      JSTemplate
    }
  }
}
</script>

<style lang="less" scoped>
.js-template {
  background: #000;
  color: blue;
}
</style>