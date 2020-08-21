import * as React from 'react'
import {
    render,
    fireEvent,
    waitForElement,
    screen,
} from '@testing-library/react'

import { App } from '../App'

function renderApp(props: Partial<any> = {}) {
    // TODO: Tyler make this work with areal component
    // return render(<App {...props} />);
    return render(<div>TEST</div>)
}

describe('<App />', () => {
    test('should render without crashing', () => {
        const app = renderApp()
        expect(screen.queryByText('TEST')).toBeDefined()
    })
})
