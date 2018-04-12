/* import { markdown } from 'markdown'
export default html => markdown.toHTML(html) */

import Markdown from 'marked'
export default html => Markdown(html)