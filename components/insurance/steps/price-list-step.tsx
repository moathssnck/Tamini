"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertCircle, Check } from "lucide-react"
import { offerData } from "@/lib/data"

interface PriceListStepProps {
  formData: any
  setFormData: (data: any) => void
  errors: Record<string, string>
  stepHeaderRef: React.RefObject<HTMLHeadingElement>
}

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

export function PriceListStep({ formData, setFormData, errors, stepHeaderRef }: PriceListStepProps) {
  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [fieldName]: value }))
  }

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      <div className="text-center mb-8 sm:mb-10 lg:mb-12 px-4">
        <Badge className="bg-green-100 text-green-700 px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold mb-4 sm:mb-6 rounded-full">
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          قائمة الأسعار
        </Badge>
        <h3
          ref={stepHeaderRef}
          tabIndex={-1}
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-900 mb-3 sm:mb-4 leading-tight"
        >
          مقارنة العروض المتاحة
        </h3>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          قارن بين العروض المتاحة واختر الأنسب لك
        </p>
      </div>

      <div className="flex justify-center mb-6 sm:mb-8 px-4">
        <div className="flex bg-gray-100 rounded-xl sm:rounded-2xl p-1 sm:p-2 shadow-inner w-full max-w-md">
          <button
            type="button"
            className={`flex-1 px-4 py-3 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-all duration-300 ${
              formData.insuranceTypeSelected === "against-others"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => handleFieldChange("insuranceTypeSelected", "against-others")}
          >
            ضد الغير
          </button>
          <button
            type="button"
            className={`flex-1 px-4 py-3 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-all duration-300 ${
              formData.insuranceTypeSelected === "comprehensive"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => handleFieldChange("insuranceTypeSelected", "comprehensive")}
          >
            شامل
          </button>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6 max-h-auto overflow-y-auto px-4">
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
                className={`relative transition-all duration-500 cursor-pointer hover:shadow-2xl rounded-xl sm:rounded-2xl transform hover:scale-[1.01] sm:hover:scale-[1.02] ${
                  isSelected
                    ? "ring-2 sm:ring-4 ring-blue-500 shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
                    : "hover:shadow-xl border-gray-200 bg-white hover:bg-gray-50"
                }`}
                onClick={() => handleFieldChange("selectedInsuranceOffer", offer.id)}
              >
                <CardContent className="p-0">
                  <div className="p-4 sm:p-6 pb-3 sm:pb-4">
                    <div className="flex items-start gap-3 sm:gap-6">
                      {/* Radio Button */}
                      <div className="flex-shrink-0 mt-1 sm:mt-2">
                        <div
                          className={`w-5 h-5 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            isSelected ? "border-blue-500 bg-blue-500 shadow-lg" : "border-gray-300 bg-white"
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 sm:w-3.5 sm:h-3.5 bg-white rounded-full" />}
                        </div>
                      </div>

                      <div
                        className={`w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-lg ${
                          isSelected ? "bg-blue-100 shadow-blue-200" : "bg-gray-100"
                        }`}
                      >
                        <img
                          src={offer.company.image_url || "/placeholder.svg?height=48&width=48"}
                          className="w-8 h-8 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl"
                          alt={offer.company.name}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base lg:text-lg text-gray-900 leading-tight mb-2 sm:mb-4 font-medium">
                          {offer.company.name.replace(/insurance/g, "").trim()}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <Badge
                            variant="secondary"
                            className="text-xs sm:text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-100 px-2 py-1 sm:px-4 sm:py-2 rounded-full"
                          >
                            {getTypeBadge(offer.type)}
                          </Badge>
                          {index < 3 && (
                            <Badge
                              className={`text-xs sm:text-sm font-semibold rounded-full px-2 py-1 sm:px-4 sm:py-2 ${
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

                      <div className="text-left flex-shrink-0">
                        <div className="text-xs sm:text-sm text-red-600 line-through mb-1">
                          {finalPrice.toFixed(0)} ر.س
                        </div>
                        <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-1">
                          {(finalPrice - finalPrice * 0.3).toFixed(0)} ر.س
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 leading-tight font-medium">سنوياً</p>
                      </div>
                    </div>
                  </div>

                  {offer.extra_features.filter((f) => f.price === 0).length > 0 && (
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                      <div className="pt-3 sm:pt-4 border-t border-gray-100">
                        <div className="space-y-2 sm:space-y-3">
                          {offer.extra_features
                            .filter((f) => f.price === 0)
                            .slice(0, 3)
                            .map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2 sm:gap-3">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-600" />
                                </div>
                                <span className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                                  {feature.content.length > 35
                                    ? feature.content.substring(0, 35) + "..."
                                    : feature.content}
                                </span>
                              </div>
                            ))}
                        </div>
                        {offer.extra_features.filter((f) => f.price === 0).length > 3 && (
                          <p className="text-xs sm:text-sm text-blue-600 mt-3 sm:mt-4 font-semibold">
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
        <div className="flex items-center gap-2 sm:gap-3 text-red-600 text-sm sm:text-base bg-red-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-red-200 shadow-lg mx-4">
          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
          <span className="font-medium">{errors.selectedInsuranceOffer}</span>
        </div>
      )}
    </div>
  )
}
