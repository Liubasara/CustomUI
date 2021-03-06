import { rollup, watch } from 'rollup'
import ora from 'ora'
import path from 'path'
import { fileURLToPath } from 'url'
import globPkg from 'glob'
import { promisify } from 'util'
import chalk from 'chalk'
import { createRequire } from 'module'
import vuePlugin from 'rollup-plugin-vue'
import typescriptPlugin from 'rollup-plugin-typescript2'
// import typescriptPlugin from '@rollup/plugin-typescript'
import postCSSPlugin from 'rollup-plugin-postcss'
import rollupPostcssLessLoader from 'rollup-plugin-postcss-webpack-alias-less-loader'
import autoprefixerPlugin from 'autoprefixer'
import { stat } from 'fs/promises'
import parseArgs from 'minimist'
import lodashPkg from 'lodash'
import del from 'rollup-plugin-delete'
import alias from '@rollup/plugin-alias'
import ttypescript from 'ttypescript'

const { isArray, uniq } = lodashPkg

const processArgs = parseArgs(process.argv.slice(2))
const argWatch = processArgs.watch || processArgs.w || false
let argComopnents = processArgs.component || []
if (!isArray(argComopnents)) {
  argComopnents = [argComopnents]
}
argComopnents = uniq(argComopnents)

const requireJson = createRequire(import.meta.url)
const { glob } = globPkg
const globSync = promisify(glob)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const UI_PATH = path.resolve(__dirname, '..', '..', '..', '@custom-ui')
const DIST = 'dist'
const PACKAGE_INDEX_SCRIPT = 'index.js'
const PACKAGE_INDEX_STYLE = 'style.css'
// 如果 npm 执行命令带了 --watch 参数
const IS_WATCH = argWatch === true
const IS_PRODUCTION = !IS_WATCH

const spinner = ora()
const buildOptionRecords = []

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
    del({
      force: true,
      targets: path.resolve(buildOpt.componentPath, DIST, '*')
    }),
    alias({
      resolve: ['.js', '.ts', '.vue'],
      entries: [
        { find: '@', replacement: path.resolve(buildOpt.componentPath, 'src') }
      ]
    }),
    tsConfigFileStat &&
      typescriptPlugin({
        // FIXME:
        tsconfig: tsConfigFilePath,
        filterRoot: buildOpt.componentPath,
        sourceMap: !IS_PRODUCTION,
        inlineSources: !IS_PRODUCTION,
        typescript: ttypescript,
        tsconfigDefaults: {
          compilerOptions: {
            plugins: [
              {
                transform: '@zerollup/ts-transform-paths',
                exclude: ['*']
              }
            ]
          }
        }
      }),
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
    })
  ]
}

async function startBuild(buildOpts = {}) {
  const { inputPath, outputPath, plugins = [], packageJson = {} } = buildOpts
  if (!inputPath || !outputPath)
    throw new Error(
      `请检查${
        (packageJson && packageJson.srcEntry) || '未识别'
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
  IS_PRODUCTION && console.log(output)
  IS_WATCH &&
    buildOptionRecords.push({
      inputOptions,
      outputOptions,
      ...buildOpts
    })
}

async function buildComponents() {
  const pathRegex = path.join(UI_PATH, '**', 'package.json')
  const ignorePaths = ['**/node_modules/**', '**/@build-utils/**', '**/@custom-ui-docs/**']
  const allPackageJsons = await globSync(pathRegex, { ignore: ignorePaths })
  const componentMap = {}
  allPackageJsons.forEach((packageJson) => {
    const json = requireJson(packageJson)
    const componentName = json.name
    const componentPath = path.dirname(packageJson)
    // 若传入 components 参数，仅构建指定组件
    let canBuild = true
    if (argComopnents.length > 0) {
      canBuild = false
    }
    if (~argComopnents.indexOf(componentName)) {
      canBuild = true
    }
    if (!canBuild) return
    // 查重
    if (componentName in componentMap)
      throw new Error(`Component ${componentName} already exit!`)
    const entryFilePath = path.resolve(componentPath, json.srcEntry)
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

function startWatch() {
  if (!buildOptionRecords.length) return
  console.log(chalk`\n\n{black.bgGreen  Done } {green Watching......}\n`)
  for (let record of buildOptionRecords) {
    const watcher = watch({
      ...record.inputOptions,
      output: [record.outputOptions]
    })
    watcher.on('event', (event) => {
      console.log(event)
    })
  }
}

async function build() {
  try {
    spinner.start('开始构建路径 \n')
    if (argComopnents.length > 0) {
      console.log(
        chalk.green(
          `~~ start to build components:\n\t${argComopnents.join(',\n\t')} ~~\n`
        )
      )
    } else {
      console.log(chalk.green(`~~ start to build all components ~~\n`))
    }
    await buildComponents()
    IS_WATCH && startWatch()
  } catch (e) {
    console.log(chalk.red(e))
  } finally {
    console.log('\n')
    spinner.stop()
  }
}

build()
