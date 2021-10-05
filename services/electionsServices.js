const { client, databaseName } = require('./databaseServices');

const electionsCollection = client.db(databaseName).collection('elections');

// Get all elections
exports.getAll = async (res) => {
  try {
    const result = await electionsCollection.find().sort({ date: -1 }).toArray();
    res.json(result);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};

// Get all running elections
exports.getAllRunning = async (res) => {
  try {
    const result = await electionsCollection
      .aggregate([
        {
          $match: {
            status: 1,
          },
        },
        {
          $lookup: {
            from: 'candidates',
            localField: '_id',
            foreignField: 'election',
            as: 'candidates',
          },
        },
        {
          $lookup: {
            from: 'votes',
            localField: '_id',
            foreignField: 'election',
            as: 'votes',
          },
        },
      ])
      .sort({ date: -1 })
      .toArray();
    res.json(result);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};

// Get all elections results
exports.getAllResults = async (res) => {
  try {
    const result = await electionsCollection
      .aggregate([
        {
          $lookup: {
            from: 'candidates',
            localField: '_id',
            foreignField: 'election',
            as: 'candidates',
          },
        },
        {
          $lookup: {
            from: 'votes',
            localField: '_id',
            foreignField: 'election',
            as: 'votes',
          },
        },
      ])
      .sort({ date: -1 })
      .toArray();
    res.json(result);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};

// Create one election
exports.createOne = async (body, res) => {
  try {
    const result = await electionsCollection.insertOne({
      ...body,
      createdAt: new Date(),
    });
    res.json(result);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};

// Get one election
exports.getOne = async (id, res) => {
  try {
    const result = await electionsCollection.findOne({ _id: id });
    res.json(result);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};

// Update one election
exports.updateOne = async (id, body, res) => {
  try {
    const result = await electionsCollection.updateOne({ _id: id }, { $set: body });
    res.json(result);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};

// Delete one election
exports.deleteOne = async (id, res) => {
  try {
    const result = await electionsCollection.deleteOne({ _id: id });
    res.json(result);
  } catch (ex) {
    return res.status(500).json({ error: ex.message });
  }
};

// Delete all elections
exports.deleteAll = async (res) => {
  try {
    const result = await electionsCollection.deleteMany();
    res.json(result);
  } catch (ex) {
    return res.status(500).json({ error: ex.message });
  }
};
