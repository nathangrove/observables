import { Observer } from './observer';

export class Observable {
    constructor(
        private subscriber: any
    ){ }

    subscribe(observer: Function){
        //make it an observer
        this.subscriber(new Observer(observer));
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
            var handler = ev => observer.next(ev);
            element.addEventListener(eventType, handler);
            
            observer.setUnsubscribe(function() {
              element.removeEventListener(eventType, handler);
            });
            
            return observer;
        });
    }

}