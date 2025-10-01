const bcrypt = require('bcryptjs');

const password = 'admin123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) {
    console.error('Error:', err);
    return;
  }
  
  console.log('\n=================================');
  console.log('Password Hash Generated');
  console.log('=================================');
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\n=================================');
  console.log('SQL para actualizar en Supabase:');
  console.log('=================================\n');
  console.log(`UPDATE users 
SET password_hash = '${hash}'
WHERE email = 'admin@edmcomunicaciones.com';\n`);
  console.log('=================================\n');
});
