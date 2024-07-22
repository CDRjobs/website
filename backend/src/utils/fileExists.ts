import fs from 'node:fs/promises'

const fileExists = async (filePath: string) => {
  try {
    await fs.stat(filePath)
    return true
  } catch {
    return false
  }
}

export default fileExists