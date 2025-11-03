"use client";

import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CreditCard, Lock, AlertCircle } from "lucide-react";
import { cardValidation } from "@/lib/card-validation";

interface PaymentStepProps {
  paymentData: any;
  setPaymentData: (data: any) => void;
  cardErrors: Record<string, string>;
  setCardErrors: (errors: any) => void;
  cardType: { type: string; icon: string; color: string };
  setCardType: (type: any) => void;
  stepHeaderRef: React.RefObject<HTMLHeadingElement>;
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
  const validateCardField = (field: string, value: string): string | null => {
    switch (field) {
      case "cardNumber": {
        const clean = value.replace(/\D/g, "");
        if (!clean) return "رقم البطاقة مطلوب";
        if (clean.length < 13) return "رقم البطاقة قصير";
        if (clean.length > 19) return "رقم البطاقة طويل";
        if (!cardValidation.luhnCheck(clean)) return "رقم البطاقة غير صحيح";
        return null;
      }
      case "cardName":
        if (!value.trim()) return "اسم حامل البطاقة مطلوب";
        if (value.trim().length < 2) return "الاسم قصير جداً";
        if (!/^[a-zA-Z\s]+$/.test(value)) return "اكتب الاسم بالإنجليزية فقط";
        return null;
      case "cardMonth":
        if (!value) return "الشهر مطلوب";
        const m = +value;
        if (m < 1 || m > 12) return "شهر غير صحيح";
        return null;
      case "cardYear":
        if (!value) return "السنة مطلوبة";
        if (!cardValidation.validateExpiry(paymentData.cardMonth, value))
          return "تاريخ الانتهاء غير صالح";
        return null;
      case "cvv":
        if (!value) return "رمز الأمان مطلوب";
        if (!cardValidation.validateCVV(value, cardType.type))
          return cardType.type === "American Express"
            ? "يجب أن يكون 4 أرقام"
            : "يجب أن يكون 3 أرقام";
        return null;
      case "pinCode":
        if (!value) return "الرقم السري مطلوب";
        if (!/^\d{4}$/.test(value)) return "يجب أن يكون 4 أرقام";
        return null;
      default:
        return null;
    }
  };

  const handleFieldChange = (name: string, val: string) => {
    let v = val;
    if (name === "cardNumber") {
      v = cardValidation.formatCardNumber(val);
      setCardType(cardValidation.getCardType(val));
    }
    setPaymentData((p: any) => ({ ...p, [name]: v }));
    if (!validateCardField(name, v) && cardErrors[name]) {
      setCardErrors((p: any) => ({ ...p, [name]: "" }));
    }
  };

  const handleBlur = (name: string, val: string) => {
    const e = validateCardField(name, val);
    if (e) setCardErrors((p: any) => ({ ...p, [name]: e }));
  };

  const renderError = (msg?: string) =>
    msg && (
      <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
        <AlertCircle className="w-3 h-3" />
        {msg}
      </div>
    );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-1">
        <Badge className="bg-green-100 text-green-700 px-3 py-1 text-xs rounded-full">
          <CreditCard className="w-3 h-3 ml-1" /> بيانات الدفع
        </Badge>
        <h3
          ref={stepHeaderRef}
          tabIndex={-1}
          className="text-sm font-bold text-gray-900"
        >
          الدفع الآمن
        </h3>
        <p className="text-xs text-gray-600 max-w-xs mx-auto leading-snug">
          أدخل بيانات بطاقتك لإتمام عملية الدفع الآمن
        </p>
      </div>

      {/* Secure Banner */}
      <Card className="bg-blue-50 border-0 shadow-sm rounded-xl">
        <CardContent className="p-3 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white">
            <Lock className="w-4 h-4" />
          </div>
          <p className="text-xs font-medium text-blue-700">
            معلوماتك محمية بتشفير SSL 256-bit
          </p>
        </CardContent>
      </Card>

      {/* Payment Fields */}
      <div className="space-y-3">
        {/* Card Number */}
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1">
            رقم البطاقة <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              name="cardNumber"
              type="text"
              placeholder="#### #### #### ####"
              dir="rtl"
              value={paymentData.cardNumber}
              onChange={(e) => handleFieldChange("cardNumber", e.target.value)}
              onBlur={(e) => handleBlur("cardNumber", e.target.value)}
              maxLength={19}
              className={`h-9 text-sm rounded-lg border ${
                cardErrors.cardNumber
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200 focus:border-blue-500"
              }`}
            />
            {cardType.icon && (
              <img
                src={cardType.icon}
                alt="card"
                width={28}
                className="absolute left-2 top-1/2 -translate-y-1/2"
              />
            )}
          </div>
          {renderError(cardErrors.cardNumber)}
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1">
            اسم حامل البطاقة <span className="text-red-500">*</span>
          </label>
          <Input
            name="cardName"
            type="text"
            placeholder="JOHN SMITH"
            dir="ltr"
            value={paymentData.cardName}
            onChange={(e) => handleFieldChange("cardName", e.target.value)}
            onBlur={(e) => handleBlur("cardName", e.target.value)}
            className={`h-9 text-sm rounded-lg border ${
              cardErrors.cardName
                ? "border-red-400 bg-red-50"
                : "border-gray-200 focus:border-blue-500"
            }`}
          />
          {renderError(cardErrors.cardName)}
        </div>

        {/* Expiry + CVV */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-800">
              الشهر
            </label>
            <select
              className={`w-full h-9 rounded-lg text-sm border ${
                cardErrors.cardMonth
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200 focus:border-blue-500"
              }`}
              value={paymentData.cardMonth}
              onChange={(e) => handleFieldChange("cardMonth", e.target.value)}
              onBlur={(e) => handleBlur("cardMonth", e.target.value)}
            >
              <option value="">شهر</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={String(i + 1).padStart(2, "0")}>
                  {String(i + 1).padStart(2, "0")}
                </option>
              ))}
            </select>
            {renderError(cardErrors.cardMonth)}
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-800">
              السنة
            </label>
            <select
              className={`w-full h-9 rounded-lg text-sm border ${
                cardErrors.cardYear
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200 focus:border-blue-500"
              }`}
              value={paymentData.cardYear}
              onChange={(e) => handleFieldChange("cardYear", e.target.value)}
              onBlur={(e) => handleBlur("cardYear", e.target.value)}
            >
              <option value="">سنة</option>
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
            {renderError(cardErrors.cardYear)}
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-800">
              CVV
            </label>
            <Input
              type="password"
              maxLength={cardType.type === "American Express" ? 4 : 3}
              placeholder={
                cardType.type === "American Express" ? "1234" : "123"
              }
              value={paymentData.cvv}
              onChange={(e) => handleFieldChange("cvv", e.target.value)}
              onBlur={(e) => handleBlur("cvv", e.target.value)}
              className={`h-9 text-sm rounded-lg border ${
                cardErrors.cvv
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200 focus:border-blue-500"
              }`}
            />
            {renderError(cardErrors.cvv)}
          </div>
        </div>

        {/* PIN */}
        <div>
          <label className="block text-xs font-semibold mb-1 text-gray-800">
            الرقم السري
          </label>
          <Input
            type="password"
            placeholder="####"
            maxLength={4}
            value={paymentData.pinCode}
            onChange={(e) => handleFieldChange("pinCode", e.target.value)}
            onBlur={(e) => handleBlur("pinCode", e.target.value)}
            className={`h-9 text-sm rounded-lg border ${
              cardErrors.pinCode
                ? "border-red-400 bg-red-50"
                : "border-gray-200 focus:border-blue-500"
            }`}
          />
          {renderError(cardErrors.pinCode)}
        </div>
      </div>

      {/* Security Info */}
      <Card className="bg-green-50 border-0 shadow-sm rounded-xl">
        <CardContent className="p-3 space-y-1 text-xs text-green-700">
          <div className="flex items-center gap-2">
            <Lock className="w-3 h-3 text-green-600" />
            <span>تشفير SSL 256-bit</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-3 h-3 text-green-600" />
            <span>معايير PCI DSS</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-3 h-3 text-green-600" />
            <span>حماية من الاحتيال</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
