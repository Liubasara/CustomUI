import { rollup, watch } from 'rollup'
import ora from 'ora'
import path from 'path'
import { fileURLToPath } from 'url'
import globPkg from 'glob'
import { promisify } from 'util'
import chalk from 'chalk'
import { createRequire } from 'module'

const requireJson = createRequire(import.meta.url)
const { glob } = globPkg
const globSync = promisify(glob)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const UI_PATH = path.resolve(__dirname, '..', '..', '..', '@custom-ui')
const DIST = 'dist'

const spinner = ora()

async function buildComponents() {
  const pathRegex = path.join(UI_PATH, '**', 'package.json')
  const ignorePaths = ['**/node_modules/**']
  const allPackageJsons = await globSync(pathRegex, { ignore: ignorePaths })
  const componentMap = {}
  allPackageJsons.forEach((packageJson) => {
    const json = requireJson(packageJson)
    const componentName = json.name
    // 查重
    if (componentName in componentMap)
      throw new Error(`Component ${componentName} already exit!`)
    const entryFilePath = path.resolve(path.dirname(packageJson), json.main)
    const outputFilePath = path.resolve(path.dirname(packageJson), DIST)
    componentMap[componentName] = {
      packageJson: json,
      inputPath: entryFilePath,
      outputPath: outputFilePath
    }
  })
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
