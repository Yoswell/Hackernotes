import { Tag, World } from "@/components/icons/Icons"
import { Machines } from "@/components/constants/Machines"
import { MenuItemSelected } from "@/App"
import { useContext } from "react"

export function SecondaryMenu() {
    const { selectedItem } = useContext(MenuItemSelected)

    return (
        <aside className="secondary-menu">
            <div className="tree tree-1">
                <h3><Tag />Topics viewed</h3>
                <article className="ree tree-links">
                    {Machines.map((a) => (
                        <>{a.items.map((item_sm) => (
                            <>{item_sm.tags.map((item_mm, index) => {
                                {if(item_sm.name === selectedItem) {
                                    return <a className="tag" key={index}>
                                        {item_mm}
                                    </a>
                                }}
                            })}</>
                        ))}</>
                    ))}
                </article>
            </div>
            <div className="tree tree-1">
                <h3><World />Social Media</h3>
                <article className="tree tree-links">
                    <a className="empty-icon" href="https://app.hackthebox.com/profile/1934172" target="_blanck" rel="noonrefer noopener">Hackthebox</a>
                    <a className="empty-icon" href="https://www.linkedin.com/in/yoswel-badilla-cyberjr" target="_blanck" rel="noonrefer noopener">LinkedIn</a>
                    <a className="empty-icon" href="https://github.com/Yoswell" target="_blanck" rel="noonrefer noopener">Github</a>
                    <a className="empty-icon" href="https://yosweldev.vercel.app" target="_blanck" rel="noonrefer noopener">Portfolio Dev</a>
                </article>
            </div>
            <div className="tree tree-1">
                <h3>Custom Files</h3>
                <article className="tree tree-links">
                    <a className="empty-icon">Bspwm</a>
                    <a className="empty-icon">Polybar</a>
                    <a className="empty-icon">Dmenu</a>
                    <a className="empty-icon">Obsidian</a>
                </article>
            </div>
        </aside>
    )
}