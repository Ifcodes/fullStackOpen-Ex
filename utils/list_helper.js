const dummy = (arr) =>{
  return 1
}

const totalLikes = (blogs) =>{
  const likes = blogs.map(blog => blog.likes)

  return likes.length === 0 ? 0 : likes.reduce((acc, sum) => acc + sum, 0)
}

const favoriteBlog = (blogs) => {
  const mostLikes = Math.max(...blogs.map(blog => blog.likes))
  
  return blogs.map((blog, index) => {
    return blog.likes === mostLikes && blog
  })
}

module.exports ={
  dummy, totalLikes, favoriteBlog
}