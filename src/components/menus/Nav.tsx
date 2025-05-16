import { Code, Idioma, Search } from "@/components/icons/Icons"
import "@/css/Nav.css"

export function Nav() {
    return (
        <header>
            <nav>
                <h1>Hackernotes</h1>
                <article className="search-cont">
                    <div className="search">
                        <Search />
                        <span>Search specific and precise tags...</span>
                    </div>
                </article>
                <div className="cont-links">
                    <a><Idioma />Translate</a>
                    <a><Code />Ctrl K / open search</a>
                </div>
            </nav>
        </header>
    )
}