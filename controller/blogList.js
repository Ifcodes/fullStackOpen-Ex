const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blogModel')
const User = require('../models/blogUsers')
const logger = require('../utils/logger')
const { tokenExtractor } = require('../utils/middleware')


blogRouter.get('/', async (request, response, next) =>{

  try {
    const blogs = await Blog.find({})
    
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    logger.info({decodedToken})

    const filteredBlog = blogs.filter(blog => blog.user !== undefined)

    const newBlog = filteredBlog.filter(blog => blog.user.toString() === decodedToken.id)

    const blogsToDisplay = newBlog.map(blog => {
        return blog.toJSON()
    })

    response.json(blogsToDisplay)
  } catch (exception) {
    next(exception)
  }
})

blogRouter.post('/', async (request, response, next) => {
  const body = request.body

  if(!request.token){
    return response.status(401).json({error: 'Authentication required'})
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id){
    return response.status(401).json({error: 'Authentication failed'})
  }
  const user = await User.findById(decodedToken.id)

    logger.info({user})

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
    user: user._id
  })

  try {
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(savedBlog)
  } catch (exception) {
    // next(exception)
    console.log({exception})
  }
})
blogRouter.put('/:id', async (req, res, next) => {
  const blogId = req.params.id
  
  const updatedBlog = await Blog.findByIdAndUpdate(blogId, req.body, { new: true})

  res.status(200).json(updatedBlog)
})

blogRouter.delete('/:id', async (req, res, next) => {

  if(!req.token){
    return res.status(401).json({error: 'Authentication required'})
  }

  const blog = await Blog.findById(req.params.id)

  logger.info({blogo: blog })

  const decodedToken = jwt.verify(req.token, process.env.SECRET)

  // logger.info({blogUser: blog.user, decoded: decodedToken})

  if(blog.user.toString() !== decodedToken.id){
    return res.status(401).json({error: 'Authentication failed!'})
  }
  

  blog.remove()
  // await Blog.findByIdAndRemove(req.params.id)
  res.status(204).end()
})
module.exports = blogRouter
