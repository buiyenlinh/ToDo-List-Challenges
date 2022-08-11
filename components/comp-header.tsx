import Head from 'next/head'
import { useTranslation } from 'react-i18next'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { currentLanguageState, langListState } from '../store/index-state'
interface IProps {
    title: string
}
function Header(props: IProps) {
    const { t, i18n } = useTranslation();
    const languageList = useRecoilValue(langListState)
    const setCurrentLang = useSetRecoilState(currentLanguageState);
    const changeLanguage = (id: string) => {
        i18n.changeLanguage(id);
        setCurrentLang(id);
    }

    return (
        <>
            <Head>
                <title>{props.title}</title>
                <meta name="description" content={t("todo_list.title")} />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="right-3.5 top-1 md:right-12 z-40 fixed">
                {languageList.length > 0 &&
                    languageList.map((lang: any) => (
                        <button
                            className="p-2 border hover:text-white hover:bg-black bg-white"
                            key={lang.id}
                            onClick={() => changeLanguage(lang.id)}
                        >
                            {lang.name}
                        </button>
                    ))}
            </div>
        </>
    )
}

export default Header
