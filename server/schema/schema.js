const graphql = require('graphql');
const _ = require('lodash');
const Account = require('../models/account');
const Transaction = require('../models/transaction');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const TransactionType = new GraphQLObjectType({
  name: 'Transaction',
  fields: () => ({
    id: { type: GraphQLID },
    description: { type: GraphQLString },
    amount: { type: GraphQLInt },
    type: { type: GraphQLString },
    recurrence: { type: GraphQLString },
    startDate: { type: GraphQLString },
    account: {
      type: AccountType,
      resolve(parent, args) {
        return Account.findById(parent.accountId);
      }
    }
  })
});

const AccountType = new GraphQLObjectType({
  name: 'Account',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    transactions: {
      type: new GraphQLList(TransactionType),
      resolve(parent, args) {
        return Transaction.find({ accountId: parent.id });
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    transaction: {
      type: TransactionType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Transaction.findById(args.id);
      }
    },
    account: {
      type: AccountType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Account.findById(args.id);
      }
    },
    transactions: {
      type: new GraphQLList(TransactionType),
      resolve(parent, args) {
        return Transaction.find({});
      }
    },
    accounts: {
      type: new GraphQLList(AccountType),
      resolve(parent, args) {
        return Account.find({});
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAccount: {
      type: AccountType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        let account = new Account({
          name: args.name
        });

        return account.save();
      }
    },
    addTransaction: {
      type: TransactionType,
      args: {
        description: { type: new GraphQLNonNull(GraphQLString) },
        amount: { type: new GraphQLNonNull(GraphQLInt) },
        type: { type: new GraphQLNonNull(GraphQLString) },
        recurrence: { type: new GraphQLNonNull(GraphQLString) },
        startDate: { type: new GraphQLNonNull(GraphQLString) },
        accountId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        let transaction = new Transaction({
          description: args.description,
          amount: args.amount,
          type: args.type,
          recurrence: args.recurrence,
          startDate: args.startDate,
          accountId: args.accountId
        });

        return transaction.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
