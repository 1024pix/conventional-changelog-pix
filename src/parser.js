export function createParserOpts () {
  return {
    gitRawCommitsOpts: { merges: false },
    headerPattern: /^\[([^\]]+)\] (.+?)(?: \(#(\d+)\))?$/,
    headerCorrespondence: ['tag', 'scope', 'pr'],
    revertPattern: /^(?:Revert)\s"\[?([\S]+?)\]\s(.*)"[\W]+?#(\d+)/,
    revertCorrespondence: ['tag', 'scope', 'pr'],
  }
}
