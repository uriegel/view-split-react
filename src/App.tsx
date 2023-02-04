import './App.css'
import { HorizontalSplit } from './component'

const FirstView = () => (
	<div className='first'></div>
)

const SecondView = () => (
	<div className='second'></div>
)

const App = () => (
	<div className="App">
		<HorizontalSplit firstView={ FirstView } secondView={ SecondView } />
	</div>
)

export default App
