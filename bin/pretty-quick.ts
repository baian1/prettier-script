import format from ".."
import chalk from "chalk"

const prettyQuickResult = format(process.cwd())
const log = console.log

if (prettyQuickResult.success === true) {
  log("完成所有暂存区代码的格式化")
} else {
  log(chalk.redBright("error message:\n"), prettyQuickResult.errors.join("\n"))
  process.exit(1)
}
