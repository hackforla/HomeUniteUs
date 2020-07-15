import * as React from 'react'
import { AboutStyle } from './style'
import Upload from '../components/Upload/Upload'

export const AboutPage = () => (
    <AboutStyle.AboutHolder>
        <AboutStyle.TextBlock>
            <AboutStyle.AboutTitle>About</AboutStyle.AboutTitle>
            <AboutStyle.AboutText>
                <h4>Introduction</h4>
                <p>
                    Welcome to Hack for LA's host homes project! Hack for LA is
                    a brigade of Code for America, and we're working with our
                    partners at Safe Place for Youth (SPY) to enhance their host
                    homes program. Together, we're developing a workflow
                    management tool, digitizing key moments within SPY’s host
                    homes initiative to make the process scaleable, reduce
                    institutional bias, and effectively capture data.
                </p>
                <h4>Overview</h4>
                <p>
                    SPY’s host homes program is centered around housing young
                    people, 18 - 25 years old. Their approach focuses on
                    low-cost, community-driven intervention by matching a
                    willing host with a guest or group of guests, providing a
                    stable housing environment for youths who are experiencing
                    homelessness and seeking stable housing.
                </p>
                <h4>Status</h4>
                <p>
                    We're currently seeking additional stakeholders who run
                    similar host home/empty bedroom programs, to provide input
                    and feedback on how this tool can and could be used. We're
                    also seeking organizations and individuals interested in
                    supporting the project financially.
                </p>
                <p>
                    If any of these applies to you, please contact Bonnie Wolfe,
                    Hack for LA's Executive Director
                    <AboutStyle.MailLink
                        target="_blank"
                        href="mailto:bonnie@hackforla.org?subject=Host Homes"
                    >
                        bonnie@hackforla.org
                    </AboutStyle.MailLink>
                </p>
            </AboutStyle.AboutText>
        </AboutStyle.TextBlock>
        <Upload />
    </AboutStyle.AboutHolder>
)
