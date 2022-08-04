import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FormEvent, useEffect, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { Header } from '../../components'
import { IItemTodoList } from '../../contants/interface'
import ROUTE_NAME from '../../router'
import { historyUpdateTodoListState, todoListState } from '../../store/todoListState'
import homeStyle from '../../styles/Home.module.css'

function Create() {
    const [todoList, setTodoList] = useRecoilState(todoListState)
    const setHistoryList = useSetRecoilState(historyUpdateTodoListState);
    const router = useRouter()
    const [index, setIndex] = useState(-1);
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
        updated_at: 0
    })

    const handleCreateOrUpdateTodoItem = (e: FormEvent) => {
        e.preventDefault()
        if (todoItem.title == '') {
            setErrors((errors) => ({ ...errors, title: 'Title is required' }))
        }
        if (todoItem.content == '') {
            setErrors((errors) => ({
                ...errors,
                content: 'Content is required',
            }))
        }
        if (todoItem.title != '' && todoItem.content != '') {
            if (router.query.name == "update") {
                updateTodoListItem(todoItem);
                alert("Updated successful");
            } else {
                createTodoListItem();
                router.push(ROUTE_NAME.HOME)
            }
        }
    }

    const createTodoListItem = () => {
        const id = `${new Date().getTime()}`;
        setTodoList((oldTodoList) => [
            ...oldTodoList, 
            {
                id: id,
                title: todoItem.title,
                content: todoItem.content,
                avatar: todoItem.avatar,
                emojiList: [],
                totalEmojiPoint: 0,
                created_at: new Date().getTime() / 1000,
                updated_at: new Date().getTime() / 1000
            }
        ])

        setHistoryList((oldHistoryList) => [
            ...oldHistoryList,
            {
                id: `${new Date().getTime()}`,
                todoId: id,
                title: todoItem.title,
                content: todoItem.content,
                avatar: todoItem.avatar,
                static: 'create',
                created_at: new Date().getTime() / 1000
            }
        ])
    }

    const updateTodoListItem = (_item: IItemTodoList) => {
        const newList = replaceItemAtIndex(todoList, index, {
            ..._item,
            updated_at: new Date().getTime()/1000
        })
        setTodoList(newList);

        setHistoryList((oldHistoryList) => [
            ...oldHistoryList,
            {
                id: `${new Date().getTime()}`,
                todoId: `${router.query.id}`,
                title: todoItem.title,
                content: todoItem.content,
                avatar: todoItem.avatar,
                static: 'update',
                created_at: new Date().getTime() / 1000
            }
        ])
    }

    const replaceItemAtIndex = (arr: IItemTodoList[], _index: number, newValue: any) => {
        return [...arr.slice(0, _index), newValue, ...arr.slice(_index + 1)];
    }

    const handleChangeAvatar = (e: any) => {
        const url = URL.createObjectURL(e.target.files[0])
        setTodoItem(todoItem => ({...todoItem, avatar: url}))
    }

    const getTodoItem = (todoId: string) => {
        if (todoList.length > 0) {
            todoList.forEach((_item) => {
                if (_item?.id == todoId) {
                    setTodoItem(_item)
                    const idx = todoList.findIndex((item) => item === _item);
                    setIndex(idx);
                }
            })
        }
    }

    useEffect(() => {
        const actionName = router.query.name
        if (actionName == 'update') {
            getTodoItem(`${router.query.id}`)
        }
        //  eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router])

    return (
        <>
            <Header title="Create todo item" />
            <main className={'lg:w-3/6 md:w-4/6 w-100 mx-auto mt-6 p-3'}>
                <div className="border border-inherit p-5">
                    <div className="flex justify-between item-center">
                        <h3 className="font-bold">Create todo item</h3>
                        <Link href="/">
                            <a className="font-bold">Back</a>
                        </Link>
                    </div>
                    <div className="pt-3">
                        <form onSubmit={handleCreateOrUpdateTodoItem}>
                            <div className="mt-3 mb-2">
                                <label className='font-bold'>
                                    Title{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={homeStyle.input}
                                    value={todoItem.title}
                                    onChange={(val) =>
                                        setTodoItem(todoItem => ({...todoItem, title: val.target.value}))
                                    }
                                />
                                {errors.title && (
                                    <div className="text-red-500 italic text-sm pt-1">
                                        {errors.title}
                                    </div>
                                )}
                            </div>

                            <div className="mt-3 mb-2">
                                <label className='font-bold'>
                                    Content{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={homeStyle.input}
                                    value={todoItem.content}
                                    onChange={(val) =>
                                        setTodoItem(todoItem => ({...todoItem, content: val.target.value}))
                                    }
                                />
                                {errors.content && (
                                    <div className="text-red-500 italic text-sm pt-1">
                                        {errors.content}
                                    </div>
                                )}
                            </div>

                            <div className="mt-3 mb-2">
                                <label className='font-bold'>Avatar</label>
                                <label className="block">
                                    <span className="sr-only">
                                        Choose profile photo
                                    </span>
                                    <input
                                        type="file"
                                        className="block w-full text-sm text-slate-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-violet-50 file:text-violet-700
                                            hover:file:bg-violet-100
                                        "
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
                                {router.query.name &&
                                    <button
                                        type={'submit'}
                                        className="bg-cyan-500 hover:bg-cyan-600 focus:bg-cyan-500 p-2 pr-5 pl-5 rounded"
                                    >
                                        {todoItem.id == '' ? 'Add' : 'Update'}
                                    </button>
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Create;
