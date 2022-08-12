import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { Header } from '../../components'
import { convertIntToDate } from '../../contants/funcs'
import { historyOfTodoIdState, statesListState } from '../../store/todo-list-state'
import Image from 'next/image'
import { IHistoryUpdateTodoListItem } from '../../contants/interface'
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import { useTranslation } from 'react-i18next'
function History() {
    const router = useRouter()
    const historyList = useRecoilValue(historyOfTodoIdState(router.query.id));
    const statesList = useRecoilValue(statesListState)
    const { t, i18n } = useTranslation();
    useEffect(() => {
        if (historyList.length === 0 && router.query.id) [
            router.push("/404")
        ]
        //  eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query.id])

    const getItemState = (todoState: string) => {
        if (todoState) {
            const itemState:any = statesList.find(item => item.id == todoState);
            if (i18n.language)
                return itemState[i18n.language];
        }
    }

    return (
        <>
            <Header title={t("todo_list.history_title")} />
            <main className="lg:w-4/6 md:w-5/6 w-100 mx-auto p-3">
                { historyList.length > 0 && router.query.id ?
                <>
                    <div className="flex justify-between item-center bg-green-400 p-2 pr-5 pl-5 mt-10">
                        <h1 className="font-bold">{t("todo_list.update_history")}</h1>
                        <Link href="/">
                            <a className="font-bold flex justify-end items-center">
                                {t("common.back")}
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
                                    <th className="border border-inherit p-2">{t("common.time")}</th>
                                    <th className="border border-inherit p-2">{t("todo_list.label_title")}</th>
                                    <th className="border border-inherit p-2">{t("todo_list.label_content")}</th>
                                    <th className="border border-inherit p-2">{t("common.status")}</th>
                                    <th className="border border-inherit p-2">{t("common.avatar")}</th>
                                    <th className="border border-inherit p-2">{t("common.status")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyList.length > 0 ? (
                                    historyList?.map((item: IHistoryUpdateTodoListItem) => {
                                        return (
                                            <tr key={item.id}>
                                                <td className="text-center border border-inherit p-2">
                                                    {convertIntToDate(
                                                        item.created_at
                                                    )}
                                                </td>
                                                <td className="border border-inherit p-2">{item.title}</td>
                                                <td className="border border-inherit p-2">{item.content}</td>
                                                <td className="text-center border border-inherit p-2">{getItemState(item.todoStatus)}</td>
                                                <td className="text-center border border-inherit p-2">
                                                    {item.avatar != '' && (
                                                        <Image
                                                            src={item.avatar}
                                                            alt={t("common.avatar")}
                                                            height="70"
                                                            width="70"
                                                        />
                                                    )}
                                                </td>
                                                <td className="text-center border border-inherit p-2">
                                                    {item.status}
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center border border-inherit p-2">{t("todo_list.empty_list")}</td>
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