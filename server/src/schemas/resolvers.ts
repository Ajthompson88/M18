import User from "../models/User.js"
import { signToken } from "../services/auth.js";

const resolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      if (context.user) {
        const user = await User.findById(context.user._id);
        return user;
      }
      throw new Error("Unauthorized");
    },
  },
  Mutation: {
    addUser : async (_: any, args : any) => {
      const user = await User.create(args);
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
  },

    login: async (_: any, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Incorrect credentials");
      }
      const correctPw = await user.isCorrectPassword(password); 
      if (!correctPw) {
        throw new Error("Incorrect credentials");
      }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
  },
  saveBook: async (_: any,  args : any, context: any) => {
    console.log(context)
    if (context.user) {
      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: args } },
        { new: true, runValidators: true }
      );
      return updatedUser;
    }
    throw new Error("Unauthorized");
  },
  removeBook: async (_: any, { bookId }: { bookId: string }, context: any) => {
    if (context.user) {
      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
      return updatedUser;
    }
    throw new Error("Unauthorized");
  },
}
}

export default resolvers