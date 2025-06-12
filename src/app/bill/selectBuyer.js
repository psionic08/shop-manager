import Dropdown from "@/components/dropdown"
import { useState } from "react"

export default function SelectBuyer({ buyersList, setBuyer, invoiceDate, setInvoiceDate }) {
  const [query, setQuery] = useState("")

  return (
    <div className="w-full max-w-2xl flex items-center gap-4 px-4">
      {/* Buyer dropdown */}
      <div className="flex-1">
        <label className="text-sm font-medium block mb-1">Buyer:</label>
        <Dropdown
          itemList={buyersList}
          menuClassName="absolute bg-white z-10 border rounded shadow max-h-48 overflow-y-auto w-full"
          containerClassName="relative w-full"
          inputClassName="border border-gray-400 rounded-sm w-full px-2 py-1"
          optionClassName="hover:bg-gray-100 px-2 py-1"
          stateSetter={setBuyer}
          query={query}
          setQuery={setQuery}
        />
      </div>

      {/* Date picker */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Invoice Date:</label>
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
