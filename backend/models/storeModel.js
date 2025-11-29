// backend/models/storeModel.js
const db = require('../db/database');

exports.createStore = (store, callback) => {
  const { name, email, address } = store;
  const sql = `INSERT INTO stores (name, email, address) VALUES (?, ?, ?)`;
  db.run(sql, [name, email, address], function (err) {
    if (err) return callback(err);
    callback(null, { id: this.lastID, name, email, address });
  });
};

exports.findStoreById = (id, callback) => {
  const sql = `SELECT * FROM stores WHERE id = ?`;
  db.get(sql, [id], (err, row) => {
    if (err) return callback(err);
    callback(null, row);
  });
};

exports.findStoreByEmail = (email, callback) => {
  const sql = `SELECT * FROM stores WHERE email = ?`;
  db.get(sql, [email], (err, row) => {
    if (err) return callback(err);
    callback(null, row);
  });
};
