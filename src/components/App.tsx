import 'babel-polyfill';

import * as React from "react";
import { AppConfig } from '../data/config';

export interface AppProps { compiler: string; framework: string; }

export const App = (props: AppProps) => {
    console.log(`App:render: in render()`);
    return (
    <h1>{AppConfig.AppName}!</h1>
    );
};
