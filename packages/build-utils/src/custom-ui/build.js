import { rollup, watch } from 'rollup'
import ora from 'ora'
import path from 'path'
import { fileURLToPath } from 'url'
import globPkg from 'glob'
import { promisify } from 'util'
import chalk from 'chalk'
import { createRequire } from 'module'
import vuePlugin from 'rollup-plugin-vue'
import typescriptPlugin from '@rollup/plugin-typescript'
import postCSSPlugin from 'rollup-plugin-postcss'
import rollupPostcssLessLoader from 'rollup-plugin-postcss-webpack-alias-less-loader'
import autoprefixerPlugin from 'autoprefixer'
import { stat } from  'fs/promises'

const requireJson = createRequire(import.meta.url)
const { glob } = globPkg
const globSync = promisify(glob)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const UI_PATH = path.resolve(__dirname, '..', '..', '..', '@custom-ui')
const DIST = 'dist'
const PACKAGE_INDEX_SCRIPT = 'index.js'
const PACKAGE_INDEX_STYLE = 'style.css'
const IS_PRODUCTION = !process.env.ROLLUP_WATCH

const spinner = ora()

async function getPlugins(buildOpt) {
  const { componentPath = '' } = buildOpt
  const tsConfigFilePath = path.resolve(componentPath, 'tsconfig.json')
  let tsConfigFileStat = null
  try {
    tsConfigFileStat = await stat(tsConfigFilePath)
  } catch (e) {
    // 非 ts 格式
  }
  return [
    vuePlugin({
      css: false
    }),
    postCSSPlugin({
      extract: path.resolve(buildOpt.componentPath, DIST, PACKAGE_INDEX_STYLE),
      loaders: [
        rollupPostcssLessLoader({
          aliases: {
            [buildOpt.packageJson.name]: path.resolve(
              buildOpt.componentPath,
              'src'
            )
          }
        })
      ],
      plugins: [autoprefixerPlugin()]
    }),
    tsConfigFileStat && typescriptPlugin({
      // FIXME:
      tsconfig: tsConfigFilePath,
      sourceMap: !IS_PRODUCTION,
      inlineSources: !IS_PRODUCTION
    })
  ]
}

async function startBuild({
  inputPath,
  outputPath,
  plugins = [],
  packageJson = {}
} = {}) {
  if (!inputPath || !outputPath)
    throw new Error(
      `请检查${
        (packageJson && packageJson.main) || '未识别'
      }组件的输入输出路径!`
    )
  const { dependencies = null, peerDependencies = null } = packageJson || {}
  const inputOptions = {
    input: inputPath,
    plugins,
    external: (id) =>
      (dependencies &&
        new RegExp(`^(${Object.keys(dependencies).join('|')})`).test(id)) ||
      (peerDependencies &&
        new RegExp(`^(${Object.keys(peerDependencies).join('|')})`).test(id))
  }
  const outputOptions = {
    file: outputPath,
    format: 'es',
    sourcemap: !IS_PRODUCTION
  }
  const bundle = await rollup(inputOptions)
  const { output } = await bundle.write(outputOptions)
  console.log(output)
}

async function buildComponents() {
  const pathRegex = path.join(UI_PATH, '**', 'package.json')
  const ignorePaths = ['**/node_modules/**']
  const allPackageJsons = await globSync(pathRegex, { ignore: ignorePaths })
  const componentMap = {}
  allPackageJsons.forEach((packageJson) => {
    const json = requireJson(packageJson)
    const componentName = json.name
    const componentPath = path.dirname(packageJson)
    // 查重
    if (componentName in componentMap)
      throw new Error(`Component ${componentName} already exit!`)
    const entryFilePath = path.resolve(componentPath, json.main)
    const outputFilePath = path.resolve(componentPath, DIST)
    componentMap[componentName] = {
      packageJson: json,
      inputPath: entryFilePath,
      outputPath: outputFilePath,
      componentPath
    }
  })
  await Promise.all(
    Object.values(componentMap).map(async (componentOpt) => {
      return startBuild({
        inputPath: componentOpt.inputPath,
        outputPath: path.resolve(componentOpt.outputPath, PACKAGE_INDEX_SCRIPT),
        packageJson: componentOpt.packageJson,
        plugins: await getPlugins(componentOpt)
      })
    })
  )
  console.log(componentMap)
}

async function build() {
  try {
    spinner.start('开始构建路径 \n')
    await buildComponents()
  } catch (e) {
    console.log(chalk.red(e))
  } finally {
    console.log('\n')
    spinner.stop()
  }
}

build()
