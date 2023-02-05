import { ChangeEvent, useState } from 'react'
import './App.css'
import ViewSplit from './component/index'

const themes = [
    { name: "Blue", theme: "themeBlue" },
    { name: "Adwaita", theme: "themeAdwaita" },
    { name: "Adwaita dark", theme: "themeAdwaitaDark" },
]

const changeTheme = (theme: string) => {
    themes.forEach(n => document.body.classList.remove(n.theme))
    document.body.classList.add(theme)    
}


const FirstView = () => (
	<div className='first'></div>
)

const SecondView = () => (
	<div className='second'></div>
)

const ThirdView = () => (
	<div className='third'></div>
)

const VerticalSplitView = () => (
	<ViewSplit firstView={ FirstView } secondView={ SecondView } />
)

const App = () => {
    const [theme, setTheme] = useState(themes[0])

    const onThemeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const theme = themes.find(n => n.name == e.target.value)!
        changeTheme(theme.theme)
        setTheme(theme)
    }

	return (
		<div className="App">
            <select value={theme.name} onChange={onThemeChange}>
                {themes.map((n, i) => <option key={i}>{n.name}</option>) }
            </select>
			<ViewSplit isHorizontal={true} firstView={VerticalSplitView} secondView={ThirdView} />
		</div>
	)
}

export default App
