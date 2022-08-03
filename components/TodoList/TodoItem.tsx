import React, { useState } from 'react'
import { IItemTodoList } from '../../contants/interface'
import Image from 'next/image'
import styles from '../../styles/TodoList.module.css'
import Link from 'next/link'
import ROUTE_NAME from '../../router'
import { useRecoilState } from 'recoil'
import { todoListState } from '../../store/todoListState'
import { convertIntToDate } from '../../contants/funcs'

interface IProps {
    todoItem: IItemTodoList
}
function TodoItem(props: IProps) {
    const [todoList, setTodoList] = useRecoilState(todoListState)
    const [isShowDropDownAction, setIsDropdownAction] = useState(false)

    const onChangeIsShowDropdownAction = () => {
        setIsDropdownAction(!isShowDropDownAction)
    }

    const removeItemIndex = (arr: IItemTodoList[], _index: number) => {
        return [...arr.slice(0, _index), ...arr.slice(_index + 1)];
    }

    const deleteTodoListItem = () => {
        if (confirm("Do you want to delete?")) {
            const idx = todoList.findIndex((item) => item === props.todoItem);
            console.log(idx);
            if (idx > -1) {
                const newList = removeItemIndex(todoList, idx);
                setTodoList(newList);
            }
        }
        setIsDropdownAction(false);
    }

    return (
        <div
            className={`flex justify-between pt-1 pb-1 pl-3 pr-3 mb-2 border border-inherit`}
        >
            <div className="flex justify-start">
                <div className={styles.todoItemImage}>
                    {props.todoItem.avatar != '' && (
                        <Image
                            src={props.todoItem.avatar}
                            alt="avatar"
                            height="200"
                            width="200"
                        />
                    )}
                </div>
                <div className={styles.todoItemContent}>
                    <b>{props.todoItem.title}</b>
                    <div>{props.todoItem.content}</div>
                </div>
            </div>
            <div className="flex justify-end items-center relative">
                <div className="text-xs">
                    {`last update: ${convertIntToDate(
                        props.todoItem.updated_at
                    )}`}
                </div>

                <svg
                    className="h-5 w-5 cursor-pointer"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    onClick={onChangeIsShowDropdownAction}
                >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>

                <ul
                    className={`bg-white border border-inherit ${styles.dropdownAction} ${
                        isShowDropDownAction ? 'block' : 'hidden'
                    }`}
                >
                    <li>
                        <Link href={`${ROUTE_NAME.TODOLIST.UPDATE}?id=${props.todoItem.id}`}>
                            <a>Edit</a>
                        </Link>
                    </li>
                    <li>
                        <a onClick={deleteTodoListItem}>Delete</a>
                    </li>
                    <li>
                        <Link href={`${ROUTE_NAME.TODOLIST.HISTORY}?id=${props.todoItem.id}`}>
                            <a>History</a>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default TodoItem
