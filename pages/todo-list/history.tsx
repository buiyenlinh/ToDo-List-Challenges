import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { Header } from '../../components'
import { convertIntToDate } from '../../contants/funcs'
import { historyOfTodoState, statesListState, todoIdState, todoListState } from '../../store/todo-list-state'
import Image from 'next/image'
import useTrans from '../../hooks/useTrans'
import { IHistoryUpdateTodoListItem, IItemTodoList } from '../../contants/interface'
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
function History() {
    const router = useRouter()
    const { locale } = router;
    const setTodoId = useSetRecoilState(todoIdState)
    const todoList = useRecoilValue(todoListState);
    const historyList = useRecoilValue(historyOfTodoState)
    const statesList = useRecoilValue(statesListState)
    const trans = useTrans();
    useEffect(() => {
        const id = router.query.id
        if (id != undefined) {
            const val = todoList.find((item: IItemTodoList) => item.id == id);
            if (val === undefined) {
                router.push("/404", "/404", {locale: locale})
            } else {
                setTodoId(`${id}`)
            }
        }
        //  eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query.id])

    const getItemState = (todoState: string) => {
        const itemState = statesList.find(item => item.id == todoState);
        return itemState?.state;
    }

    return (
        <>
            <Header title="History of todo item" />
            <main className="lg:w-4/6 md:w-5/6 w-100 mx-auto p-3">
                { historyList?.list?.length > 0 && router.query.id != undefined ?
                <>
                    <div className="flex justify-between item-center bg-green-400 p-2 pr-5 pl-5 mt-6">
                        <h1 className="font-bold">{trans.todoList.UPDATE_HISTORY}</h1>
                        <Link href="/" locale={locale}>
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
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="border border-inherit p-2">{trans.Common.TIME}</th>
                                    <th className="border border-inherit p-2">{trans.todoList.LABEL_TITLE}</th>
                                    <th className="border border-inherit p-2">{trans.todoList.LABEL_CONTENT}</th>
                                    <th className="border border-inherit p-2">StateTodo</th>
                                    <th className="border border-inherit p-2">{trans.Common.AVATAR}</th>
                                    <th className="border border-inherit p-2">{trans.Common.STATIC}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyList?.list?.length > 0 ? (
                                    historyList.list?.map((item: IHistoryUpdateTodoListItem) => {
                                        return (
                                            <tr key={item.id}>
                                                <td className="text-center border border-inherit p-2">
                                                    {convertIntToDate(
                                                        item.created_at
                                                    )}
                                                </td>
                                                <td className="border border-inherit p-2">{item.title}</td>
                                                <td className="border border-inherit p-2">{item.content}</td>
                                                <td className="text-center border border-inherit p-2">{getItemState(item.todoState)}</td>
                                                <td className="text-center border border-inherit p-2">
                                                    {item.avatar != '' && (
                                                        <Image
                                                            src={item.avatar}
                                                            alt={trans.Common.AVATAR}
                                                            height="70"
                                                            width="70"
                                                        />
                                                    )}
                                                </td>
                                                <td className="text-center border border-inherit p-2">
                                                    {item.static}
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center border border-inherit p-2">{trans.todoList.EMPTY_LIST}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
                : <div className="mt-6">
                    <Skeleton count={8} />
                </div>
                }
            </main>
        </>
    )
}

export default History;
