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
      data: { name: newName, rate: newRate, unit: newUnit, quantity: -1*quantity },
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
    <div className="w-full flex flex-col items-center gap-2">
      <div className="w-full flex flex-col justify-center items-center gap-4">
        <div className="flex justify-center items-center gap-2">
          <div className="text-sm font-medium">Item:</div>
          <div className="flex">
            <div>
              <input
                type="radio"
                value={mode}
                onChange={() => setMode("existing")}
                checked={mode === "existing"}
              />
              Existing
            </div>
            <div className="ml-3">
              <input
                type="radio"
                value={mode}
                onChange={() => setMode("new")}
                checked={mode === "new"}
              />
              New
            </div>
          </div>
        </div>
        {mode === "existing" && (
          <div className="flex items-center gap-2">
            <Dropdown
              inputRef={inputRef}
              itemList={itemList}
              menuClassName="absolute bg-gray-50 z-10 border rounded shadow max-h-48 overflow-y-auto w-full"
              containerClassName="relative"
              inputClassName="border border-gray-400 rounded-sm w-64 px-2 py-1"
              optionClassName="hover:bg-gray-200 px-2 py-1"
              stateSetter={setSelectedItem}
              query={query}
              setQuery={setQuery}
            />
            {selectedItem && (
              <>
                <div className="flex items-center gap-3">
                  <div className="text-sm">{`Qty (${selectedItem.unit}):`}</div>
                  <input
                    className="border border-gray-400 rounded-sm w-16 px-2 py-1"
                    type="number"
                    step="any"
                    value={quantity.toString()}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />

                  <div className="text-sm">Rate:</div>
                  <input
                    className="border border-gray-400 rounded-sm w-16 px-2 py-1"
                    type="number"
                    step="any"
                    value={selectedItem.rate.toString()}
                    onChange={(e) => {
                      setSelectedItem({ ...selectedItem, rate: Number(e.target.value) })
                    }}
                  />

                  <div className="text-sm">Discount %:</div>
                  <input
                    className="border border-gray-400 rounded-sm w-16 px-2 py-1"
                    type="number"
                    step="any"
                    value={discount.toString()}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                  />

                  <button
                    className="bg-blue-600 text-white rounded-sm px-3 py-1 hover:bg-blue-700 text-sm"
                    onClick={handleAddItem}
                  >
                    Add Item
                  </button>
                </div>
                <div className="text-xs text-green-600 mt-1">
                  Available Quantity: {selectedItem.quantity} {selectedItem.unit}
                </div>
              </>
            )}
          </div>
        )}
        {mode === "new" && (
          <div className="flex flex-wrap gap-4 mt-2 items-center">
            <div className="flex items-center gap-1">
              <div className="text-sm">Name:</div>
              <input
                className="border border-gray-400 rounded-sm px-2 py-1 w-64"
                placeholder="Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-1">
              <div className="text-sm">Rate:</div>
              <input
                className="border border-gray-400 rounded-sm px-2 py-1 w-20"
                placeholder="Rate"
                type="number"
                value={newRate.toString()}
                onChange={(e) => setNewRate(Number(e.target.value))}
              />
            </div>
            <div className="flex items-center gap-1">
              <div className="text-sm">Unit:</div>
              <select
                className="border border-gray-400 rounded-sm px-2 py-1 w-24"
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
            <div className="flex items-center gap-1">
              <div className="text-sm">Qty:</div>
              <input
                className="border border-gray-400 rounded-sm px-2 py-1 w-20"
                placeholder="Qty"
                type="number"
                value={quantity.toString()}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <div className="flex items-center gap-1">
              <div className="text-sm">Discount %:</div>
              <input
                className="border border-gray-400 rounded-sm px-2 py-1 w-24"
                placeholder="Discount %"
                type="number"
                value={discount.toString()}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>
            <div>
              <button
                className="bg-green-600 text-white rounded-sm px-3 py-1 hover:bg-green-700 text-sm"
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
