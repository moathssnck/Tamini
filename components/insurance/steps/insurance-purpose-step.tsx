"use client";

import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  UserCheck,
  ArrowRight,
  AlertCircle,
  Check,
  Building2,
} from "lucide-react";

interface InsurancePurposeStepProps {
  formData: any;
  setFormData: (field: string, value: any) => void;
  errors: Record<string, string>;
  stepHeaderRef: React.RefObject<HTMLHeadingElement>;
  onFieldBlur?: (field: string) => void;
}

export function InsurancePurposeStep({
  formData,
  setFormData,
  errors,
  stepHeaderRef,
  onFieldBlur,
}: InsurancePurposeStepProps) {
  const renderError = (msg?: string) =>
    msg && (
      <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
        <AlertCircle className="w-3 h-3" />
        {msg}
      </div>
    );

  const SelectButton = ({
    active,
    onClick,
    icon: Icon,
    title,
    desc,
    color,
  }: {
    active: boolean;
    onClick: () => void;
    icon: any;
    title: string;
    desc: string;
    color: string;
  }) => (
    <button
      onClick={onClick}
      type="button"
      className={`relative p-3 text-center rounded-lg border transition-all text-sm ${
        active
          ? `border-${color}-500 bg-white ring-2 ring-${color}-200`
          : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
      }`}
    >
      <div
        className={`w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-md bg-gradient-to-br from-${color}-500 to-${color}-600 text-white`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="font-semibold text-gray-900 text-xs">{title}</div>
      <div className="text-gray-500 text-[11px]">{desc}</div>
      {active && (
        <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
          <Check className="w-2 h-2 text-white" />
        </div>
      )}
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-1">
        <Badge className="bg-blue-100 text-blue-700 px-3 py-1 text-xs rounded-full">
          <FileText className="w-3 h-3 ml-1" /> البيانات الأساسية
        </Badge>
        <h3
          ref={stepHeaderRef}
          tabIndex={-1}
          className="text-sm font-bold text-gray-900"
        >
          معلومات المركبة والمالك
        </h3>
        <p className="text-xs text-gray-600 max-w-xs mx-auto leading-snug">
          أدخل معلومات المركبة والمالك لعرض السعر المخصص
        </p>
      </div>

      {/* Insurance Purpose */}
      <Card className="bg-blue-50 border-0 shadow-sm rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-800">
            <FileText className="w-4 h-4 text-blue-600" />
            الغرض من التأمين
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SelectButton
              active={formData.insurance_purpose === "renewal"}
              onClick={() => setFormData("insurance_purpose", "renewal")}
              icon={UserCheck}
              title="تجديد"
              desc="وثيقة موجودة"
              color="green"
            />
            <SelectButton
              active={formData.insurance_purpose === "property-transfer"}
              onClick={() =>
                setFormData("insurance_purpose", "property-transfer")
              }
              icon={ArrowRight}
              title="نقل ملكية"
              desc="مركبة جديدة"
              color="orange"
            />
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Type */}
      <Card className="bg-green-50 border-0 shadow-sm rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-800">
            <Building2 className="w-4 h-4 text-green-600" />
            نوع المركبة
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SelectButton
              active={formData.vehicle_type === "serial"}
              onClick={() => setFormData("vehicle_type", "serial")}
              icon={FileText}
              title="برقم تسلسلي"
              desc="مركبة مسجلة"
              color="green"
            />
            <SelectButton
              active={formData.vehicle_type === "custom"}
              onClick={() => setFormData("vehicle_type", "custom")}
              icon={Building2}
              title="برقم لوحة"
              desc="مركبة بلوحة"
              color="purple"
            />
          </div>
        </CardContent>
      </Card>

      {/* Fields */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1">
            اسم المالك <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            placeholder="الاسم الكامل"
            value={formData.documment_owner_full_name}
            onChange={(e) =>
              setFormData("documment_owner_full_name", e.target.value)
            }
            className={`h-9 text-sm rounded-lg border ${
              errors.documment_owner_full_name
                ? "border-red-400 bg-red-50"
                : "border-gray-200 focus:border-blue-500"
            }`}
          />
          {renderError(errors.documment_owner_full_name)}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1">
            الرقم التسلسلي <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            placeholder="123456789"
            value={formData.sequenceNumber}
            onChange={(e) => setFormData("sequenceNumber", e.target.value)}
            className={`h-9 text-sm rounded-lg border ${
              errors.sequenceNumber
                ? "border-red-400 bg-red-50"
                : "border-gray-200 focus:border-blue-500"
            }`}
          />
          {renderError(errors.sequenceNumber)}
        </div>

        {/* Conditional Fields */}
        {formData.insurance_purpose === "renewal" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">
                رقم هوية المالك <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                maxLength={10}
                placeholder="##########"
                value={formData.owner_identity_number}
                onChange={(e) =>
                  setFormData("owner_identity_number", e.target.value)
                }
                className={`h-9 text-sm rounded-lg border ${
                  errors.owner_identity_number
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 focus:border-blue-500"
                }`}
              />
              {renderError(errors.owner_identity_number)}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">
                رقم الهاتف <span className="text-red-500">*</span>
              </label>
              <Input
                type="tel"
                maxLength={10}
                placeholder="05########"
                value={formData.phoneNumber}
                onChange={(e) => setFormData("phoneNumber", e.target.value)}
                className={`h-9 text-sm rounded-lg border ${
                  errors.phoneNumber
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 focus:border-blue-500"
                }`}
              />
              {renderError(errors.phoneNumber)}
            </div>
          </div>
        )}

        {formData.insurance_purpose === "property-transfer" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">
                هوية المشتري <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                maxLength={10}
                placeholder="##########"
                value={formData.buyer_identity_number}
                onChange={(e) =>
                  setFormData("buyer_identity_number", e.target.value)
                }
                className={`h-9 text-sm rounded-lg border ${
                  errors.buyer_identity_number
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 focus:border-blue-500"
                }`}
              />
              {renderError(errors.buyer_identity_number)}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">
                هوية البائع <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                maxLength={10}
                placeholder="##########"
                value={formData.seller_identity_number}
                onChange={(e) =>
                  setFormData("seller_identity_number", e.target.value)
                }
                className={`h-9 text-sm rounded-lg border ${
                  errors.seller_identity_number
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 focus:border-blue-500"
                }`}
              />
              {renderError(errors.seller_identity_number)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
