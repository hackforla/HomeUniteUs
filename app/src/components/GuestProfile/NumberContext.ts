import * as React from "react"

const NumberContext = React.createContext({})

export const NumberProvider = NumberContext.Provider
export const NumberConsumer = NumberContext.Consumer
export default NumberContext
