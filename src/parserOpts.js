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
    revertPattern: /^(?:Revert)\s"\[?([\S]+?)]\s(.*)"[\W]+?#(\d+)/,
    revertCorrespondence: [
      'tag',
      'scope',
      'pr'
    ],
  }
}
