"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CreditCard, Lock, AlertCircle } from "lucide-react"
import { cardValidation } from "@/lib/card-validation"

interface PaymentStepProps {
  paymentData: any
  setPaymentData: (data: any) => void
  cardErrors: Record<string, string>
  setCardErrors: (errors: any) => void
  cardType: { type: string; icon: string; color: string }
  setCardType: (type: any) => void
  stepHeaderRef: React.RefObject<HTMLHeadingElement>
}

export function PaymentStep({
  paymentData,
  setPaymentData,
  cardErrors,
  setCardErrors,
  cardType,
  setCardType,
  stepHeaderRef,
}: PaymentStepProps) {
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
        if (!cardValidation.validateExpiry(paymentData.cardMonth, value)) return "تاريخ انتهاء الصلاحية منتهي"
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
    setPaymentData((prev: any) => ({ ...prev, [fieldName]: processedValue }))

    // Clear error if field becomes valid
    const error = validateCardField(fieldName, processedValue)
    if (!error && cardErrors[fieldName]) {
      setCardErrors((prev: any) => ({ ...prev, [fieldName]: "" }))
    }
  }

  const handleCardFieldBlur = (fieldName: string, value: string) => {
    const error = validateCardField(fieldName, value)
    if (error) {
      setCardErrors((prev: any) => ({ ...prev, [fieldName]: error }))
    }
  }

  return (
    <div className="space-y-10">
      <div className="text-center mb-12">
        <Badge className="bg-green-100 text-green-700 px-6 py-3 text-base font-semibold mb-6 rounded-full">
          <CreditCard className="w-5 h-5 ml-2" />
          بيانات الدفع
        </Badge>
        <h3 ref={stepHeaderRef} tabIndex={-1} className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          الدفع الآمن
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          أدخل بيانات بطاقتك الائتمانية لإتمام عملية الدفع الآمن
        </p>
      </div>

      {/* Security Notice */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
        <CardContent className="p-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="font-bold text-blue-900 text-sm">دفع آمن ومحمي</p>
              <p className="text-lg text-blue-700 font-medium">جميع بياناتك محمية بتشفير SSL 256-bit</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          {/* Card Number */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-4">
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
                value={paymentData.cardNumber}
                onChange={(e) => handleCardFieldChange("cardNumber", e.target.value)}
                onBlur={(e) => handleCardFieldBlur("cardNumber", e.target.value)}
                maxLength={19}
                autoFocus={true}
                className={`h-16 pr-20 text-lg border-2 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-xl ${
                  cardErrors.cardNumber
                    ? "border-red-400 focus:border-red-500 bg-red-50 ring-4 ring-red-200"
                    : "border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300 focus:ring-4 focus:ring-blue-200"
                }`}
              />
              {/* Card type indicator */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <div className={`flex items-center gap-2 ${cardType.color}`}>
                  <span className="text-sm"><img src={cardType.icon} width={35}/></span>
                </div>
              </div>
            </div>
            {cardErrors.cardNumber && (
              <div
                className="flex items-center gap-2 mt-3 text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-200 shadow-lg"
                role="alert"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{cardErrors.cardNumber}</span>
              </div>
            )}
          </div>

          {/* Card Name */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-4">
              الاسم كما هو مكتوب على البطاقة <span className="text-red-500">*</span>
            </label>
            <Input
              name="cardName"
              id="cardName"
              type="text"
              className={`h-16 text-lg border-2 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-xl ${
                cardErrors.cardName
                  ? "border-red-400 focus:border-red-500 bg-red-50 ring-4 ring-red-200"
                  : "border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300 focus:ring-4 focus:ring-blue-200"
              }`}
              value={paymentData.cardName}
              onChange={(e) => handleCardFieldChange("cardName", e.target.value)}
              onBlur={(e) => handleCardFieldBlur("cardName", e.target.value)}
              placeholder="JOHN SMITH"
              required
              dir="ltr"
            />
            {cardErrors.cardName && (
              <div
                className="flex items-center gap-2 mt-3 text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-200 shadow-lg"
                role="alert"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{cardErrors.cardName}</span>
              </div>
            )}
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-4">
                الشهر <span className="text-red-500">*</span>
              </label>
              <select
                name="expiryMonth"
                id="expiryMonth"
                className={`w-full h-16 px-4 py-2 border-2 rounded-2xl focus:outline-none focus:ring-4 text-lg transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-xl ${
                  cardErrors.cardMonth
                    ? "border-red-400 focus:ring-red-200 focus:border-red-500 bg-red-50"
                    : "border-gray-200 focus:ring-blue-200 focus:border-blue-500 bg-white hover:border-gray-300"
                }`}
                value={paymentData.cardMonth}
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
              {cardErrors.cardMonth && <p className="text-red-500 text-sm mt-2 font-medium">{cardErrors.cardMonth}</p>}
            </div>

            <div>
              <label className="block text-lg font-bold text-gray-800 mb-4">
                السنة <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full h-16 px-4 py-2 border-2 rounded-2xl focus:outline-none focus:ring-4 text-lg transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-xl ${
                  cardErrors.cardYear
                    ? "border-red-400 focus:ring-red-200 focus:border-red-500 bg-red-50"
                    : "border-gray-200 focus:ring-blue-200 focus:border-blue-500 bg-white hover:border-gray-300"
                }`}
                value={paymentData.cardYear}
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
              {cardErrors.cardYear && <p className="text-red-500 text-sm mt-2 font-medium">{cardErrors.cardYear}</p>}
            </div>

            <div>
              <label className="block text-lg font-bold text-gray-800 mb-4">
                CVV <span className="text-red-500">*</span>
              </label>
              <Input
                name="cvv"
                id="cvv"
                type="password"
                className={`h-16 text-lg border-2 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-xl ${
                  cardErrors.cvv
                    ? "border-red-400 focus:border-red-500 bg-red-50 ring-4 ring-red-200"
                    : "border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300 focus:ring-4 focus:ring-blue-200"
                }`}
                placeholder={cardType.type === "American Express" ? "1234" : "123"}
                maxLength={cardType.type === "American Express" ? 4 : 3}
                value={paymentData.cvv}
                onChange={(e) => handleCardFieldChange("cvv", e.target.value)}
                onBlur={(e) => handleCardFieldBlur("cvv", e.target.value)}
              />
              {cardErrors.cvv && <p className="text-red-500 text-sm mt-2 font-medium">{cardErrors.cvv}</p>}
            </div>
          </div>

          {/* PIN Code */}
          <div className="w-full">
            <label className="block text-lg font-bold text-gray-800 mb-4">
              الرقم السري للبطاقة <span className="text-red-500">*</span>
            </label>
            <Input
              name="pinCode"
              id="pinCode"
              type="password"
              className={`h-16 text-lg border-2 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-xl ${
                cardErrors.pinCode
                  ? "border-red-400 focus:border-red-500 bg-red-50 ring-4 ring-red-200"
                  : "border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300 focus:ring-4 focus:ring-blue-200"
              }`}
              placeholder="####"
              maxLength={4}
              value={paymentData.pinCode}
              required
              onChange={(e) => handleCardFieldChange("pinCode", e.target.value)}
              onBlur={(e) => handleCardFieldBlur("pinCode", e.target.value)}
            />
            {cardErrors.pinCode && (
              <div
                className="flex items-center gap-2 mt-3 text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-200 shadow-lg"
                role="alert"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{cardErrors.pinCode}</span>
              </div>
            )}
          </div>
        </div>

        {/* Security Info */}
        <div className="flex items-start">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl w-full">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="font-bold text-green-800 text-sm">معلومات آمنة</p>
                  <p className="text-lg text-green-600 font-medium">جميع بيانات البطاقة مشفرة ولا يتم حفظها</p>
                </div>
              </div>
              <div className="space-y-4 text-green-700">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">تشفير SSL 256-bit</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">معايير PCI DSS</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">حماية من الاحتيال</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
