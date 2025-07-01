import Dropdown from "@/components/dropdown"
import axios from "axios"
import { useRef, useState } from "react"

export default function SelectBuyer({ buyersList, setBuyer, invoiceDate, setInvoiceDate, buyerQuery, setBuyerQuery }) {
  const inputRef = useRef(null)
  const [mode, setMode] = useState("Existing")
  const [visibility, setVisibility] = useState("visible")
  const handleAddBuyer = async () => {
    const res = await axios.post("/api/buyer/newbuyer", { name: buyerQuery }, { withCredentials: true })
    if (res.status === 200) {
      setBuyer(res.data.response)
      setVisibility("invisible")
    }
    else {
      alert("error creating buyer")
    }
  }
  return (
    <div className="w-full max-w-2xl flex justify-center gap-4">
      {/* Buyer dropdown */}
      <div className="flex flex-col w-full">
        <div className="flex gap-3 items-center">
          <div >Buyer:</div>
          <div className="flex">
            <div>
              <input
                type="radio"
                value={mode}
                onChange={() => setMode("Existing")}
                checked={mode === "Existing"}
              />
              Existing
            </div>
            <div className="ml-3">
              <input
                type="radio"
                value={mode}
                onChange={() => setMode("New")}
                checked={mode === "New"}
              />
              New
            </div>
          </div>
        </div>
        <div>
          {mode === "Existing" ? (
            <Dropdown
              inputRef={inputRef}
              itemList={buyersList}
              menuClassName="absolute bg-white z-10 border rounded shadow max-h-48 overflow-y-auto w-full"
              containerClassName="relative w-full"
              inputClassName="border border-gray-400 rounded-sm w-full px-2 py-1"
              optionClassName="hover:bg-gray-100 px-2 py-1"
              stateSetter={setBuyer}
              query={buyerQuery}
              setQuery={setBuyerQuery}
            />
          ) : (
            <div className="flex">
              <input
                type="text"
                className="border border-gray-400 rounded-sm w-full px-2 py-1"
                value={buyerQuery}
                onChange={(e) => setBuyerQuery(e.target.value)}
              />
              <button className={`ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm w-30 ${visibility}`}
                onClick={handleAddBuyer}
                disabled={buyerQuery === ""}
              >
                Add Buyer
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <div>Invoice Date:</div>
        <input
          type="date"
          value={invoiceDate}
          onChange={(e) => setInvoiceDate(e.target.value)}
          className="border border-gray-400 px-3 py-1 rounded w-full"
        />
      </div>
    </div>
  )
}
