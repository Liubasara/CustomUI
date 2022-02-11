const path = require('path')
const { execSync } = require('child_process')
const utils = require('../../utils')

const ROOT_PATH = path.resolve(__dirname, '..', '..', '..')
const PLOP_DIR = path.resolve(ROOT_PATH, 'plop')
const TEMPLATES_DIR = path.resolve(PLOP_DIR, 'templates')

/** @type {import('plop').PlopGenerator} */
module.exports = {
  description: '创建 Vue2 UI 组件',
  prompts: [
    {
      type: 'input',
      name: 'componentName',
      message: '组件名称'
    }
  ],
  /**
   * @param {@types {componentName: number}} data
   * @returns
   */
  actions: (data) => {
    const { componentName } = data
    const packageName = utils.convertStrToJoiner(componentName)
    const JAVASCRIPT_TEMPLATE_DIR = path.resolve(
      TEMPLATES_DIR,
      'vue2-javascript'
    )
    const PACKAGE_DIR = path.resolve(ROOT_PATH, 'packages', '@custom-ui-vue2')
    const COMPONENT_DIR = path.resolve(PACKAGE_DIR, packageName)
    const STORY_DIR = path.resolve(PACKAGE_DIR, '@custom-ui-docs-vue2')

    return [
      {
        type: 'addMany',
        base: JAVASCRIPT_TEMPLATE_DIR,
        templateFiles: path.resolve(JAVASCRIPT_TEMPLATE_DIR, '**', '*.hbs'),
        destination: COMPONENT_DIR,
        data: {
          componentName,
          packageName
        }
      },
      {
        type: 'add',
        templateFile: path.resolve(
          TEMPLATES_DIR,
          'stories',
          'vue2Template.js.hbs'
        ),
        path: path.resolve(
          STORY_DIR,
          'stories',
          componentName,
          `${componentName}.stories.js`
        ),
        data: {
          componentName,
          packageName
        }
      },
      function custom() {
        // 安装组件依赖
        execSync(`pnpm install --filter=@custom-lb-ui/${packageName} install`, {
          stdio: [0, 1, 2]
        })
        // 安装 story 依赖
        execSync(
          `pnpm --filter=@custom-lb-ui/docs-vue2 install @custom-lb-ui/${packageName}`,
          {
            stdio: [0, 1, 2]
          }
        )
        // 打包组件
        execSync(
          `pnpm --filter=@custom-lb/build-utils-vue2 build:customUI -- --component=@custom-lb-ui/${packageName}`,
          {
            stdio: [0, 1, 2]
          }
        )
        return `使用 pnpm --filter=@custom-lb/build-utils-vue2 build:customUI -- --component=@custom-lb-ui/${packageName} -w 命令可打包组件${'\
      \n      '}使用 pnpm --filter=@custom-lb-ui/docs-vue2 storybook 命令可预览组件`
      }
    ]
  }
}
