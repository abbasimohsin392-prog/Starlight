import { createShareCard, shareCardContentType, shareCardSize } from '@/lib/share-card'

export const alt = 'Starlight AI — practical AI automation for customer enquiries and follow-up'
export const size = shareCardSize
export const contentType = shareCardContentType

export default function TwitterImage() {
  return createShareCard()
}
