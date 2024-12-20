import React, { JSX, useEffect, useRef, useState } from 'react'
import './ViewSplit.css'

interface ViewProp {
    isHorizontal?: boolean
    initialWidth?: number
    firstView: ()=>JSX.Element
    secondView: () => JSX.Element
    secondVisible?: boolean
}

const ViewSplit = ({ isHorizontal, firstView, secondView, secondVisible, initialWidth}: ViewProp) => {

    const first = useRef<HTMLDivElement>(null)
    const second = useRef<HTMLDivElement>(null)
    const splitter = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)

    useEffect(() => {
        if (initialWidth && second.current) 
            second.current.style.flex = `0 0 ${initialWidth}%`
    }, [initialWidth, secondVisible])

    const onMouseDown = (e: React.MouseEvent) => {
        const evt = e.nativeEvent
        if (evt.button != 0) 
            return
        const size1 = isHorizontal ? first.current!.offsetHeight : first.current!.offsetWidth
        const size2 = isHorizontal ? second.current!.offsetHeight : second.current!.offsetWidth
        const initialPosition = isHorizontal ? evt.pageY : evt.pageX

        let timestamp = performance.now()

        const onMouseMove = (evt: MouseEvent) => {
            const newTime = performance.now()
            const diff = newTime - timestamp
            if (diff > 20) {
                timestamp = newTime

                let delta = (isHorizontal ? evt.pageY : evt.pageX) - initialPosition
                if (delta < 10 - size1)
                    delta = 10 - size1
                const maxSize = (isHorizontal
                    ? first.current!.parentElement!.offsetHeight
                    : first.current!.parentElement!.offsetWidth) - 10 - size1 - 6   
                if (delta > maxSize)
                    delta = maxSize

                const newSize1 = size1 + delta
                const newSize2 = size2 - delta

                const procent2 = newSize2 / (newSize2 + newSize1 + 
                    (isHorizontal ? splitter.current!.offsetHeight : splitter.current!.offsetWidth)) * 100

                document.body.style.cursor = isHorizontal ? 'ns-resize' : 'ew-resize'
                
                const size = `0 0 ${procent2}%` 
                second.current!.style.flex = size
            }
            evt.stopPropagation()
            evt.preventDefault()
        }

        const onMouseUp = (evt: MouseEvent) => {
            window.removeEventListener('mousemove', onMouseMove, true)
            window.removeEventListener('mouseup', onMouseUp, true)

            evt.stopPropagation()
            evt.preventDefault()

            document.body.style.cursor = ""

            setIsDragging(false)
        }

        setIsDragging(true)
        window.addEventListener('mousemove', onMouseMove, true)
        window.addEventListener('mouseup', onMouseUp, true)

        evt.stopPropagation()
        evt.preventDefault()        		
    }

    return (
        <div className={`vsr--container ${isHorizontal ? "vsr--horizontal" : ""}`}>
            <div ref={first} className='vsr--view'>
                {firstView()}
                {isDragging ? (<div className="overlay"></div>) : null}
            </div>
            {secondVisible == undefined || secondVisible ?
                (<>
                    <div ref={splitter} className='vsr--splitter' onMouseDown={onMouseDown}>
                        <div className={`${isHorizontal ? "vsr--horizontal-grip" : "vsr--vertical-grip"}`}></div>
                    </div>
                    <div ref={second} className='vsr--view'>
                        {secondView()}
                        {isDragging ? (<div className="vsr--overlay"></div>) : null}
                    </div>
                </>)
                : (<></>)}
        </div>        
    )
}

export default ViewSplit
