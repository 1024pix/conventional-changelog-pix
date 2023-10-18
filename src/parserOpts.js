export function createParserOpts () {
  return {
    gitRawCommitsOpts: {
      merges: null
    },
    headerPattern: /^\[(.*)] (.*)$|#(\d+)/,
    headerCorrespondence: [
      'tag',
      'scope',
      'pr'
    ],
  }
}
