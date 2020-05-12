import * as React from 'react';
import {render, fireEvent, waitForElement, screen} from '@testing-library/react';

import {App} from '../App';

const renderApp = () => render(<div>TEST</div>);

describe('<App />', () => {
    test('should render without crashing', () => {
        const app = renderApp();
        expect(screen.queryByText('TEST')).toBeDefined();
    });
});