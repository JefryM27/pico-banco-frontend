import DOMPurify from 'dompurify'
import { MODE } from '../constants/routes'

export function sanitizeHtml(html) {
  if (MODE === 'vulnerable') {
    // VULNERABLE: return raw HTML
    return html
  }
  return DOMPurify.sanitize(html)
}
