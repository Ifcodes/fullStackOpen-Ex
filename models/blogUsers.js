const mongoose = require('mongoose')
const mongooseValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'name must be 3 characters and above'],
    required: true,
  },
  username: {
    type: String,
    minLength: [3, 'username must be 3 characters and above'],
    unique: true,
    required: true
  },
  passwordHash: {
    type: String,
    minLength: [3, 'Password must be 3 characters and above']
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.plugin(mongooseValidator)

userSchema.set('toJSON',{
  transform: (document, returnedObj) =>{
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj._v
    delete returnedObj.passwordHash
  }
})

const BlogUser = mongoose.model('User', userSchema)

module.exports = BlogUser