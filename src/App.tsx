import '@/css/App.css'
import { Docs } from '@/components/pages/Docs'
import { Nav } from '@/components/menus/Nav'
import { createContext, useState } from 'react'

export const MenuSelected = createContext<{ 
    selectedAccess: number; 
    setSelectedAccess: React.Dispatch<React.SetStateAction<number>>; 
} | null>(null)

function App() {
    const [selectedAccess, setSelectedAccess] = useState(0)

    return (
        <MenuSelected.Provider value={{ selectedAccess, setSelectedAccess }}>
            <Nav />
            <Docs />
            <span className='scan-animate'></span>
        </MenuSelected.Provider>
    )
}

export default App
