import { ResponseMultiplicity } from '.'

export interface GuestQuestion {
  id: number
  questionKey: string
  text: string
  responseValues: Array<number>
  multiplicity: ResponseMultiplicity
}
