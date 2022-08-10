import Link from 'next/link'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { IDataExport, IHistoryUpdateTodoListItem, IItemTodoList } from '../../contants/interface'
import { currentPageState, historyListState, OptionPageSizeState, pageSizeState, textFilterState, todoListFilterState, todoListState, totalPageState, } from '../../store/todo-list-state'
import TodoItem from './todo-item'
import ROUTE_NAME from '../../router'
import useTrans from '../../hooks/useTrans'
import { useRouter } from 'next/router'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
function TodoList() {
    const [todoList, setTodoList] = useRecoilState(todoListState)
    const todoFilterList = useRecoilValue(todoListFilterState);
    const [textFilter, setTextFilter] = useRecoilState(textFilterState)
    const totalPage = useRecoilValue(totalPageState);
    const setCurrentPage = useSetRecoilState(currentPageState)
    const inputFileImportRef = useRef<null | HTMLInputElement>(null)
    const optionPageSize = useRecoilValue(OptionPageSizeState);
    const [pageSize, setPageSize] = useRecoilState(pageSizeState);
    const [historyList, setHistoryList] = useRecoilState(historyListState)
    const trans = useTrans();
    const router = useRouter();
    const {locale} = router;
    const [isLoading, setIsLoading] = useState(false);

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
                        const val = todoList.find((_itemTodo: IItemTodoList) => item.todoItem.id == _itemTodo.id)
                        if (val == undefined) {
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
        todoFilterList.forEach((item: IItemTodoList) => {
            const _list = historyList.filter((_itemChild: IHistoryUpdateTodoListItem) => _itemChild.todoId == item.id)
            data.push({
                todoItem: item,
                historyList: _list
            })
        })
        return data;
    }

    const createPagination = () => {
        return <ul className='flex items-center justify-end mt-5 mb-5'>
            {Array.from(Array(totalPage), (e, i) => {
                return(
                    <li
                        key={i}
                        className="p-1 pl-5 pr-5 border hover:text-white hover:bg-green-500 cursor-pointer"
                        onClick={() => {
                            setCurrentPage(i+1);
                        }}>
                        {i + 1}
                    </li>
                )
            })}
        </ul>
    }

    useEffect(() => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
        }, 200)
    }, [todoFilterList])

    return (
        <div className='lg:w-4/6 md:w-5/6 w-100 mx-auto'>
            { !isLoading ? 
            <>
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
                    {todoFilterList.length > 0 ? (
                        todoFilterList.map((todoItem: IItemTodoList, index) => (
                            <div key={index}>
                                <TodoItem todoItem={todoItem} />
                            </div>
                        ))
                    ) : (
                        <div>{trans.todoList.EMPTY_LIST}</div>
                    )}
                </div>
            </div>

            { totalPage > 1 &&
                <div className="p-5 md:p-0">
                    {createPagination()}
                </div>
            }
            </>
            : <div className='mt-12'>
                <Skeleton count={3} />
            </div>}
        </div>
    )
}

export default TodoList;
