export interface IItemTodoList {
    id: string,
    avatar: string,
    title: string,
    content: string,
    created_at: number,
    updated_at: number
}

export interface IHistoryUpdateTodoListItem {
    id: string,
    todoId: string,
    avatar: {
        old: string,
        new: string
    },
    title: {
        old: string,
        new: string
    },
    content: {
        old: string,
        new: string
    },
    static: string,
    created_at: number,
    updated_at: number
}