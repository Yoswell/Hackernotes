import "@/css/Docs.css"
import { FC, ReactNode } from "react"
import { PrimaryMenu } from "@/components/menus/PrimaryMenu"
import { SecondaryMenu } from "@/components/menus/SecondaryMenu"
import { MarkdownViewer } from "@/components/MarkdowmViewer"

export function Docs() {
    return (
        <DocsContent>
            <MarkdownViewer filePath="/machines/GoodGames.md"></MarkdownViewer>
        </DocsContent>
    )
}

export const DocsContent : FC<{children: ReactNode}> = ({children}) => {
    return (
        <main className="main-container">
            <PrimaryMenu />
            <div className="md-container">
                {children}
            </div>
            <SecondaryMenu />
        </main>
    )
}