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
    mergePattern: /^\[(.*)] (.*)$/,
    mergeCorrespondence: [
      'tag',
      'scope'
    ],
  }
}
