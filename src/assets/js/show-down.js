import ShowDown from 'showdown'
const Converter = new ShowDown.Converter()
export default html => Converter.makeHtml(html)