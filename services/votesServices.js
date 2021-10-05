const { ObjectId } = require('mongodb');
const { client, databaseName } = require('./databaseServices');

const votesCollection = client.db(databaseName).collection('votes');

// Get all votes
exports.getAll = async (res) => {
  try {
    const result = await votesCollection
      .aggregate([
        {
          $lookup: {
            from: 'elections',
            localField: 'election',
            foreignField: '_id',
            as: 'election',
          },
        },
        {
          $lookup: {
            from: 'candidates',
            localField: 'candidate',
            foreignField: '_id',
            as: 'candidate',
          },
        },
        {
          $lookup: {
            from: 'voters',
            localField: 'voter',
            foreignField: '_id',
            as: 'voter',
          },
        },
        {
          $project: {
            election: { $arrayElemAt: ['$election', 0] },
            candidate: { $arrayElemAt: ['$candidate', 0] },
            voter: { $arrayElemAt: ['$voter', 0] },
            createdAt: 1,
          },
        },
      ])
      .sort({ createdAt: -1 })
      .toArray();
    res.json(result);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};

// Create one vote
exports.createOne = async (body, res) => {
  try {
    const result = await votesCollection.insertOne({
      election: ObjectId(body.election),
      candidate: ObjectId(body.candidate),
      voter: ObjectId(body.voter),
      createdAt: new Date(),
    });
    res.json(result);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};

// Get one vote
exports.getOne = async (id, res) => {
  try {
    const result = await votesCollection.findOne({ _id: id });
    res.json(result);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};

// Update one vote
exports.updateOne = async (id, body, res) => {
  try {
    const result = await votesCollection.updateOne({ _id: id }, { $set: body });
    res.json(result);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};

// Delete one vote
exports.deleteOne = async (id, res) => {
  try {
    const result = await votesCollection.deleteOne({ _id: id });
    res.json(result);
  } catch (ex) {
    return res.status(500).json({ error: ex.message });
  }
};

// Delete all votes
exports.deleteAll = async (res) => {
  try {
    const result = await votesCollection.deleteMany();
    res.json(result);
  } catch (ex) {
    return res.status(500).json({ error: ex.message });
  }
};
