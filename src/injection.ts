/// <reference path="../typings/react/react-inner.d.ts" />

import ReactDOMComponent = require('react/lib/ReactDOMComponent')
import {ReactDrawComponent} from './ReactDrawComponent'
import {ChartReconcileTransaction} from './ChartReconcileTransaction'
import * as ReactInjection from 'react/lib/ReactInjection'
import * as ReactComponentEnvironment from 'react/lib/ReactComponentEnvironment'
import ReactReconcileTransaction = require('react/lib/ReactReconcileTransaction')

var injected = false;

function injectProcessChildrenUpdates() {
    if (injected) {
        return
    }
    injected = true;
    const oldProcessChildrenUpdates = ReactComponentEnvironment.processChildrenUpdates
    ReactComponentEnvironment.processChildrenUpdates = (updatesQueue: any[], markupQueue: any[]) => {
        const newMarkupQueue: any[] = []
        const newUpdatesQueue: any[] = []
        for (var i = 0, l = markupQueue.length; i < l; i++) {
            if (!(markupQueue[i] instanceof Path2D)) {
                newUpdatesQueue.push(updatesQueue[i])
                newMarkupQueue.push(markupQueue[i])
            }
        }
        oldProcessChildrenUpdates(newUpdatesQueue, newMarkupQueue)
    }
}

export function inEnvironment(action: () => any) {
    injectProcessChildrenUpdates()
    
    ReactInjection.NativeComponent.injectGenericComponentClass(ReactDrawComponent);
    ReactInjection.EmptyComponent.injectEmptyComponent('element')
    
    const oldReplaceNodeWithMarkupByID = ReactComponentEnvironment.replaceNodeWithMarkupByID
    ReactComponentEnvironment.replaceNodeWithMarkupByID = () => {}
    try {
        action()
    }
    finally {
        ReactInjection.NativeComponent.injectGenericComponentClass(ReactDOMComponent);
        ReactComponentEnvironment.replaceNodeWithMarkupByID = oldReplaceNodeWithMarkupByID;
    }
}