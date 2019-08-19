import { existsSync } from "fs"
import { resolve } from "path"
import execa from "execa"
import { isNull, isString } from "util"

export let rootDirectory: string | null = null

export const detect = (directory: string) => {
  if (existsSync(resolve(directory, ".git"))) {
    rootDirectory = directory
    return directory
  } else {
    return null
  }
}

export const runGit = (directory: string, args: string[]) =>
  execa.sync("git", args, {
    cwd: directory,
  })

//找到用来比较的commit
//并输出短的hash
export const getSinceRevision = (directory: string) => {
  try {
    const revision = "HEAD"
    return runGit(directory, ["rev-parse", "--short", revision]).stdout.trim()
  } catch (error) {
    if (/HEAD/.test(error.message)) {
      return null
    }
    throw error
  }
}

const getLines = (execaResult: execa.ExecaSyncReturnValue<string>) =>
  execaResult.stdout.split("\n")

export const getChangedFiles = (
  directory: string,
  revision: string,
  staged = true
) => {
  return [
    ...getLines(
      runGit(
        directory,
        [
          "diff",
          "--name-only",
          staged ? "--cached" : null,
          "--diff-filter=ACMRTUB",
          revision,
        ].filter(isString)
      )
    ),
  ]
}

export const stageFile = (directory: string, file: string) => {
  runGit(directory, ["add", file])
}
