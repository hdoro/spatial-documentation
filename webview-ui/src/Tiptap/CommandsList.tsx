import { SuggestionProps } from '@tiptap/suggestion'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { COMMANDS } from './SlashCommands'

export const CommandsList = forwardRef(
  (props: SuggestionProps<typeof COMMANDS[0]>, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)
    console.log({ props })

    const selectItem = (index: number) => {
      const item = props.items[index]

      if (item) {
        // @TODO figure out what's up with this props.command
        props.command(item)
      }
    }

    const upHandler = () => {
      setSelectedIndex(
        (selectedIndex + props.items.length - 1) % props.items.length,
      )
    }

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % props.items.length)
    }

    const enterHandler = () => {
      selectItem(selectedIndex)
    }

    useEffect(() => setSelectedIndex(0), [props.items])

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === 'ArrowUp') {
          upHandler()
          return true
        }

        if (event.key === 'ArrowDown') {
          downHandler()
          return true
        }

        if (event.key === 'Enter') {
          enterHandler()
          return true
        }

        return false
      },
    }))

    return (
      <div className="overflow-hidden relative p-1 rounded-md bg-white text-gray-600 text-sm shadow-sm">
        {props.items.length ? (
          props.items.map((item, index) => (
            <button
              className={`block w-full text-left rounded-md border py-1 px-2 leading-none ${
                index === selectedIndex
                  ? 'border-gray-300 bg-gray-50'
                  : 'border-transparent'
              } ${item.isActive(props.editor) ? 'font-bold' : ''}`}
              key={index}
              onClick={() => selectItem(index)}
            >
              {item.title}
            </button>
          ))
        ) : (
          <div className="block w-full text-left rounded-md border py-1 px-2 leading-none font-medium">
            No result
          </div>
        )}
      </div>
    )
  },
)
