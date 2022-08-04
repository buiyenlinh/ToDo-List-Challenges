import { atom, selector } from 'recoil'
import { IHistoryUpdateTodoListItem, IItemTodoList } from '../contants/interface'
const initialTodoListState = [
    {
        id: 'id01',
        avatar: '',
        title: 'Todo item 01',
        content: 'Content - todo item 01',
        emojiList: [],
        totalEmojiPoint: 0,
        created_at: 1659431583,
        updated_at: 1659431583,
    },
    {
        id: 'id02',
        avatar: '',
        title: 'Todo item 02',
        content: 'Content - todo item 02',
        emojiList: [],
        totalEmojiPoint: 0,
        created_at: 1659431583,
        updated_at: 1659431583,
    },
    {
        id: 'id03',
        avatar: '',
        title: 'Todo item 03',
        content: 'Content - todo item 03',
        emojiList: [],
        totalEmojiPoint: 0,
        created_at: 1659431583,
        updated_at: 1659431583,
    },
    {
        id: 'id04',
        avatar: '',
        title: 'Todo item 04',
        content: 'Content - todo item 04',
        emojiList: [
            {
                id: "1",
                emojiId: "2",
                num: 2,
            },
        ],
        totalEmojiPoint: 2,
        created_at: 1659431583,
        updated_at: 1659431583,
    },
]

const initialHistoryUpdateState = [
    {
        id: 'hisid01',
        todoId: 'id01',
        avatar: '',
        title: 'Todo item 01',
        content: 'Content - todo item 01',
        static: 'create',
        created_at: 1659431583,
    },
    {
        id: 'hisid02',
        todoId: 'id02',
        avatar: '',
        title: 'Todo item 02',
        content: 'Content - todo item 02',
        static: 'create',
        created_at: 1659431583,
    },
    {
        id: 'hisid03',
        todoId: 'id03',
        avatar: '',
        title: 'Todo item 03',
        content: 'Content - todo item 03',
        static: 'create',
        created_at: 1659431583,
    },
    {
        id: 'hisid04',
        todoId: 'id04',
        avatar: '',
        title: 'Todo item 04',
        content: 'Content - todo item 04',
        static: 'create',
        created_at: 1659431583,
    },
]

const initialEmoji = [
    { id: '1', content: '👍' },
    { id: '2', content: '❤' },
    { id: '3', content: '😆' },
    { id: '4', content: '😮' },
    { id: '5', content: '😢' },
    { id: '6', content: '😠' },
    { id: '7', content: '🤪' },
]

export const todoListState = atom({
    key: 'TodoList',
    default: initialTodoListState,
})

export const historyUpdateTodoListState = atom({
    key: 'HistoryTodoList',
    default: initialHistoryUpdateState,
})

export const todoListTextFilter = atom({
    key: 'TodoListTextFilter',
    default: '',
})

export const todoListPage = atom({
    key: 'TodoListPage',
    default: {
        currentPage: 1,
        sizePage: 8
    },
})

export const todoId = atom({
    key: 'TodoId',
    default: '',
})

export const emojiListState = atom({
    key: 'EmojiList',
    default: initialEmoji,
})

export const filterTodoList = selector({
    key: 'FilterTotoList',
    get: ({ get }) => {
        let list = get(todoListState)
        const textFilter = get(todoListTextFilter);
        const page = get(todoListPage);
        if (textFilter != '') {
            list = list.filter((item) =>
                item.title.toLowerCase().includes(textFilter.toLowerCase())
            )
        }
        const data: IItemTodoList[] = [];
        list.map((item, index) => {
            if (index < page.currentPage * page.sizePage) {
                data.push(item);
            }
        })

        return data
    }
})

export const getHistoryUpdateById = selector({
    key: 'GetHistoryUpdateById',
    get: ({ get }) => {
        const historyList = get(historyUpdateTodoListState)
        const todoList = get(todoListState)
        const id = get(todoId)
        const list: IHistoryUpdateTodoListItem[] = []
        historyList.map((item: IHistoryUpdateTodoListItem) => {
            if (item.todoId === id) {
                list.push(item)
            }
        })

        let todo = null
        todoList.map((item) => {
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