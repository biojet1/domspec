// export default class ClassName {
//     static get prop() {
//         console.log('prop', this);
//         return 'val:prop';
//     }

//     static play() {}
// }

import * as all from '../../dist/all.js';

function time() {
    return 'oras';
}

export const option = {
    aspect_ratio = [16, 9];
    _inc = 0;
    
};

export const params = class {
    static aspect_ratio = [16, 9];
    static _inc = 0;

    static get what() {
        console.log('what', this);
        return 'what?';
    }
    static get foo() {
        console.log('foo', this.what);
        return 'foo';
    }
    static get aspect() {
        return this.aspect_ratio;
    }
    static get inc() {
        return ++this._inc;
    }
};

// export default { play, ['in']: time, ClassName, f: MyConstants.foo };
export default {
    time,
    ...all,
    get latest() {
        return '444';
    },
};
