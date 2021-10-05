const { ObjectId } = require('mongodb');
const { client, databaseName } = require('./databaseServices');

const candidatesCollection = client.db(databaseName).collection('candidates');

// Get all candidates
exports.getAll = async (res) => {
  try {
    const result = await candidatesCollection
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
          $project: {
            firstName: 1,
            lastName: 1,
            party: 1,
            election: { $arrayElemAt: ['$election', 0] },
            createdAt: 1,
          },
        },
      ])
      .toArray();
    res.json(result);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};

// Create one candidate
exports.createOne = async (body, res) => {
  try {
    const result = await candidatesCollection.insertOne({
      ...body,
      election: ObjectId(body.election),
      createdAt: new Date(),
    });
    res.json(result);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};

// Get one candidate
exports.getOne = async (id, res) => {
  try {
    const result = await candidatesCollection.findOne({ _id: id });
    res.json(result);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};

// Update one candidate
exports.updateOne = async (id, body, res) => {
  try {
    const result = await candidatesCollection.updateOne(
      { _id: id },
      {
        $set: {
          ...body,
          election: ObjectId(body.election),
        },
      },
    );
    res.json(result);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};

// Delete one candidate
exports.deleteOne = async (id, res) => {
  try {
    const result = await candidatesCollection.deleteOne({ _id: id });
    res.json(result);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};

// Delete all candidates
exports.deleteAll = async (res) => {
  try {
    const result = await candidatesCollection.deleteMany();
    res.json(result);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};
