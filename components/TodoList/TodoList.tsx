import Link from 'next/link'
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { IDataExport, IHistoryUpdateTodoListItem, IItemTodoList } from '../../contants/interface'
import { historyUpdateTodoListState, todoListState, } from '../../store/todoListState'
import homeStyle from '../../styles/Home.module.css'
import styles from '../../styles/TodoList.module.css'
import TodoItem from './TodoItem'
import ROUTE_NAME from '../../router'
import useTrans from '../../pages/hook/useTrans'
function TodoList() {
    const [todoList, setTodoList] = useRecoilState(todoListState)
    const [textFilter, setTextFilter] = useState('')
    const inputFileImportRef = useRef(null)
    const observer = useRef<IntersectionObserver | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(8);
    const [historyList, setHistoryList] = useRecoilState(historyUpdateTodoListState)
    const [dataList, setDataList] = useState<IItemTodoList[]>([])
    const trans = useTrans();

    const lastTodoElementRef = useCallback((node: any) => {
        console.log("run here")
        if (observer.current) {
            observer.current.disconnect()
        }

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                checkSetCurrentPage();
            }
        })

        if (node) {
            observer.current.observe(node)
        }
    }, [])

    const checkSetCurrentPage = () => {
        if (todoList.length > currentPage * pageSize) {
            setCurrentPage((currentPage) => currentPage + 1)
        }
    }
    const getTodoList = () => {
        const list:IItemTodoList[] = todoList.filter((item: IItemTodoList) =>
            item.title.toLowerCase().includes(textFilter.toLowerCase())
        )

        const data = [...list.splice(0, currentPage * pageSize - 1)];
        setDataList(data);
    }

    useEffect(() => {
        getTodoList();
    }, [currentPage, textFilter, todoList])

    
    const onChangeTextSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setCurrentPage(1);
        setTextFilter(e.target.value)
    }

    const exportTodoFile = () => {
        const dataExport = getDataExport();
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify(dataExport)
        )}`
        const link = document.createElement('a')
        link.href = jsonString
        link.download = 'data-todo-list.json'
        link.click()
    }

    const handleChangeFileImport = (e: any) => {
        if (confirm(trans.todoList.ASK_IMPORT)) {
            const reader = new FileReader()
            reader.readAsText(e.target.files[0])
            reader.onload = () => {
                const result = JSON.parse(reader.result as string)
                if (result?.length > 0) {
                    result.forEach((item: any) => {
                        let isCheck = false
                        todoList.forEach((_itemTodo: IItemTodoList) => {
                            if (item.todoItem.id == _itemTodo.id) isCheck = true
                        })

                        if (!isCheck) {
                            createTodoListItem(item.todoItem, item.historyList)
                        }
                    })
                }
            }
        }
    }

    const createTodoListItem = (
        _todoItem: IItemTodoList,
        _historyList: IHistoryUpdateTodoListItem[]
    ) => {
        setTodoList((oldTodoList: IItemTodoList[]) => [
            ...oldTodoList,
            _todoItem,
        ])

        if (_historyList.length > 0) {
            _historyList.forEach((item: IHistoryUpdateTodoListItem) => {
                setHistoryList(
                    (oldHistoryList: IHistoryUpdateTodoListItem[]) => [
                        ...oldHistoryList,
                        item,
                    ]
                )
            })
        }
    }

    const getDataExport = () => {
        const data: IDataExport[] = [];
        dataList.forEach((item: IItemTodoList) => {
            const _list: IHistoryUpdateTodoListItem[] = [];
            historyList.forEach((_itemChild: IHistoryUpdateTodoListItem) => {
                if (_itemChild.todoId == item.id) {
                    _list.push(_itemChild);
                }
            })
            data.push({
                todoItem: item,
                historyList: _list
            })
        })
        return data;
    }

    return (
        <>
            <div className='lg:w-4/6 md:w-5/6 w-100 mx-auto'>
                <div className={`lg:w-4/6 md:w-5/6 w-100 mx-auto ${styles.top} fixed bg-white border border-inherit p-3`}>
                    <Link href={ROUTE_NAME.TODOLIST.CREATE} className="mr-3 ml-3">
                        <a className='font-bold'>{trans.Common.NEW}</a>
                    </Link>
                    <input
                        type="file"
                        className="hidden"
                        ref={inputFileImportRef}
                        onChange={handleChangeFileImport}
                    />
                    <button
                        className="mr-5 ml-5 font-bold"
                        onClick={() => inputFileImportRef.current.click()}
                    >
                        {trans.Common.IMPORT}
                    </button>
                    <button className="font-bold" onClick={exportTodoFile}>
                        {trans.Common.EXPORT}
                    </button>
                </div>
                <div className={styles.bottom}>
                    <div className="flex justify-between items-center bg-green-400 p-2 pr-5 pl-5">
                        <h1 className="font-bold">{trans.todoList.TODO_TITLE}</h1>
                        <div className="search">
                            <input
                                type="text"
                                value={textFilter}
                                onChange={onChangeTextSearch}
                                className={homeStyle.input}
                                placeholder={trans.todoList.SEARCH}
                            />
                        </div>
                    </div>
                    <div className="border border-inherit p-5 pt-2">
                        {dataList.length > 0 ? (
                            dataList.map((todoItem: IItemTodoList, index) => {
                                if (dataList.length == index + 1)
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
                            <div>{trans.todoList.EMPTY_LIST}</div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default TodoList
