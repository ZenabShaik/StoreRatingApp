// backend/models/userModel.js
const db = require('../db/database');

exports.createUser = (user, callback) => {
  const { name, email, password, address, role } = user;
  const sql = `INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [name, email, password, address, role], function (err) {
    if (err) return callback(err);
    // this.lastID is the inserted row id
    callback(null, { id: this.lastID, name, email, address, role });
  });
};

exports.findUserByEmail = (email, callback) => {
  const sql = `SELECT * FROM users WHERE email = ?`;
  db.get(sql, [email], (err, row) => {
    if (err) return callback(err);
    callback(null, row);
  });
};

exports.findUserById = (id, callback) => {
  const sql = `SELECT id, name, email, address, role FROM users WHERE id = ?`;
  db.get(sql, [id], (err, row) => {
    if (err) return callback(err);
    callback(null, row);
  });
};
