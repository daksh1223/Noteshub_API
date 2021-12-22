module.exports = {
  hello: () => 'Hello world!',
  notes: async (parent, args, { Models }) => await Models.Note.find(),
  note: async (parent, args, { Models }) => {
    return await Models.Note.findById(args.id);
  },
  user: async (parent, args, { Models }) => {
    return await Models.User.findOne({ username: args.username });
  },
  users: async (parent, args, { Models }) => {
    return await Models.User.find();
  },
  me: async (parent, args, { Models, user }) => {
    return await Models.User.findById(user.id);
  },
  noteFeed: async (parent, { cursor }, { Models }) => {
    const limit = 5;
    let hasNextPage = false;
    let db_query = {};
    if (cursor) db_query = { _id: { $lt: cursor } };
    let notes = await Models.Note.find(db_query)
      .sort({ _id: -1 })
      .limit(limit + 1);
    if (notes.length > limit) {
      hasNextPage = true;
      notes = notes.slice(0, -1);
      cursor = notes[notes.length - 1]._id;
    }
    return {
      cursor,
      notes,
      hasNextPage
    };
  }
};
