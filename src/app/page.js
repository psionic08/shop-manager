"use client"

import { useRouter } from "next/navigation"
import axios from "axios"
import { useState } from "react"

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    try {
      setLoading(true)
      await axios.get("/api/users/logout", { withCredentials: true })
      router.push("/login")
    } catch (error) {
      alert("Logout failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full flex flex-col items-center pt-20 gap-6">
      {["/bill", "/buyer", "/item"].map((route, idx) => {
        let label = ""
        if (route === "/bill") label = "Create New Bill"
        else if (route === "/buyer") label = "Create / Modify Buyer"
        else if (route === "/item") label = "Create / Modify Item"

        return (
          <button
            key={idx}
            onClick={() => router.push(route)}
            className="text-blue-600 underline cursor-pointer text-lg font-semibold hover:text-blue-800 transition"
          >
            {label}
          </button>
        )
      })}

      {/* Logout button styled like the others */}
      <button
        onClick={handleLogout}
        disabled={loading}
        className="text-blue-600 underline cursor-pointer text-lg font-semibold hover:text-blue-800 transition"
      >
        {loading ? "Logging out..." : "Logout"}
      </button>
    </div>
  )
}
