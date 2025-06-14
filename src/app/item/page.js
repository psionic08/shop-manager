"use client"

import { useEffect, useRef, useState } from "react"
import axios from "axios"
import Dropdown from "@/components/dropdown"
import { useRouter } from "next/navigation"

export default function Item() {
    const inputRef = useRef(null)
    const router = useRouter()
    const [items, setItems] = useState([])
    const [selectedItem, setSelectedItem] = useState(null)
    const [query, setQuery] = useState("")
    const [mode, setMode] = useState("create") // "create" | "modify" | "stock"

    const [name, setName] = useState("")
    const [rate, setRate] = useState("")
    const [unit, setUnit] = useState("Mtr")
    const [stockChange, setStockChange] = useState("0")

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await axios.get("/api/items/getitems", { withCredentials: true })
                setItems(res.data.items || [])
            } catch (error) {
                alert("Error fetching items")
            }
        }
        fetchItems()
    }, [])

    useEffect(() => {
        if (selectedItem && (mode === "modify" || mode === "stock")) {
            setName(selectedItem.name)
            setRate(selectedItem.rate)
            setUnit(selectedItem.unit)
            setQuery(selectedItem.name)
        } else {
            setName("")
            setRate("")
            setUnit("Mtr")
            setQuery("")
            setSelectedItem(null)
        }
    }, [selectedItem, mode])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (mode === "create") {
            const res = await axios('/api/items/newitem', {
                method: "post",
                data: {
                    name: name,
                    rate: rate,
                    unit: unit,
                    quantity: 0
                },
                withCredentials: true
            })

            if (res.status === 200) {
                alert(res.data.message)
                router.push("/")
            }
            else alert(res.data.error)

        }
        else{
            const res = await axios('/api/items/updateitem', {
                method: "post",
                data: [{
                    _id: selectedItem._id,
                    name: name,
                    rate: rate,
                    unit: unit,
                    quantity: selectedItem.quantity+Number(stockChange)
                }],
                withCredentials: true
            })

            if (res.status === 200) {
                alert(res.data.message)
                router.push("/")
            }
            else alert(res.data.error)
        }
    }
    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Manage Items</h2>

            {/* Mode Toggle */}
            <div className="flex gap-6 mb-4 flex-wrap">
                {["create", "modify", "stock"].map((m) => (
                    <label key={m} className="flex items-center gap-2">
                        <input
                            type="radio"
                            value={m}
                            checked={mode === m}
                            onChange={() => setMode(m)}
                        />
                        {m === "create"
                            ? "Create New Item"
                            : m === "modify"
                                ? "Modify Item"
                                : "Update Stock"}
                    </label>
                ))}
            </div>

            {(mode === "modify" || mode === "stock") && (
                <div className="mb-4">
                    <label className="block mb-2 font-medium">Select Item:</label>
                    <Dropdown
                        inputRef={inputRef}
                        itemList={items}
                        containerClassName="relative"
                        menuClassName="absolute bg-white border border-gray-300 rounded shadow max-h-48 overflow-y-auto w-full z-10"
                        inputClassName="w-full border border-gray-300 rounded px-3 py-2"
                        optionClassName="px-3 py-2 cursor-pointer hover:bg-blue-100"
                        stateSetter={setSelectedItem}
                        query={query}
                        setQuery={setQuery}
                    />
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {mode !== "stock" && (
                    <>
                        <div>
                            <label className="block mb-1 font-medium">Name *</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Rate *</label>
                            <input
                                type="number"
                                value={rate}
                                onChange={(e) => setRate(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Unit</label>
                            <select
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            >
                                <option value="Mtr">Mtr</option>
                                <option value="Bdl">Bdl</option>
                                <option value="Pcs">Pcs</option>
                            </select>
                        </div>
                    </>
                )}

                {mode === "stock" && selectedItem && (
                    <>
                        <div className="text-sm text-gray-600">
                            Current Quantity: {selectedItem.quantity ?? "N/A"}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                            Unit: <span className="font-medium">{selectedItem.unit}</span>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Quantity Change (+)</label>
                            <input
                                type="number"
                                value={stockChange}
                                onChange={(e) => setStockChange(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                required
                            />
                        </div>
                    </>
                )}



                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    {mode === "create"
                        ? "Create Item"
                        : mode === "modify"
                            ? "Update Item"
                            : "Update Stock"}
                </button>
            </form>
        </div>
    )
}
