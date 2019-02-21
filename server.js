const express = require('express');
const helmet = require('helmet');
const server = express();

const knexConfig = require('./data/dbConfig');

const db = knexConfig;

server.use(helmet());
server.use(express.json());

server.get('/', (req, res) => {
  res.send('home page');
});

server.get('/api/cohorts', async (req, res) => {
  try {
    const cohorts = await db('cohorts');
    res.status(200).json(cohorts);
  } catch (error) {
    res.status(500).json(error);
  }
});

server.get('/api/cohorts/:id', async (req, res) => {
  try {
    const cohort = await db('cohorts')
      .where({ id: req.params.id })
      .first();
    res.status(200).json(cohort);
  } catch (error) {
    res.status(500).json(error);
  }
});

server.post('/api/cohorts', async (req, res) => {
  try {
    const [id] = await db('cohorts').insert(req.body);
    const newCohort = await db('cohorts')
      .where({ id })
      .first();
    res.status(201).json(newCohort);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

server.put('/api/cohorts/:id', async (req, res) => {
  try {
    const count = await db('cohorts')
      .where({ id: req.params.id })
      .update(req.body);

    if (count) {
      const updatedCohort = await db('cohorts')
        .where({ id: req.params.id })
        .first();
      res.status(200).json(updatedCohort);
    } else {
      res.status(404).json({
        message: 'Cohort not found, make sure you have the right entry!',
      });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

server.delete('/api/cohorts/:id', async (req, res) => {
  try {
    const count = await db('cohorts')
      .where({ id: req.params.id })
      .del();
    if (count) {
      res.status(204).end();
    } else {
      res.status(404).json({
        message: 'Cohort not found, make sure you have the right entry!',
      });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Student routes
server.get('/api/cohorts/:id/students', async (req, res) => {
  try {
    const cohort = await db
      .select('cohorts.name as Cohort', 'students.name as Students')
      .from('cohorts')
      .innerJoin('students', 'cohorts.id', 'students.cohort_id')
      .where('cohorts.id', req.params.id);
    res.status(200).json(cohort);
  } catch (error) {
    res.status(500).json(error);
  }
});


module.exports = server;
