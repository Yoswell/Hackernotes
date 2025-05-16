import "@/css/Menu.css"
import { Arrow, Folder, Volt } from "@/components/icons/Icons"
import { Link } from "react-router-dom"
import { Machines, Errors } from "@/components/constants/Machines"
import { MenuItemSelected } from "@/App"
import { useContext } from "react"

type DifficultySectionProps = {
    difficulty: string;
    items: { name: string; difficulty: string }[];
    selectedItem: string;
    selectItem: (id: string) => void;
};

function DifficultySection({ difficulty, items, selectedItem, selectItem }: DifficultySectionProps) {
    const filteredItems = items.filter(item => item.difficulty === difficulty)

    return (
        <>
        <h3><Volt /><span>{difficulty}</span></h3>
        <article className="tree tree-links">
            {filteredItems.map((item) => (
                <Link
                    to={`/machines/${item.name}`}
                    key={item.name}
                    className={`link ${selectedItem === item.name ? "active" : ""}`}
                    onClick={() => selectItem(item.name)}>
                    <span>HTB {item.name}</span>
                </Link>
            ))}
        </article>
        </>
    )
}

export function PrimaryMenu() {
    const { selectedItem, setSelectedItem } = useContext(MenuItemSelected)

    const selectItem = (id: string) => setSelectedItem(id)

    return (
        <aside className="primary-menu">
            <section className="tree tree-1">
                <h3>
                    <Folder />
                    <span>Machines</span>
                    <span className="float-span"><Arrow /></span>
                </h3>
                {Machines.map((category) => (
                    <article className="tree tree-2" key={category.category}>
                        <h3>
                            <Folder />
                            <span>{category.category}</span>
                            <span className="float-span"><Arrow /></span>
                        </h3>
                        <article className="tree tree-3">
                            <DifficultySection
                                difficulty="Easy"
                                items={category.items}
                                selectedItem={selectedItem}
                                selectItem={selectItem}>
                            </DifficultySection>
                            <DifficultySection
                                difficulty="Medium"
                                items={category.items}
                                selectedItem={selectedItem}
                                selectItem={selectItem}>
                            </DifficultySection>
                        </article>
                    </article>
                ))}
            </section>

            <section className="tree tree-1">
                <h3>
                    <Folder />
                    <span>Information</span>
                    <span className="float-span"><Arrow /></span>
                </h3>
                {Errors.map((category) => (
                    <article className="tree tree-2" key={category.category}>
                        <h3>
                            <Folder />
                            <span>{category.category}</span>
                            <span className="float-span"><Arrow /></span>
                        </h3>
                        <article className="tree tree-links">
                            {category.items.map((item) => (
                                <Link
                                    to={`/machines/${item.name}`}
                                    key={item.name}
                                    className={`link ${selectedItem === item.name ? "active" : ""}`}
                                    onClick={() => selectItem(item.name)}>
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </article>
                    </article>
                ))}
            </section>
        </aside>
    )
}
