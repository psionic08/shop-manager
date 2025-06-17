import { useRef, useState } from "react"

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

  function filter(itemList) {
    if (query === "") return itemList
    return itemList.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    )
  }

  function handleItemClick(item) {
    setQuery(item.name)
    stateSetter(item)
    setIsOpen(false)
  }

  const handleClick = (e) => {
    const wasFocused = document.activeElement === e.currentTarget

    // If already focused, toggle; else just open
    if (wasFocused) {
      setIsOpen((prev) => !prev)
    } else {
      setIsOpen(true)
    }
  }
  return (
    <div className={containerClassName}>
      <input
        className={inputClassName}
        ref={inputRef}
        type="text"
        value={query}
        placeholder={isOpen ? "" : "Search..."}
        onFocus={() => {
          // don't setIsOpen here
        }}
        onChange={(e) => {
          setQuery(e.target.value)
        }}
        onClick={handleClick}
      />
      {isOpen && (
        <div className={menuClassName}>
          {filter(itemList).map((item, idx) => (
            <div
              key={idx}
              className={optionClassName}
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
