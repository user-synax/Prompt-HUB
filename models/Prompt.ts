import mongoose from 'mongoose';

const promptSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    }, // Encrypted
    category: {
      type: String,
      default: 'General',
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    isFavorite: {
      type: Boolean,
      default: false,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

export default mongoose.models.Prompt || mongoose.model('Prompt', promptSchema);
