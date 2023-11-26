// Import necessary modules
import mongoose from 'mongoose';

// Define the schema for the model
const topicSchema = new mongoose.Schema({
  topicName: {
    type: String,
    required: true,
  },
  replyCount: {
    type: Number,
    required: true,
  },
});

// Create the Mongoose model
const Topic = mongoose.models.Topic || mongoose.model('Topic', topicSchema);

// Export the model
export default Topic;
