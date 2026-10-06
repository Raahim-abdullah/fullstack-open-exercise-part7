import { create } from "zustand"


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

export const useNotification = () => useNotificationStore(state => state.notification)
export const useNotificationAction = () => useNotificationStore(state => state.actions)
