import * as React from 'react'
import { FourOhFourStyle } from './style'

const FourOhFour = () => (
    <FourOhFourStyle.Holder>
        <FourOhFourStyle.Message>
            <FourOhFourStyle.PageNotFound>
                <p>404</p>
                <p>Page Not Found</p>
            </FourOhFourStyle.PageNotFound>
            <FourOhFourStyle.Report>
                <span>To report a broken link,&nbsp;</span>
                <span>please email HostHome@HackforLA.org</span>
            </FourOhFourStyle.Report>
        </FourOhFourStyle.Message>
    </FourOhFourStyle.Holder>
)

export default FourOhFour
