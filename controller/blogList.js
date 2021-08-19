const blogRouter = require('express').Router()
const Blog = require('../models/blogModel')
const User = require('../models/blogUsers')
const logger = require('../utils/logger')

blogRouter.get('/', async (request, response, next) =>{
  const blogs = await Blog.find({}).populate('user')

  try {
    response.json(blogs)
  } catch (exception) {
    next(exception)
  }
})

blogRouter.post('/', async (request, response, next) => {
  const body = request.body

  logger.info(body)

  try {
  const user = await User.findById(body.userId)
    logger.info({user})

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.userId
  })
  
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(savedBlog)
  } catch (exception) {
    next(exception)
    // console.log({exception})
  }
})
blogRouter.put('/:id', async (req, res, next) => {
  const blogId = req.params.id
  
  const updatedBlog = await Blog.findByIdAndUpdate(blogId, req.body, { new: true})

  res.status(200).json(updatedBlog)
})
blogRouter.delete('/:id', async (req, res, next) => {
  await Blog.findByIdAndRemove(req.params.id)
  res.status(204).end()
})
module.exports = blogRouter