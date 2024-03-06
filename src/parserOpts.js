export function createParserOpts () {
  return {
    gitRawCommitsOpts: {
      merges: true
    },
    headerPattern: / #(\d+)/,
    headerCorrespondence: [
      'pr'
    ],
    mergePattern: /^\[(.*)] (.*)$/,
    mergeCorrespondence: [
      'tag',
      'scope'
    ],
  }
}
