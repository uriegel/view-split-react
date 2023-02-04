import React, { useRef } from 'react'
import './ViewSplit.css'

interface ViewProp {
    firstView: ()=>JSX.Element
    secondView: ()=>JSX.Element
}

export const HorizontalSplit = ({ firstView, secondView }: ViewProp) => {

    const first = useRef<HTMLDivElement>(null)
    const second = useRef<HTMLDivElement>(null)
    const splitter = useRef<HTMLDivElement>(null)

    const onMouseDown = (e: React.MouseEvent) => {
        const evt = e.nativeEvent
        if (evt.which != 1) 
            return
        const isVertical = false // this.getAttribute("orientation") == VERTICAL
        const size1 = isVertical ? first.current!.offsetHeight : first.current!.offsetWidth
        const size2 = isVertical ? second.current!.offsetHeight : second.current!.offsetWidth
        const initialPosition = isVertical ? evt.pageY : evt.pageX		

        let timestap = performance.now()

        const onMouseMove = (evt: MouseEvent) => {
            const newTime = performance.now()
            const diff = newTime - timestap
            if (diff > 20) {
                timestap = newTime

                let delta = (isVertical ? evt.pageY : evt.pageX) - initialPosition
                if (delta < 10 - size1)
                    delta = 10 - size1
                const maxSize = (isVertical
                    ? first.current!.parentElement!.offsetHeight
                    : first.current!.parentElement!.offsetWidth) - 10 - size1 - 6   
                if (delta > maxSize)
                    delta = maxSize

                const newSize1 = size1 + delta
                const newSize2 = size2 - delta

                const procent2 = newSize2 / (newSize2 + newSize1 + 
                    (isVertical ? splitter.current!.offsetHeight : splitter.current!.offsetWidth)) * 100

                const size = `0 0 ${procent2}%` 
                second.current!.style.flex = size
                // TODO
                //this.dispatchEvent(new CustomEvent('position-changed'))

            }
            evt.stopPropagation()
            evt.preventDefault()
        }

        const onMouseUp = (evt: MouseEvent) => {
            window.removeEventListener('mousemove', onMouseMove, true)
            window.removeEventListener('mouseup', onMouseUp, true)

            evt.stopPropagation()
            evt.preventDefault()
        }

        window.addEventListener('mousemove', onMouseMove, true)
        window.addEventListener('mouseup', onMouseUp, true)

        evt.stopPropagation()
        evt.preventDefault()        		
    }

    return (
        <div className='vsr--container'>
            <div ref={first} className='vsr--view'>
                { firstView() }
            </div>
            <div ref={splitter} className='vsr--splitter' onMouseDown={onMouseDown}></div>
            <div ref={second} className='vsr--view'>
                { secondView() }
            </div>
        </div>        
    )
}

