import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { useRecoilState } from 'recoil'
import { DOMAIN } from '../contants/funcs'
import useTrans from "../pages/hook/useTrans"
import { currentLang } from '../store/indexState'
import styles from "../styles/Home.module.css"
interface IProps {
    title: string
}
function Header(props: IProps) {
    const trans = useTrans();
    const router = useRouter();
    const [lang, setLang] = useRecoilState(currentLang);

    const handleChangeLanguage = (e: any) => {
        const langList = ['vi', 'en']
        const val = e.target.value;
        const index = langList.findIndex(
            (item: string) => item === val
        )
        setLang(langList[index])
        router.replace(`${DOMAIN}/${langList[index]}`)
    }
    return (
        <>
            <Head>
                <title>{props.title}</title>
                <meta
                    name="description"
                    content={trans.todoList.TITLE}
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>
                <select className={`${styles.select} border border-inherit p-2 pl-4 pr-4 outline-0`} onChange={handleChangeLanguage} value={lang}>
                    <option value="vi">{trans.Language.VI}</option>
                    <option value="en">{trans.Language.EN}</option>
                </select>
            </div>
        </>
    )
}

export default Header
