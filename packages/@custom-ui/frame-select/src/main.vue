<template>
  <div>
    <div class="ts-template">
      <Demo></Demo>
      {{ TSTemplate }}
    </div>
    <div>
      <CommonSearchInput></CommonSearchInput>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { Ref } from 'vue'
import { useDemo } from './hooks/useDemo'
import Demo from './components/Demo.vue'
import CommonSearchInput from '@custom-lb-ui/common-search-input'

export default defineComponent({
  components: {
    Demo,
    CommonSearchInput
  },
  setup() {
    // const TSTemplate = 'my ts template'
    const TSTemplate: Ref<string> = ref('my ts template')
    useDemo()
    return {
      TSTemplate
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@custom-lb-ui/frame-select/main.less';
@import './main.less';

.ts-template {
  background: #000;
  color: red;
}
</style>