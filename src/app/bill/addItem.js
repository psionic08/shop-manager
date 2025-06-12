import Dropdown from "@/components/dropdown"
import { useState } from "react"

export default function AddItem({ itemList, setBillItems }) {
  const [selectedItem, setSelectedItem] = useState(null)
  const [quantity, setQuantity] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [query, setQuery] = useState("")

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
    }
  }
  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div className="w-full flex justify-center items-center gap-4">
        <div className="flex justify-center items-center gap-2">
          <div className="text-sm font-medium">Item:</div>
          <Dropdown
            itemList={itemList}
            menuClassName="absolute bg-gray-50 z-10 border rounded shadow max-h-48 overflow-y-auto w-full"
            containerClassName="relative"
            inputClassName="border border-gray-400 rounded-sm w-64 px-2 py-1"
            optionClassName="hover:bg-gray-200 px-2 py-1"
            stateSetter={setSelectedItem}
            query={query}
            setQuery={setQuery}
          />
        </div>

        {selectedItem && (
          <>
            <div className="flex items-center gap-3">
              <div className="text-sm">Rate:</div>
              <input
                className="border border-gray-400 rounded-sm w-16 px-2 py-1"
                value={selectedItem.rate}
                onChange={(e) => {
                  setSelectedItem({ ...selectedItem, rate: Number(e.target.value) })
                }}
              />

              <div className="text-sm">{`Qty (${selectedItem.unit}):`}</div>
              <input
                className="border border-gray-400 rounded-sm w-16 px-2 py-1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />

              <div className="text-sm">Discount %:</div>
              <input
                className="border border-gray-400 rounded-sm w-16 px-2 py-1"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />

              <button
                className="bg-blue-500 text-white rounded-sm px-3 py-1 hover:bg-blue-600 text-sm"
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
    </div>
  )
}
