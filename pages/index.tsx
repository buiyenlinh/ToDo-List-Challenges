import type { NextPage } from 'next'
import { Header, TodoList } from '../components'

const Home: NextPage = () => {
    return (
        <>
            <Header title="ToDo List Challenges" />
            <main className='lg:w-4/6 md:w-5/6 w-100 mx-auto'>
                <TodoList/>
            </main>
        </>
    )
}

export default Home