const { test, describe } = require("node:test")
const assert = require("node:assert")

const listHelper = require("../utils/list_helper")
describe("most likes", () => {
  const oneAuthorWithOneBlog = [
    {
      _id: '5b123aa71b54a676234d17a1',
      title: 'Understanding JavaScript Closures',
      author: 'Kyle Simpson',
      url: 'https://medium.com/javascript-closures',
      likes: 8,
      __v: 0

    }
  ]
  const authorWithOneBlog = [
    {
      _id: '5b123aa71b54a676234d17a1',
      title: 'Understanding JavaScript Closures',
      author: 'Kyle Simpson',
      url: 'https://medium.com/javascript-closures',
      likes: 8,
      __v: 0
    },
    {
      _id: '5b123aa71b54a676234d17a2',
      title: 'A Guide to Node.js Event Loop',
      author: 'Anna Henningsen',
      url: 'https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/',
      likes: 12,
      __v: 0
    },
    {
      _id: '5b123aa71b54a676234d17a3',
      title: 'Mastering React Hooks',
      author: 'Dan Abramov',
      url: 'https://overreacted.io/a-complete-guide-to-useeffect/',
      likes: 20,
      __v: 0
    },
    {
      _id: '5b123aa71b54a676234d17a4',
      title: 'Functional Programming in JS',
      author: 'Eric Elliott',
      url: 'https://medium.com/functional-programming-in-js',
      likes: 7,
      __v: 0
    },
    {
      _id: '5b123aa71b54a676234d17a5',
      title: 'Async Await in Depth',
      author: 'Jake Archibald',
      url: 'https://jakearchibald.com/async-await/',
      likes: 14,
      __v: 0
    }
  ]

  const authorWithManyBlogs = [
    {
      _id: '5c123aa71b54a676234d17b1',
      title: 'Understanding JavaScript Closures',
      author: 'Kyle Simpson',
      url: 'https://medium.com/javascript-closures',
      likes: 8,
      __v: 0
    },
    {
      _id: '5c123aa71b54a676234d17b1',
      title: 'Understanding JavaScript Closures',
      author: 'Kyle Simpson',
      url: 'https://medium.com/javascript-closures',
      likes: 8,
      __v: 0
    },
    {
      _id: '5c123aa71b54a676234d17b2',
      title: 'You Don\'t Know JS: Scope & Closures',
      author: 'Kyle Simpson',
      url: 'https://github.com/getify/You-Dont-Know-JS',
      likes: 15,
      __v: 0
    },
    {
      _id: '5c123aa71b54a676234d17b3',
      title: 'A Guide to Node.js Event Loop',
      author: 'Anna Henningsen',
      url: 'https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/',
      likes: 12,
      __v: 0
    },
    {
      _id: '5c123aa71b54a676234d17b4',
      title: 'Mastering React Hooks',
      author: 'Dan Abramov',
      url: 'https://overreacted.io/a-complete-guide-to-useeffect/',
      likes: 20,
      __v: 0
    },
    {
      _id: '5c123aa71b54a676234d17b5',
      title: 'React Hot Loader',
      author: 'Dan Abramov',
      url: 'https://gaearon.github.io/react-hot-loader/',
      likes: 9,
      __v: 0
    }
  ]

  test("of empty return undefined", () => {
    assert.deepStrictEqual(listHelper.mostLikes([]), undefined)
  })

  test("of one return itself", () => {
    assert.deepStrictEqual(listHelper.mostLikes(oneAuthorWithOneBlog), { author: 'Kyle Simpson', likes: 8 })
  })

  test("of many return author with most blogs", () => {
    assert.deepStrictEqual(listHelper.mostLikes(authorWithOneBlog), { author: 'Dan Abramov', likes: 20 })
  })
  test("of many return author with most blogs", () => {
    assert.deepStrictEqual(listHelper.mostLikes(authorWithManyBlogs), { author: 'Kyle Simpson', likes: 31 })
  })
})
