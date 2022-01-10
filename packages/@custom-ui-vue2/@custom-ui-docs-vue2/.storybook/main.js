module.exports = {
  webpackFinal: (config) => {
    config.module.rules.push({
      test: /\.less$/,
      use: ['vue-style-loader', 'css-loader', 'less-loader']
    })
    return config
  },
  stories: [
    '../stories/**/*.stories.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)'
    // "../stories-examples/**/*.stories.mdx",
    // "../stories-examples/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-actions',
    '@storybook/addon-knobs',
    '@storybook/addon-postcss'
  ],
  framework: '@storybook/vue'
}
