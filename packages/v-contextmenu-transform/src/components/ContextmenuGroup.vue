<template>
  <li class="v-contextmenu-group">
    <ul
      :style="menusStyle"
      class="v-contextmenu-group__menus"
    >
      <slot />
    </ul>
  </li>
</template>

<script>
export default {
  name: 'VContextmenuGroup',

  props: {
    maxWidth: {
      type: [Number, String],
      default: ''
    },
  },

  computed: {
    menusStyle() {
      if (!this.maxWidth) return null

      const style = {
        'max-width': typeof this.maxWidth === 'number' ? `${this.maxWidth}px` : this.maxWidth,
        'overflow-x': 'auto',
      }

      return style
    },
  },
}
</script>
