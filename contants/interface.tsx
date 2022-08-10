export interface IItemTodoList {
    id: string,
    avatar: string,
    title: string,
    content: string,
    emojiList: IEmojiListItem[],
    totalEmojiPoint: number,
    state: string,
    created_at: number,
    updated_at: number,
}

export interface IHistoryUpdateTodoListItem {
    id: string,
    todoId: string,
    avatar: string,
    title: string,
    content: string,
    static: string,
    todoState: string,
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