export class Observer {

    isSubscribed: boolean = true; //this will track our subscribtion state

    unsubs: Function[] = [];
    nexts: Function[] = [];
    completes: Function[] = [];
    catches: Function[] = [];

    constructor(
        private nextFunc : any,
        private promise: boolean = false
    ){ 
        if (!nextFunc) throw 'Next observer is required';
        this.nexts.push(nextFunc);
    }
    
    
    public next(value) {
        if (!this.isSubscribed || !this.nexts.length) return;
        
        try {

            this.nexts.forEach( f => f(value) );
            if (this.promise) this._complete();

        } catch (e) {
            // we want to unsubscribe only if there is an error
            this.error(e);
        }
    }
    
    public catch(errFunction?: Function): Observer{
        this.catches.push(errFunction);
        return this;
    }
    
    public unsubscribe(unsubFunc: Function): Observer {
        this.unsubs.push(unsubFunc);
        return this;
    }
   
    public complete(completeFunc?: Function): Observer {
        if (!completeFunc) this._complete();
        this.completes.push(completeFunc);
        return this;
    }

    public fork(next: Function): Observer{
        this.nexts.push(next);
        return this;
    }


    public error(err: any) {
        if (!this.isSubscribed) return;
        
        try {
            // this.observer.error(err);
            this.catches.forEach( c => c(err) );
        } catch (e) { console.error('Observable error',e) }
        
        // we will unsubscribe no matter what happens
        this._unsubscribe();
    }
 

    private _complete(){
        if (!this.isSubscribed) return;
        
        if (this.completes.length){
            try {
                this.completes.forEach( f => f() );
            } catch (e) { this.error(e) }
        }
        
        // we will unsubscribe no matter what happens
        this._unsubscribe();
    }

    private _unsubscribe(){
        this.isSubscribed = false;
        if (this.unsubs.length) this.unsubs.forEach( f => f() );
    }

    
    
}