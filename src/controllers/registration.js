import bcrypt from 'bcrypt';
const saltRounds = 10;
const password = 'user-password';
const passwordHash = await bcrypt.hash(password, saltRounds);

// The hash looks like: $2b$10$N9qo8uLOickgx2ZMRZoMye...
console.log(passwordHash);
