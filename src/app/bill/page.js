"use client"

import { useState } from "react"
import AddItem from "./addItem"
import SelectBuyer from "./selectBuyer"

const buyersList = [
    { name: "Alice" },
    { name: "Bob" },
    { name: "Charlie" },
    { name: "Diana" },
    { name: "Ethan" }
]

const itemList = [
    { name: "PVC Insulated Wire 1.5mm", unit: "m", rate: 25 },
    { name: "Coaxial Cable RG6", unit: "m", rate: 18 },
    { name: "3 Core Electrical Cable", unit: "m", rate: 45 },
    { name: "LAN Cat6 Cable", unit: "m", rate: 22 },
    { name: "PVC Water Pipe 1 inch", unit: "m", rate: 35 },
    { name: "LED Bulb 12W", unit: "pcs", rate: 90 },
    { name: "A4 Paper Pack", unit: "box", rate: 250 },
    { name: "Whiteboard Marker", unit: "pcs", rate: 30 },
    { name: "Steel Table", unit: "pcs", rate: 4500 },
    { name: "2 Core Cable Bundle", unit: "bundles", rate: 650 }
]

export default function Bill() {
    const [buyer, setBuyer] = useState(null)
    const [billItems, setBillItems] = useState([])

    const handleDelete = (indexToDelete) => {
        setBillItems(prev => prev.filter((_, idx) => idx !== indexToDelete))
    }

    const billTotal = billItems.reduce((acc, curr) => {
        return acc + (curr.item.rate * curr.qty)
    }, 0)

    return (
        <div className="pt-12 flex flex-col gap-8 items-center w-full px-4">
            <SelectBuyer buyersList={buyersList} setBuyer={setBuyer} />
            <AddItem itemList={itemList} setBillItems={setBillItems} />

            <div className="w-full max-w-2xl flex flex-col gap-4">
                {billItems.map((element, idx) => {
                    const itemTotal = element.item.rate * element.qty
                    return (
                        <div key={idx} className="flex justify-between items-center border p-3 rounded shadow-sm bg-white">
                            <div className="flex gap-2">
                                <div className="font-semibold flex items-center">{element.item.name}</div>
                                <div className="text-sm text-gray-600 flex items-center">
                                    Qty: {element.qty} {element.item.unit} × Rate: ₹{element.item.rate}
                                </div>
                                <div className="text-sm text-green-700 flex items-center">Total: ₹{itemTotal}</div>
                            </div>
                            <button
                                onClick={() => handleDelete(idx)}
                                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    )
                })}
            </div>

            {billItems.length > 0 && (
                <>
                    <div className="mt-1 font-medium bg-yellow-100 px-4 py-2 rounded shadow border">
                        Grand Total: ₹{billTotal}
                    </div>
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded shadow hover:bg-blue-700 transition">Print Bill</button>
                </>
            )}
        </div>
    )
}
