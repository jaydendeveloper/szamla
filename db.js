import Database from 'better-sqlite3';
export const db = new Database('db.db');

db.prepare('CREATE TABLE IF NOT EXISTS invoices (id INTEGER PRIMARY KEY, issuerData TEXT, receipentData TEXT, issueDate DATE, changeDate DATE, payDate DATE, endPrice INTEGER, VAT INTEGER, storno INT)').run();