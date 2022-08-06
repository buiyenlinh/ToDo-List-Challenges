import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
const Header = dynamic(() => import("../components/Header"), {ssr: false})
const TodoList = dynamic(() => import("../components/TodoList/TodoList"), {ssr: false})
import useTrans from './hook/useTrans'
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