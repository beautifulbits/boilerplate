#!/usr/bin/env node
import { BoilerplateGenerator } from './boilerplate-generator.js';
import { CliArgumentsParser } from './cli-arguments-parser.js';
import { CliPromptInterface } from './cli-prompt-interface.js';

(async () => {
  const { template, name, destination, usePrompt, verboseMode } =
    new CliArgumentsParser();

  const cliPromptInterface = new CliPromptInterface(usePrompt, verboseMode);
  const { selectedTemplate, selectedModuleName, selectedDestination } =
    await cliPromptInterface.init();

  const boilerplateGenerator = new BoilerplateGenerator(
    usePrompt ? selectedModuleName : name,
    usePrompt ? selectedTemplate : template,
    usePrompt ? selectedDestination : destination,
    verboseMode
  );

  await boilerplateGenerator.generate();
})();
