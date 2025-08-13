"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Shield, Star, Award, Clock } from "lucide-react"
import { offerData } from "@/lib/data"

interface SummaryStepProps {
  formData: any
  setFormData: (data: any) => void
  errors: Record<string, string>
  stepHeaderRef: React.RefObject<HTMLHeadingElement>
}

export function SummaryStep({ formData, setFormData, errors, stepHeaderRef }: SummaryStepProps) {
  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [fieldName]: value }))
  }

  const selectedOffer = offerData.find((offer) => offer.id === formData.selectedInsuranceOffer)

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-8 py-4 text-lg font-bold mb-8 rounded-full shadow-lg">
          <CheckCircle className="w-6 h-6 ml-2" />
          ملخص الطلب
        </Badge>
        <h3 ref={stepHeaderRef} tabIndex={-1} className="text-md lg:text-5xl font-bold text-gray-900 mb-6">
          مراجعة طلبك النهائي
        </h3>
        <p className="text-sm text-gray-600 max-w-3xl mx-auto leading-relaxed">
          راجع جميع التفاصيل بعناية قبل إتمام عملية الدفع
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Selected Insurance Details */}
        <div className="xl:col-span-2 space-y-8">
          {/* Selected Insurance Card */}
          {selectedOffer && (
            <Card className="border-0 shadow-2xl rounded-2xl bg-gradient-to-br from-white to-blue-50/30 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                <div className="flex items-center gap-4 text-white">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Shield className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">التأمين المختار</h4>
                    <p className="text-blue-100 text-lg">{selectedOffer.company.name}</p>
                  </div>
                </div>
              </div>

              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Company Info */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={selectedOffer.company.image_url || "/placeholder.svg"}
                        alt={selectedOffer.company.name}
                        className="w-16 h-16 rounded-xl shadow-lg"
                      />
                      <div>
                        <h5 className="text-sm font-bold text-gray-900">{selectedOffer.company.name}</h5>
                        <Badge
                          className={`mt-2 ${
                            selectedOffer.type === "comprehensive"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {selectedOffer.type === "comprehensive" ? "تأمين شامل" : "ضد الغير"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Price Info */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                    <div className="text-center">
                      <p className="text-sm text-green-600 font-semibold mb-2">السعر الأساسي</p>
                      <p className="text-md font-bold text-green-700">{selectedOffer.main_price} ر.س</p>
                      <p className="text-sm text-green-600 mt-1">سنوياً</p>
                    </div>
                  </div>
                </div>

                {/* Free Features */}
                <div className="mt-8">
                  <h6 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    المزايا المشمولة مجاناً
                  </h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedOffer.extra_features
                      .filter((f) => f.price === 0)
                      .map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200"
                        >
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-gray-700 font-medium">{feature.content}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Selected Add-ons */}
                {formData.selectedAddons.length > 0 && (
                  <div className="mt-8">
                    <h6 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-500" />
                      الخدمات الإضافية المختارة
                    </h6>
                    <div className="space-y-4">
                      {selectedOffer.extra_features
                        .filter((f) => formData.selectedAddons.includes(f.id))
                        .map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-gray-700 font-medium">{feature.content}</span>
                            </div>
                            <span className="text-purple-700 font-bold">+{feature.price} ر.س</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Terms and Conditions */}
       
          {errors.agreeToTerms && (
            <div className="flex items-center gap-4 text-red-600 text-lg bg-red-50 p-6 rounded-2xl border-2 border-red-200 shadow-lg">
              <AlertCircle className="w-8 h-8 flex-shrink-0" />
              <span className="font-semibold">{errors.agreeToTerms}</span>
            </div>
          )}
        </div>

        <div className="xl:col-span-1">
          <div className="sticky top-8">
            <Card className="border-0 shadow-2xl rounded-2xl bg-gradient-to-br from-white to-gray-50 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">ملخص الدفع</h4>
                    <p className="text-green-100">المبلغ الإجمالي</p>
                  </div>
                </div>
              </div>

              <CardContent className="p-8">
                {selectedOffer ? (
                  (() => {
                    const basePrice = Number.parseFloat(selectedOffer.main_price)
                    const selectedFeatures = selectedOffer.extra_features.filter((f) =>
                      formData.selectedAddons.includes(f.id),
                    )
                    const addonsTotal = selectedFeatures.reduce((sum, f) => sum + f.price, 0)
                    const expenses = selectedOffer.extra_expenses.reduce((sum, e) => sum + e.price, 0)
                    const subtotal = basePrice + addonsTotal
                    const total = subtotal + expenses

                    return (
                      <div className="space-y-6">
                        {/* Base Price */}
                        <div className="flex justify-between items-center text-lg">
                          <span className="font-medium text-gray-700">قسط التأمين الأساسي</span>
                          <span className="font-bold text-gray-900">{basePrice.toLocaleString()} ر.س</span>
                        </div>

                        {/* Add-ons */}
                        {addonsTotal > 0 && (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center text-lg">
                              <span className="font-medium text-gray-700">الخدمات الإضافية</span>
                              <span className="font-bold text-gray-900">+{addonsTotal.toLocaleString()} ر.س</span>
                            </div>
                            {selectedFeatures.map((feature, idx) => (
                              <div key={idx} className="flex justify-between items-center text-sm text-gray-600 pr-4">
                                <span>• {feature.content}</span>
                                <span>+{feature.price} ر.س</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Subtotal */}
                        <div className="flex justify-between items-center text-lg pt-4 border-t border-gray-200">
                          <span className="font-semibold text-gray-800">المجموع الفرعي</span>
                          <span className="font-bold text-gray-900">{subtotal.toLocaleString()} ر.س</span>
                        </div>

                        {/* Taxes and Fees */}
                        <div className="flex justify-between items-center text-lg">
                          <span className="font-medium text-gray-700">الرسوم والضرائب (15%)</span>
                          <span className="font-bold text-gray-900">+{expenses.toLocaleString()} ر.س</span>
                        </div>

                        {/* Total */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-900">المبلغ الإجمالي</span>
                            <div className="text-right">
                              <span className="text-md font-bold text-green-600">{total.toLocaleString()}</span>
                              <span className="text-green-600 font-bold text-lg"> ر.س</span>
                              <p className="text-sm text-green-600 font-medium mt-1">شامل الضريبة</p>
                            </div>
                          </div>
                        </div>

                        {/* Payment Method Info */}
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                          <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="text-sm font-semibold text-blue-800">دفع آمن ومحمي</p>
                              <p className="text-xs text-blue-600">جميع المعاملات مشفرة بتقنية SSL</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })()
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">لم يتم اختيار عرض تأمين بعد</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
