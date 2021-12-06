<template>
  <div class="ts-template">{{ TSTemplate }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  setup() {
    return {
      TSTemplate: 'my ts template'
    }
  }
})
</script>

<style lang="less">
@import '~@custom-liubasara-ui/frame-select/main.less';
@import './main.less';

.ts-template {
  background: #000;
  color: red;
}
</style>