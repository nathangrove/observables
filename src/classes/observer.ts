export class Observer {
    isSubscribed: boolean = true; //this will track our subscribtion state
    _unsubscribe: Function;
    
    constructor(
        private observer: any
    ){ 
        if (typeof observer === 'function') {
            this.observer = { next: observer };
        }
    }
    
    
    next(value) {
        if (!this.isSubscribed || !this.observer.next) {
            return;
        }
        
        try {
            this.observer.next(value);
        } catch (e) {
            // we want to unsubscribe only if there is an error
            this.unsubscribe();
        }
    }
    
    
    error(err) {
        if (!this.isSubscribed || !this.observer.error) {
            return;
        }
        
        try {
            this.observer.error(err);
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
        } catch (e) { console.log(e); }
        
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
    
    
}