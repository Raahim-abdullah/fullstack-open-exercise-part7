import { create } from "zustand"

import blogService from "./services/blogs"

const useBlogStore = create((set) => ({
  blogs: [],
  actions: {
    initialize: async () => {
      const blogs = await blogService.getAll()
      set({ blogs })
    },
    create: async (newBlog) => {
      try {
        const returnedBlog = await blogService.create(newBlog)
        useNotificationStore.getState().actions.setNotification(
          `a new blog ${returnedBlog.title} by ${returnedBlog.author} added.`,
          "success"
        )
        set((state) => ({ blogs: state.blogs.concat(returnedBlog) }))
      } catch (error) {
        useNotificationStore.getState().actions.setNotification(
          error.response.data.error,
          "error"
        )
      }
    },
    like: async (newBlog) => {
      try {
        const updatedBlog = await blogService.update(newBlog)
        set((state) => ({ blogs: state.blogs.map(blog => blog.id === updatedBlog.id ? { ...blog, likes: updatedBlog.likes } : blog) }))
      } catch (error) {
        useNotificationStore.getState().actions.setNotification(
          error.response.data.error,
          "error"
        )
      }
    },
    remove: async (blog) => {
      try {
        await blogService.deleteBlog(blog)
        set((state) => ({ blogs: state.blogs.filter(b => b.id !== blog.id) }))
        useNotificationStore.getState().actions.setNotification(
          `you have deleted ${blog.title} by ${blog.author}.`,
          "success"
        )
      } catch (error) {
        useNotificationStore.getState().actions.setNotification(
          error.response.data.error,
          "error"
        )
      }
    }
  }
}))

const useNotificationStore = create((set) => ({
  notification: {
    message: null,
    type: "",
  },
  actions: {
    setNotification: (message, type) => {
      set({ notification: { message, type } })

      setTimeout(() => {
        set({ notification: { message: null, type: null } })
      }, 3000)
    }
  }
})
)

export const useBlogs = () => useBlogStore(state => state.blogs)
export const useBlogsAction = () => useBlogStore(state => state.actions)

export const useNotification = () => useNotificationStore(state => state.notification)
export const useNotificationAction = () => useNotificationStore(state => state.actions)
