import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { Header } from '../../components'
import { convertIntToDate } from '../../contants/funcs'
import ROUTE_NAME from '../../router'
import { getHistoryUpdateById, todoId } from '../../store/todoListState'
import styles from '../../styles/Home.module.css'
import Image from 'next/image'
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
                                <th>Title</th>
                                <th>Content</th>
                                <th>Avatar</th>
                                <th>Static</th>
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
                                                        alt="avatar"
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
                                    <td>Empty</td>
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
