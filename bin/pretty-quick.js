"use strict"
exports.__esModule = true
var __1 = require("..")
var chalk_1 = require("chalk")
var prettyQuickResult = __1["default"](process.cwd())
var log = console.log
if (prettyQuickResult.success === true) {
  log("完成所有暂存区代码的格式化")
} else {
  log(
    chalk_1["default"].redBright("error message:\n"),
    prettyQuickResult.errors.join("\n")
  )
  process.exit(1)
}
