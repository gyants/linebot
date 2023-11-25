"use client"
import { scrapeEvilBoard } from '@/lib/actions'
import { scrapePalm } from '@/lib/scraper'
import { useState } from 'react'

const Button = () => {
  const [isLoading, setisLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const url = new URL("https://www.palm-plaza.com/cgi-bin/CCforum/board.cgi?az=list&forum=DCForumID4&archive=")

    try {
      setisLoading(true)
      
      const palm = await scrapeEvilBoard(url)
    } catch (error) {
      console.log(`An error occured: ${error}`)
    } finally {
      setisLoading(false)
  } 
  }
  return (
    <div className='my-4 w-full border-white border-2 bg-transparent text-white font-bold flex justify-center rounded-xl text-lg transition-all hover:bg-white hover:text-black'>
        <button onClick={handleSubmit} className='w-full px-4 py-2' disabled={isLoading}>Click me</button>
    </div>
  )
}

export default Button