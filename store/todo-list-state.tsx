import { atom, selector, selectorFamily } from 'recoil'
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

export const statesListState = atom({
    key: "StatesListState",
    default: [
        {
            id: "1",
            vi: "Mới",
            en: "New"
        },
        {
            id: "2",
            vi: "Đang chờ xử lý",
            en: "Pending"
        },
        {
            id: "3",
            vi: "Đang xử lý",
            en: "In progress"
        },
        {
            id: "4",
            vi: "Hoàn thành",
            en: "Done"
        }
    ]
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

export const statusFilterState = atom({
    key: "StatusFilterState",
    default: ""
})

export const todoIdState = atom({
    key: 'TodoId',
    default: '',
})

export const emojiListState = atom({
    key: 'EmojiList',
    default: initialEmoji,
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
        const statusFilter = get(statusFilterState);
        let totalPage = 1;
        let list:IItemTodoList[] = [...todoList];
        if (textFilter) {
            list = list.filter((item: IItemTodoList) =>
                item.title.toLowerCase().includes(textFilter.toLowerCase())
            )
        }
        if (statusFilter != '') {
            list = list.filter((item: IItemTodoList) => statusFilter == item.status)
        }

        totalPage = Math.ceil(list.length / pageSize);

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
        const statusFilter = get(statusFilterState)

        let list:IItemTodoList[] = [...todoList];
        if (textFilter) {
            list = list.filter((item: IItemTodoList) =>
                item.title.toLowerCase().includes(textFilter.toLowerCase())
            )
        }

        if (statusFilter != '') {
            list = list.filter((item: IItemTodoList) => statusFilter == item.status)
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

export const historyOfTodoIdState = selectorFamily({
    key: "HistoryOfTodoIdState",
    get: (todoId) => ({get}) => {
        const historyList = get(historyListState);
        const list: IHistoryUpdateTodoListItem[] = historyList.filter(
            (item: IHistoryUpdateTodoListItem) => item.todoId == todoId
        );
        
        return list
    }
})

export const todoItemState = selectorFamily({
    key: "TodoItemState",
    get: (query: any) => ({get}) => {
        const todoList = get(todoListState);
        if (query?.id === undefined) {
            return undefined;
        }

        const todoItem = todoList.find((item: IItemTodoList) => item.id == query.id);
        return todoItem;
    }
})