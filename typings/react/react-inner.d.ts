/// <reference path="react.d.ts" />

declare namespace __React {
    namespace __ReactDOMComponent {
        interface IReactDOMComponent {
            construct(element: __React.ReactElement<any>): void;
            mountComponent(rootID: string, transation: any, context: any): any;
            receiveComponent(nextElement: __React.ReactElement<any>, transaction: any, context: any): any;
            unmountComponent(): void;
        }
        
        class ReactDOMComponent implements IReactDOMComponent {
            construct(element: __React.ReactElement<any>): void;
            mountComponent(rootID: string, transation: any, context: any): any;
            receiveComponent(nextElement: __React.ReactElement<any>, transaction: any, context: any): any;
            unmountComponent(): void;
        }
    }
    
    namespace __ReactInjection {
        interface ReactDOMComponentConstructor {
            new(tag: string): __React.__ReactDOMComponent.IReactDOMComponent;
        }
        
        interface NativeComponentInjection {
            injectGenericComponentClass(component: ReactDOMComponentConstructor): void;
        }
        
        interface EmptyComponentInjection {
            injectEmptyComponent(placeholder: string): void;
        }
        
        interface ReactComponentEnvironmentInjection {
            processChildrenUpdates: Function;
            replaceNodeWithMarkupByID: Function;
        }
        
        interface UpdatesInjection {
            injectReconcileTransaction(transaction: any): void;
        }
        
        const NativeComponent: NativeComponentInjection;
        const EmptyComponent: EmptyComponentInjection;
        const Updates: UpdatesInjection
    }
    
    namespace __ReactComponentEnvironment {
        var processChildrenUpdates: Function;
        var replaceNodeWithMarkupByID: Function;
    }
    
    namespace __InstantiateReactComponent {
        function instantiateReactComponent(element: __React.ReactElement<any>)
            : __React.__ReactDOMComponent.IReactDOMComponent;
    }
}

declare module "react/lib/ReactDOMComponent" {
    export = __React.__ReactDOMComponent.ReactDOMComponent;
}

declare module 'react/lib/ReactMultiChild' {
    export const Mixin: any;
}

declare module "react/lib/ReactInjection" {
    import ReactInjection = __React.__ReactInjection;
    export = ReactInjection;
}

declare module "react/lib/ReactComponentEnvironment" {
    import ReactComponentEnvironment = __React.__ReactComponentEnvironment;
    export = ReactComponentEnvironment;
}

declare module "react/lib/instantiateReactComponent" {
    import InstantiateReactComponent = __React.__InstantiateReactComponent;
    export = InstantiateReactComponent.instantiateReactComponent;
}

declare module "react/lib/ReactReconcileTransaction" {
    class ReactReconcileTransaction {
        getReactMountReady(): any;
    }
    export = ReactReconcileTransaction;
}

declare module "react/lib/Transaction" {
    export const Mixin: any;
}

declare module 'react/lib/ReactUpdates' {
    export const ReactReconcileTransaction: {
        getPooled<T>(): T;
        release(transaction: any): void;
    }
    export function batchedUpdates(updater: () => any): void;
}

declare module 'react/lib/ReactInstanceHandles' {
    export function createReactRootID(): string;
}

declare module 'react/lib/PooledClass' {
    export function addPoolingTo(constructor: any): void;
}

declare module 'react/lib/CallbackQueue' {
    export function getPooled(arg: any): CallbackQueue;
    export function release(queue: CallbackQueue): void;
    export interface CallbackQueue {
        enqueue(method: Function, ctx?: any): void;
    }
}