const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => blog.likes + sum, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((fav, blog) => (blog.likes > fav.likes ? blog : fav), blogs[0])
}

const mostBlogs = (blogs) => {
  let result = []
  for (let i = 0; i < blogs.length; i++) {
    if (result.find(b => b.author === blogs[i].author)) {
      result.find(b => b.author === blogs[i].author).blogs += 1
    } else {
      result.push({ author: blogs[i].author, blogs: 1 });

    }
  }
  return result.length > 0 ? result.reduce((max, blog) => blog.blogs > max.blogs ? blogs : max) : undefined
}

const mostLikes = (blogs) => {
  let result = []
  for (let i = 0; i < blogs.length; i++) {
    if (result.find(b => b.author === blogs[i].author)) {
      result.find(b => b.author === blogs[i].author).likes += blogs[i].likes
    } else {
      result.push({ author: blogs[i].author, likes: blogs[i].likes });

    }
  }
  return result.length > 0 ? result.reduce((max, blog) => blog.likes > max.likes ? blog : max) : undefined
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}

