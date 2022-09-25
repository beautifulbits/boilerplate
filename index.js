#!/usr/bin/env node
const yargs = require(`yargs`);
const consola = require(`consola`);
const changeCase = require(`change-case`);
const path = require(`path`);
const fs = require(`fs`);
const mkdirp = require(`mkdirp`);
const pluralize = require(`pluralize`);
const recursiveReaddir = require(`recursive-readdir`);

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
  .help()
  .alias(`help`, `h`)
  .alias(`version`, `v`);

let template;
let name;
let destination;

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

const moduleProps = {
  template,
  name,
  destination,
};

const templateDir = `__boilerplate__`;
const cliWorkingDir = process.cwd();
const templatePath = `${path.join(cliWorkingDir, templateDir)}/${template}`;
const templateConfigPath = `${templatePath}/boilerplate.config`;
const templateConfig = require(templateConfigPath);

let replacements;
let moduleDirectory;

if (
  templateConfig &&
  templateConfig.replacements &&
  typeof templateConfig.replacements === `function`
) {
  replacements = templateConfig.replacements(moduleProps);
  consola.log(`Replacements`, replacements);
} else {
  consola.error(
    `Module configuration doesn't include a valid [replacements] function.`
  );
  process.exit(9);
}

if (
  templateConfig &&
  templateConfig.moduleDirectory &&
  typeof templateConfig.moduleDirectory === `function`
) {
  moduleDirectory = templateConfig.moduleDirectory(moduleProps);
  consola.log(`Module Directory`, moduleDirectory);
} else {
  consola.error(
    `Module configuration doesn't include a valid [moduleDirectory] function.`
  );
  process.exit(9);
}

function replaceAll(str) {
  let replaced = str;
  Object.keys(replacements).forEach((replacementKey) => {
    const replaceWith = replacements[replacementKey];
    replaced = replaced.replace(new RegExp(replacementKey, `g`), replaceWith);
  });
  return replaced;
}

consola.log(`Scanning template directory: [${templatePath}]`);

recursiveReaddir(
  templatePath,
  [`boilerplate.config.js`],
  (recursiveReaddirError, files) => {
    if (recursiveReaddirError) {
      consola.error(`Unable to scan directory: ${recursiveReaddirError}`);
      process.exit(1);
    }

    files.forEach((file) => {
      try {
        (async () => {
          // Get content of the template file
          const buffer = await fs.promises.readFile(file, `utf8`);
          const fileContents = buffer.toString();

          // Do all required string replacements to the content
          const outputFileContents = replaceAll(fileContents);

          // Get the template filename
          const fileName = path.basename(file);
          const fileNameWithPath = file.split(
            `__boilerplate__/${template}/`
          )[1];

          // Generate output's filename
          const outputFileName = replaceAll(fileName);
          const outputFileNameWithPath = replaceAll(fileNameWithPath);
          const outputFilePath = `${path.join(
            cliWorkingDir,
            moduleDirectory
          )}/${outputFileNameWithPath}`;
          const outputFolderPath = outputFilePath.split(outputFileName)[0];

          consola.log(`\n*************\n`);
          consola.log(`Filename: ${fileName}`);
          consola.log(`Filename (with path): ${fileNameWithPath}`);
          consola.log(`Output Filename: ${outputFileName}`);
          consola.log(`Output Directory Path: ${outputFolderPath}`);
          consola.log(`Output File Path: ${outputFilePath}`);
          consola.log(
            `\nTemplate:\n----------\n${fileContents}\n----------\n\nOutput:\n----------\n${outputFileContents}\n----------\n`
          );
          consola.log(`\n*************\n`);

          try {
            //
            try {
              await fs.promises.access(outputFolderPath);
            } catch {
              await mkdirp(outputFolderPath);
              consola.log(`Directory created: ${outputFolderPath}`);
            }
            await fs.promises.writeFile(outputFilePath, outputFileContents);
            consola.log(`File created: ${outputFilePath}`);
          } catch (writeFileError) {
            consola.error(
              `Unable to write file: ${outputFilePath}\n${writeFileError}\n`
            );
            process.exit(1);
          }
        })();
      } catch (readFileError) {
        consola.error(`Unable to read file: ${file}\n${readFileError}\n`);
        process.exit(1);
      }
    });
  }
);
