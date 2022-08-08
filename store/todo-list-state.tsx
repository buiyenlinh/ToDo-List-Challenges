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