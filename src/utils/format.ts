import type { PaymentMethod } from '../store/AppContext'

/** 1 Gold = 1,000 VND */
export const GOLD_RATE = 1000

export const formatVND = (value: number) => `${value.toLocaleString('en-US')} VND`

export const formatGold = (value: number) => `${value.toLocaleString('en-US')} Gold`

export const vndToGold = (vnd: number) => Math.ceil(vnd / GOLD_RATE)

export const goldToVnd = (gold: number) => gold * GOLD_RATE

export const METHOD_LABEL: Record<PaymentMethod, string> = {
  gold: 'Gold',
  momo: 'Momo',
  bank: 'Bank Account',
}
