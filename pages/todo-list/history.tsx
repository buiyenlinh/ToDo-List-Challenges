import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { Header } from '../../components'
import { convertIntToDate } from '../../contants/funcs'
import ROUTE_NAME from '../../router'
import { getHistoryUpdateById, todoId } from '../../store/todoListState'
import styles from "../../styles/Home.module.css"

function History() {
    const router = useRouter()
    const setTodoId = useSetRecoilState(todoId)
    const historyList = useRecoilValue(getHistoryUpdateById)
    useEffect(() => {
        const id = router.query.id
        if (!id) {
            router.push(ROUTE_NAME.HOME)
        } else {
            setTodoId(`${id}`)
        }
        //  eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <>
            <Header title="History of todo item" />
            <main className="lg:w-4/6 md:w-5/6 w-100 mx-auto">
                <div className="flex justify-between item-center bg-green-400 p-2 pr-5 pl-5 mt-6">
                    <h1 className="font-bold">History</h1>
                    <Link href="/">
                        <a className="font-bold">Back</a>
                    </Link>
                </div>
                <div>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Content</th>
                                <th>Static</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyList?.map((item) => {
                                return (
                                    <tr key={item.id}>
                                        <td>{convertIntToDate(item.updated_at)}</td>
                                        <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
                                        <td>{item.static}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </main>
        </>
    )
}

export default History
