import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useTranslation } from 'react-i18next'
const Header = dynamic(() => import("../components/comp-header"), {ssr: false})
const TodoList = dynamic(() => import("../components/todo-list/todo-list"), {ssr: false})

const Home: NextPage = () => {
    const { t } = useTranslation();
    return (
        <div>
            <Header title={t("todo_list.title")} />
            <main>
                <TodoList/>
            </main>
        </div>
    )
}

export default Home