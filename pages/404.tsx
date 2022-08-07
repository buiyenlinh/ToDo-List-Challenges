import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import styles from '../styles/Home.module.css'
import useTrans from './hook/useTrans'
function NotFound() {
    const trans = useTrans()
    const router = useRouter()
    return (
        <div className={styles.notFound}>
            <h1 className="font-bold text-2xl">404</h1>
            <p>{trans.Common.NOT_FOUND_TEXT}</p>
            <Link href="/" locale={router.locale}>
                <a className={'border border-sky-500 pl-4 pr-4 p-2 mt-4'}>
                    {trans.todoList.BACK_TO_LIST}
                </a>
            </Link>
        </div>
    )
}

export default NotFound
