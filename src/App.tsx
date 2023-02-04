import './App.css'
import ViewSplit from './component/index'

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

const App = () => (
	<div className="App">
		<ViewSplit isHorizontal={true} firstView={VerticalSplitView} secondView={ThirdView} />
	</div>
)

export default App
