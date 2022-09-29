import path from 'path';
import fs from 'fs';
import enquirer from 'enquirer';

const { Select, Form } = enquirer;

/* ========================================================================== */
/*                            CLI PROMPT INTERFACE                            */
/* ========================================================================== */
export class CliPromptInterface {
  /* ------------------------------------------------------------------------ */
  constructor(usePrompt = true, verbose = true, moduleDirectory) {
    this.usePrompt = usePrompt;
    this.verbose = verbose;
    this.moduleDirectory = moduleDirectory;
    this.selectedTemplate = false;
    this.selectedModuleName = false;
    this.selectedDestination = false;
    this.templateDir = `__boilerplate__`;
    this.cliWorkingDir = process.cwd();
  }

  /* ------------------------------------------------------------------------ */
  async getDirectories(source) {
    const allFiles = await fs.promises.readdir(source, { withFileTypes: true });
    console.log('allFiles', allFiles);
    const directories = allFiles
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
    return directories;
  }

  /* ------------------------------------------------------------------------ */
  async getAvailableTemplates() {
    const templateDirPath = path.join(this.cliWorkingDir, this.templateDir);
    if (this.verbose) {
      consola.log(`Getting available templates from: ${templateDirPath}`);
    }
    try {
      this.availableTemplates = await this.getDirectories(templateDirPath);
    } catch (getDirectoriesError) {
      consola.error(
        `__boilerplate__ directory doesn't exists.`,
        getDirectoriesError
      );
      process.exit(9);
    }
  }

  /* ------------------------------------------------------------------------ */
  async init() {
    if (this.usePrompt) {
      await this.getAvailableTemplates();

      if (this.availableTemplates.length === 0) {
        consola.error(`No templates found in __boilerplate__ directory.`);
        process.exit(9);
      }

      const selectPrompt = new Select({
        name: 'template',
        message: 'Select what template to use',
        choices: this.availableTemplates,
      });

      await selectPrompt
        .run()
        .then((answer) => {
          if (this.verbose) {
            console.log('Template selected:', answer);
          }
          this.selectedTemplate = answer;
        })
        .catch((promptError) => {
          consola.error('Error reading answer.', promptError);
        });

      const formPrompt = new Form({
        name: 'details',
        message: `Please provide the following information${
          this.moduleDirectory ? ` (${this.moduleDirectory})` : ''
        }:`,
        choices: [
          {
            name: 'selectedModuleName',
            message: 'Template',
            initial: 'NameOfOutputModule',
          },
          {
            name: 'selectedDestination',
            message: 'Destination',
            initial: 'path/to/module',
          },
        ],
      });

      await formPrompt
        .run()
        .then((answers) => {
          console.log('Details:', answers);
          if (this.verbose) {
            console.log('Template selected:', answers);
          }
          this.selectedModuleName = answers.selectedModuleName;
          this.selectedDestination = answers.selectedDestination;
        })
        .catch((promptError) => {
          consola.error('Error reading answer.', promptError);
        });

      return {
        selectedTemplate: this.selectedTemplate,
        selectedModuleName: this.selectedModuleName,
        selectedDestination: this.selectedDestination,
      };
    }
  }
}
