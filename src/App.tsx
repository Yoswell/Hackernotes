import '@/css/App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Nav } from '@/components/menus/Nav'
import { Docs, DocsContent } from '@/components/pages/Docs'
import { MarkdownViewer } from '@/components/MarkdowmViewer'
import { Machines } from '@/components/constants/Machines'
import { createContext, useEffect, useState } from 'react'
import { SearchMachine } from './components/SearchMachine'
import CursorFollower from './components/icons/CursorFollower'

export const MenuItemSelected = createContext<{ selectedItem: string; setSelectedItem: React.Dispatch<React.SetStateAction<string>> }>({
    selectedItem: '',
    setSelectedItem: () => {}
})

function App() {
    const [selectedItem, setSelectedItem] = useState("")

    useEffect(() => {
        setSelectedItem("GoodGames")
    }, [])

    return (
        <MenuItemSelected value={{selectedItem, setSelectedItem}}>              
        <BrowserRouter>
            <div className='docs-container'>
                <Nav />
                <Routes>
                    <Route path='/' element={<Docs />} />
                    {Machines.map((item) => (
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
                <CursorFollower />
            </div>
        </BrowserRouter>
        </MenuItemSelected>
    )
}

export default App
