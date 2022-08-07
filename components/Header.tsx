import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { useRecoilValue } from 'recoil'
import useTrans from '../pages/hook/useTrans'
import { langList } from '../store/indexState'
import styles from '../styles/Home.module.css'
interface IProps {
    title: string
}
function Header(props: IProps) {
    const trans = useTrans()
    const languageList = useRecoilValue(langList)
    const router = useRouter()
    const changeLang = (lang: string) => {
        router.push('/', `/${lang}`, { locale: lang })
    }
    return (
        <>
            <Head>
                <title>{props.title}</title>
                <meta name="description" content={trans.todoList.TITLE} />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={`${styles.languages} fixed`}>
                {languageList.length > 0 &&
                    languageList.map((locale) => (
                        <button
                            className="p-2 border hover:text-white hover:bg-black bg-white"
                            key={locale}
                            onClick={() => changeLang(locale)}
                        >
                            {trans.Language[locale]}
                        </button>
                    ))}
            </div>
        </>
    )
}

export default Header
