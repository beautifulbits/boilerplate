function replaceAll(str, replacements) {
  let replaced = str;
  Object.keys(replacements).forEach((replacementKey) => {
    const replaceWith = replacements[replacementKey];
    replaced = replaced.replace(new RegExp(replacementKey, `g`), replaceWith);
  });
  return replaced;
}

module.exports = { replaceAll };
