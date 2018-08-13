import { Observer } from './observer';

export class Observable {

    constructor(
        private subscriber: any
    ){ }

    subscribe(observer: Function): Observer{
        //make it an observer
        let o: Observer = new Observer(observer);
        this.subscriber(o);
        return o;
    }

    static fromArray(arr) {
        return new Observable(function(observer: Observer) {
          try {
            arr.forEach(value => observer.next(value));
            observer.complete();
          } catch (e) {
            observer.error(e);
          }
        });
    }


    static fromInputEvent(element: Element, eventType: string){
        return new Observable(function(observer: Observer) {
            var handler = ev => observer.next(ev.target.value);
            element.addEventListener(eventType, handler);
            
            observer.setUnsubscribe(function() {
              element.removeEventListener(eventType, handler);
            });
            
            return observer;
        });
    }

}