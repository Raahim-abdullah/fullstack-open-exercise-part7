const { test, describe } = require("node:test")
const assert = require("node:assert")

const listHelper = require("../utils/list_helper")

describe("favorite blog", () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]
  const listWithManyBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f3',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 10,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d1743',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 15,
      __v: 0
    }

  ]

  test("of empty return undefined", () => {
    assert.deepStrictEqual(listHelper.favoriteBlog([]), undefined)
  })
  test("of one return itself", () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(listWithOneBlog), listWithOneBlog[0])
  })
  test("of many return highest likes", () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(listWithManyBlog),
      {
        _id: '5a422aa71b54a676234d1743',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 15,
        __v: 0
      })
  })


})
