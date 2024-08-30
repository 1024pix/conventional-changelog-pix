export function createParserOpts () {
  return {
    gitRawCommitsOpts: {
      merges: true
    },
    headerPattern: / #(\d+)/,
    headerCorrespondence: [
      'pr'
    ],
    mergePattern: /^\[(.*)] (.*?)(?: \(#(\d+)\))?$/,
    mergeCorrespondence: [
      'tag',
      'scope',
      'prNumberFromTitle'
    ],
    revertPattern: /^(?:Revert)\s"\[?([\S]+?)]\s(.*)"[\W]+?#(\d+)/,
    revertCorrespondence: [
      'tag',
      'scope',
      'pr'
    ],
  }
}
