"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, CheckCircle } from "lucide-react"

// Mock offer data - in real app this would come from props or API
const mockOfferData = [
  {
    id: "offer-1",
    extra_features: [
      { id: "addon-1", content: "تأمين إضافي ضد الحوادث", price: 200 },
      { id: "addon-2", content: "خدمة الإنقاذ المتقدمة", price: 150 },
    ],
  },
]

interface AddonsStepProps {
  formData: any
  setFormData: (data: any) => void
  errors: Record<string, string>
  stepHeaderRef: React.RefObject<HTMLHeadingElement>
}

export function AddonsStep({ formData, setFormData, errors, stepHeaderRef }: AddonsStepProps) {
  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [fieldName]: value }))
  }

  return (
    <div className="space-y-10">
      <div className="text-center mb-12">
        <Badge className="bg-purple-100 text-purple-700 px-6 py-3 text-base font-semibold mb-6 rounded-full">
          <Star className="w-5 h-5 ml-2" />
          الإضافات والخدمات
        </Badge>
        <h3 ref={stepHeaderRef} tabIndex={-1} className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          الخدمات الإضافية
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          اختر الخدمات الإضافية التي تناسب احتياجاتك
        </p>
      </div>

      {(() => {
        const selectedOffer = mockOfferData.find((offer) => offer.id === formData.selectedInsuranceOffer)
        const paidFeatures = selectedOffer?.extra_features.filter((f) => f.price > 0) || []

        if (paidFeatures.length === 0) {
          return (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-6">جميع المزايا مشمولة!</h4>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                العرض المختار يشمل جميع المزايا الأساسية بدون رسوم إضافية
              </p>
            </div>
          )
        }

        return (
          <div className="space-y-6">
            {paidFeatures.map((feature) => (
              <Card
                key={feature.id}
                className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl bg-white hover:bg-gray-50 transform hover:scale-[1.02]"
              >
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <input
                        type="checkbox"
                        className="w-7 h-7 text-blue-600 rounded-xl border-2 border-gray-300 focus:ring-blue-500 focus:ring-2"
                        checked={formData.selectedAddons.includes(feature.id)}
                        onChange={(e) => {
                          const newAddons = e.target.checked
                            ? [...formData.selectedAddons, feature.id]
                            : formData.selectedAddons.filter((id: string) => id !== feature.id)
                          handleFieldChange("selectedAddons", newAddons)
                        }}
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-3">{feature.content}</h4>
                        <p className="text-gray-600 font-medium">خدمة إضافية اختيارية</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-xl font-bold text-gray-900">+{feature.price} ر.س</p>
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
  )
}
