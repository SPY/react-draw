/// <reference path="../typings/react/react-inner.d.ts" />

import * as Transaction from 'react/lib/Transaction'
import * as PooledClass from 'react/lib/PooledClass'
import * as CallbackQueue from 'react/lib/CallbackQueue'

interface TransactionWrapper {
    initialize(): void;
    close(): void;
}

const ON_CHART_READY_QUEUEING: TransactionWrapper = {
    initialize() {
        this.reactMountReady.reset();
    },
    close() {
        this.reactMountReady.notifyAll();
    }
};

export class ChartReconcileTransaction {
    private reactMountReady: CallbackQueue.CallbackQueue;
    
    constructor() {
        this.reinitializeTransaction();
        this.reactMountReady = CallbackQueue.getPooled(null);
    }
    
    getTransactionWrappers(): TransactionWrapper[] {
        return [ON_CHART_READY_QUEUEING]
    }
    
    getReactMountReady() {
        return this.reactMountReady;
    }
    
    destructor() {
        CallbackQueue.release(this.reactMountReady);
        this.reactMountReady = null;
    }
    
    // come from mixin
    private reinitializeTransaction() {
        throw new Error('Should be overrided from mixin')
    }

    public perform(method: Function, ctx?: any) {
        throw new Error('Should be overrided from mixin')
    }
}

const proto: any = ChartReconcileTransaction.prototype;
for (var key in Transaction.Mixin) {
    if (key == 'getTransactionWrappers') {
        continue;
    }
    proto[key] = Transaction.Mixin[key]
}

PooledClass.addPoolingTo(ChartReconcileTransaction)