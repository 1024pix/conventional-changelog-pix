export function createParserOpts () {
  return {
    gitRawCommitsOpts: {
      merges: true
    },
    headerPattern: /^\[(.*)] (.*)$/,
    headerCorrespondence: [
      'tag',
      'scope',
    ],
    mergeCorrespondence: ['pr'],
  }
}