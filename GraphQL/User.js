module.exports = {
  Notes: async (User, args, { Models }) => {
    return await Models.Note.find({ author: User._id });
  },
  favorites: async (User, args, { Models }) => {
    return await Models.Note.find({
      favoritedBy: User._id
    });
  }
};
