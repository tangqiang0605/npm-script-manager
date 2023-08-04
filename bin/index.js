#!/usr/bin/env node

const path = require('node:path')
const fs = require('node:fs')
const { exec } = require('node:child_process')

let limit = 5;

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
    return
  } else if (Array.isArray(scripts)) {
    runScriptArr(scripts)
  } else if (typeof scripts === 'object') {
    await runScriptArr(scripts.scripts || [], scripts.async)
  } else {
    console.log('脚本的scripts属性类型错误')
    return
  }
}

async function runScriptArr(arr, async = false) {
  // 控制异步执行
  if (async) {
    for (let command of arr) {
      runScripts(command)
    }
  } else {
    for (let command of arr) {
      await runScripts(command)
    }
  }
}

entryScript()