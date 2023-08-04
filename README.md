This package enhances the functionality of scripts in your package.json file:

1. It extracts scripts from packageJSON, reducing the overall size of the packageJSON file.

2. It replaces the usage of 'npm run script' with the shorthand 'nr script'.

3. It enables the substitution of static scripts with dynamic scripts.

4. It allows you to add comments to your scripts.

5. It provides the ability to group your scripts.

6. It supports the execution of multiple scripts in a single script, with support for synchronous, asynchronous, and hybrid execution.

7. It enables automatic parameter changes in scripts based on the environment.

8. It allows scripts to have a more significant impact.

## Installation

```sh
npm i npm-script-manager --save-dev
```

## Usage

To specify a file as your storage script in package.json, use the 'script' field:

```
// package.json
{
  "script": "./scripts/index.js"
}
```

A script file looks like this:

```javascript
module.exports = {
  "time": `echo ${new Date().toString()}`
}
```

You can then run your script using the following command:

```shell
nr time
```

The value of an attribute can also be an array, which will be executed sequentially:

```javascript
const time = new Date();
module.exports = {
  "time": [
    `echo ${time.getFullYear()}`,
    `echo ${time.getMonth() + 1}`,
    `echo ${time.getDay()}`
  ]
}
```

The value of an attribute can also be an object, and you can make it execute asynchronously by setting the value of the 'async' property:

```javascript
module.exports = {
  "run-async": {
    "async": true,
    "scripts": ["echo 1", "echo 2", "echo 3"]
  }
}
```

If the 'async' property is omitted, it defaults to false.

You can use the `--limit` parameter to restrict the number of concurrently running scripts:
```shell
nr echos --limit 5
```

The file:

```javascript
const echos = []
for (let i = 0; i < 1000; i++) {
  echos.push(`echo test${i}`)
}
module.exports = { echos }
```

The 'scripts' property and arrays of objects support nesting:

```javascript
module.exports = {
  "run-async": {
    "async": true,
    "scripts": [
      "echo 1",
      ["echo 2", "echo 3"],
      {
        "async": true,
        "scripts": ["echo 4", "echo 5", "echo 6"]
      }
    ]
  }
}
```
