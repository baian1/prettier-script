import * as git from "./git"
import createIgnorer from "./createIgnorer"
import processFiles from "./processFiles"
import chalk from "chalk"
const log = console.log

export default (currentDirectory: string) => {
  if (!git.detect(currentDirectory)) {
    return {
      success: false,
      errors: ["can not find .git"],
    }
  }
  const directory = git.rootDirectory as string
  const revision = git.getSinceRevision(directory)
  if (revision === null) {
    return {
      success: false,
      errors: ["can not find revision"],
    }
  }

  const prettyIgnore = createIgnorer(directory)

  const stagedChangedFiles = git
    .getChangedFiles(directory, revision)
    .filter(prettyIgnore)
  log(`Found ${stagedChangedFiles.length} changed files.`)

  const changedFiles = git
    .getChangedFiles(directory, revision, false)
    .filter(prettyIgnore)
  const failReasons = new Set<string>()

  processFiles(directory, stagedChangedFiles, {
    onWriteFile: (file: string) => {
      if (changedFiles.includes(file)) {
        failReasons.add(`You should commit ${file}`)
      }
      log(`${file} is fixed.`)
      git.stageFile(directory, file)
    },
    onCheckFile: (file: string, isFormatted: boolean) => {
      log(
        `check ${file}:${
          isFormatted ? chalk.blueBright("success") : chalk.redBright("fail")
        }`
      )
    },
    onError: (file, err) => {
      if (err.message.match(/No parser/) !== null) {
        failReasons.add(`Can't parser ${file},you should add ${file} to ignore`)
      } else {
        failReasons.add(err.message)
      }
    },
  })

  return {
    success: failReasons.size === 0,
    errors: Array.from(failReasons),
  }
}
