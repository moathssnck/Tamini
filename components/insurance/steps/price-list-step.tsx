"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertCircle, Check } from "lucide-react"
import { offerData } from "@/lib/data"

// Mock offer data - in real app this would come from props or API
const mockOfferData = [
  {
    id: "offer-1",
    company: { name: "شركة التأمين الأولى", image_url: "/placeholder.svg?height=48&width=48" },
    type: "against-others",
    main_price: "1200",
    extra_expenses: [{ price: 180 }],
    extra_features: [
      { id: "f1", content: "تغطية شاملة للأضرار", price: 0 },
      { id: "f2", content: "خدمة الطوارئ 24/7", price: 0 },
      { id: "f3", content: "استبدال المركبة", price: 0 },
    ],
  },
  {
    id: "offer-2",
    company: { name: "شركة التأمين الثانية", image_url: "/placeholder.svg?height=48&width=48" },
    type: "comprehensive",
    main_price: "2400",
    extra_expenses: [{ price: 360 }],
    extra_features: [
      { id: "f4", content: "تغطية شاملة للأضرار", price: 0 },
      { id: "f5", content: "خدمة الطوارئ 24/7", price: 0 },
      { id: "f6", content: "استبدال المركبة", price: 0 },
      { id: "f7", content: "تأمين ضد السرقة", price: 0 },
    ],
  },
  {
    id: "offer-3",
    company: { name: "شركة التأمين الثالثة", image_url: "/placeholder.svg?height=48&width=48" },
    type: "against-others",
    main_price: "1100",
    extra_expenses: [{ price: 165 }],
    extra_features: [
      { id: "f8", content: "تغطية الأضرار الأساسية", price: 0 },
      { id: "f9", content: "خدمة الطوارئ", price: 0 },
    ],
  },
]

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
    <div className="space-y-10">
      <div className="text-center mb-12">
        <Badge className="bg-green-100 text-green-700 px-6 py-3 text-base font-semibold mb-6 rounded-full">
          <TrendingUp className="w-5 h-5 ml-2" />
          قائمة الأسعار
        </Badge>
        <h3 ref={stepHeaderRef} tabIndex={-1} className="text-md lg:text-4xl font-bold text-gray-900 mb-4">
          مقارنة العروض المتاحة
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          قارن بين العروض المتاحة واختر الأنسب لك
        </p>
      </div>

      {/* Insurance Type Toggle */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-gray-100 rounded-2xl p-2 shadow-inner">
          <button
            type="button"
            className={`px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 ${
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
            className={`px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 ${
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

      {/* Offers List */}
      <div className="space-y-6 max-h-auto overflow-y-auto">
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
                className={`relative transition-all duration-500 cursor-pointer hover:shadow-2xl rounded-2xl transform hover:scale-[1.02] ${
                  isSelected
                    ? "ring-4 ring-blue-500 shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
                    : "hover:shadow-xl border-gray-200 bg-white hover:bg-gray-50"
                }`}
                onClick={() => handleFieldChange("selectedInsuranceOffer", offer.id)}
              >
                <CardContent className="p-0">
                  {/* Header Section */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start gap-6">
                      {/* Radio Button */}
                      <div className="flex-shrink-0 mt-2">
                        <div
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            isSelected ? "border-blue-500 bg-blue-500 shadow-lg" : "border-gray-300 bg-white"
                          }`}
                        >
                          {isSelected && <div className="w-3.5 h-3.5 bg-white rounded-full" />}
                        </div>
                      </div>

                      {/* Company Icon */}
                      <div
                        className={`w-20 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-lg ${
                          isSelected ? "bg-blue-100 shadow-blue-200" : "bg-gray-100"
                        }`}
                      >
                        <img
                          src={offer.company.image_url || "/placeholder.svg?height=48&width=48"}
                          className="w-14 h-14 rounded-xl"
                          alt={offer.company.name}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-lg leading-tight mb-4">
                          {offer.company.name.replace(/insurance/g, "").trim()}
                        </h4>

                        <div className="flex flex-wrap items-center gap-3">
                          <Badge
                            variant="secondary"
                            className="text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-full"
                          >
                            {getTypeBadge(offer.type)}
                          </Badge>

                          {index < 3 && (
                            <Badge
                              className={`text-sm font-semibold rounded-full px-4 py-2 ${
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
                        <div className="text-lg font-bold text-red-600 line-through mb-1">
                          {finalPrice.toFixed(0)} ر.س
                        </div>
                        <div className="text-sm font-bold text-gray-900 mb-1">
                          {(finalPrice - finalPrice * 0.3).toFixed(0)} ر.س
                        </div>
                        <p className="text-sm text-gray-500 leading-tight font-medium">سنوياً</p>
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
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <Check className="w-3.5 h-3.5 text-green-600" />
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
                          <p className="text-sm text-blue-600 mt-4 font-semibold">
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

      {/* Error Message */}
      {errors.selectedInsuranceOffer && (
        <div className="flex items-center gap-3 text-red-600 text-base bg-red-50 p-6 rounded-2xl border border-red-200 shadow-lg">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <span className="font-medium">{errors.selectedInsuranceOffer}</span>
        </div>
      )}
    </div>
  )
}
