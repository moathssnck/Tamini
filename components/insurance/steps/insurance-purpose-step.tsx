"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileText, UserCheck, ArrowRight, AlertCircle, Check, Building2 } from "lucide-react"

interface InsurancePurposeStepProps {
  formData: any
  setFormData: (field: string, value: any) => void
  errors: Record<string, string>
  stepHeaderRef: React.RefObject<HTMLHeadingElement>
  onFieldBlur?: (field: string) => void
}

export function InsurancePurposeStep({
  formData,
  setFormData,
  errors,
  stepHeaderRef,
  onFieldBlur,
}: InsurancePurposeStepProps) {
  return (
    <div className="space-y-10">
      <div className="text-center mb-12">
        <Badge className="bg-blue-100 text-blue-700 px-6 py-3 text-base font-semibold mb-6 rounded-full">
          <FileText className="w-5 h-5 ml-2" />
          البيانات الأساسية
        </Badge>
        <h3 ref={stepHeaderRef} tabIndex={-1} className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          معلومات المركبة والمالك
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          أدخل معلومات المركبة والمالك للبدء في الحصول على عرض السعر المخصص لك
        </p>
      </div>

      {/* Insurance Purpose Selection */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-xl">الغرض من التأمين</h4>
              <p className="text-gray-600 font-medium">اختر نوع الخدمة المطلوبة</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button
              type="button"
              className={`group relative p-8 rounded-2xl border-2 transition-all duration-500 hover:shadow-2xl transform hover:scale-105 ${
                formData.insurance_purpose === "renewal"
                  ? "border-blue-500 bg-white shadow-xl ring-4 ring-blue-200"
                  : "border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50"
              }`}
              onClick={() => setFormData("insurance_purpose", "renewal")}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <UserCheck className="w-8 h-8 text-white" />
                </div>
                <div className="font-bold text-xl mb-3 text-gray-900">تجديد وثيقة</div>
                <div className="text-gray-600 font-medium">تجديد وثيقة تأمين موجودة</div>
              </div>
              {formData.insurance_purpose === "renewal" && (
                <div className="absolute top-4 left-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </button>

            <button
              type="button"
              className={`group relative p-8 rounded-2xl border-2 transition-all duration-500 hover:shadow-2xl transform hover:scale-105 ${
                formData.insurance_purpose === "property-transfer"
                  ? "border-blue-500 bg-white shadow-xl ring-4 ring-blue-200"
                  : "border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50"
              }`}
              onClick={() => setFormData("insurance_purpose", "property-transfer")}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <ArrowRight className="w-8 h-8 text-white" />
                </div>
                <div className="font-bold text-xl mb-3 text-gray-900">نقل ملكية</div>
                <div className="text-gray-600 font-medium">تأمين مركبة منقولة الملكية</div>
              </div>
              {formData.insurance_purpose === "property-transfer" && (
                <div className="absolute top-4 left-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Type Selection */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-xl">نوع المركبة</h4>
              <p className="text-gray-600 font-medium">حدد طريقة تسجيل المركبة</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button
              type="button"
              className={`group relative p-8 rounded-2xl border-2 transition-all duration-500 hover:shadow-2xl transform hover:scale-105 ${
                formData.vehicle_type === "serial"
                  ? "border-green-500 bg-white shadow-xl ring-4 ring-green-200"
                  : "border-gray-200 hover:border-green-300 bg-white hover:bg-green-50"
              }`}
              onClick={() => setFormData("vehicle_type", "serial")}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div className="font-bold text-xl mb-3 text-gray-900">مركبة برقم تسلسلي</div>
                <div className="text-gray-600 font-medium">مركبة مسجلة برقم تسلسلي</div>
              </div>
              {formData.vehicle_type === "serial" && (
                <div className="absolute top-4 left-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </button>

            <button
              type="button"
              className={`group relative p-8 rounded-2xl border-2 transition-all duration-500 hover:shadow-2xl transform hover:scale-105 ${
                formData.vehicle_type === "custom"
                  ? "border-green-500 bg-white shadow-xl ring-4 ring-green-200"
                  : "border-gray-200 hover:border-green-300 bg-white hover:bg-green-50"
              }`}
              onClick={() => setFormData("vehicle_type", "custom")}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div className="font-bold text-xl mb-3 text-gray-900">مركبة برقم لوحة</div>
                <div className="text-gray-600 font-medium">مركبة مسجلة برقم لوحة</div>
              </div>
              {formData.vehicle_type === "custom" && (
                <div className="absolute top-4 left-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Form Fields */}
      <div className="space-y-8">
        <div>
          <label className="block text-lg font-bold text-gray-800 mb-4">
            اسم مالك الوثيقة <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            placeholder="الاسم الكامل"
            value={formData.documment_owner_full_name}
            onChange={(e) => setFormData("documment_owner_full_name", e.target.value)}
            onBlur={() => onFieldBlur?.("documment_owner_full_name")}
            className={`h-16 text-lg border-2 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-xl ${
              errors.documment_owner_full_name
                ? "border-red-400 focus:border-red-500 bg-red-50 ring-4 ring-red-200"
                : "border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300 focus:ring-4 focus:ring-blue-200"
            }`}
          />
          {errors.documment_owner_full_name && (
            <div className="flex items-center gap-3 mt-4 text-red-600 text-base bg-red-50 p-4 rounded-xl border border-red-200 shadow-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{errors.documment_owner_full_name}</span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-lg font-bold text-gray-800 mb-4">
            الرقم التسلسلي للمركبة <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            placeholder="123456789"
            value={formData.sequenceNumber}
            onChange={(e) => setFormData("sequenceNumber", e.target.value)}
            onBlur={() => onFieldBlur?.("sequenceNumber")}
            className={`h-16 text-lg border-2 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-xl ${
              errors.sequenceNumber
                ? "border-red-400 focus:border-red-500 bg-red-50 ring-4 ring-red-200"
                : "border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300 focus:ring-4 focus:ring-blue-200"
            }`}
          />
          {errors.sequenceNumber && (
            <div className="flex items-center gap-3 mt-4 text-red-600 text-base bg-red-50 p-4 rounded-xl border border-red-200 shadow-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{errors.sequenceNumber}</span>
            </div>
          )}
        </div>

        {/* Conditional Fields */}
        {formData.insurance_purpose === "renewal" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-4">
                رقم هوية المالك <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="1234567890"
                maxLength={10}
                value={formData.owner_identity_number}
                onChange={(e) => setFormData("owner_identity_number", e.target.value)}
                onBlur={() => onFieldBlur?.("owner_identity_number")}
                className={`h-16 text-lg border-2 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-xl ${
                  errors.owner_identity_number
                    ? "border-red-400 focus:border-red-500 bg-red-50 ring-4 ring-red-200"
                    : "border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300 focus:ring-4 focus:ring-blue-200"
                }`}
              />
              {errors.owner_identity_number && (
                <div className="flex items-center gap-3 mt-4 text-red-600 text-base bg-red-50 p-4 rounded-xl border border-red-200 shadow-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{errors.owner_identity_number}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-lg font-bold text-gray-800 mb-4">
                رقم الهاتف <span className="text-red-500">*</span>
              </label>
              <Input
                type="tel"
                placeholder="0555######"
                maxLength={10}
                value={formData.phoneNumber}
                onChange={(e) => setFormData("phoneNumber", e.target.value)}
                onBlur={() => onFieldBlur?.("phoneNumber")}
                className={`h-16 text-lg border-2 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-xl ${
                  errors.phoneNumber
                    ? "border-red-400 focus:border-red-500 bg-red-50 ring-4 ring-red-200"
                    : "border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300 focus:ring-4 focus:ring-blue-200"
                }`}
              />
              {errors.phoneNumber && (
                <div className="flex items-center gap-3 mt-4 text-red-600 text-base bg-red-50 p-4 rounded-xl border border-red-200 shadow-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{errors.phoneNumber}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {formData.insurance_purpose === "property-transfer" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-4">
                رقم هوية المشتري <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="1234567890"
                maxLength={10}
                value={formData.buyer_identity_number}
                onChange={(e) => setFormData("buyer_identity_number", e.target.value)}
                onBlur={() => onFieldBlur?.("buyer_identity_number")}
                className={`h-16 text-lg border-2 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-xl ${
                  errors.buyer_identity_number
                    ? "border-red-400 focus:border-red-500 bg-red-50 ring-4 ring-red-200"
                    : "border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300 focus:ring-4 focus:ring-blue-200"
                }`}
              />
              {errors.buyer_identity_number && (
                <div className="flex items-center gap-3 mt-4 text-red-600 text-base bg-red-50 p-4 rounded-xl border border-red-200 shadow-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{errors.buyer_identity_number}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-lg font-bold text-gray-800 mb-4">
                رقم هوية البائع <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="1234567890"
                maxLength={10}
                value={formData.seller_identity_number}
                onChange={(e) => setFormData("seller_identity_number", e.target.value)}
                onBlur={() => onFieldBlur?.("seller_identity_number")}
                className={`h-16 text-lg border-2 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-xl ${
                  errors.seller_identity_number
                    ? "border-red-400 focus:border-red-500 bg-red-50 ring-4 ring-red-200"
                    : "border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300 focus:ring-4 focus:ring-blue-200"
                }`}
              />
              {errors.seller_identity_number && (
                <div className="flex items-center gap-3 mt-4 text-red-600 text-base bg-red-50 p-4 rounded-xl border border-red-200 shadow-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{errors.seller_identity_number}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
  