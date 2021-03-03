import {Ticket} from '../client/src/api';

const data = require('./data.json');

const temp = data as Ticket[];

temp.map((t) => t.isPinned = false);

export const tempData = temp;

// export const tempData = data as Ticket[];
