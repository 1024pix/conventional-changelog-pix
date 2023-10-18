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
    mergeCorrespondence: ['pr'],
  }
}