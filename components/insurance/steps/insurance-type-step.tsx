"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Users, Star } from "lucide-react"

interface InsuranceTypeStepProps {
  formData: any
  setFormData: (data: any) => void
  errors: Record<string, string>
  stepHeaderRef: React.RefObject<HTMLHeadingElement>
}

export function InsuranceTypeStep({ formData, setFormData, errors, stepHeaderRef }: InsuranceTypeStepProps) {
  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [fieldName]: value }))
  }

  return (
    <div className="space-y-10">
      <div className="text-center mb-12">
        <Badge className="bg-green-100 text-green-700 px-6 py-3 text-base font-semibold mb-6 rounded-full">
          <Shield className="w-5 h-5 ml-2" />
          بيانات التأمين
        </Badge>
        <h3 ref={stepHeaderRef} tabIndex={-1} className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          تفاصيل وثيقة التأمين
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          حدد تفاصيل وثيقة التأمين ونوع التغطية المطلوبة
        </p>
      </div>

      {/* Insurance Type Selection */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">نوع التأمين</h4>
              <p className="text-gray-600 font-medium">اختر نوع التغطية المناسبة لك</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button
              type="button"
              className={`group relative p-8 rounded-2xl border-2 transition-all duration-500 hover:shadow-2xl transform hover:scale-105 ${
                formData.insuranceTypeSelected === "comprehensive"
                  ? "border-blue-500 bg-white shadow-xl ring-4 ring-blue-200"
                  : "border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50"
              }`}
              onClick={() => handleFieldChange("insuranceTypeSelected", "comprehensive")}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="font-bold text-sm mb-3 text-gray-900">تأمين شامل</div>
                <div className="text-gray-600 font-medium">تغطية شاملة لجميع المخاطر</div>
              </div>
            </button>

            <button
              type="button"
              className={`group relative p-8 rounded-2xl border-2 transition-all duration-500 hover:shadow-2xl transform hover:scale-105 ${
                formData.insuranceTypeSelected === "against-others"
                  ? "border-blue-500 bg-white shadow-xl ring-4 ring-blue-200"
                  : "border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50"
              }`}
              onClick={() => handleFieldChange("insuranceTypeSelected", "against-others")}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="font-bold text-sm mb-3 text-gray-900">ضد الغير</div>
                <div className="text-gray-600 font-medium">تغطية الأضرار للطرف الثالث</div>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Additional Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl overflow-hidden">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <span className="font-bold text-sm text-gray-900">إضافة سائقين</span>
            </div>
            <div className="flex items-center justify-center gap-6 mb-6">
              <button
                type="button"
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl text-sm font-bold transform hover:scale-110"
                onClick={() => handleFieldChange("additionalDrivers", Math.max(0, formData.additionalDrivers - 1))}
              >
                -
              </button>
              <span className="text-3xl font-bold text-gray-900 min-w-[4rem]">{formData.additionalDrivers}</span>
              <button
                type="button"
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl text-sm font-bold transform hover:scale-110"
                onClick={() => handleFieldChange("additionalDrivers", Math.min(5, formData.additionalDrivers + 1))}
              >
                +
              </button>
            </div>
            <p className="text-gray-600 font-medium">الحد الأقصى 5 سائقين</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl overflow-hidden">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Star className="w-7 h-7 text-white" />
              </div>
              <span className="font-bold text-sm text-green-800">خصومات خاصة</span>
            </div>
            <div className="flex items-center gap-4 mb-8 justify-center">
              <input
                type="checkbox"
                className="w-6 h-6 text-green-600 rounded-lg border-2 border-green-300 focus:ring-green-500"
                checked={formData.specialDiscounts}
                onChange={(e) => handleFieldChange("specialDiscounts", e.target.checked)}
              />
              <span className="text-green-800 font-semibold">أريد الحصول على خصومات خاصة</span>
            </div>
            <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white w-full py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              عرض الخصومات
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
