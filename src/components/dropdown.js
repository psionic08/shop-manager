import { useRef, useState, useEffect } from "react"

export default function Dropdown({
  inputRef,
  itemList,
  containerClassName,
  menuClassName,
  inputClassName,
  optionClassName,
  stateSetter,
  query,
  setQuery
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef(null)
  const menuRef = useRef(null)

  const filteredItems = query === ""
    ? itemList
    : itemList.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )

  function handleItemClick(item) {
    setQuery(item.name)
    stateSetter(item)
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  const handleClick = (e) => {
    const wasFocused = document.activeElement === e.currentTarget
    if (wasFocused) {
      setIsOpen((prev) => !prev)
    } else {
      setIsOpen(true)
    }
  }

  const handleKeyDown = (e) => {
    if (!isOpen) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightedIndex((prev) =>
        prev < filteredItems.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredItems.length - 1
      )
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (highlightedIndex >= 0 && highlightedIndex < filteredItems.length) {
        handleItemClick(filteredItems[highlightedIndex])
      }
    } else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  // ⛔ Detect clicks outside dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // 🎯 Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && highlightedIndex !== -1 && menuRef.current) {
      const optionEl = menuRef.current.children[highlightedIndex]
      if (optionEl) {
        optionEl.scrollIntoView({ block: "nearest" })
      }
    }
  }, [highlightedIndex, isOpen])

  return (
    <div className={containerClassName} ref={containerRef}>
      <input
        className={inputClassName}
        ref={inputRef}
        type="text"
        value={query}
        placeholder={isOpen ? "" : "Search..."}
        onChange={(e) => {
          setQuery(e.target.value)
          setIsOpen(true)
          setHighlightedIndex(0)
        }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      />
      {isOpen && (
        <div className={menuClassName} ref={menuRef}>
          {filteredItems.map((item, idx) => (
            <div
              key={idx}
              className={`${optionClassName} ${
                idx === highlightedIndex ? "bg-gray-200" : ""
              }`}
              onClick={() => handleItemClick(item)}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
