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
  url: {
    type: String, // Assuming the URL is a string
    required: true, // Adjust this as per your requirements
  },
});

// Create the Mongoose model
const Topic = mongoose.models.Topic || mongoose.model('Topic', topicSchema);

// Export the model
export default Topic;
