import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { Header } from '../../components'
import { convertIntToDate } from '../../contants/funcs'
import { getHistoryUpdateById, todoId } from '../../store/todoListState'
import styles from '../../styles/Home.module.css'
import Image from 'next/image'
import ROUTE_NAME from '../../router'
import useTrans from '../hook/useTrans'
function History() {
    const router = useRouter()
    const setTodoId = useSetRecoilState(todoId)
    const historyList = useRecoilValue(getHistoryUpdateById)
    const trans = useTrans();
    useEffect(() => {
        const id = router.query.id
        setTodoId(`${id}`)
        //  eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query.id])
    return (
        <>
            <Header title="History of todo item" />
            <main className="lg:w-4/6 md:w-5/6 w-100 mx-auto p-3">
                <div className="flex justify-between item-center bg-green-400 p-2 pr-5 pl-5 mt-6">
                    <h1 className="font-bold">History</h1>
                    <Link href={ROUTE_NAME.HOME}>
                        <a className="font-bold flex justify-end items-center">
                            {trans.Common.BACK}
                            <svg
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                />
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </a>
                    </Link>
                </div>
                <div>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>{trans.Common.TIME}</th>
                                <th>{trans.todoList.LABEL_TITLE}</th>
                                <th>{trans.todoList.LABEL_CONTENT}</th>
                                <th>{trans.Common.AVATAR}</th>
                                <th>{trans.Common.STATIC}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyList?.list?.length > 0 ? (
                                historyList.list?.map((item) => {
                                    return (
                                        <tr key={item.id}>
                                            <td className="text-center">
                                                {convertIntToDate(
                                                    item.created_at
                                                )}
                                            </td>
                                            <td>{item.title}</td>
                                            <td>{item.content}</td>
                                            <td className="text-center">
                                                {item.avatar != '' && (
                                                    <Image
                                                        src={item.avatar}
                                                        alt={trans.Common.AVATAR}
                                                        height="70"
                                                        width="70"
                                                    />
                                                )}
                                            </td>
                                            <td className="text-center">
                                                {item.static}
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center">{trans.todoList.EMPTY_LIST}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </>
    )
}

export default History
