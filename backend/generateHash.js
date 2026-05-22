const bcrypt = require('bcrypt');

const passwordToHash = "Anmol@9479"; // Put your password inside the quotes
const saltRounds = 10;

bcrypt.hash(passwordToHash, saltRounds).then((hash) => {
  console.log("\n--- COPY THIS HASH ---");
  console.log(hash);
  console.log("----------------------\n");
});