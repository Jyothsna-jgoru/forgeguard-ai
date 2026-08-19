import { copyFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDirectory = path.join(webRoot, 'dist')
const entryPoint = path.join(distDirectory, 'index.html')
const routes = [
  'workflow',
  'ticket',
  'changes',
  'governance',
  'approval',
  'architecture',
  'docs',
]

await Promise.all(
  routes.map(async (route) => {
    const routeDirectory = path.join(distDirectory, route)
    await mkdir(routeDirectory, { recursive: true })
    await copyFile(entryPoint, path.join(routeDirectory, 'index.html'))
  }),
)

await copyFile(entryPoint, path.join(distDirectory, '404.html'))
