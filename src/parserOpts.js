export function createParserOpts () {
  return {
    gitRawCommitsOpts: {
      merges: true
    },
    headerPattern: /^\[(.*)] (.*)$|#(\d+)/,
    headerCorrespondence: [
      'tag',
      'scope',
      'pr'
    ],
    mergePattern: /^\[(.*)] (.*)$/,
    mergeCorrespondence: [
      'tag',
      'scope'
    ],
  }
}
