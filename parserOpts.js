export function createParserOpts () {
  return {
    headerPattern: /^\[(.*)] (.*)$/,
    headerCorrespondence: [
      'tag',
      'scope',
    ]
  }
}