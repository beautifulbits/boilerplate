# Boilerplate

Boilerplate is CLI tool used for generating code out of template files.

## Features

Create multiple boilerplate templates for your project.
Your templates can be composed of multiple files and folders.
No special syntax is needed; the templates are composed of standard code files.
Commit the templates to the project's repository so all collaborators can use them.

## How to use

### Creating templates

- Create a `./__boilerplate__` directory at the root of your project
- Create a folder inside `./__boilerplate__` for each one of the templates you want to use with your project
- Create all the files that will be part of your template (a template is composed of standard code files, no special syntax is needed)
- Add a `boilerplage.config.mjs` file to your template specifying all the strings that will be replaced in the templates when generating a module, including file and directory names (see sample templates).

### Creating a module out of a template

- From the root of your project's directory, run the command `npx @beautifulbits/boilerplate -p`
- Select what template to use
- Specify a name and specify the location for the resulting module the CLI tool will generate.
- Hit `Enter` and you are done!

### Optional

The package includes two libraries to help you modify the name of the module to use for replacements on your templates:

- change-case: https://www.npmjs.com/package/change-case
- pluralize: https://www.npmjs.com/package/pluralize

To use them, install this package on your project using:

```
npm install @beautifulbits/boilerplate --save-dev
```

or

```
yarn add @beautifulbits/boilerplate -D
```

Then in your `boilerplate.config.mjs` file, you can use the helper packages by importing them like:

```
import {pluralize, changeCase} from `@beautifulbits/boilerplate`
```
