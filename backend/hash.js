// hash-password.js
// Run: node hash-password.js

const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log('Original Password:', password);
    console.log('Hashed Password:', hashedPassword);
  } catch (err) {
    console.error('Error hashing password:', err);
  }
}

// Change this password
hashPassword('12345');

// abhi persist cheez check karni hai , appointments check karni , doctor banane ki button banani hai  