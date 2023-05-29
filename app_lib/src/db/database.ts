import DataStore from 'nedb'

const db = new DataStore ({ filename: '../src/db/data_openapi.db', autoload: true });

export default db