import "@/css/Menu.css"
import { Cube, Difficulty } from "@/components/icons/Icons"
import { Link } from "react-router-dom"
import { Machines, Errors } from "@/components/constants/Machines"
import { MenuItemSelected } from "@/App"
import { useContext } from "react"

export function PrimaryMenu() {
    const { selectedItem, setSelectedItem } = useContext(MenuItemSelected)

    const selectItem = (id: string) => { setSelectedItem(id) }

    return (
        <aside className="primary-menu">
            {Machines.map((category, index) => (
                <article className="tree tree-1" key={index}>
                    <h3><Cube /><span>{category.category}</span><span className="float-span">SO</span></h3>
                    <article className="tree tree-2">
                        <h4 key={index}><Difficulty /><span>Easy</span></h4>
                        <article className="tree tree-links">
                            {category.items.map((item, index) => {
                                if(item.difficulty == "Easy") {
                                    return (
                                        <Link 
                                            to={`/machines/${item.name}`} 
                                            key={index}
                                            className={`${selectedItem == item.name && "active"} ${category.category == "Errors" && "empty-icon"}`}
                                            onClick={() => selectItem(item.name)}>
                                            <span>HTB {item.name}</span>
                                        </Link>
                                    )
                                }
                            })}
                        </article>
                        <h4 key={index}><Difficulty /><span>Medium</span></h4>
                        <article className="tree tree-links">
                            {category.items.map((item, index) => {
                                if(item.difficulty == "Medium") {
                                    return (
                                        <Link 
                                            to={`/machines/${item.name}`} 
                                            key={index}
                                            className={`${selectedItem == item.name && "active"}`}
                                            onClick={() => selectItem(item.name)}>
                                            <span>HTB {item.name}</span>
                                        </Link>
                                    )
                                }
                            })}
                        </article>
                        <h4 key={index}><Difficulty /><span>Hard</span></h4>
                        <article className="tree tree-links">
                            {category.items.map((item, index) => {
                                if(item.difficulty == "Hard") {
                                    return (
                                        <Link 
                                            to={`/machines/${item.name}`} 
                                            key={index}
                                            className={`${selectedItem == item.name && "active"}`}
                                            onClick={() => selectItem(item.name)}>
                                            <span>HTB {item.name}</span>
                                        </Link>
                                    )
                                }
                            })}
                        </article>
                    </article>
                </article>
            ))}
            {Errors.map((category, index) => (
                <article className="tree tree-1" key={index}>
                    <h3><Cube /><span>{category.category}</span></h3>
                    <article className="tree tree-links">
                        {category.items.map((item, index) => (
                            <Link 
                                to={`/machines/${item.name}`} 
                                key={index}
                                className={`${selectedItem == item.name && "active"}`}
                                onClick={() => selectItem(item.name)}>
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </article>
                </article>
            ))}
        </aside>
    )
}