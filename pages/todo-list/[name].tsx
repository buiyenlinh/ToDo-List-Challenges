import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FormEvent, useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { Header } from '../../components'
import {
    IHistoryUpdateTodoListItem,
    IItemTodoList,
} from '../../contants/interface'
import {
    historyListState,
    statesListState,
    todoItemState,
    todoListState,
} from '../../store/todo-list-state'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useTranslation } from 'react-i18next'

function CreateUpdate() {
    const { t, i18n } = useTranslation();
    const [todoList, setTodoList] = useRecoilState(todoListState)
    const setHistoryList = useSetRecoilState(historyListState) 
    const statesList = useRecoilValue(statesListState);
    const router = useRouter();
    const itemState = useRecoilValue(todoItemState(router.query))
    const [index, setIndex] = useState(-1)
    const [errors, setErrors] = useState({
        title: '',
        content: '',
        avatar: ''
    })
    const [todoItem, setTodoItem] = useState<IItemTodoList>({
        id: '',
        title: '',
        content: '',
        avatar: '',
        emojiList: [],
        totalEmojiPoint: 0,
        status: '',
        created_at: 0,
        updated_at: 0,
    })

    const handleCreateOrUpdateTodoItem = (e: FormEvent) => {
        e.preventDefault()
        let errTitle = '';
        let errContent = '';
        if (todoItem.title === '') {
            errTitle = t("todo_list.required.title");
        }

        if (todoItem.content === '') {
            errContent = t("todo_list.required.content");
        }

        setErrors((errors) => ({ ...errors, title: errTitle }))
        setErrors((errors) => ({ ...errors, content: errContent }))

        if (errTitle === '' && errContent === '') {
            if (router.query.name == 'update') {
                updateTodoListItem(todoItem)
            } else {
                createTodoListItem()
            }
            router.push("/")
        }
    }

    const createTodoListItem = () => {
        const id = `${new Date().getTime()}`
        setTodoList((oldTodoList: IItemTodoList[]) => [
            ...oldTodoList,
            {
                id: id,
                title: todoItem.title,
                content: todoItem.content,
                avatar: todoItem.avatar,
                emojiList: [],
                totalEmojiPoint: 0,
                status: statesList[0].id,
                created_at: new Date().getTime() / 1000,
                updated_at: new Date().getTime() / 1000,
            },
        ])

        setHistoryList((oldHistoryList: IHistoryUpdateTodoListItem[]) => [
            ...oldHistoryList,
            {
                id: `${new Date().getTime()}`,
                todoId: id,
                title: todoItem.title,
                content: todoItem.content,
                avatar: todoItem.avatar,
                status: t("common.create"),
                todoStatus: statesList[0].id,
                created_at: new Date().getTime() / 1000,
            },
        ])
    }

    const updateTodoListItem = (_item: IItemTodoList) => {
        const newList = replaceItemAtIndex(todoList, index, {
            ..._item,
            updated_at: new Date().getTime() / 1000,
        })
        setTodoList(newList)

        setHistoryList((oldHistoryList: IHistoryUpdateTodoListItem[]) => [
            ...oldHistoryList,
            {
                id: `${new Date().getTime()}`,
                todoId: `${router.query.id}`,
                title: todoItem.title,
                content: todoItem.content,
                avatar: todoItem.avatar,
                todoStus: todoItem.status,
                status: t("common.update"),
                created_at: new Date().getTime() / 1000,
            },
        ])
    }

    const replaceItemAtIndex = (
        arr: IItemTodoList[],
        _index: number,
        newValue: any
    ) => {
        return [...arr.slice(0, _index), newValue, ...arr.slice(_index + 1)]
    }

    const handleChangeAvatar = (e: any) => {
        if (["image/jpeg", "image/svg+xml", "image/png"].includes(e?.target?.files[0]?.type)) {
            setErrors(errors => ({...errors, avatar: ""}))
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                setTodoItem((todoItem) => ({
                    ...todoItem,
                    avatar: reader.result as string,
                }))
            })
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setErrors(errors => ({...errors, avatar: t("todo_list.required.avatar")}))
        }
    }

    useEffect(() => {
        if (router.query.name == 'update') {
            if (itemState === undefined) {
                router.push("/404");
            } else {
                setTodoItem(itemState);
                const idx = todoList.findIndex((item: IItemTodoList) => item === itemState);
                setIndex(idx)
            }
        }
        //  eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router])

    const getState = (_status: any) => {
        if (i18n.language)
            return _status[i18n.language];
    }

    return (
        <>
            <Header title={t("todo_list.item")} />
            <main className={'lg:w-3/6 md:w-4/6 w-100 mx-auto mt-9 p-3'}>
                { (todoItem.id && router.query.id) || (router.query.name == "create") ?
                    <div className="border border-inherit">
                        <div className="flex justify-between item-center bg-green-400 p-5">
                            <h3 className="font-bold">
                                {router.query.name == "create" ? t("todo_list.create_title") : t("todo_list.update_title")}
                            </h3>
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
                        <div className="p-5 pt-2">
                            <form onSubmit={handleCreateOrUpdateTodoItem}>
                                <div className="mt-3 mb-2">
                                    <label className="font-bold">
                                        {t("todo_list.label_title")} {' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="border border-inherit rounded-sm w-full outline-none py-1 px-3"
                                        value={todoItem.title}
                                        onChange={(val) =>
                                            setTodoItem((todoItem) => ({
                                                ...todoItem,
                                                title: val.target.value,
                                            }))
                                        }
                                    />
                                    {errors.title && (
                                        <div className="text-red-500 italic text-sm pt-1">
                                            {t("todo_list.required.title")}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-3 mb-2">
                                    <label className="font-bold">
                                    {t("todo_list.label_content")} {' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        onChange={(val) => {
                                            setTodoItem((todoItem) => ({
                                                ...todoItem,
                                                content: val.target.value,
                                            }))
                                        }}
                                        className="border border-inherit rounded-sm w-full outline-none py-1 px-3 resize-y"
                                        rows={3}
                                        value={todoItem.content}
                                    ></textarea>
                                    {errors.content && (
                                        <div className="text-red-500 italic text-sm pt-1">
                                            {t("todo_list.required.content")}
                                        </div>
                                    )}
                                </div>

                                {
                                    router.query.id &&
                                    <div className="mt-3 mb-2">
                                        <label className="font-bold">{t("common.status")}</label>
                                        {statesList.length > 0 && 
                                        <select
                                            className="focus-visible:outline-0 mr-2 mt-1 border border-inherit p-1 pb-2 w-full"
                                            onChange={(val) => setTodoItem((todoItem) => (
                                                {...todoItem, status: val.target.value}))
                                            }
                                            value={todoItem.status}
                                            
                                        >
                                            { statesList.map((_status) => (
                                                <option value={_status.id} key={_status.id}>
                                                    {getState(_status)}
                                                </option>
                                            ))}
                                        </select>
                                        }
                                    </div>
                                }

                                <div className="mt-3 mb-2">
                                    <label className="font-bold">{t("common.avatar")}</label>
                                    <label className="block">
                                        <span className="sr-only">
                                            {t("todo_list.choose_image")}
                                        </span>
                                        <input
                                            type="file"
                                            className="block w-full text-sm text-slate-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-violet-50 file:text-violet-700
                                                hover:file:bg-violet-100"
                                            onChange={handleChangeAvatar}
                                        />
                                    </label>
                                    { errors.avatar && (
                                        <div className="text-red-500 italic text-sm pt-1">
                                            {t("todo_list.required.avatar")}
                                        </div>
                                    )}
                                    <div className="shrink-0">
                                        {todoItem.avatar && (
                                            <Image
                                                src={todoItem.avatar}
                                                alt="avatar"
                                                height="200"
                                                width="200"
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="text-left col-span-2 mt-3 mb-2">
                                    {router.query.name && (
                                        <button
                                            type={'submit'}
                                            className="bg-green-500 hover:bg-green-600 focus:bg-green-500 p-2 pr-5 pl-5 rounded"
                                        >
                                            {todoItem.id == '' ? t("common.create") : t("common.update")}
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                :
                    <div className="mt-6">
                        <Skeleton count={8} />
                    </div>
                }
            </main>
        </>
    )
}

export default CreateUpdate;

export const getStaticProps = async (context: any) => {
    const name = context.params.name;
    const res = ['create', 'update'].includes(name)
        ?   {props: {
                name: name
            }}
        :   {
              props: {},
              notFound: true,
            }
    return res;
}

export const getStaticPaths = async () => {
    return {
        paths: [],
        fallback: true,
    }
}