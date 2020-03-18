import * as React from "react"
import * as ReactDOM from "react-dom"
import "./index.css"

import { App } from "./App"

window.addEventListener("load", function() {
  console.log(`window:load: about to render app...`)
  ReactDOM.render(<App />, document.getElementById("app-root"))
  console.log(`window:load: app rendered`)
})
