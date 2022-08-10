import { atom, selector } from 'recoil'
import { recoilPersist } from 'recoil-persist'
import {
    IHistoryUpdateTodoListItem,
    IItemTodoList
} from '../contants/interface'

const initialEmoji = [
    { id: '1', content: '👍' },
    { id: '2', content: '❤' },
    { id: '3', content: '😆' },
    { id: '4', content: '😮' },
    { id: '5', content: '😢' },
    { id: '6', content: '😠' },
    { id: '7', content: '🤪' },
]

const { persistAtom } = recoilPersist()

export const todoListState = atom({
    key: 'TodoList',
    default: [],
    effects_UNSTABLE: [persistAtom]
})

export const historyListState = atom({
    key: 'HistoryTodoList',
    default: [],
    effects_UNSTABLE: [persistAtom]
})

export const textFilterState = atom({
    key: 'TextFilterState',
    default: '',
})

export const todoIdState = atom({
    key: 'TodoId',
    default: '',
})

export const emojiListState = atom({
    key: 'EmojiList',
    default: initialEmoji,
})

export const historyOfTodoState = selector({
    key: 'HistoryOfTodoState',
    get: ({ get }) => {
        const historyList = get(historyListState)
        const todoList = get(todoListState)
        const id = get(todoIdState)
        const list: IHistoryUpdateTodoListItem[] = []
        historyList.map((item: IHistoryUpdateTodoListItem) => {
            if (item.todoId === id) {
                list.push(item)
            }
        })

        let todo = null
        todoList.map((item: IItemTodoList) => {
            if (item.id == id) {
                todo = item
            }
        })

        return {
            list: list,
            todo: todo,
        }
    },
})

export const currentPageState = atom({
    key: "CurrentPageState",
    default: 1
})

export const pageSizeState = atom({
    key: "PageSizeState",
    default: 10
})

export const OptionPageSizeState = atom({
    key: "OptionPageSizeState",
    default: [10, 25, 50, 100]
})

export const totalPageState = selector({
    key: "totalPageState",
    get: ({get}) => {
        const textFilter = get(textFilterState);
        const todoList = get(todoListState);
        const pageSize = get(pageSizeState);
        let totalPage = 1;
        if (textFilter) {
            const list:IItemTodoList[] = todoList.filter((item: IItemTodoList) =>
                item.title.toLowerCase().includes(textFilter.toLowerCase())
            )
            totalPage = Math.ceil(list.length / pageSize);
        } else {
            totalPage = Math.ceil(todoList.length / pageSize);
        }
        return totalPage;
    }
})

export const todoListFilterState = selector({
    key: "TodoListFilterState",
    get: ({get}) => {
        const currentPage = get(currentPageState);
        const todoList = get(todoListState);
        const pageSize = get(pageSizeState);
        const textFilter = get(textFilterState);

        let list:IItemTodoList[] = [...todoList];
        if (textFilter) {
            list = todoList.filter((item: IItemTodoList) =>
                item.title.toLowerCase().includes(textFilter.toLowerCase())
            )
        }
        let data: IItemTodoList[] = [];
        const listLength = list.length;
        if (pageSize >= listLength) {
            data = list;
        } else {
            if (currentPage * pageSize <= listLength) {
                data = [...list.slice(listLength - currentPage * pageSize, listLength - (currentPage - 1) * pageSize)];
            } else {
                data = [...list.slice(0, listLength - (currentPage - 1) * pageSize )];
            } 
        }
        return data.reverse();
    }
})