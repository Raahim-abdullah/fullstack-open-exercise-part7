import { useState, useEffect } from 'react'
import anecdoteService from '../services/anecdotes'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => setValue("")

  return {
    inputprops: {
      type,
      value,
      onChange
    },
    reset
  }
}

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then(data => setAnecdotes(data))
  }, [])

  const addAnecdote = async (newAnecdote) => {
    const reutrnedAnecdote = await anecdoteService.createNew(newAnecdote)
    setAnecdotes(anecdotes.concat(reutrnedAnecdote))
  }

  const deleteAnecdote = async (id) => {
    const deletedAnecdote = await anecdoteService.remove(id)
    setAnecdotes(anecdotes.filter(a => a.id === deletedAnecdote.id ? null : a))
  }

  return {
    anecdotes,
    addAnecdote,
    deleteAnecdote,
  }
}
