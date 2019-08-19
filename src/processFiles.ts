import { readFileSync, writeFileSync } from "fs"
import * as prettier from "prettier"
import { join } from "path"

export default (
  directory: string,
  files: string[],
  {
    check = true,
    onExamineFile = undefined,
    onCheckFile = undefined,
    onWriteFile = undefined,
    onError = undefined,
  }: {
    onCheckFile?: (relative: string, isFormatted: boolean) => void
    onExamineFile?: (relative: string) => void
    onWriteFile?: (relative: string) => void
    check?: boolean
    onError?: (file: string, error: Error) => void
  } = {}
) => {
  for (const relative of files) {
    onExamineFile && onExamineFile(relative)
    const file = join(directory, relative)
    const options = Object.assign(
      {},
      prettier.resolveConfig.sync(file, {
        editorconfig: true,
      }),
      { filepath: file }
    )

    const input = readFileSync(file, "utf8")

    try {
      if (check) {
        const isFormatted = prettier.check(input, options)
        onCheckFile && onCheckFile(relative, isFormatted)
        if (isFormatted) {
          continue
        }
      }

      const output = prettier.format(input, options)

      if (output !== input) {
        writeFileSync(file, output)
        onWriteFile && onWriteFile(relative)
      }
    } catch (e) {
      onError && onError(relative, e)
    }
  }
}
