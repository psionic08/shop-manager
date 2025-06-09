import Dropdown from "@/components/dropdown";
import { useState } from "react";

export default function SelectBuyer({ buyersList, setBuyer }) {
    const [query, setQuery] = useState("")
    return (
        <div className="w-full max-w-2xl flex items-center gap-3 px-4">
            <label className="text-sm font-medium">Buyer:</label>
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
    );
}
