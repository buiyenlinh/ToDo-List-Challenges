export interface IItemTodoList {
    id: string,
    avatar: string,
    title: string,
    content: string,
    emojiList: IEmojiListItem[],
    totalEmojiPoint: number,
    created_at: number,
    updated_at: number
}

export interface IHistoryUpdateTodoListItem {
    id: string,
    todoId: string,
    avatar: string,
    title: string,
    content: string,
    static: string,
    created_at: number,
}

export interface IEmojiListItem {
    id: string,
    emojiId: string,
    num: number
}