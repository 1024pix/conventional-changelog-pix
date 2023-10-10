export function createParserOpts () {
  return {
    gitRawCommitsOpts: {
      noMerges: null
    },
    headerPattern: /^\[(.*)] (.*)$/,
    headerCorrespondence: [
      'tag',
      'scope',
    ],
    mergeCorrespondence: ['pr'],
  }
}