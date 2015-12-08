/// <reference path="../typings/react/react-inner.d.ts" />

import * as React from 'react'
import * as ReactInjection from 'react/lib/ReactInjection'
import * as ReactMultiChild from 'react/lib/ReactMultiChild'
import {ChartReconcileTransaction} from './ChartReconcileTransaction'
import ReactReconcileTransaction = require('react/lib/ReactReconcileTransaction')
import {inEnvironment} from './injection'
import * as ReactUpdates from 'react/lib/ReactUpdates';

interface CompositComponent<T> {
    _renderedComponent: T;
}

export class ReactDrawComponent {
    private _tag: string;
    private _currentElement: React.ReactElement<any>
    private _mountImage: Path2D;
    private _renderedChildren: {
        [childId: string]: CompositComponent<ReactDrawComponent> | ReactDrawComponent
    };
    private _rootNodeID: string;
    
    constructor(tag: string) {
        this._tag = tag;
        this._currentElement = null;
        this._renderedChildren = null;
        this._mountImage = null;
        this._rootNodeID = '';
    }
    
    get path(): Path2D {
        return this._mountImage;
    }
    
    construct(element: React.ReactElement<any>) {
        this._currentElement = element
    }
    
    mountComponent(rootID: string, transaction: ChartReconcileTransaction, context: any) {
        this._rootNodeID = rootID;
        const children = React.Children.toArray(this._currentElement.props.children) as React.ReactElement<any>[]
        const mountImage = this.createPathForPrimitive()
        if (children.length) {
            this.mountChildren(
                children,
                transaction,
                context
            )
        }
        this._mountImage = mountImage
        if (this._tag == "draw-root") {
            context.root = this
            transaction.getReactMountReady().enqueue(() => {
                this.rerender();
            })
        }
        return mountImage;
    }
    
    createPathForPrimitive(): Path2D {
        const path = new Path2D()
        switch (this._tag) {
            case 'draw-line': {
                const {from, to} = this._currentElement.props
                path.moveTo(from.x, from.y)
                path.lineTo(to.x, to.y)
                break;
            }
        }
        return path;
    }
    
    receiveComponent(nextElement: React.ReactElement<any>, transaction: ReactReconcileTransaction, context: any) {
        this._currentElement = nextElement;
        const children = React.Children.toArray(nextElement.props.children) as React.ReactElement<any>[]
        const mountImage = this.createPathForPrimitive()
        if (children.length) {
            inEnvironment(() => {
                this.updateChildren(children, transaction, context)
            })
        }
        
        this._mountImage = mountImage
        transaction.getReactMountReady().enqueue(() => {
            context.root.rerender();
        })
        return mountImage;
    }
    
    unmountComponent() {
        
    }
    
    public rerender() {
        if (this._tag == "draw-root") {
            const {context, width, height} = this._currentElement.props
            
            context.clearRect(0, 0, width, height)
            context.stroke(this.recalcPathForChildren())
        }
    }
    
    public updateRoot(nextChildren: React.ReactElement<any>) {
        const children = React.Children.toArray(nextChildren) as React.ReactElement<any>[]
        const transaction = ReactUpdates.ReactReconcileTransaction.getPooled<ChartReconcileTransaction>();
    
        transaction.perform(() => {
            this.updateChildren(children, transaction, { root: this })
        })
        ReactUpdates.ReactReconcileTransaction.release(transaction);
        this.rerender()
    }
    
    protected recalcPathForChildren(): Path2D {
        if (this._tag == 'draw-root' || this._tag == 'draw-group') {
            const mountImage = new Path2D()
            for (const childId in this._renderedChildren) {
                if (this._renderedChildren.hasOwnProperty(childId)) {
                    if (this._renderedChildren[childId] instanceof ReactDrawComponent) {
                        const child = this._renderedChildren[childId] as ReactDrawComponent
                        mountImage.addPath(child._mountImage)
                    }
                    else if ((this._renderedChildren[childId] as CompositComponent<any>)._renderedComponent) {
                        const composit = this._renderedChildren[childId] as CompositComponent<any>
                        const group: ReactDrawComponent = composit._renderedComponent
                        mountImage.addPath(group.recalcPathForChildren())
                    }
                }
            }
            this._mountImage = mountImage
            return mountImage
        }
        return null
    }
    
    // from ReactMultiChild.Mixin
    mountChildren(children: React.ReactElement<any>[], transaction: any, context: any): Path2D[] {
        throw new Error('Should be overrided from mixin')
    }
    
    updateChildren(nextElement: React.ReactElement<any>[], transaction: any, context: any) {
        throw new Error('Should be overrided from mixin')
    }
    
    _updateChildren(nextElement: React.ReactElement<any>[], transaction: any, context: any) {
        throw new Error('Should be overrided from mixin')
    }
}

const proto: any = ReactDrawComponent.prototype;
for (var key in ReactMultiChild.Mixin) {
    proto[key] = ReactMultiChild.Mixin[key]
}