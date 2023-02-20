const core = require('@actions/core');
const github = require('@actions/github');
const wait = require('./wait');
const fs = require("fs");


// most @actions toolkit packages have async methods
async function run() {
  try {
    const ms = core.getInput('milliseconds');
    core.info(`Waiting ${ms} milliseconds ...`);
    core.debug((new Date()).toTimeString());
    await wait(parseInt(ms));
    core.info((new Date()).toTimeString());

    core.setOutput('time', new Date().toTimeString());
    increment();
    console.log(JSON.stringify(github.context,null,4))
  } catch (error) {
    core.setFailed(error.message);
  }
}


function increment(){
  const pkg = require("./package.json");

  const [major = 0, minor = 0, patch = 0] = pkg.version
      .split(".")
      .map((n) => parseInt(n, 10));
  const formatter = new Intl.NumberFormat("en-us", { minimumIntegerDigits: 2 });
  const version =  [major, minor, formatter.format(patch + 1)].join(".");
  fs.writeFileSync(
      "./package.json",
      JSON.stringify({
        ...pkg,
        version
      }, null, 4)
  );
  console.log("Incremented to " ,version);
  return version;
}
run();
