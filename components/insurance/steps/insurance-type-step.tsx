"use client";

import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Users, Star } from "lucide-react";

interface InsuranceTypeStepProps {
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
  stepHeaderRef: React.RefObject<HTMLHeadingElement>;
}

export function InsuranceTypeStep({
  formData,
  setFormData,
  stepHeaderRef,
}: InsuranceTypeStepProps) {
  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [fieldName]: value }));
  };

  const SelectButton = ({
    active,
    icon: Icon,
    title,
    desc,
    color,
    value,
  }: {
    active: boolean;
    icon: any;
    title: string;
    desc: string;
    color: string;
    value: string;
  }) => (
    <button
      onClick={() => handleFieldChange("insuranceTypeSelected", value)}
      className={`relative p-3 text-center rounded-lg border text-xs transition-all ${
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
      <div className="font-semibold text-gray-900">{title}</div>
      <div className="text-gray-500 text-[11px]">{desc}</div>
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-1">
        <Badge className="bg-green-100 text-green-700 px-3 py-1 text-xs rounded-full">
          <Shield className="w-3 h-3 ml-1" />
          بيانات التأمين
        </Badge>
        <h3
          ref={stepHeaderRef}
          tabIndex={-1}
          className="text-sm font-bold text-gray-900"
        >
          تفاصيل وثيقة التأمين
        </h3>
        <p className="text-xs text-gray-600 max-w-xs mx-auto leading-snug">
          حدد تفاصيل الوثيقة ونوع التغطية المطلوبة
        </p>
      </div>

      {/* Insurance Type */}
      <Card className="bg-blue-50 border-0 shadow-sm rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-800">
            <Shield className="w-4 h-4 text-blue-600" />
            نوع التأمين
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SelectButton
              active={formData.insuranceTypeSelected === "comprehensive"}
              icon={Shield}
              title="شامل"
              desc="كل الأضرار"
              color="blue"
              value="comprehensive"
            />
            <SelectButton
              active={formData.insuranceTypeSelected === "against-others"}
              icon={Users}
              title="ضد الغير"
              desc="الأطراف الأخرى"
              color="green"
              value="against-others"
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Additional Drivers */}
        <Card className="bg-blue-50 border-0 shadow-sm rounded-xl">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white">
                <Users className="w-4 h-4" />
              </div>
              <span className="font-semibold text-gray-900 text-sm">
                السائقون
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 mb-2">
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center hover:opacity-90 text-sm"
                onClick={() =>
                  handleFieldChange(
                    "additionalDrivers",
                    Math.max(0, formData.additionalDrivers - 1)
                  )
                }
              >
                −
              </button>
              <span className="text-lg font-bold text-gray-900 w-8 text-center">
                {formData.additionalDrivers}
              </span>
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center hover:opacity-90 text-sm"
                onClick={() =>
                  handleFieldChange(
                    "additionalDrivers",
                    Math.min(5, formData.additionalDrivers + 1)
                  )
                }
              >
                +
              </button>
            </div>
            <p className="text-gray-500 text-[11px]">الحد الأقصى 5 سائقين</p>
          </CardContent>
        </Card>

        {/* Discounts */}
        <Card className="bg-green-50 border-0 shadow-sm rounded-xl">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center text-white">
                <Star className="w-4 h-4" />
              </div>
              <span className="font-semibold text-green-800 text-sm">
                خصومات
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 mb-3">
              <input
                type="checkbox"
                className="w-4 h-4 text-green-600 border-2 border-green-300 rounded-md focus:ring-green-500"
                checked={formData.specialDiscounts}
                onChange={(e) =>
                  handleFieldChange("specialDiscounts", e.target.checked)
                }
              />
              <span className="text-xs text-green-800 font-medium">
                أرغب بخصومات خاصة
              </span>
            </div>
            <Button className="w-full py-2 text-xs bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg shadow hover:shadow-md transition-all">
              عرض الخصومات
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
