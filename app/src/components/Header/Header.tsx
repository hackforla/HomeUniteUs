import React from 'react'
import * as AppStyle from '../../AppStyle'
import logo from '../../img/masterSpyLogo3.png'
import { useAuth0 } from '../../react-auth0-spa'
import { NavLink } from 'react-router-dom'

export const Header = () => {
    const { user, logout } = useAuth0()

    const logoutClick = () => {
        logout()
    }
    return (
        <AppStyle.FlexHolder>
            <AppStyle.FlexGrowHolder>
                <a href="http://www.safeplaceforyouth.org/" target="_blank">
                    <AppStyle.Image src={logo} alt="Logo" />
                </a>
            </AppStyle.FlexGrowHolder>
            <AppStyle.Holder>
                <NavLink to={`/caseworkerdashboard`}>caseworker dashboard</NavLink>
            </AppStyle.Holder>
            <AppStyle.Holder>
                <NavLink to={`/about`}>ABOUT</NavLink>
            </AppStyle.Holder>
            {/* Tyler 8/8/2020: Moving away from proof-of-concept to prototype */}
            {/* <AppStyle.Holder>
                <NavLink to={`/hostinfo`}>host info</NavLink>
            </AppStyle.Holder> */}
            {/* <AppStyle.Holder>
                <NavLink to={`/hostformlang`}>Lang</NavLink>
            </AppStyle.Holder> */}
            {/* 
            <AppStyle.Holder>
                <NavLink to={`/demo`}>DEMO</NavLink>
            </AppStyle.Holder>
            <AppStyle.Holder>
                <NavLink to={`/admin/guests`}>ADMIN</NavLink>
            </AppStyle.Holder>
            <AppStyle.Holder>
                <NavLink to={`/admin/hosts`}>ALL HOSTS</NavLink>
            </AppStyle.Holder>
            <AppStyle.Holder>
                <NavLink to={`/profile`}>Profile</NavLink>
            </AppStyle.Holder> 
            */}
            {/* <AppStyle.Holder>
                <NavLink to={`/uploadImage`}>Image Upload</NavLink>
            </AppStyle.Holder> */}
            <AppStyle.Holder>
                <NavLink to={`/profileselection`}>Register</NavLink>
            </AppStyle.Holder>
            <AppStyle.Holder>
                <NavLink to={`/admin/dashboard`}>ADMIN</NavLink>
            </AppStyle.Holder>
            <AppStyle.Holder>
                <span>Hello, {(user && user.name) || 'User'}</span>
            </AppStyle.Holder>
            <AppStyle.Holder>
                <span onClick={logoutClick}>Logout</span>
            </AppStyle.Holder>
        </AppStyle.FlexHolder>
    )
}
