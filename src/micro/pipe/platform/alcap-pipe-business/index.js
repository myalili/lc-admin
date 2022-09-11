import sortName from './sortName';
import vfilter from './vfilter';
import entity from './entity';
import component from './component';
import cookie from './cookie';
import des from './des';
import fetch from './fetch';
import exportFile from './exportFile';
import getRandomNum from './getRandomNum';
import store from './store';
import localStorage from './localStorage';
import rsa from './rsa';
import base64 from './base64';

const app = {
    sortName,
	vfilter,
    entity,
    cookie,
    des,
    fetch,
    exportFile,
    getRandomNum,
    store,
    localStorage,
    rsa,
    base64,
    component
}

!window.pipe && (window.pipe = {});
window.pipe = { ...window.pipe, ...app };

import './libs';
export default app