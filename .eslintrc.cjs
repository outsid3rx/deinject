const { configure, presets } = require('eslint-kit')

module.exports = configure({
  presets: [
    presets.typescript(),
    presets.node(),
    presets.prettier(),
    presets.imports({ sort: { newline: true } }),
  ],
})
