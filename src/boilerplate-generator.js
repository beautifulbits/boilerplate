const consola = require(`consola`);
const path = require(`path`);
const fs = require(`fs`);
const mkdirp = require(`mkdirp`);
const recursiveReaddir = require(`recursive-readdir-async`);
//const boxen = require('boxen');
const { replaceAll } = require('./replace-all');

class BoilerplateGenerator {
  constructor(name, template, destination, verbose = true) {
    this.name = name;
    this.template = template;
    this.destination = destination;
    this.verbose = verbose;

    this.moduleProps = {
      template,
      name,
      destination,
    };

    this.cliWorkingDir = process.cwd();
    this.templateDir = `__boilerplate__`;
    this.templateDirPath = `${path.join(
      this.cliWorkingDir,
      this.templateDir
    )}/${this.template}`;
  }

  async generate() {
    await this.getTemplateConfig();
    await this.getReplacementsFromTemplate();
    await this.getBoilerplateDestinationDirFromTemplate();
    await this.getTemplateFiles();
    await this.createBoilerplateFiles();
    return Promise.resolve();
  }

  async getTemplateConfig() {
    const templatePath = `${path.join(this.cliWorkingDir, this.templateDir)}/${
      this.template
    }`;
    const templateConfigPath = `${templatePath}/boilerplate.config`;
    this.templateConfig = require(templateConfigPath);
    return Promise.resolve();
  }

  async getReplacementsFromTemplate() {
    if (
      this.templateConfig &&
      this.templateConfig.replacements &&
      typeof this.templateConfig.replacements === `function`
    ) {
      this.replacements = this.templateConfig.replacements(this.moduleProps);
      if (this.verbose) {
        consola.log(`Replacements`, this.replacements);
      }
    } else {
      consola.error(
        `Module configuration doesn't include a valid [replacements] function.`
      );
      process.exit(9);
    }
    return Promise.resolve();
  }

  async getBoilerplateDestinationDirFromTemplate() {
    if (
      this.templateConfig &&
      this.templateConfig.moduleDirectory &&
      typeof this.templateConfig.moduleDirectory === `function`
    ) {
      this.moduleDirectory = this.templateConfig.moduleDirectory(
        this.moduleProps
      );
      if (this.verbose) {
        consola.log(`Module Directory`, this.moduleDirectory);
      }
    } else {
      consola.error(
        `Module configuration doesn't include a valid [moduleDirectory] function.`
      );
      process.exit(9);
    }
    return Promise.resolve();
  }

  async getTemplateFiles() {
    if (this.verbose) {
      consola.log(`Scanning template directory: ${this.templateDirPath}`);
    }

    try {
      const files = await recursiveReaddir.list(this.templateDirPath, {
        exclude: [`boilerplate.config.js`],
        ignoreFolders: false,
      });
      this.templateFiles = files;
      return Promise.resolve();
    } catch (recursiveReaddirError) {
      consola.error(`Unable to scan directory: ${recursiveReaddirError}`);
      process.exit(1);
    }
  }

  async createBoilerplateFiles() {
    this.templateFiles.forEach((file) => {
      try {
        (async () => {
          const fileFullPath = file.fullname;

          // Get content of the template file
          const buffer = await fs.promises.readFile(fileFullPath, `utf8`);
          const fileContents = buffer.toString();

          // Do all required string replacements to the content
          const outputFileContents = replaceAll(
            fileContents,
            this.replacements
          );

          // Get the template filename
          const fileName = path.basename(fileFullPath);
          const fileNameWithPath = fileFullPath.split(
            `__boilerplate__/${this.template}/`
          )[1];

          // Generate output's filename
          const outputFileName = replaceAll(fileName, this.replacements);
          const outputFileNameWithPath = replaceAll(
            fileNameWithPath,
            this.replacements
          );
          const outputFilePath = path.join(
            this.cliWorkingDir,
            this.moduleDirectory,
            outputFileNameWithPath
          );
          const outputFolderPath = outputFilePath.split(outputFileName)[0];

          if (this.verbose) {
            consola.log(`\n*************\n`);
            consola.log(`Filename: ${fileName}`);
            consola.log(`Filename (with path): ${fileNameWithPath}`);
            consola.log(`Output Filename: ${outputFileName}`);
            consola.log(`Output Directory Path: ${outputFolderPath}`);
            consola.log(`Output File Path: ${outputFilePath}`);
            consola.log(
              //boxen(fileContents, { padding: 1 })
              `\nTemplate:\n----------\n${fileContents}\n----------\n\nOutput:\n----------\n${outputFileContents}\n----------\n`
            );
            consola.log(`\n*************\n`);
          }

          try {
            // First create directory for output file before attempting to
            // create the file
            try {
              await fs.promises.access(outputFolderPath);
            } catch {
              await mkdirp(outputFolderPath);
              if (this.verbose) {
                consola.log(`Directory created: ${outputFolderPath}`);
              }
            }

            // Create the file
            await fs.promises.writeFile(outputFilePath, outputFileContents);
            if (this.verbose) {
              consola.log(`File created: ${outputFilePath}`);
            }
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
}

module.exports = { BoilerplateGenerator };
