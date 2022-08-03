import Link from 'next/link'
import React, { ChangeEvent } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { IItemTodoList } from '../../contants/interface'
import { filterTodoList, todoListTextFilter } from '../../store/todoListState'
import homeStyle from '../../styles/Home.module.css'
import TodoItem from './TodoItem'
import ROUTE_NAME from '../../router'
function TodoList() {
    const todoList = useRecoilValue(filterTodoList)
    const [textFilter, setTextFilter] = useRecoilState(todoListTextFilter)

    const onChangeTextSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setTextFilter(e.target.value)
    }

    return (
        <div>
            <div className="text-right mt-5 mb-3">
                <Link href={ROUTE_NAME.TODOLIST.CREATE}>
                    <a>New</a>
                </Link>
            </div>
            <div className="flex justify-between items-center bg-green-400 p-2 pr-5 pl-5">
                <h1 className="font-bold">TODO LIST</h1>
                <div className="search">
                    <input
                        type="text"
                        value={textFilter}
                        onChange={onChangeTextSearch}
                        className={homeStyle.input}
                        placeholder="Search..."
                    />
                </div>
            </div>
            <div className="border border-inherit p-5 pt-2">
                {todoList.length > 0 ? (
                    todoList.map((todoItem: IItemTodoList) => (
                        <TodoItem key={todoItem.id} todoItem={todoItem}/>
                    ))
                ) : (
                    <div>Empty list</div>
                )}
            </div>
        </div>
    )
}

export default TodoList
