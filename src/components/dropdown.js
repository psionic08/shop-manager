import { useRef, useState } from "react"

export default function Dropdown({ itemList, containerClassName, menuClassName, inputClassName, optionClassName, stateSetter, query, setQuery}) {
    const inputRef = useRef(null)
    const [isOpen, setIsOpen] = useState(false)

    function filter(itemList){
        if(query=="")return itemList
        return itemList.filter((item)=>{
            return item.name.toLowerCase().includes(query.toLowerCase())
        })
    }
    function handleItemClick(item){
        setQuery(item.name)
        stateSetter(item)
        setIsOpen(false)
    }
    return (
        <div className={containerClassName}>
            <input
                className={inputClassName}
                id="inputfeild"
                ref={inputRef}
                type="text"
                value={query}
                placeholder={isOpen ? "" : "Search..."}
                onChange={(e) => { setQuery(e.target.value) }}
                onClick={() => setIsOpen((isOpen) => !isOpen)}
            />
            {isOpen ? (
                <div className={menuClassName}>
                    {filter(itemList).map((item, idx) => {
                        return (
                            <div key={idx} className={optionClassName} onClick={()=>handleItemClick(item)}>
                                {item.name}
                            </div>
                        )
                    })}
                </div>
            ) : (<></>)}
        </div>
    )
}