import "@/css/Menu.css"
import { useContext } from "react"
import { MenuSelected } from "@/App"
import { Linux } from "@/components/icons/Icons"

export function PrimaryMenu() {
    const menuSelected = useContext(MenuSelected)
    if (!menuSelected) return null
    const { selectedAccess, setSelectedAccess } = menuSelected

    const activeAccess = (id: number) => { setSelectedAccess(id) }

    const menuLinuxItems = [
        {
            category: "Linux",
            items: [
                { title: "Hackthebox GoodGames", d: "easy" },
                { title: "Hackthebox Bizness", d: "easy" },
                { title: "Hackthebox Paper", d: "easy" },
                { title: "Hackthebox Usage", d: "easy" },
                { title: "Hackthebox Perfection", d: "easy" },
                { title: "Hackthebox Sau", d: "easy" },
            ]
        },
        {
            category: "Windows",
            items: [
                { title: "Hackthebox Support", d: "easy" },
                { title: "Hackthebox Jerry", d: "easy" },
                { title: "Hackthebox Timelapse", d: "easy" }
            ]
        },
        {
            category: "Errors",
            items: [
                { title: "Clock skew to great", d: "" }
            ]
        }
    ]

    return (
        <aside className="primary-menu">
            {menuLinuxItems.map((category, index) => (
                <div className="category-sec" key={index}>
                    <h3><Linux />{category.category}</h3>
                    <article className="article-sec">
                        {category.items.map((item, index) => {
                            if(category.category === "Linux") index += 100;
                            if(category.category === "Windows") index += 200;
                            if(category.category === "Errors") index += 300;
                            if(category.category === "Customize") index += 400;

                            return (
                                <a className={ selectedAccess === index ? (
                                    "access active"
                                    ) : (
                                        `access
                                        ${item.d === "easy" && "easy"}
                                        ${item.d === "medium" && "medium"}
                                        ${item.d === "hard" && "hard"}`
                                    )} 
                                    key={index} 
                                    onClick={() => activeAccess(index)}>
                                    {item.title}
                                </a>
                            )
                        })}
                    </article>
                </div>
            ))}
        </aside>
    )
}