export default {
  secret: process.env.PRIVATE_KEY || 'SECRET',
  signOptions: {
    expiresIn: '24h',
  },
};
