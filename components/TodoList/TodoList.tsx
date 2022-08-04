import Link from 'next/link'
import React, {
    ChangeEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { IItemTodoList } from '../../contants/interface'
import {
    filterTodoList,
    todoListPage,
    todoListState,
    todoListTextFilter,
} from '../../store/todoListState'
import homeStyle from '../../styles/Home.module.css'
import TodoItem from './TodoItem'
import ROUTE_NAME from '../../router'
function TodoList() {
    const todoList = useRecoilValue(todoListState)
    const todoListFilter = useRecoilValue(filterTodoList)
    const [page, settPage] = useRecoilState(todoListPage)
    const [textFilter, setTextFilter] = useRecoilState(todoListTextFilter)
    const observer = useRef<IntersectionObserver | null>(null)
    const [currentPage, setCurrentPage] = useState(page.currentPage)

    const lastTodoElementRef = useCallback((node: any) => {
        if (observer.current) {
            observer.current.disconnect()
        }

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setCurrentPage((currentPage) => currentPage + 1)
            }
        })

        if (node) {
            observer.current.observe(node)
        }
    }, [])

    useEffect(() => {
        if (Math.ceil(todoList.length / page.sizePage) > currentPage)
            settPage({
                currentPage: page.currentPage + 1,
                sizePage: page.sizePage,
            })
        
        if (currentPage > page.currentPage)
            setCurrentPage(page.currentPage)
        //  eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage])

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
                {todoListFilter.length > 0 ? (
                    todoListFilter.map((todoItem: IItemTodoList, index) => {
                        if (todoListFilter.length == index + 1)
                            return (
                                <div ref={lastTodoElementRef} key={todoItem.id}>
                                    <TodoItem todoItem={todoItem} />
                                </div>
                            )
                        else {
                            return (
                                <div key={todoItem.id}>
                                    <TodoItem todoItem={todoItem} />
                                </div>
                            )
                        }
                    })
                ) : (
                    <div>Empty list</div>
                )}
            </div>
        </div>
    )
}

export default TodoList
