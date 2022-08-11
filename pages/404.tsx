import Link from 'next/link'
import React from 'react'
import { useTranslation } from 'react-i18next';
function NotFound() {
    const { t } = useTranslation();
    return (
        <div className="h-screen text-center flex flex-col items-center justify-center">
            <h1 className="font-bold text-2xl">404</h1>
            <p>{t("common.not_found_text")}</p>
            <Link href="/">
                <a className={'border border-sky-500 pl-4 pr-4 p-2 mt-4'}>
                    {t("todo_list.back_to_list")}
                </a>
            </Link>
        </div>
    )
}

export default NotFound
