import React, { useState } from 'react'
import {
    IEmojiListItem,
    IHistoryUpdateTodoListItem,
    IItemTodoList,
} from '../../contants/interface'
import Image from 'next/image'
import Link from 'next/link'
import ROUTE_NAME from '../../router'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
    emojiListState,
    historyListState,
    statesListState,
    todoListState,
} from '../../store/todo-list-state'
import { convertIntToDate } from '../../contants/funcs'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useTranslation } from 'react-i18next'
interface IProps {
    todoItem: IItemTodoList
}
function TodoItem(props: IProps) {
    const [todoList, setTodoList] = useRecoilState(todoListState)
    const [historyList, setHistoryList] = useRecoilState(historyListState)
    const statesList = useRecoilValue(statesListState)
    const emojiList = useRecoilValue(emojiListState)
    const [isShowDropDownAction, setIsDropdownAction] = useState(false)
    const { t, i18n } = useTranslation();

    const onChangeIsShowDropdownAction = () => {
        setIsDropdownAction(!isShowDropDownAction)
    }

    const removeItemIndex = (arr: IItemTodoList[], _index: number) => {
        return [...arr.slice(0, _index), ...arr.slice(_index + 1)]
    }

    const replaceItemAtIndex = (
        arr: IItemTodoList[],
        _index: number,
        newValue: any
    ) => {
        return [...arr.slice(0, _index), newValue, ...arr.slice(_index + 1)]
    }

    const deleteTodoListItem = () => {
        if (confirm(t("todo_list.ask_delete"))) {
            const idx = todoList.findIndex(
                (item: IItemTodoList) => item === props.todoItem
            )
            if (idx > -1) {
                const newList: IItemTodoList[] = removeItemIndex(todoList, idx)
                setTodoList(newList)

                // delete history
                let newHistoryList: IHistoryUpdateTodoListItem[] = []
                if (historyList.length > 0) {
                    newHistoryList = historyList.filter((hisItem: IHistoryUpdateTodoListItem) => hisItem.todoId != props.todoItem.id)
                }
                setHistoryList(newHistoryList)
            }
        }
        setIsDropdownAction(false)
    }

    const handlePointEmoji = (_todoId: string, emojiId: string) => {
        const test: IEmojiListItem[] = []
        todoList.forEach((_item: IItemTodoList, index: number) => {
            if (_item.id == _todoId) {
                if (_item.emojiList.length > 0) {
                    let isCheck = false
                    _item.emojiList.forEach((_itemChild) => {
                        if (_itemChild.emojiId == emojiId) {
                            test.push({
                                id: _itemChild.id,
                                emojiId: _itemChild.emojiId,
                                num: _itemChild.num + 1,
                            })
                            isCheck = true
                        } else {
                            test.push(_itemChild)
                        }
                    })
                    if (!isCheck) {
                        test.push({
                            id: `${new Date().getTime()}`,
                            emojiId: emojiId,
                            num: 1,
                        })
                    }
                } else {
                    test.push({
                        id: `${new Date().getTime()}`,
                        emojiId: emojiId,
                        num: 1,
                    })
                }
                const newList = replaceItemAtIndex(todoList, index, {
                    ..._item,
                    emojiList: test,
                    totalEmojiPoint: _item.totalEmojiPoint + 1,
                })
                setTodoList(newList)
            }
        })
    }

    const removeEmoji = () => {
        todoList.forEach((_item: IItemTodoList, index: number) => {
            if (_item.id === props.todoItem.id) {
                const newList = replaceItemAtIndex(todoList, index, {
                    ..._item,
                    emojiList: [],
                    totalEmojiPoint: 0,
                })
                setTodoList(newList)
            }
        })
    }

    const getItemState = () => {
        const itemState: any = statesList.find(item => item.id == props.todoItem.status);
        if (i18n.language)
            return itemState[i18n.language];
    }

    return (
        <>
        {props.todoItem.id ? 
            <div
                className={`group flex justify-between relative p-3 pb-7 mb-4 pt-6 border border-inherit md:items-center sm:items-start md:pb-3 sm:pb-7`}
            >
                <div className='absolute -top-1 -left-2 bg-green-500 border border-black py-0.5 px-1 text-white z-10 text-xs'>{getItemState()}</div>
                <div className="flex justify-start sm:flex-row flex-col">
                    <div className="w-16 h-16 min-w-[64px] object-cover rounded-full mr-2 bg-green-400">
                        {props.todoItem.avatar != '' &&
                            <Image
                                src={props.todoItem.avatar}
                                alt={t("common.avatar")}
                                height="100"
                                width="100"
                            />}
                    </div>
                    <div className="text-justify">
                        <b>{props.todoItem.title}</b>
                        <div>{props.todoItem.content}</div>
                    </div>
                </div>
                <div className="flex justify-end md:ml-4 md:w-[90px] md:min-w-[90px] ml-0 w-auto min-w-fit">
                    <div className="text-xs absolute bottom-1 left-3.5 md:static">
                        {`${t("todo_list.last_update")}: ${convertIntToDate(
                            props.todoItem.updated_at
                        )}`}
                    </div>

                    <div className="sm:static absolute top-2">
                        <div className="relative">
                            <svg
                                className="h-5 w-5 cursor-pointer min-w-[10px]"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                onClick={onChangeIsShowDropdownAction}
                            >
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>

                            <ul
                                className={`bg-white border border-inherit absolute right-0 top-6 z-10 ${isShowDropDownAction ? 'block' : 'hidden'}`}
                            >
                                <li>
                                    <Link
                                        href={`${ROUTE_NAME.TODOLIST.UPDATE}?id=${props.todoItem.id}`}
                                    >
                                        <a className='cursor-pointer block min-w-[65px] p-2'>{t("common.edit")}</a>
                                    </Link>
                                </li>
                                <li>
                                    <a className='cursor-pointer block min-w-[65px] p-2' onClick={deleteTodoListItem}>{t("common.delete")}</a>
                                </li>
                                <li>
                                    <Link
                                        href={`${ROUTE_NAME.TODOLIST.HISTORY}?id=${props.todoItem.id}`}
                                    >
                                        <a className='cursor-pointer block min-w-[65px] p-2'>{t("todo_list.update_history")}</a>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="group-hover:block hidden absolute bottom-1 right-1">
                    <div className="relative">
                        <div className="peer border border-inherit rounded-full p-0.5 bg-white">
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="1"
                                color="#afaeae"
                            >
                                <path
                                    strokeLinecap="round"
                                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                />
                            </svg>
                        </div>

                        <ul
                            className="peer-hover:flex hover:flex hidden flex justify-between items-center bg-white border border-inherit pl-1 pr-1 rounded-sm absolute bottom-5 right-0"
                        >
                            {emojiList.map((itemEmoji) => {
                                return (
                                    <li
                                        key={itemEmoji.id}
                                        className="p-2 cursor-pointer ease-in-out duration-300 hover:scale-150"
                                        onClick={() =>
                                            handlePointEmoji(
                                                props.todoItem.id,
                                                itemEmoji.id
                                            )
                                        }
                                    >
                                        {itemEmoji.content}
                                    </li>
                                )
                            })}
                            {props.todoItem.emojiList?.length > 0 && (
                                <li
                                    className="cursor-pointer"
                                    onClick={removeEmoji}
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {props.todoItem.emojiList?.length > 0 && (
                    <ul
                        className={`absolute right-8 -bottom-2 flex justify-between items-center bg-white rounded-xl border border-inherit pl-2 pr-2`}
                    >
                        {props.todoItem.totalEmojiPoint > 0 && (
                            <li className="text-xs">
                                {props.todoItem.totalEmojiPoint}
                            </li>
                        )}
                        {props.todoItem.emojiList.map((item, index) =>
                            emojiList.map((emj) => {
                                if (emj.id == item.emojiId)
                                    return <li key={index}>{emj.content}</li>
                            })
                        )}
                    </ul>
                )}
            </div>
        : <Skeleton count={3} />}
        </>
    )
}

export default TodoItem
