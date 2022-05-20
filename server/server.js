require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

const app = express();
app.use(cors());

const uri = `mongodb+srv://richard:${process.env.DB_PASSWORD}@cluster0.y4xwj.mongodb.net/pers?retryWrites=true&w=majority`;
mongoose.connect(uri);
mongoose.connection.once('open', () => {
  console.log('connected to database');
});

app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
