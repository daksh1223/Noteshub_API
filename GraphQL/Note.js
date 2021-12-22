module.exports = {
  author: async (note, args, { Models, User }) => {
    return await Models.User.findById(note.author);
  },
  favoritedBy: async (note, args, { Models, User }) => {
    return await Models.User.find({ _id: { $in: note.favoritedBy } });
  }
};
