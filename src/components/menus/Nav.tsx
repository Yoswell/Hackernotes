import { Search } from "@/components/icons/Icons"
import "@/css/Nav.css"

export function Nav() {
    return (
        <header>
            <div className="draw-line"></div>
            <h1>Hackernotes</h1>
            <div className="draw-line"></div>
            <div className="row">
                <div className="search-cont">
                    <Search />
                    <input type="text" placeholder="Search specific and precise tags... " />
                    <span className="float float-01">Ctrl</span>
                    <span className="float float-02">K</span>
                </div>
            </div>
            <div className="draw-line"></div>
            <div className="cont-links">
                 <a>Log In</a>
                 <a>Sign Up</a>
            </div>
            <div className="draw-line"></div>
        </header>
    )
}