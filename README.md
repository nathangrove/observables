# Observables
Based on article:  ``https://dev.to/vonheikemen/homemade-observables-4ab3``


I built this to play around with the observer/subscriber pattern.



## Demonstrate Forking and Duplicating Streams
Forking will use the same observer, just add another next() call.

    let a, test = new Observable( function(observer) { let i = 0; setInterval(() => observer.next(i++), 1000); setTimeout( () => { observer.error('some error'); }, 10000) });

    setTimeout(() => {
        console.log('starting root0');
        a = test.subscribe( count => console.log('root0',count) ).catch( e => console.error('root0',e) );
    }, 2500);


    setTimeout( () => {
        console.log('forking root0');
        a.fork( count => console.log('fork',count) ).catch( e => console.error('fork',e) );
    }, 5000);


    setTimeout( () => {
      console.log('duplicating root0');
      test.subscribe( count => console.log('root1', count) ).catch( e => console.error('root1',e) );
    },7500);
