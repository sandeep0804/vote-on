const { client, databaseName } = require('./databaseServices');

const votersCollection = client.db(databaseName).collection('voters');

// Get all voters
exports.getAll = async (res) => {
  try {
    const result = await votersCollection.find().sort({ firstName: 1 }).toArray();
    res.json(result);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};

// Create one voter
exports.createOne = async (body, res) => {
  try {
    const result = await votersCollection.insertOne({
      ...body,
      status: 0,
      createdAt: new Date(),
    });
    res.json(result);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};

// Get one voter
exports.getOne = async (id, res) => {
  try {
    const result = await votersCollection.findOne({ _id: id });
    res.json(result);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};

// Update one voter
exports.updateOne = async (id, body, res) => {
  try {
    const result = await votersCollection.updateOne({ _id: id }, { $set: body });
    res.json(result);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};

// Delete one voter
exports.deleteOne = async (id, res) => {
  try {
    const result = await votersCollection.deleteOne({ _id: id });
    res.json(result);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};

// Delete all voters
exports.deleteAll = async (res) => {
  try {
    const result = await votersCollection.deleteMany();
    res.json(result);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};

// Login
exports.login = async (body, res) => {
  try {
    const result = await votersCollection.findOne({
      studentId: body.studentId,
      password: body.password,
    });
    if (!result) {
      return res.status(401).json({ error: 'Incorrect credentials' });
    }
    if (result.status === -1) {
      return res.status(403).json({ error: 'You have been rejected' });
    }
    if (result.status === 0) {
      return res.status(403).json({ error: 'Your approval is pending' });
    }
    res.json(result);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};
