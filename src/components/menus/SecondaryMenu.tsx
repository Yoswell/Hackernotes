import { Cube, World } from "@/components/icons/Icons"
import { menuItems } from "@/components/constants/Machines"
import { MenuItemSelected } from "@/App"
import { useContext } from "react"

export function SecondaryMenu() {
    const { item } = useContext(MenuItemSelected)

    return (
        <aside className="secondary-menu">
            <div className="category-sec">
                <h3><World />Topics viewed</h3>
                <article className="article-sec article-tags">
                    {menuItems.map((a) => (
                        <>{a.items.map((item_sm) => (
                            <>{item_sm.tags.map((item_mm, index) => {
                                {if(item_sm.name === item) {
                                    return <a className="tag" key={index}>{item_mm}</a>
                                }}
                            })}</>
                        ))}</>
                    ))}
                </article>
            </div>
            <div className="category-sec">
                <h3><World />Social Media</h3>
                <article className="article-sec">
                    <a href="https://app.hackthebox.com/profile/1934172" target="_blanck" rel="noonrefer noopener">Hackthebox</a>
                    <a href="https://www.linkedin.com/in/yoswel-badilla-cyberjr" target="_blanck" rel="noonrefer noopener">LinkedIn</a>
                    <a href="https://github.com/Yoswell" target="_blanck" rel="noonrefer noopener">Github</a>
                    <a href="https://yosweldev.vercel.app" target="_blanck" rel="noonrefer noopener">Portfolio Dev</a>
                </article>
            </div>
            <div className="category-sec">
                <h3><Cube />Custom Files</h3>
                <article className="article-sec">
                    <a>Bspwm</a>
                    <a>Polybar</a>
                    <a>Dmenu</a>
                    <a>Obsidian</a>
                </article>
            </div>
        </aside>
    )
}