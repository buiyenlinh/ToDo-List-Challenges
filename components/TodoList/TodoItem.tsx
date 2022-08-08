import React, { useState } from 'react'
import {
    IEmojiListItem,
    IHistoryUpdateTodoListItem,
    IItemTodoList,
} from '../../contants/interface'
import Image from 'next/image'
import styles from '../../styles/TodoList.module.css'
import Link from 'next/link'
import ROUTE_NAME from '../../router'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
    emojiListState,
    historyUpdateTodoListState,
    todoListState,
} from '../../store/todoListState'
import { convertIntToDate } from '../../contants/funcs'
import useTrans from '../../hooks/useTrans'
import { useRouter } from 'next/router'

interface IProps {
    todoItem: IItemTodoList
}
function TodoItem(props: IProps) {
    const [todoList, setTodoList] = useRecoilState(todoListState)
    const [historyList, setHistoryList] = useRecoilState(historyUpdateTodoListState)
    const emojiList = useRecoilValue(emojiListState)
    const [isShowDropDownAction, setIsDropdownAction] = useState(false)
    const trans = useTrans();
    const router = useRouter();

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
        if (confirm(trans.todoList.ASK_DELETE)) {
            const idx = todoList.findIndex(
                (item: IItemTodoList) => item === props.todoItem
            )
            if (idx > -1) {
                const newList: IItemTodoList[] = removeItemIndex(todoList, idx)
                setTodoList(newList)

                // delete history
                const newHistoryList: IHistoryUpdateTodoListItem[] = []
                if (historyList.length > 0) {
                    historyList.forEach(
                        (hisItem: IHistoryUpdateTodoListItem) => {
                            if (hisItem.todoId != props.todoItem.id) {
                                newHistoryList.push(hisItem)
                            }
                        }
                    )
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

    return (
        <div
            className={`flex justify-between items-center relative pt-2 pb-3 pl-3 pr-3 mb-4 border border-inherit ${styles.todoItem}`}
        >
            <div className={`flex justify-start ${styles.itemLeft}`}>
                <div className={styles.todoItemImage}>
                    {props.todoItem.avatar != '' && (
                        <Image
                            src={props.todoItem.avatar}
                            alt={trans.Common.AVATAR}
                            height="100"
                            width="100"
                        />
                    )}
                </div>
                <div className={`${styles.todoItemContent} text-justify `}>
                    <b>{props.todoItem.title}</b>
                    <div>{props.todoItem.content}</div>
                </div>
            </div>
            <div className={`flex justify-end ${styles.itemRight}`}>
                <div className={`text-xs ${styles.lastTime}`}>
                    {`${trans.todoList.LAST_UPDATE}: ${convertIntToDate(
                        props.todoItem.updated_at
                    )}`}
                </div>

                <div className={styles.iconDotsVerticalWrap}>
                    <div className="relative">
                        <svg
                            className={`h-5 w-5 cursor-pointer ${styles.iconDotsVertical}`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            onClick={onChangeIsShowDropdownAction}
                        >
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>

                        <ul
                            className={`bg-white border border-inherit ${
                                styles.dropdownAction
                            } ${isShowDropDownAction ? 'block' : 'hidden'}`}
                        >
                            <li>
                                <Link
                                    href={`${router.locale}${ROUTE_NAME.TODOLIST.UPDATE}?id=${props.todoItem.id}`}
                                >
                                    <a>{trans.Common.EDIT}</a>
                                </Link>
                            </li>
                            <li>
                                <a onClick={deleteTodoListItem}>{trans.Common.DELETE}</a>
                            </li>
                            <li>
                                <Link
                                    href={`${router.locale}${ROUTE_NAME.TODOLIST.HISTORY}?id=${props.todoItem.id}`}
                                >
                                    <a>{trans.todoList.UPDATE_HISTORY}</a>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className={styles.emoji}>
                <div className="relative">
                    <div className="border border-inherit rounded-full p-0.5 bg-white">
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
                        className={`${styles.emojiList} flex justify-between items-center bg-white border border-inherit pl-1 pr-1 rounded-sm`}
                    >
                        {emojiList.map((itemEmoji) => {
                            return (
                                <li
                                    key={itemEmoji.id}
                                    className="p-2 cursor-pointer"
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
                    className={`${styles.emojiListPoint} flex justify-between items-center bg-white rounded-xl border border-inherit pl-2 pr-2`}
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
    )
}

export default TodoItem
