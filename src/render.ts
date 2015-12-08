/// <reference path="../typings/react/react-inner.d.ts" />

import * as React from 'react'

import instantiateReactComponent = require('react/lib/instantiateReactComponent')
import * as ReactInstanceHandles from 'react/lib/ReactInstanceHandles';
import * as ReactUpdates from 'react/lib/ReactUpdates';
import {ChartReconcileTransaction} from './ChartReconcileTransaction'

import {ReactDrawComponent} from './ReactDrawComponent'

export function render(element: React.ReactElement<any>): ReactDrawComponent {    
    const id = ReactInstanceHandles.createReactRootID();
    const component = instantiateReactComponent(element) as ReactDrawComponent;
    const transaction = ReactUpdates.ReactReconcileTransaction.getPooled<ChartReconcileTransaction>();
    
    transaction.perform(() => {
        component.mountComponent(id, transaction, {});
    })
    ReactUpdates.ReactReconcileTransaction.release(transaction);

    return component
}
