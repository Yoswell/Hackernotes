import "@/css/Docs.css"
import { useContext } from "react"
import { MenuSelected } from "@/App"
import { PrimaryMenu } from "@/components/menus/PrimaryMenu"
import { Copy, TabletDevice } from "@/components/icons/Icons"
import { SecondaryMenu } from "@/components/menus/SecondaryMenu"
import { MarkdownViewer } from "@/components/MarkdowmViewer"

export function Docs() {
    const menuSelected = useContext(MenuSelected)
    if (!menuSelected) return null
    const { selectedAccess } = menuSelected

    return (
        <main className="docs-container">
            <div className="draw-line"></div>
            <PrimaryMenu />
            <div className="draw-line"></div>

            <div className="fluid-container">
                <div className="row">
                    <button className="btn btn-hide"><TabletDevice />Hide left menu</button>
                    <div className="avatar">
                        <img src="/Avatar.png" decoding="async" loading="lazy" />
                    </div>
                    <button className="btn btn-copy"><Copy />Copy markdowm</button>
                </div>
                <section className="main-container">
                    { selectedAccess < 100 && <MarkdownViewer filePath="/machines/linux/easy/GoodGames.md" /> }
                    { selectedAccess === 100 && <MarkdownViewer filePath="/machines/linux/easy/GoodGames.md" /> }
                    { selectedAccess === 101 && <MarkdownViewer filePath="/machines/linux/easy/Bizness.md" /> }
                    { selectedAccess === 102 && <MarkdownViewer filePath="/machines/linux/easy/Paper.md" /> }
                    { selectedAccess === 103 && <MarkdownViewer filePath="/machines/linux/easy/Usage.md" /> }
                    { selectedAccess === 104 && <MarkdownViewer filePath="/machines/linux/easy/Writeup.md" /> }
                    { selectedAccess === 300 && <MarkdownViewer filePath="/errors/Ker_ClockSkew.md" /> }
                </section>
            </div>
            <div className="draw-line"></div>
            <SecondaryMenu />
            <div className="draw-line"></div>
        </main>
    )
}