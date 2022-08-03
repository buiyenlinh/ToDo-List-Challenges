import { atom, selector } from 'recoil'
import { IHistoryUpdateTodoListItem } from '../contants/interface'
const initialTodoListState = [
    {
        id: 'id01',
        avatar: '',
        title: 'Todo item 01',
        content: 'Content - todo item 01',
        created_at: 1659431583,
        updated_at: 1659431583
    },
    {
        id: 'id02',
        avatar: '',
        title: 'Todo item 02',
        content: 'Content - todo item 02',
        created_at: 1659431583,
        updated_at: 1659431583
    },
    {
        id: 'id03',
        avatar: '',
        title: 'Todo item 03',
        content: 'Content - todo item 03',
        created_at: 1659431583,
        updated_at: 1659431583
    },
    {
        id: 'id04',
        avatar: '',
        title: 'Todo item 04',
        content: 'Content - todo item 04',
        created_at: 1659431583,
        updated_at: 1659431583
    },
]

const initialHistoryUpdateState = [
    {
        id: 'hisid01',
        todoId: 'id01',
        title: {
            old: '',
            new: 'Todo item 01'
        },
        content: {
            old: '',
            new: 'Todo item 01 new'
        },
        avatar: {
            old: '',
            new: ''
        },
        static: 'create',
        created_at: 1659431183,
        updated_at: 1659431183
    },
    {
        id: 'hisid02',
        todoId: 'id01',
        title: {
            old: 'Todo item 01',
            new: 'Todo item 01'
        },
        content: {
            old: 'Todo item 01',
            new: 'Todo item 01 new'
        },
        avatar: {
            old: '',
            new: ''
        },
        static: 'update',
        created_at: 1659431583,
        updated_at: 1659431583
    }
]

export const todoListState = atom({
    key: 'TodoList',
    default: initialTodoListState,
})

export const historyUpdateTodoListState = atom({
    key: 'HistoryTodoList',
    default: initialHistoryUpdateState
})

export const todoListTextFilter = atom({
    key: "TodoListTextFilter",
    default: ""
})

export const todoId = atom({
    key: "TodoId",
    default: ""
})

export const filterTodoList = selector({
    key: 'FilterTotoList',
    get: ({ get }) => {
        let list = get(todoListState);
        const textFilter = get(todoListTextFilter);
        if (textFilter != "") {
            list = list.filter((item) => item.title.toLowerCase().includes(textFilter.toLowerCase()))
        }
        
        return list;
    },
})

export const getHistoryUpdateById = selector({
    key: "GetHistoryUpdateById",
    get: ({ get }) => {
        const historyList = get(historyUpdateTodoListState);
        const id = get(todoId);
        const list: IHistoryUpdateTodoListItem[] = [];
        historyList.map((item: IHistoryUpdateTodoListItem) => {
            if (item.todoId === id) {
                list.push(item);
            }
        })
        return list;
    }
})
