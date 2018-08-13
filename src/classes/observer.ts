export class Observer {
    isSubscribed: boolean = true; //this will track our subscribtion state
    _unsubscribe: Function;
    forks: Function[] = [];
    catches: Function[] = [];

    observers: any[] = [];

    constructor(
        private observer: any
    ){ 
        if (typeof observer === 'function') this.observer = { next: observer };
    }
    
    
    next(value) {
        if (!this.isSubscribed || !this.observer.next) {
            return;
        }
        
        try {
            this.observer.next(value);
            this.forks.forEach( f => f(value) );
        } catch (e) {
            // we want to unsubscribe only if there is an error
            this.unsubscribe();
        }
    }
    
    catch(errFunction?: Function): Observer{
        this.catches.push(errFunction);
        return this;
    }

    error(err) {
        if (!this.isSubscribed) {
            return;
        }
        
        try {
            // this.observer.error(err);
            this.catches.forEach( c => c(err) );
        } catch (e) {}
        
        // we will unsubscribe no matter what happens
        this.unsubscribe();
    }
    
    complete() {
        if (!this.isSubscribed || !this.observer.complete) {
            return;
        }
        
        try {
            this.observer.complete();
        } catch (e) { }
        
        // we will unsubscribe no matter what happens
        this.unsubscribe();
    }
    
    setUnsubscribe(unsub: Function) {
        this._unsubscribe = unsub;
    }
    
    unsubscribe() {
        this.isSubscribed = false;
        
        if(this._unsubscribe) {
            this._unsubscribe();
        }
    }


    fork(next: Function): Observer{
        this.forks.push(next);
        return this;
    }
    
    
}