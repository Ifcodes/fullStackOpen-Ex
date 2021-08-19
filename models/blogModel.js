const mongoose = require('mongoose')
const mongooseValidator = require('mongoose-unique-validator')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: [3, 'must be more than 3 letters'],
    required: true,
    unique: true
  },
  author: {
    type: String,
    minLength: [3, 'must be more than 3 letters'],
    required: true,
    unique: true
  },
  url: {
    type: String,
    minLength: [3, 'must be more than 3 letters'],
    required: true,
  },
  likes: {
    type: Number,
    minLength: [1, 'must be more than 3 letters'],
    required: true,
  },
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  }
  
})

blogSchema.plugin(mongooseValidator)

blogSchema.set('toJSON', {
  transform: (document, returnedObj) =>{
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj._v
  },
})

// const Blog = 

module.exports = mongoose.model('Blog', blogSchema)