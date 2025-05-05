import sqlite3 from 'sqlite3';

export const db = new sqlite3.Database('./w1866971_cw2.sqlite', (err) => {
    if (err) {
        console.error('Database Connection failed', err.message);
    } else {
        console.log('Databse connected successfully')
    }
});
