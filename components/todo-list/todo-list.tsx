import Link from 'next/link'
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { IDataExport, IHistoryUpdateTodoListItem, IItemTodoList } from '../../contants/interface'
import { historyListState, todoListState, } from '../../store/todo-list-state'
import TodoItem from './todo-item'
import ROUTE_NAME from '../../router'
import useTrans from '../../hooks/useTrans'
import { useRouter } from 'next/router'
function TodoList() {
    const [todoList, setTodoList] = useRecoilState(todoListState)
    const [textFilter, setTextFilter] = useState('')
    const inputFileImportRef = useRef<null | HTMLInputElement>(null)
    const observer = useRef<IntersectionObserver | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const optionPageSize = [7, 10]
    const [pageSize, setPageSize] = useState(optionPageSize[0]);
    const [historyList, setHistoryList] = useRecoilState(historyListState)
    const [dataList, setDataList] = useState<IItemTodoList[]>([])
    const trans = useTrans();
    const router = useRouter();
    const {locale} = router;

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

    const getTodoList = () => {
        if (currentPage < Math.ceil(todoList.length / pageSize)) {
            const list:IItemTodoList[] = todoList.filter((item: IItemTodoList) =>
                item.title.toLowerCase().includes(textFilter.toLowerCase())
            )

            if (list.length <= currentPage * pageSize) {
                setDataList(list.reverse());
            } else {
                const data = [...list.splice(list.length - currentPage * pageSize, list.length - 1)];
                setDataList(data.reverse());
            }
        }
    }

    useEffect(() => {
        getTodoList();
        //  eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, textFilter, todoList, pageSize])

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
                <div className="lg:w-4/6 md:w-5/6 w-full mx-auto fixed bg-white border border-inherit p-3 top-0 z-10">
                    <Link href={`${ROUTE_NAME.TODOLIST.CREATE}`} locale={locale} className="mr-3 ml-3">
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
                        onClick={() => inputFileImportRef?.current?.click()}
                    >
                        {trans.Common.IMPORT}
                    </button>
                    <button className="font-bold" onClick={exportTodoFile}>
                        {trans.Common.EXPORT}
                    </button>
                </div>
                <div className="mt-12">
                    <div className="flex justify-between items-center bg-green-400 p-2 pr-5 pl-5">
                        <h1 className="font-bold">{trans.todoList.TODO_TITLE}</h1>
                        <div className='flex justify-start items-center'>
                            <div className='mr-2'>{trans.Common.PAGE_SIZE}</div>
                            {optionPageSize.length > 0 && 
                            <select
                                className="focus-visible:outline-0 mr-2 border border-inherit p-1"
                                onChange={val => setPageSize(parseInt(val.target.value))}
                                value={pageSize}
                            >
                                { optionPageSize.map((num, index) => (
                                    <option value={num} key={index}>{num}</option>
                                ))}
                            </select>
                            }
                            <div className="search">
                                <input
                                    type="text"
                                    value={textFilter}
                                    onChange={onChangeTextSearch}
                                    className="border border-inherit rounded-sm w-full outline-none py-1 px-3"
                                    placeholder={trans.todoList.SEARCH}
                                />
                            </div>
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

export default TodoList;
