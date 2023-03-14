import React, { useEffect, useRef, useState } from "react";
import reactLogo from './assets/react.svg'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './App.css'
import axios from "axios";

const App = () => {

  const textarea = useRef(null)

  const [text, setText] = useState("")

  const [fetchedMarkDown, setfetchedMarkDown] = useState("")

  useEffect(() => {
    (async () => {
      try {

        const response = await fetch("http://localhost:5000/news/1")
        const data = await response.json()

        console.log(data)
        setfetchedMarkDown(data.content)

      } catch (error) {
        console.log(error)
      }
    })()
  }, [])


  const [selected, setSelected] = useState({
    text: "",
    start: 0,
    end: 0,
  })

  const markdownButtons = [
    {
      name: "bold",
      label: "B",
      left: "**", right: "**",
    },
    {
      name: "italic",
      label: "I",
      left: "_", right: "_",
    },


    {
      name: "quote",
      label: "quote",
      left: "> ", right: "",
    },
    {
      name: "list",
      label: "*",
      left: "- ", right: "\n",
    },
    {
      name: "orderedList",
      label: "1.",
      left: "1. ", right: "\n",
    },

    {
      name: "code",
      label: "</>",
      left: "```", right: "```",
    },
    {
      name: "link",
      label: "link",
      left: "[", right: "](url)",
    },
    {
      name: "image",
      label: "IMG",
      left: "![", right: "](url)",
    },
  ]

  const handleSelect = ({ target }) => {
    const text = textarea.current.value

    const start = target.selectionStart
    const end = target.selectionEnd

    setSelected({ text: text.substring(start, end), start, end })
  }

  const handleClick = ({ target }) => {
    const syntax = markdownButtons.find((item) => item.name === target.name)

    const modifiedSelected = `${syntax.left}${selected.text}${syntax.right}`

    const startCut = text.substring(0, selected.start)
    const endCut = text.substring(selected.end)

    const modifiedText = startCut + modifiedSelected + endCut

    setText(modifiedText)
    textarea.current.value = modifiedText;
  }

  const handleChange = ({ target }) => {
    setText(target.value)
  }

  return (
    <div className="App">
      <div className="editor">
        <header>
          {
            markdownButtons.map(({ name, label }, i) =>
              <button key={i} name={name} onClick={handleClick}>
                {label}
              </button>
            )
          }
        </header>
        
        <div className="box">
          <textarea
            ref={textarea}
            onChange={handleChange}
            onSelect={handleSelect}
          ></textarea>
          
          <div className="post" style={{ padding: "20px" }}>
            <ReactMarkdown linkTarget="_blank" children={text} remarkPlugins={[remarkGfm]} />
          </div>
        </div>
      </div>
      
      <ReactMarkdown linkTarget="_blank" children={fetchedMarkDown} remarkPlugins={[remarkGfm]} />
    </div>
  )
}

export default App
