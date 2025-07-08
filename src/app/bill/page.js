"use client"

import { useEffect, useState } from "react"
import AddItem from "./addItem"
import SelectBuyer from "./selectBuyer"
import axios from "axios"
import { useRouter } from "next/navigation"
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer"
import InvoiceTemplate from "@/components/invoiceTemplate"

export default function Bill() {
    const router = useRouter()
    const [buyer, setBuyer] = useState(null)
    const [itemList, setItemList] = useState(null)
    const [buyersList, setBuyersList] = useState(null)
    const [billItems, setBillItems] = useState([])
    const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().split("T")[0])
    const [buyerQuery, setBuyerQuery] = useState("")
    const [roundoff, setRoundoff] = useState(0)
    const handleDelete = (indexToDelete) => {
        setBillItems(prev => prev.filter((_, idx) => idx !== indexToDelete))
    }

    const billTotal = billItems.reduce((acc, curr) => {
        const discount = curr.discount || 0
        const totalAfterDiscount = curr.item.rate * curr.qty * (1 - discount / 100)
        return acc + totalAfterDiscount
    }, 0)
    const newBillTotal = parseFloat(billTotal.toFixed(2)) + roundoff
    const handleClearBill = async () => {
        const updatedItems = billItems.map((billItem, idx) => {
            billItem.item.quantity = billItem.item.quantity - billItem.qty
            return billItem.item
        })
        const res = await axios('/api/items/updateitem', {
            method: "post",
            data: updatedItems,
            withCredentials: true
        })
        if (res.status == 200) {
            setBuyer(null)
            setBuyerQuery("")
            setBillItems([])
        }
    }

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await axios.get("/api/items/getitems", { withCredentials: true })
                if (res.status === 401) router.push("/")
                else setItemList(res.data.items)
            } catch (error) {
                alert("Could not fetch items.")
            }
        }

        fetchItems()
    }, [])

    useEffect(() => {
        const fetchBuyers = async () => {
            try {
                const res = await axios.get("/api/buyer/getbuyers", { withCredentials: true })
                if (res.status === 401) router.push("/")
                else setBuyersList(res.data.buyers)
            } catch (error) {
                alert("Could not fetch buyers.")
            }
        }

        fetchBuyers()
    }, [])
    return (
        <div className="pt-12 flex flex-col gap-8 items-center w-full px-4">
            {buyersList && (
                <SelectBuyer
                    buyersList={buyersList}
                    setBuyer={setBuyer}
                    invoiceDate={invoiceDate}
                    setInvoiceDate={setInvoiceDate}
                    buyerQuery={buyerQuery}
                    setBuyerQuery={setBuyerQuery}
                />
            )}

            {itemList && <AddItem itemList={itemList} setBillItems={setBillItems} />}

            <div className="w-full max-w-2xl flex flex-col gap-2">
                {billItems.map((element, idx) => {
                    const { item, qty, discount = 0 } = element
                    const originalTotal = item.rate * qty
                    const totalAfterDiscount = originalTotal * (1 - discount / 100)

                    return (
                        <div
                            key={idx}
                            className="flex justify-between items-center border px-4 py-2 rounded shadow-sm bg-white text-sm"
                        >
                            <div className="flex flex-wrap gap-4 items-center">
                                <span className="font-medium">{item.name}</span>
                                <span className="text-gray-600">
                                    {qty} {item.unit} × ₹{item.rate}
                                </span>
                                {discount > 0 && (
                                    <span className="text-red-500">–{discount}%</span>
                                )}
                                <span className="text-green-700 font-semibold">
                                    ₹{totalAfterDiscount.toFixed(2)}
                                </span>
                            </div>
                            <button
                                onClick={() => handleDelete(idx)}
                                className="ml-4 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    )
                })}
            </div>

            {billItems.length > 0 && (
                <>
                    <div className="flex gap-4 items-center">
                        <div>Round off:</div>
                        <input
                            className="border border-gray-400 rounded-sm w-16 px-2 py-1"
                            type="number"
                            step="any"
                            value={roundoff}
                            onChange={(e) => {
                                const val = e.target.value;
                                // Allow empty string, minus sign, or valid number
                                if (val === '' || val === '-' || val === '.' || val === '-.') {
                                    setRoundoff(val);
                                } else {
                                    const parsed = parseFloat(val);
                                    if (!isNaN(parsed)) setRoundoff(parsed);
                                }
                            }}
                        />
                    </div>
                    <div className="mt-1 font-medium bg-yellow-100 px-4 py-2 rounded shadow border">
                        Grand Total: ₹{isNaN(newBillTotal)?billTotal.toFixed(2):newBillTotal}
                    </div>
                    <div className="flex gap-4">
                        <div className="px-4 py-2 bg-blue-600 text-white text-sm rounded shadow hover:bg-blue-700 transition">
                            <PDFDownloadLink
                                document={
                                    <InvoiceTemplate
                                        buyer={buyer}
                                        items={billItems}
                                        invoiceDate={invoiceDate}
                                        billTotal={newBillTotal}
                                        roundoff={roundoff}
                                    />
                                }
                                fileName={`Invoice_${invoiceDate}.pdf`}
                            >
                                Download
                            </PDFDownloadLink>
                        </div>
                        <button
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded shadow hover:bg-blue-700 transition"
                            onClick={handleClearBill}
                        >
                            Clear Bill
                        </button>
                    </div>
                </>
            )
            }
        </div >
    )
}
