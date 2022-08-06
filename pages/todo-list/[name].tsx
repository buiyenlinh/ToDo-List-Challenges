import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FormEvent, useEffect, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { Header } from '../../components'
import {
    IHistoryUpdateTodoListItem,
    IItemTodoList,
} from '../../contants/interface'
import ROUTE_NAME from '../../router'
import {
    historyUpdateTodoListState,
    todoListState,
} from '../../store/todoListState'
import homeStyle from '../../styles/Home.module.css'
import useTrans from '../hook/useTrans'

function CreateUpdate() {
    const [todoList, setTodoList] = useRecoilState(todoListState)
    const setHistoryList = useSetRecoilState(historyUpdateTodoListState)
    const router = useRouter()
    const [index, setIndex] = useState(-1)
    const [errors, setErrors] = useState({
        title: '',
        content: '',
    })
    const [todoItem, setTodoItem] = useState<IItemTodoList>({
        id: '',
        title: '',
        content: '',
        avatar: '',
        emojiList: [],
        totalEmojiPoint: 0,
        created_at: 0,
        updated_at: 0,
    })

    const trans = useTrans();

    const handleCreateOrUpdateTodoItem = (e: FormEvent) => {
        e.preventDefault()
        let errTitle = '';
        let errContent = '';
        if (todoItem.title === '') {
            errTitle = 'Title is required';
        }
        if (todoItem.content === '') {
            errContent = 'Content is required'
        }
        
        setErrors((errors) => ({ ...errors, title: errTitle }))
        setErrors((errors) => ({ ...errors, content: errContent }))

        if (errTitle === '' && errContent === '') {
            if (router.query.name == 'update') {
                updateTodoListItem(todoItem)
                alert('Updated successful')
            } else {
                createTodoListItem()
                router.push(ROUTE_NAME.HOME)
            }
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
                static: 'create',
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
                static: 'update',
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
        const reader = new FileReader()
        reader.addEventListener('load', () => {
            setTodoItem((todoItem) => ({
                ...todoItem,
                avatar: reader.result as string,
            }))
        })
        reader.readAsDataURL(e.target.files[0])
    }

    const getTodoItem = (todoId: string) => {
        if (todoList.length > 0) {
            todoList.forEach((_item: IItemTodoList) => {
                if (_item?.id == todoId) {
                    setTodoItem(_item)
                    const idx = todoList.findIndex(
                        (item: IItemTodoList) => item === _item
                    )
                    setIndex(idx)
                }
            })
        }
    }

    useEffect(() => {
        if (router.query.name == 'update') {
            getTodoItem(`${router.query.id}`)
        }
        //  eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router])

    return (
        <>
            <Header title={trans.todoList.CREATE_TITLE} />
            <main className={'lg:w-3/6 md:w-4/6 w-100 mx-auto mt-6 p-3'}>
                <div className="border border-inherit">
                    <div className="flex justify-between item-center bg-green-400 p-5">
                        <h3 className="font-bold">{trans.todoList.CREATE_TITLE}</h3>
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
                    <div className="p-5 pt-2">
                        <form onSubmit={handleCreateOrUpdateTodoItem}>
                            <div className="mt-3 mb-2">
                                <label className="font-bold">
                                    {trans.todoList.LABEL_TITLE} {' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={homeStyle.input}
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
                                        {errors.title}
                                    </div>
                                )}
                            </div>

                            <div className="mt-3 mb-2">
                                <label className="font-bold">
                                {trans.todoList.LABEL_CONTENT} {' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    onChange={(val) => {
                                        setTodoItem((todoItem) => ({
                                            ...todoItem,
                                            content: val.target.value,
                                        }))
                                    }}
                                    className={`${homeStyle.input} resize-y`}
                                    rows={3}
                                    value={todoItem.content}
                                ></textarea>
                                {errors.content && (
                                    <div className="text-red-500 italic text-sm pt-1">
                                        {errors.content}
                                    </div>
                                )}
                            </div>

                            <div className="mt-3 mb-2">
                                <label className="font-bold">{trans.Common.AVATAR}</label>
                                <label className="block">
                                    <span className="sr-only">
                                        {trans.todoList.CHOOSE_IMAGE}
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
                                        {todoItem.id == '' ? trans.Common.CREATE : trans.Common.UPDATE}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
                
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
        paths: [
            { params: { name: 'create' } },
            { params: { name: 'update' } }
        ],
        fallback: 'blocking',
    }
}