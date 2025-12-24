import Dropdown from "@/components/dropdown"
import axios from "axios"
import { useRef, useState } from "react"

export default function AddItem({ itemList, setBillItems }) {
  const inputRef = useRef(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [quantity, setQuantity] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [query, setQuery] = useState("")
  const [mode, setMode] = useState("existing")
  const [newName, setNewName] = useState("")
  const [newRate, setNewRate] = useState(0)
  const [newUnit, setNewUnit] = useState("")
  const unitOptions = ["Mtr", "Coil", "Pcs"]
  const handleAddNewItem = async () => {
    if(newName===""||newRate===0||newUnit===""||quantity===0){
      alert("set proper details")
      return;
    }
    const res = await axios("/api/items/newitem", {
      method: "post",
      data: { name: newName, rate: newRate, unit: newUnit, quantity: 0 },
      withCredentials: true
    })
    if(res.status===200){
      setBillItems(prev => [
        ...prev,
        {
          item: res.data.item,
          qty: quantity,
          discount: discount,
        },
      ])
      setSelectedItem(null)
      setQuantity(0)
      setDiscount(0)
      setNewName("")
      setNewRate("")
      setNewUnit("")
      setQuery("")
      inputRef.current?.focus()
      setMode("existing")
    }
    else{
      alert("Item not added")
    }
  }
  const handleAddItem = () => {
    if (selectedItem && quantity > 0) {
      setBillItems(prev => [
        ...prev,
        {
          item: selectedItem,
          qty: quantity,
          discount: discount,
        },
      ])
      setSelectedItem(null)
      setQuantity(0)
      setDiscount(0)
      setQuery("")
      inputRef.current?.focus()

    }
  }
  return (
    <div className="w-full flex flex-col items-center gap-3 sm:gap-2">
      <div className="w-full max-w-2xl flex flex-col justify-center items-center gap-4">
        <div className="flex flex-col sm:flex-row justify-center items-start sm:items-center gap-2">
          <div className="text-sm font-medium">Item:</div>
          <div className="flex gap-4">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                value={mode}
                onChange={() => setMode("existing")}
                checked={mode === "existing"}
              />
              <span className="text-sm">Existing</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                value={mode}
                onChange={() => setMode("new")}
                checked={mode === "new"}
              />
              <span className="text-sm">New</span>
            </label>
          </div>
        </div>
        {mode === "existing" && (
          <div className="flex flex-col items-stretch gap-3 w-full px-2 sm:px-0">
            <Dropdown
              inputRef={inputRef}
              itemList={itemList}
              menuClassName="absolute bg-gray-50 z-10 border rounded shadow max-h-48 overflow-y-auto w-full"
              containerClassName="relative w-full"
              inputClassName="border border-gray-400 rounded-sm w-full px-3 py-2 text-sm sm:text-base"
              optionClassName="hover:bg-gray-200 px-2 py-1 text-sm"
              stateSetter={setSelectedItem}
              query={query}
              setQuery={setQuery}
            />
            {selectedItem && (
              <>
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
                  <div className="flex items-center gap-2 justify-between sm:justify-start">
                    <div className="text-sm whitespace-nowrap">{`Qty (${selectedItem.unit}):`}</div>
                    <input
                      className="border border-gray-400 rounded-sm w-20 px-2 py-1 text-sm"
                      type="number"
                      step="any"
                      value={quantity.toString()}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                  </div>

                  <div className="flex items-center gap-2 justify-between sm:justify-start">
                    <div className="text-sm">Rate:</div>
                    <input
                      className="border border-gray-400 rounded-sm w-20 px-2 py-1 text-sm"
                      type="number"
                      step="any"
                      value={selectedItem.rate.toString()}
                      onChange={(e) => {
                        setSelectedItem({ ...selectedItem, rate: Number(e.target.value) })
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-2 justify-between sm:justify-start">
                    <div className="text-sm">Discount %:</div>
                    <input
                      className="border border-gray-400 rounded-sm w-20 px-2 py-1 text-sm"
                      type="number"
                      step="any"
                      value={discount.toString()}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                    />
                  </div>

                  <button
                    className="bg-blue-600 text-white rounded-sm px-4 py-2 sm:px-3 sm:py-1 hover:bg-blue-700 text-sm"
                    onClick={handleAddItem}
                  >
                    Add Item
                  </button>
                </div>
                <div className="text-xs text-green-600">
                  Available Quantity: {selectedItem.quantity} {selectedItem.unit}
                </div>
              </>
            )}
          </div>
        )}
        {mode === "new" && (
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 mt-2 items-stretch sm:items-center w-full px-2 sm:px-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <div className="text-sm font-medium sm:font-normal">Name:</div>
              <input
                className="border border-gray-400 rounded-sm px-3 py-2 w-full sm:w-64 text-sm"
                placeholder="Item name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 justify-between sm:justify-start">
              <div className="text-sm">Rate:</div>
              <input
                className="border border-gray-400 rounded-sm px-2 py-2 w-24 sm:w-20 text-sm"
                placeholder="0"
                type="number"
                value={newRate.toString()}
                onChange={(e) => setNewRate(Number(e.target.value))}
              />
            </div>
            <div className="flex items-center gap-2 justify-between sm:justify-start">
              <div className="text-sm">Unit:</div>
              <select
                className="border border-gray-400 rounded-sm px-2 py-2 w-32 sm:w-24 text-sm"
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
              >
                <option value="">Select Unit</option>
                {unitOptions.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 justify-between sm:justify-start">
              <div className="text-sm">Qty:</div>
              <input
                className="border border-gray-400 rounded-sm px-2 py-2 w-24 sm:w-20 text-sm"
                placeholder="0"
                type="number"
                value={quantity.toString()}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <div className="flex items-center gap-2 justify-between sm:justify-start">
              <div className="text-sm">Discount %:</div>
              <input
                className="border border-gray-400 rounded-sm px-2 py-2 w-24 text-sm"
                placeholder="0"
                type="number"
                value={discount.toString()}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>
            <div className="w-full sm:w-auto">
              <button
                className="bg-green-600 text-white rounded-sm px-4 py-2 sm:px-3 sm:py-1 hover:bg-green-700 text-sm w-full sm:w-auto"
                onClick={handleAddNewItem}
              >
                Add New Item
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
