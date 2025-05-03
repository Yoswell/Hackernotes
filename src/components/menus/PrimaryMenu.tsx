import "@/css/Menu.css"
import { Linux } from "@/components/icons/Icons"
import { Link } from "react-router-dom"
import { menuItems } from "@/components/constants/Machines"
import { MenuItemSelected } from "@/App"
import { useContext } from "react"

export function PrimaryMenu() {
    const { setSelectedItem } = useContext(MenuItemSelected)

    const selectItem = (id: string) => {
        setSelectedItem(id)
    }

    return (
        <aside className="primary-menu">
            {menuItems.map((category, index) => (
                <div className="category-sec" key={index}>
                    <h3><Linux />{category.category}</h3>
                    <article className="article-sec">
                        {category.items.map((item, index) => (
                            <Link 
                                to={`/machines/${item.name}`} 
                                key={index}
                                onClick={() => selectItem(item.name)}
                                className={`
                                    ${item.difficulty === "easy" && "easy"}
                                    ${item.difficulty === "medium" && "medium"}
                                    ${item.difficulty === "hard" && "hard"}
                                `}>
                                {category.category != "Common Errors" && "Hackthebox "}
                                {item.name}
                            </Link>
                        ))}
                    </article>
                </div>
            ))}
        </aside>
    )
}