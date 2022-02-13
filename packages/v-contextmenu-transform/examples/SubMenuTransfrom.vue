<template>
  <div class="example">
    <v-contextmenu class="example-submenu-transform" ref="contextmenu" :theme="theme">
      <v-contextmenu-item @click="handleClick">菜单1</v-contextmenu-item>
      <v-contextmenu-item @click="handleClick">菜单2</v-contextmenu-item>

      <v-contextmenu-item divider></v-contextmenu-item>

      <v-contextmenu-submenu-transform @submenu-show="handleSubmenuShow" title="子菜单1">
        <v-contextmenu-item @click="handleClick">菜单3</v-contextmenu-item>

        <v-contextmenu-item divider></v-contextmenu-item>

        <v-contextmenu-submenu-transform title="子菜单2">
          <v-contextmenu-item :auto-hide="false" @click="handleClick">不自动关闭</v-contextmenu-item>
          <v-contextmenu-item @click="handleClick">菜单6</v-contextmenu-item>
          <v-contextmenu-submenu-transform title="子菜单3">
            <v-contextmenu-item :auto-hide="false" @click="handleClick">不自动关闭</v-contextmenu-item>
            <v-contextmenu-item @click="handleClick">菜单7</v-contextmenu-item>
            <v-contextmenu-submenu-transform title="子菜单3">
              <v-contextmenu-item :auto-hide="false" @click="handleClick">不自动关闭</v-contextmenu-item>
              <v-contextmenu-item @click="handleClick">菜单8</v-contextmenu-item>
            </v-contextmenu-submenu-transform>
          </v-contextmenu-submenu-transform>
        </v-contextmenu-submenu-transform>

        <v-contextmenu-item :auto-hide="false">不自动关闭1</v-contextmenu-item>
        <v-contextmenu-item :auto-hide="false">不自动关闭2</v-contextmenu-item>
      </v-contextmenu-submenu-transform>

      <v-contextmenu-item @click="handleClick">菜单4</v-contextmenu-item>
      <v-contextmenu-item @click="handleClick">菜单5</v-contextmenu-item>
      <v-contextmenu-item @click="handleClick">菜单6</v-contextmenu-item>
      <v-contextmenu-item @click="handleClick">菜单7</v-contextmenu-item>
      <v-contextmenu-item @click="handleClick">菜单8</v-contextmenu-item>
      <v-contextmenu-item @click="handleClick">菜单9</v-contextmenu-item>

      <v-contextmenu-submenu-transform @submenu-show="handleSubmenuShow" title="子菜单1">
        <v-contextmenu-item @click="handleClick">菜单3</v-contextmenu-item>

        <v-contextmenu-item divider></v-contextmenu-item>

        <v-contextmenu-item :auto-hide="false">不自动关闭1</v-contextmenu-item>
        <v-contextmenu-item :auto-hide="false">不自动关闭2</v-contextmenu-item>
      </v-contextmenu-submenu-transform>
    </v-contextmenu>

    <div :class="['box', theme]" v-contextmenu:contextmenu>右键点击此区域</div>
  </div>
</template>

<script>
export default {
  name: 'SubmenuTransform',

  props: {
    theme: String,
  },

  methods: {
    handleClick(vm, event) {
      console.log(vm, event)
    },
    handleSubmenuShow(vm, placement) {
      console.log(vm, placement)
    },
  },
}
</script>

<style scoped>
.box {
  width: 100%;
}
</style>

<style>
.example-submenu-transform.v-contextmenu {
  overflow: scroll;
  max-height: 300px;
}
</style>
