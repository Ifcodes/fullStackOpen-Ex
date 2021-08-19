const bcrypt = require('bcryptjs')
const BlogUser = require('../models/blogUsers')
const userRouter = require('express').Router()
// const blogRouter = require('./blogList')

userRouter.post('/', async (request, response, next) => {
  const body = request.body

  if(body.password.length < 3 || body.username.length < 3){
    return response.status(400).send({error: "Username and Password must be more than 3 characters long"})
  }

  const saltround = 10
    const passwordHash = await bcrypt.hashSync(body.password, saltround)

    const user = new BlogUser({
      name: body.name,
      username: body.username,
      passwordHash
  })

    const savedUser = await user.save()

    response.json(savedUser)

})

userRouter.get('/', async (request, response, next) => {
  const user = await BlogUser.find({}).populate('blogs', {title: 1, author: 1, likes: 1})

  try {
    response.json(user)
  } catch (exception) {
    next(exception)
  }
})

module.exports = userRouter