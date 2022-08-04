import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
const Header = dynamic(() => import("../components/Header"), {ssr: false})
const TodoList = dynamic(() => import("../components/TodoList/TodoList"), {ssr: false})
const Home: NextPage = () => {
    return (
        <div>
            <Header title="ToDo List Challenges" />
            <main className='lg:w-4/6 md:w-5/6 w-100 mx-auto'>
                <TodoList/>
            </main>
        </div>
    )
}

export default Home