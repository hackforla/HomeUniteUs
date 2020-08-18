import { ResponseMultiplicity } from '.'

export interface HostQuestion {
  id: number
  questionKey: string
  text: string
  displayName: string
  responseValues: Array<number>
  multiplicity: ResponseMultiplicity
}
