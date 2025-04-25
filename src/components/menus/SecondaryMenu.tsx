import { Cube, World } from "@/components/icons/Icons"

export function SecondaryMenu() {
    return (
        <aside className="secondary-menu">
            <div className="category-sec">
                <h3><World />Social media</h3>
                <article className="article-sec">
                    <a>Hackthebox</a>
                    <a>LinkdIn</a>
                    <a>Github</a>
                    <a>Portfolio Dev</a>
                </article>
            </div>
            <div className="category-sec">
                <h3><Cube />Custom</h3>
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