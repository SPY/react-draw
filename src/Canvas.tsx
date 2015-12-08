/// <reference path="../typings/react/react.d.ts" />

import * as React from 'react'
import {ReactDrawComponent} from './ReactDrawComponent'
import {inEnvironment} from './injection'
import {render} from './render'

export interface CanvasProps extends React.Props<Canvas> {
    width: number;
    height: number;
    className?: string;
    style?: React.CSSProperties;
}

interface CanvasState {}

export class Canvas extends React.Component<CanvasProps, CanvasState> {
    private rootComponent: ReactDrawComponent;
    
    componentDidMount() {
        const canvas = this.refs['canvas'] as HTMLCanvasElement
        const context = canvas.getContext('2d')
        inEnvironment(() => {
            this.rootComponent = render(
                <draw-root context={context} width={this.props.width} height={this.props.height}>
                    {this.props.children}
                </draw-root>
            )
        })
    }
    
    componentWillUpdate(nextProps: CanvasProps) {
        const canvas = this.refs['canvas'] as HTMLCanvasElement
        const context = canvas.getContext('2d')
        const children = nextProps.children as React.ReactElement<any>
        
        inEnvironment(() => {
            this.rootComponent.updateRoot(children)
        })
    }

    render() {
        return (
            <canvas
                ref="canvas"
                className={this.props.className}
                style={this.props.style}
                width={this.props.width}
                height={this.props.height}
            />
        )
    }
}