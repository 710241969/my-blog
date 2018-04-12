import ShowDown from 'showdown'
// ShowDown.setFlavor('github');
const Converter = new ShowDown.Converter({
  omitExtraWLInCodeBlocks: true,
  strikethrough: true,
  tables: true,
  tasklists: true,
  requireSpaceBeforeHeadingText: true,
  emoji: true,
  // splitAdjacentBlockquotes: true
})

export default html => Converter.makeHtml(html)