This package is used to enhance scripts in your package.json:

1. Extract scripts from packageJSON to make your packageJSON look less bulky

2. Replace 'npm run script' with 'nr script'

3. Replacing static scripts with dynamic scripts

4. You can add comments to your script

5. You can group your scripts

6. A script can execute multiple scripts and supports synchronous, asynchronous, and hybrid execution.

7. Scripts can automatically change parameters based on the environment

8. A script can have a greater impact

## Usage
Specify a file as your storage script file through the 'script' field in package.json:
```
// package.json
{
  "script":"./scripts/index.js"
}
```
A script file looks similar:
```
module.exports={
  "time":`echo ${new Date().toString()}`
}
```
And run your script:
```sh
nr time
```

The value of an attribute can also be an array, which will be executed sequentially:
```cjs
const time=new Date()
module.exports={
  "time":[`echo ${time.getFullYear()}`,`echo ${time.getMonth()+1}`,`echo ${time.getDay()}`]
}
```

The value of an attribute can also be an object, and you can make it execute asynchronously by setting the value of async:
```cjs
module.exports={
  "run-async":{
    async:true,
    scripts:["echo 1","echo 2","echo 3"]
  }
}
```
If the async attribute is omitted, it defaults to false.

The scripts properties and arrays of objects support nesting:
```cjs
module.exports={
  "run-async":{
    async:true,
    scripts:[
      "echo 1",
      ["echo 2","echo 3"]
      {
        async:true,
        scripts:["echo 4","echo 5","echo 6"]
      }
  ]
  }
}
```
