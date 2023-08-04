#!/usr/bin/env node

const path = require('node:path')
const fs = require('node:fs')
const { exec } = require('node:child_process')
const command = process.argv[2]

// console.log(process.argv)

const config = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf-8'),
)
const fileName = config['script']
const configScripts = config['scripts']

const scripts = Object.assign(
  configScripts,
  require(path.resolve(process.cwd(), fileName)),
)

if (!scripts[command]) {
  console.log('找不到脚本' + command)
  return;
}
const commands =
  typeof scripts[command] == 'string' ? [scripts[command]] : scripts[command]
const execPro = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err)
        return
      }
      console.log(stdout || stderr)
      resolve(stdout || stderr)
    })
  })
}

async function execCommandsQueue(commands) {
  let result = []
  const execCommand = async () => {
    try {
      const res = await execPro(commands.shift())
      result.push({ state: 'fulfilled', value: res })
    } catch (err) {
      result.push({ state: 'rejected', value: err })
    }
    if (commands.length) {
      await execCommand()
    }
    return
  }

  await execCommand()
  return result
}

execCommandsQueue(commands).then((res) => {
  // console.log(res)
})
