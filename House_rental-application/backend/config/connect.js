const mongoose = require('mongoose');

const connectionOfDb = () => {
  const mongoURI = process.env.MONGO_URI;
  
  if (!mongoURI) {
    console.error('MONGO_URI is not defined in .env file');
    process.exit(1);
  }

  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log('Connected to MongoDB Atlas');
    })
    .catch((err) => {
      console.error(`Could not connect to MongoDB: ${err.message}`);
      process.exit(1);
    });
};

module.exports = connectionOfDb;