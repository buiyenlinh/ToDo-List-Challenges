import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
const Header = dynamic(() => import("../components/comp-header"), {ssr: false})
const TodoList = dynamic(() => import("../components/todo-list/todo-list"), {ssr: false})
import useTrans from '../hooks/useTrans'
const Home: NextPage = () => {
    const trans = useTrans();
    return (
        <div>
            <Header title={trans.todoList.TITLE} />
            <main>
                <TodoList/>
            </main>
        </div>
    )
}

export default Home