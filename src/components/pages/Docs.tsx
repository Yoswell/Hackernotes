import "@/css/Docs.css"
import { FC, ReactNode } from "react"
import { PrimaryMenu } from "@/components/menus/PrimaryMenu"
import { TabletDevice } from "@/components/icons/Icons"
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
        <main className="docs-container">
            <div className="draw-line line-1"></div>
            <PrimaryMenu />

            {/* Content scroll */}
            <div className="fluid-container">
                <div className="row">
                    <button className="btn btn-hide"><TabletDevice />Hide left menu</button>
                    <div className="avatar">
                        <img src="/Avatar.png" decoding="async" loading="lazy" />
                    </div>
                    <button className="btn btn-copy"><TabletDevice />Hide right menu</button>
                </div>
                {children}
            </div>
            {/* Content scroll */}
            
            <SecondaryMenu />
            <div className="draw-line line-2"></div>
        </main>
    )
}