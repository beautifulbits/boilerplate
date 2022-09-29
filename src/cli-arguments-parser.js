import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import consola from 'consola';

// Work around to be able to use Yargs as an imported module
// https://github.com/yargs/yargs/issues/1854#issuecomment-787509517
const yargs = _yargs(hideBin(process.argv));

/* ========================================================================== */
/*                            CLI ARGUMENTS PARSER                            */
/* ========================================================================== */
export class CliArgumentsParser {
  constructor() {
    let usePrompt = false;
    let verboseMode = false;
    let template;
    let name;
    let destination;

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
      .alias(`version`, `V`);

    if (argv.prompt) {
      usePrompt = true;
    }

    if (argv.verbose) {
      verboseMode = true;
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

    return {
      template,
      name,
      destination,
      usePrompt,
      verboseMode,
    };
  }
}
