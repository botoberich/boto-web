// const { of } = require('rxjs');
// const { mergeAll } = require('rxjs/operators');

// function promiseDelay(ms) {
//     return new Promise(resolve => {
//         setTimeout(() => resolve('done p'), ms);
//     });
// }

// function promiseDelay2(ms) {
//     return new Promise(resolve => {
//         setTimeout(() => resolve('done p2'), ms);
//     });
// }

// let promises = [promiseDelay(100), promiseDelay(2000)];

// let promises2 = [promiseDelay2(1000), promiseDelay2(3000)];

// let $p = Rx.of
//     .apply(this, promises)
//     .pipe(mergeAll())
//     .subscribe(x => console.log(x));

// let $p2 = Rx.of
//     .apply(this, promises2)
//     .pipe(mergeAll())
//     .subscribe(x => console.log(x));

// function test() {
//     console.log(arguments);
// }

// test.apply(this, [1, 2, 3, 4]);

var p1 = new Promise((resolve, reject) => {
    resolve('p1 resolved');
});

var p2 = new Promise(async (resolve, reject) => {
    let p1Data = await p1;
    resolve({ id: 1, p1Data });
});

(async () => {
    var p2Data = await p2;
    console.log(p2Data);
})();
