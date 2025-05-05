import { Search } from "@/components/icons/Icons"
import "@/css/Nav.css"

export function Nav() {
    return (
        <header>
            <div className="draw-line"></div>
            <h1>Hackernotes</h1>
            <div className="draw-line"></div>
            <article className="search-cont">
                <div className="search">
                    <Search />
                    <input type="text" placeholder="Search specific and precise tags... " />
                    <div className="cont-commands">
                        <span>(Ctrl K) to open</span>
                    </div>
                </div>
            </article>
            <div className="draw-line"></div>
            <div className="cont-links">
                 <a>Log In</a>
                 <a>Sign Up</a>
            </div>
            <div className="draw-line"></div>
        </header>
    )
}