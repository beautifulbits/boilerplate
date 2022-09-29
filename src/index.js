/**
 * Include as part of the package helper libraries useful for creating
 * replacements in the boilerplate.config.js file of a template
 *
 * -----------------------------------------------------------------------------
 * change-case
 * -----------------------------------------------------------------------------
 * https://www.npmjs.com/package/change-case
 * Transform a string between:
 * - camelCase
 * - PascalCase
 * - Capital Case
 * - snake_case
 *  - param-case
 *  - CONSTANT_CASE
 *  - and others.
 *
 * -----------------------------------------------------------------------------
 * pluralize
 * -----------------------------------------------------------------------------
 * https://www.npmjs.com/package/pluralize
 * Pluralize and singularize any word.
 */

import _changeCase from 'change-case';
import _pluralize from 'pluralize';

export const changeCase = _changeCase;
export const pluralize = _pluralize;
