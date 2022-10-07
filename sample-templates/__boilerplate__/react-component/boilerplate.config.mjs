import { changeCase } from '@beautifulbits/boilerplate';

export default {
  replacements: (module) => ({
    'react-component': changeCase.paramCase(module.name),
    ReactComponent: changeCase.pascalCase(module.name),
  }),
  moduleDirectory: (module) =>
    `./src/${module.destination}/${changeCase.paramCase(module.name)}`,
};
