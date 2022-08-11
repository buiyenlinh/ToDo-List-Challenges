export interface IItemTodoList {
    id: string,
    avatar: string,
    title: string,
    content: string,
    emojiList: IEmojiListItem[],
    totalEmojiPoint: number,
    status: string,
    created_at: number,
    updated_at: number,
}

export interface IHistoryUpdateTodoListItem {
    id: string,
    todoId: string,
    avatar: string,
    title: string,
    content: string,
    status: string,
    todoStatus: string,
    created_at: number,
}

export interface IEmojiListItem {
    id: string,
    emojiId: string,
    num: number
}

export interface IDataExport {
    todoItem: IItemTodoList,
    historyList: IHistoryUpdateTodoListItem[]
}