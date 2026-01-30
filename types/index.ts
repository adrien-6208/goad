export interface Series {
  id: string
  name: string
  image?: string
}

export interface Rarity {
  id: string
  name: string
}

export type CardStatus = 'acquired' | 'wanted' | 'both'

export interface Card {
  id: string
  cardNumber: string
  name: string
  image?: string
  seriesId: string
  rarityId: string
  status: CardStatus
  duplicates: number
}
