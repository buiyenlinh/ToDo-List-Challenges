import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import useTrans from '../hooks/useTrans'
function NotFound() {
    const trans = useTrans()
    const router = useRouter()
    return (
        <div className="h-screen text-center flex flex-col items-center justify-center">
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
