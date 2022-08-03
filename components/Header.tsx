import Head from 'next/head'
import React from 'react'
interface IProps {
    title: string
}
function Header(props: IProps) {
    return (
        <Head>
            <title>{props.title}</title>
            <meta
                name="description"
                content="ToDo List Challenges"
            />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    )
}

export default Header
