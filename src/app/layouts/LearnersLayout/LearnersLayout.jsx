import React from 'react'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import { Outlet } from 'react-router'
import ScrollTop from '../../components/ScrollTop/ScrollTop'

export default function LearnersLayout() {
    return (
        <>
            <Header />
            <div className='pt-16'>
                <Outlet />
            </div>
            <ScrollTop />
            <Footer />
        </>
    )
}
