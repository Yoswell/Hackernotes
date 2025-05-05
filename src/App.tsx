import '@/css/App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Nav } from '@/components/menus/Nav'
import { Docs, DocsContent } from '@/components/pages/Docs'
import { MarkdownViewer } from '@/components/MarkdowmViewer'
import { menuItems } from '@/components/constants/Machines'
import { createContext, useEffect, useState } from 'react'
import { SearchMachine } from './components/SearchMachine'

export const MenuItemSelected = createContext<{ item: string; setSelectedItem: React.Dispatch<React.SetStateAction<string>> }>({
    item: '',
    setSelectedItem: () => {}
})

function App() {
    const [item, setSelectedItem] = useState("")

    useEffect(() => {
        setSelectedItem("GoodGames")
    }, [])

    return (
        <MenuItemSelected value={{item, setSelectedItem}}>              
        <BrowserRouter>
            <Nav />
            <Routes>
                <Route path='/' element={<Docs />} />
                {menuItems.map((item) => (
                    <>{item.items.map((item_sm, index) => (
                        <Route 
                            key={index}
                            path={`/machines/${item_sm.name}`} 
                            element={
                                <DocsContent>
                                    <MarkdownViewer filePath={`/machines/${item_sm.name}.md`} key={index} />
                                </DocsContent>
                            }>
                        </Route>
                    ))}</>
                ))}
            </Routes>
            <SearchMachine />
            <span className='scan-animate'></span>
        </BrowserRouter>
        </MenuItemSelected>
    )
}

export default App
