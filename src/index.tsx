import * as React from "react";
import * as ReactDOM from "react-dom";

import { App } from "./components";

window.addEventListener('load', function(){
    console.log(`window:load: about to render app...`);
    ReactDOM.render(
        <App />,
        document.getElementById("example")
    );
    console.log(`window:load: app rendered`);
});
