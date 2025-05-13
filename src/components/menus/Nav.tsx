import { Search } from "@/components/icons/Icons"
import "@/css/Nav.css"

export function Nav() {
    return (
        <header>
            <article className="search-cont">
                <div className="search">
                    <Search />
                    <span>Search specific and precise tags...</span>
                    <div className="command">Ctrl K</div>
                </div>
            </article>
            <div className="cont-links">
                 <a>Log In</a>
                 <a>Sign Up</a>
            </div>
        </header>
    )
}