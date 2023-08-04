#!/usr/bin/env node

const path = require('node:path')
const fs = require('node:fs')
const { exec } = require('node:child_process')

let limit = 8;

let running = 0
const waitQueue = []

function getArgvs() {
  let index = 3
  const commends = process.argv
  let argvs = {}
  while (index < commends.length) {
    const quals = commends[index].split('=')
    let key = ''
    let value = ''
    if (quals.length > 1) {
      key = quals[0]
      value = quals[1]
      index++
    } else {
      key = commends[index++]
      value = commends[index++]
    }
    argvs[key.slice(2)] = value
  }
  return argvs
}

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

function entryScript() {
  // 处理脚本
  const script = process.argv[2]
  const argvs = getArgvs()
  console.log(argvs)
  if (argvs.limit) {
    limit = Number(argvs.limit)
  }
  console.log(limit)
  const config = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf-8'),
  )
  const configScripts = config['scripts']
  const fileName = config['script']
  const scripts = Object.assign(
    configScripts,
    require(path.resolve(process.cwd(), fileName)),
  )
  if (!scripts[script]) {
    console.log('找不到脚本' + script)
    return;
  }
  const command = scripts[script]
  runScripts(command)
}

async function runScripts(scripts) {
  // 处理属性scripts
  if (typeof scripts === 'string') {
    await execPro(scripts)
    if (waitQueue.length > 0) {
      await runScripts(waitQueue.shift())
    }
    return
  } else if (Array.isArray(scripts)) {
    runScriptArr(scripts)
  } else if (typeof scripts === 'object') {
    await runScriptArr(scripts.scripts || [], scripts.async)
  } else {
    console.log('脚本的scripts属性类型错误', scripts)
    return
  }
}

async function runScriptArr(arr, async = false) {
  // 控制异步执行
  if (async) {
    for (let command of arr) {
      if (running < limit) {
        runScripts(command)
        running++;
      } else {
        waitQueue.push(command)
      }
    }
  } else {
    for (let command of arr) {
      await runScripts(command)
    }
  }
}

entryScript()