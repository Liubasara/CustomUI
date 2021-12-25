<template>
  <div class="ts-template">{{ TSTemplate }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useDemo } from '@/hooks/useDemo'

export default defineComponent({
  setup() {
    // const TSTemplate = 'my ts template'
    const TSTemplate: string = 'my ts template'
    useDemo()
    return {
      TSTemplate
    }
  }
})
</script>

<style lang="less" scoped>
@import "~@custom-lb-ui/frame-select/main.less";
@import "./main.less";

.ts-template {
  background: #000;
  color: red;
}
</style>