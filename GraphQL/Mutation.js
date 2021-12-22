const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  AuthenticationError,
  ForbiddenError
} = require('apollo-server-express');
require('dotenv').config();
const gravatar = require('../util/gravatar');

module.exports = {
  newNote: async (parent, args, { Models, user }) => {
    if (!user) throw new AuthenticationError('Sign In Required!');
    let noteValue = {
      content: args.content,
      author: mongoose.Types.ObjectId(user.id)
    };
    return await Models.Note.create(noteValue);
  },
  updateNote: async (parent, args, { Models, user }) => {
    if (!user) throw new AuthenticationError('Sign In Required!');
    let note = await Models.Note.findById(args.id);
    if (!note || note.author != user.id)
      throw new ForbiddenError('Note not found/Permission Denied!');
    note.content = args.content;
    await note.save();
    return note;
  },
  deleteNote: async (parent, args, { Models, user }) => {
    try {
      if (!user) throw new AuthenticationError('Sign In Required!');
      let note = await Models.Note.findById(args.id);
      console.log(note.author,user.id)
      if (!note || note.author != user.id)
        throw new ForbiddenError('No note found/ Permission denied!');
      await Models.Note.deleteOne({ _id: args.id });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
  signUp: async (parent, { username, password, email }, { Models }) => {
    email = email.trim().toLowerCase();
    let hash_pass = await bcrypt.hash(password, 10);
    let avatar = gravatar(email);
    try {
      const user = await Models.User.create({
        username,
        email,
        avatar,
        password: hash_pass
      });
      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    } catch (err) {
      console.log('Error creating account', err);
      return err;
    }
  },
  signIn: async (parent, { username, email, password }, { Models }) => {
    email = email.trim().toLowerCase();
    let user = await Models.User.findOne({ email, username });
    if (!user) throw new AuthenticationError('Error Signing In');
    const check = await bcrypt.compare(password, user.password);
    if (!check) throw new AuthenticationError('Wrong Password');
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  },
  toggleFavorite: async (parent, args, { Models, user }) => {
    if (!user) throw new AuthenticationError('Sign In Required!');
    let note = await Models.Note.findById(args.id);
    if (note.favoritedBy.includes(user.id)) {
      note.favoriteCount--;
      note.favoritedBy.remove(user.id);
    } else {
      note.favoriteCount++;
      note.favoritedBy.push(user.id);
    }
    await note.save();
    console.log(note)
    return note;
  }
};
