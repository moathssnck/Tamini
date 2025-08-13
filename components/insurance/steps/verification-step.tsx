"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Phone, Lock } from "lucide-react"

interface VerificationStepProps {
  formData: any
  paymentData: any
  setPaymentData: (data: any) => void
  otpTimer: number
  otpAttempts: number
  stepHeaderRef: React.RefObject<HTMLHeadingElement>
}

export function VerificationStep({
  formData,
  paymentData,
  setPaymentData,
  otpTimer,
  otpAttempts,
  stepHeaderRef,
}: VerificationStepProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-10">
      <div className="text-center mb-12">
        <Badge className="bg-green-100 text-green-700 px-6 py-3 text-base font-semibold mb-6 rounded-full">
          <Lock className="w-5 h-5 ml-2" />
          التحقق من الهوية
        </Badge>
        <h3 ref={stepHeaderRef} tabIndex={-1} className="text-md lg:text-4xl font-bold text-gray-900 mb-4">
          رمز التحقق
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          أدخل رمز التحقق المرسل إلى هاتفك لإتمام العملية
        </p>
      </div>

      <div className="max-w-2xl mx-auto text-center space-y-12">
        {/* Phone Icon */}
        <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto shadow-xl">
          <Phone className="w-16 h-16 text-blue-600" />
        </div>

        {/* Message */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-6">تم إرسال رمز التحقق</h4>
          <p className="text-gray-600 text-lg leading-relaxed">
            تم إرسال رمز التحقق المكون من 6 أرقام إلى رقم الهاتف
            <br />
            <span className="font-bold text-blue-600 text-sm">{formData.phone || "05xxxxxxxx"}</span>
          </p>
        </div>

        {/* OTP Input */}
        <div>
          <label className="block text-lg font-bold text-gray-800 mb-6">
            رمز التحقق <span className="text-red-500">*</span>
          </label>
          <Input
            name="otp"
            type="text"
            placeholder="######"
            required
            value={paymentData.otp}
            maxLength={6}
            onChange={(e) => setPaymentData((prev: any) => ({ ...prev, otp: e.target.value }))}
            autoFocus={true}
            className="text-center text-sm h-20 tracking-widest border-2 rounded-2xl border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-xl focus:ring-4 focus:ring-blue-200"
          />
        </div>

        {/* Timer and Resend */}
        <div className="space-y-6">
          {otpTimer > 0 ? (
            <p className="text-lg text-gray-600 font-medium">
              يمكنك طلب رمز جديد خلال <span className="font-bold text-blue-600 text-sm">{formatTime(otpTimer)}</span>
            </p>
          ) : (
            <Button
              variant="outline"
              className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-transparent"
            >
              إرسال رمز جديد
            </Button>
          )}

          {otpAttempts > 0 && (
            <p className="text-lg text-orange-600 font-semibold">عدد المحاولات المتبقية: {3 - otpAttempts}</p>
          )}
        </div>
      </div>
    </div>
  )
}
