"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Dropdown from "@/components/dropdown"
import { useRouter } from "next/navigation"

export default function Buyer() {
  const [buyers, setBuyers] = useState([])
  const [selectedBuyer, setSelectedBuyer] = useState(null)
  const [name, setName] = useState("")
  const [query, setQuery] = useState("")
  const [mode, setMode] = useState("create") // "create" or "modify"
  const router= useRouter()

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const res = await axios.get("/api/buyer/getbuyers", { withCredentials: true })
        setBuyers(res.data.buyers || [])
      } catch (error) {
        alert("Error fetching buyers")
      }
    }
    fetchBuyers()
  }, [])

  useEffect(() => {
    if (selectedBuyer && mode === "modify") {
      setName(selectedBuyer.name)
      setQuery(selectedBuyer.name)
    } else {
      setName("")
      setQuery("")
      setSelectedBuyer(null)
    }
  }, [selectedBuyer, mode])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      alert("Name is required")
      return
    }

    try {
      if (mode === "modify" && selectedBuyer) {
        const res = await axios.post(`/api/buyer/newbuyer`, { _id: selectedBuyer._id, name: name }, { withCredentials: true })
        alert(res.data.message)
      } else {
        const res = await axios.post("/api/buyer/newbuyer", { name: name }, { withCredentials: true })
        alert(res.data.message)
      }
      router.push("/")
    } catch (error) {
      alert("Error saving buyer")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create or Modify Buyer</h2>

      {/* Mode Toggle */}
      <div className="flex gap-6 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="create"
            checked={mode === "create"}
            onChange={() => setMode("create")}
          />
          Create New Buyer
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="modify"
            checked={mode === "modify"}
            onChange={() => setMode("modify")}
          />
          Modify Existing Buyer
        </label>
      </div>

      {/* Dropdown visible only in modify mode */}
      {mode === "modify" && (
        <div className="mb-4">
          <label className="block mb-2 font-medium">Select Buyer:</label>
          <Dropdown
            itemList={buyers}
            containerClassName="relative"
            menuClassName="absolute bg-white border border-gray-300 rounded shadow max-h-48 overflow-y-auto w-full z-10"
            inputClassName="w-full border border-gray-300 rounded px-3 py-2"
            optionClassName="px-3 py-2 cursor-pointer hover:bg-blue-100"
            stateSetter={setSelectedBuyer}
            query={query}
            setQuery={setQuery}
          />
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="block mb-1 font-medium" htmlFor="name">Name *</label>
        <input
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Buyer Name"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {mode === "modify" ? "Update Buyer" : "Create Buyer"}
        </button>
      </form>
    </div>
  )
}
