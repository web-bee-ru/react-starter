module.exports = {
  processors: [
    'stylelint-processor-styled-components'
  ],
  plugins: ['stylelint-scss'],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-styled-components'
  ],
  rules: {
    // @NOTE: This conflicts with @use from scss
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,

    // @NOTE: This conflicts with styled-components
    'no-empty-source': null,
    'no-descending-specificity': null,
    'value-keyword-case': null,
  },
};
