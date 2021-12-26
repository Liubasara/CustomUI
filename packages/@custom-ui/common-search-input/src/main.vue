<template>
  <div class="js-template">
    <Demo></Demo>
    {{ JSTemplate }}
  </div>
</template>

<script>
import { ref } from 'vue'
import Demo from '@/components/Demo.vue'
// import Demo from './components/Demo.vue'

export default {
  components: {
    Demo
  },
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
  background: lightcyan;
  color: red;
}
</style>