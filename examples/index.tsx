/// <reference path="../typings/react/react-dom.d.ts" />
/// <reference path="../typings/react/react-draw.d.ts" />

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Canvas} from '../src/Canvas'
import '../libs/canvas-polyfill.js'

class Cross extends React.Component<{}, { offset: number }> {
    constructor(props: any) {
        super(props)
        this.state = { offset: 0 }
    }
    
    componentDidMount() {
        const mover = () => {
            this.setState({ offset: this.state.offset + 1 })
            requestAnimationFrame(mover)
        }
        requestAnimationFrame(mover)
    }
    render() {
        return (
            <draw-group>
                <draw-line
                    from={{x:100 + this.state.offset, y: 25}}
                    to={{x:150 + this.state.offset, y: 25}}
                />
                <draw-line
                    from={{x:125 + this.state.offset, y: 0}}
                    to={{x:125 + this.state.offset, y: 50}}
                />
            </draw-group>
        )
    }
}

interface ShowAfterProps extends React.Props<ShowAfter> {
    time: number;
}

interface ShowAfterState {
    showed: boolean
}

class ShowAfter  extends React.Component<ShowAfterProps, ShowAfterState> {
    constructor(props: ShowAfterProps) {
        super(props)
        this.state = { showed: false }
    }
    
    componentDidMount() {
        setTimeout(() => { this.setState({ showed: true }) }, this.props.time)
    }
    
    render() {
        return (
            <draw-group>
                {this.state.showed ? this.props.children : null}
            </draw-group>
        )
    }
}

class Example extends React.Component<{}, { more: any }> {
    componentDidMount() {
        setTimeout(() => {
            this.setState({ more: <draw-line from={{x:25, y: 10}} to={{x:25, y: 50}} /> })
        }, 1000)
    }
    render() {
        return (
            <div className="example-chart">
                <Canvas className="example-chart__chart" width={600} height={400}>
                    <ShowAfter time={1500}>
                        <draw-line from={{x:0, y: 30}} to={{x:50, y: 30}} />
                    </ShowAfter>
                    <draw-line from={{x:25, y: 10}} to={{x:25, y: 50}} />
                    <Cross />
                    { this.state ? this.state.more : null }
                </Canvas>
            </div>
        )
    }
}

ReactDOM.render(<Example />, document.querySelector('.example'))