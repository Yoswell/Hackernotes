import { useState, FC, useEffect } from "react"
import { Search } from "@/components/icons/Icons"
import { menuItems } from "@/components/constants/Machines"

export function SearchMachine() {
    const [valueSearch, setValueSearch] = useState('')
    const [showSearch, setShowSearch] = useState(false)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setShowSearch(false);
            }
            
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                setShowSearch(true);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <section className={`results-container ${showSearch == true ? "show-search" : "hide-results"}`}>
            <div className="results-content">
                <div className={`scroll ${valueSearch.length <= 0 && "empty-results"}`}>
                    {valueSearch.length > 0 && <FilterSearch content={valueSearch} />}
                </div>
                <article className="search-cont">
                    <div className="search">
                        <Search />
                        <input 
                            type="text"
                            placeholder="Search specific and precise tags... "
                            onChange={(e) => setValueSearch(e.target.value)}>
                        </input>
                        <div className="cont-commands">
                            <span>(Escape) to close</span>
                        </div>
                    </div>
                </article>
            </div>
        </section>
    )
}

interface FilterSearchProps {
    content: string
}

const FilterSearch: FC<FilterSearchProps> = ({ content }) => {
    const filteredItems = menuItems.filter(item => 
        item.category.toLowerCase().includes(content.toLowerCase())
    )

    return (
        <>
        {filteredItems.map((item) => (
            item.items.map((item_sm, index) => (
                <article key={`${item.category}-${index}`}>
                    <div className="float-tags">
                        <span className="type">{item.category}</span>
                        <span className="difficulty">{item_sm.difficulty}</span>
                    </div>
                    <h1>{item_sm.name}</h1>
                    <p>{item_sm.description}</p>
                    <div className="cont-tags">
                        {item_sm.tags.map((tag, index) => (
                            <span key={index}>{tag}</span>
                        ))}
                    </div>
                </article>
            ))
        ))}
        </>
    )
}