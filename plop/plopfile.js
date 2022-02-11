const vue3ComponentsGenerator = require('./generator/ui/vue3Components')
const vue2ComponentsGenerator = require('./generator/ui/vue2Components')

function cli(
  /** @type {import('plop').NodePlopAPI} */
  plop
) {
  plop.setGenerator('packages/@custom-ui', vue3ComponentsGenerator)
  plop.setGenerator('components/@custom-ui-vue2', vue2ComponentsGenerator)
}

module.exports = cli
