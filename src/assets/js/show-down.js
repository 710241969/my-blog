import ShowDown from 'showdown'

const Converter = new ShowDown.Converter({
  omitExtraWLInCodeBlocks: true,
  strikethrough: true,
  tables: true,
  tasklists: true,
  requireSpaceBeforeHeadingText: true,
  emoji: true,
})

export default html => Converter.makeHtml(html)