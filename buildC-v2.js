const path = require("path");
const fs = require("fs");

//获取配置
const getConfig = () => {
  let params = {};
  process.argv
    .filter((e) => e.startsWith("--"))
    .forEach((e) => {
      const f = e.replace(/^--/, "");
      const parts = f.split("=");
      params[params[0]] = parts.slice(1).join("=");
      if (parts.length && parts[0]) {
        params[parts[0]] = parts.slice(1).join("=");
      }
    });
  return params;
};
const componentName = getConfig().name;

const exec = require("child_process").exec;
const distCmd = `npx micro-package --input src/v2Components/${componentName}/index.vue --output src/v2Components/${componentName}/dist --name @alcap-component/${componentName}`;
let isErr = false;
exec(distCmd, (err, stdout, stderr) => {
  isErr = err;
  if (err) {
    console.log(err);
    console.warn(new Date(), componentName + "组件打包失败");
  } else {
    console.log(stdout);
    console.warn(new Date(), componentName + "组件打包成功");
    const packCmd = `npm pack`;
    exec(packCmd,{
      cwd: `src/v2Components/${componentName}`,
    }, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
      } else {
        console.log(stdout);
      }
    });
  }
});
