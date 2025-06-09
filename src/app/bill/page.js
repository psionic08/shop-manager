"use client"

import { useEffect, useState } from "react"
import AddItem from "./addItem"
import SelectBuyer from "./selectBuyer"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function Bill() {
    const router = useRouter()
    const [buyer, setBuyer] = useState(null)
    const [itemList, setItemList] = useState(null)
    const [buyersList, setBuyersList] = useState(null)
    const [billItems, setBillItems] = useState([])

    const handleDelete = (indexToDelete) => {
        setBillItems(prev => prev.filter((_, idx) => idx !== indexToDelete))
    }

    const billTotal = billItems.reduce((acc, curr) => {
        return acc + (curr.item.rate * curr.qty)
    }, 0)

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await axios.get("/api/items/getitems", { withCredentials: true })
                if (res.status === 401) {
                    router.push("/")
                } else {
                    setItemList(res.data.items)
                }
            } catch (error) {
                console.error("Error fetching items:", error)
                alert("Could not fetch items.")
            }
        }

        fetchItems()
    }, [])

    useEffect(() => {
        const fetchBuyers = async () => {
            try {
                const res = await axios.get("/api/buyer/getbuyers", { withCredentials: true })
                if (res.status === 401) {
                    router.push("/")
                } else {
                    setBuyersList(res.data.buyers)
                }
            } catch (error) {
                console.error("Error fetching buyers:", error)
                alert("Could not fetch buyers.")
            }
        }

        fetchBuyers()
    }, [])

    return (
        <div className="pt-12 flex flex-col gap-8 items-center w-full px-4">
            {buyersList && <SelectBuyer buyersList={buyersList} setBuyer={setBuyer} />}
            {itemList && <AddItem itemList={itemList} setBillItems={setBillItems} />}

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
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded shadow hover:bg-blue-700 transition">
                        Print Bill
                    </button>
                </>
            )}
        </div>
    )
}
