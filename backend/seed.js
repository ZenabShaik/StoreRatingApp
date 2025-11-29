// backend/seed.js
const bcrypt = require('bcryptjs');
const db = require('./db/database');

// Data to insert (from your input)
const users = [
  {
    name: 'Shaik Zenab',
    email: 'shaikzenab07@gmail.com',
    address: 'Hyderabad',
    password: 'zen@123',
    role: 'admin'
  },
  {
    name: 'Shaik Bandisaheb',
    email: 'shaik.bandi@gmail.com',
    address: 'Jafrapur',
    password: 'bandi@786',
    role: 'owner'
  },
  {
    name: 'Shaik Wasim',
    email: 'shaikwasim05@gmail.com',
    address: 'UAE',
    password: 'wasim@2005',
    role: 'user'
  },
  {
    name: 'Shaik Noora',
    email: 'shaiknoora02@gmail.com',
    address: 'San Fransisco',
    password: 'noora@2002',
    role: 'user'
  }
];

const store = {
  name: 'ZNW Store',
  email: 'shaikznw@gmail.com',
  address: 'Hno:1-93,Jafrapur,Nirmal'
};

// helper to check if user exists
function userExists(email, cb) {
  db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
    if (err) return cb(err);
    cb(null, !!row);
  });
}

// helper to insert user hashed
function insertUser(user, cb) {
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return cb(err);
    const sql = `INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [user.name, user.email, hash, user.address, user.role], function (err) {
      if (err) return cb(err);
      cb(null, { id: this.lastID });
    });
  });
}

// insert store (ensure not duplicate)
function insertStore(storeObj, cb) {
  db.get('SELECT id FROM stores WHERE email = ?', [storeObj.email], (err, row) => {
    if (err) return cb(err);
    if (row) return cb(null, { id: row.id, existed: true });

    const sql = `INSERT INTO stores (name, email, address) VALUES (?, ?, ?)`;
    db.run(sql, [storeObj.name, storeObj.email, storeObj.address], function (err) {
      if (err) return cb(err);
      cb(null, { id: this.lastID, existed: false });
    });
  });
}

// Run seeding sequentially
(async function seed() {
  try {
    console.log('🔁 Starting seed...');

    for (const u of users) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve, reject) => {
        userExists(u.email, (err, exists) => {
          if (err) return reject(err);
          if (exists) {
            console.log(`⚠️ User already exists: ${u.email}`);
            return resolve();
          }
          insertUser(u, (err, info) => {
            if (err) return reject(err);
            console.log(`✅ Inserted user ${u.email} (id: ${info.id})`);
            resolve();
          });
        });
      });
    }

    // Insert store
    await new Promise((resolve, reject) => {
      insertStore(store, (err, info) => {
        if (err) return reject(err);
        if (info.existed) console.log(`⚠️ Store already exists: ${store.email}`);
        else console.log(`✅ Inserted store ${store.email} (id: ${info.id})`);
        resolve();
      });
    });

    console.log(' Seed completed.');
    process.exit(0);
  } catch (err) {
    console.error(' Seed failed:', err);
    process.exit(1);
  }
})();
