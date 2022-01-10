与 build-utils 的区别是使用了 rollup-plugin-vue2 代替官方插件 rollup-plugin-vue（官方插件无法识别多个 Vue 存在的情况下，以及无法智能识别新旧版本的 vue-template-compiler）

但是要注意 rollup-plugin-vue2 无法对 scoped 的 css 作出响应