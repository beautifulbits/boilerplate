#!/usr/bin/env node
const yargs = require(`yargs`);
const consola = require(`consola`);
const changeCase = require(`change-case`);
const path = require(`path`);
const pluralize = require(`pluralize`);
const { MultiSelect } = require('enquirer');
const { BoilerplateGenerator } = require('./boilerplate-generator');

module.exports = { changeCase, pluralize };

const { argv } = yargs
  .option(`template`, {
    alias: `t`,
    description: `Template to use to generate boilerplate.`,
    type: `string`,
  })
  .option(`name`, {
    alias: `n`,
    description: `Name of the module to be generated.`,
    type: `string`,
  })
  .option(`destination`, {
    alias: `d`,
    description: `Destination of the generated module relative, used in the moduleDirectory property in the template configuration.`,
    type: `string`,
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
  })
  .option('prompt', {
    alias: 'p',
    type: 'boolean',
    description: 'Use interactive prompt to generate a module.',
  })
  .help()
  .alias(`help`, `h`)
  .alias(`version`, `v`);

let template;
let name;
let destination;

let usePrompt = false;
if (argv.prompt) {
  usePrompt = true;
}
console.log('argv', usePrompt, argv);
let verboseMode = false;
if (argv.verbose) {
  verboseMode = true;
}

const templateDir = `__boilerplate__`;
const cliWorkingDir = process.cwd();

const getDirectories = async (source) =>
  (await readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

if (usePrompt) {
  console.log('here 1');
  (async () => {
    console.log('here 2');
    const templateDirPath = path.join(cliWorkingDir, templateDir);
    console.log('here 3', templateDirPath);
    const availableTemplates = await getDirectories(templateDirPath);
    console.log('here 4');
    console.log(availableTemplates);
    process.exit();
  })();
  // fs.promises.readdir
}

if (!usePrompt) {
  if (argv.template) {
    template = argv.template;
  } else {
    consola.error(
      `Template required. Use option [-t] to specify the template to use.`
    );
    process.exit(9);
  }

  if (argv.name) {
    name = argv.name;
  } else {
    consola.error(
      `Module's name required. Use option [-n] to specify the name of the module.`
    );
    process.exit(9);
  }

  if (argv.destination) {
    destination = argv.destination;
  } else {
    consola.error(
      `Module's destination required. Use option [-d] to specify the destination of the module.`
    );
    process.exit(9);
  }
}

const boilerplateGenerator = new BoilerplateGenerator(
  name,
  template,
  destination
);

(async () => {
  await boilerplateGenerator.generate();
})();
