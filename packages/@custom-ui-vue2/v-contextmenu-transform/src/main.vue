<template>
  <div class="js-template-wrap">
    <Demo></Demo>
    <div>{{ JSTemplate }}</div>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api'
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
.js-template-wrap {
  background: lightcyan;
  color: red;
}
</style>