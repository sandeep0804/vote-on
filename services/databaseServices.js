const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb+srv://sit725-2021:sandy123@sit725-2021-t2-prac4.4epn1.mongodb.net/sit725-2021-t2-prac4?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  if (err) throw err;
  console.log('Database connected');
});

module.exports = {
  client: client,
  databaseName: 'deakin-evoting',
};
