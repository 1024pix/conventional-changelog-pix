export function createParserOpts () {
  return {
    gitRawCommitsOpts: {
      merges: null
    },
    headerPattern: /^\[(.*)] (.*)$/,
    headerCorrespondence: [
      'tag',
      'scope',
    ],
    mergePattern: /(#.*)/
    mergeCorrespondence: ['pr'],
  }
}
