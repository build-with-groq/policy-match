"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Upload,
  FileText,
  CheckCircle,
  ArrowRight,
  Star,
  Play,
  Zap,
  Brain,
  Lock,
  TrendingUp,
  Users,
  Clock,
  Target,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [scanProgress, setScanProgress] = useState(0)

  useEffect(() => {
    setIsVisible(true)

    const progressInterval = setInterval(() => {
      setScanProgress((prev) => (prev >= 100 ? 0 : prev + 1))
    }, 50)

    const featureInterval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3)
    }, 3000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(featureInterval)
    }
  }, [])

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-blue-600" />,
      title: "AI-Powered Analysis",
      description: "Advanced AI scans your policies for compliance gaps and provides actionable insights in seconds.",
      color: "blue",
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Multi-Framework Support",
      description: "Support for GDPR, CCPA, HIPAA, SOX, and other major compliance frameworks worldwide.",
      color: "green",
    },
    {
      icon: <Zap className="w-8 h-8 text-purple-600" />,
      title: "Instant Results",
      description: "Get compliance scores and detailed reports in seconds, not hours or days.",
      color: "purple",
    },
  ]

  const stats = [
    { number: "10,000+", label: "Documents Analyzed", icon: <FileText className="w-5 h-5" /> },
    { number: "99.2%", label: "Accuracy Rate", icon: <Target className="w-5 h-5" /> },
    { number: "2.3s", label: "Average Scan Time", icon: <Clock className="w-5 h-5" /> },
    { number: "500+", label: "Companies Trust Us", icon: <Users className="w-5 h-5" /> },
  ]

  const complianceFrameworks = ["GDPR", "CCPA", "HIPAA", "SOX", "PCI DSS", "ISO 27001"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute opacity-10 text-slate-400 animate-float",
              i === 0 && "top-20 left-20 animation-delay-1000",
              i === 1 && "top-40 right-32 animation-delay-2000",
              i === 2 && "bottom-40 left-32 animation-delay-3000",
              i === 3 && "bottom-20 right-20 animation-delay-4000",
              i === 4 && "top-60 left-1/2 animation-delay-5000",
              i === 5 && "bottom-60 right-1/2 animation-delay-6000",
            )}
          >
            {i % 3 === 0 && <Shield className="w-8 h-8" />}
            {i % 3 === 1 && <FileText className="w-8 h-8" />}
            {i % 3 === 2 && <Lock className="w-8 h-8" />}
          </div>
        ))}
      </div>

      <header className="relative z-50 border-b border-white/20 bg-white/80 backdrop-blur-sm sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                PolicyMatch
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">
                Features
              </a>
              <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">
                How it Works
              </a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">
                Pricing
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <Button variant="ghost" className="hidden sm:inline-flex hover:bg-white/50">
                Sign In
              </Button>
              <Link href="/scanner">
                <Button className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                  Try Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={cn("space-y-8", isVisible ? "animate-slide-up" : "opacity-0")}>
              <Badge className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-200 px-4 py-2 rounded-full">
                <Star className="w-4 h-4" />
                Trusted by 500+ Companies Worldwide
              </Badge>

              <div className="space-y-6">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                    Ensure Policy
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Compliance
                  </span>
                  <br />
                  <span className="text-slate-800">with AI Precision</span>
                </h1>

                <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
                  Upload your policy documents and get instant compliance analysis across GDPR, CCPA, HIPAA, and more.
                  Identify gaps, get recommendations, and stay compliant effortlessly.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/scanner">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Start Free Analysis
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:shadow-lg transition-all duration-300"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>

              <p className="text-sm text-slate-500">
                No credit card required • Free for first 3 documents • Enterprise-grade security
              </p>

              <div className="pt-8">
                <p className="text-sm font-medium text-slate-600 mb-4">Supports all major compliance frameworks:</p>
                <div className="flex gap-3 overflow-hidden">
                  <div className="flex gap-3 animate-scroll">
                    {[...complianceFrameworks, ...complianceFrameworks].map((framework, index) => (
                      <Badge key={index} variant="outline" className="whitespace-nowrap bg-white/60 backdrop-blur-sm">
                        {framework}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={cn("relative", isVisible ? "animate-slide-up animation-delay-500" : "opacity-0")}>
              <div className="relative">
                <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-2xl border-0 transform hover:scale-105 transition-all duration-500">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">Privacy Policy.pdf</h3>
                        <p className="text-sm text-slate-600">Analyzing compliance...</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">AI Analysis Progress</span>
                        <span className="font-medium text-slate-900">{scanProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-100 ease-out"
                          style={{ width: `${scanProgress}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-800">Compliant</span>
                        </div>
                        <p className="text-2xl font-bold text-green-700">87%</p>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-amber-600" />
                          <span className="font-semibold text-amber-800">Issues</span>
                        </div>
                        <p className="text-2xl font-bold text-amber-700">3</p>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Brain className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-slate-900">AI Insights</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-slate-700">Data retention clause needs clarification</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-slate-700">GDPR consent mechanisms are compliant</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20",
              isVisible ? "animate-slide-up animation-delay-1000" : "opacity-0",
            )}
          >
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="p-6 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                  <div className="text-slate-600">{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">{stat.number}</div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Everything You Need for
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Compliance
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Powerful AI-driven tools to analyze, monitor, and maintain policy compliance across all major frameworks.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={cn(
                  "p-8 text-center border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer",
                  activeFeature === index
                    ? "bg-gradient-to-br from-white to-blue-50 ring-2 ring-blue-200"
                    : "bg-white/90 backdrop-blur-sm hover:bg-gradient-to-br hover:from-white hover:to-slate-50",
                )}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div
                  className={cn(
                    "w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300",
                    feature.color === "blue" && "bg-gradient-to-br from-blue-100 to-blue-200",
                    feature.color === "green" && "bg-gradient-to-br from-green-100 to-green-200",
                    feature.color === "purple" && "bg-gradient-to-br from-purple-100 to-purple-200",
                    activeFeature === index && "scale-110 shadow-lg",
                  )}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Simple 3-Step Process</h2>
            <p className="text-xl text-slate-600">Get compliance insights in minutes, not days</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: 1,
                title: "Upload Document",
                desc: "Simply drag and drop your policy document or paste the text directly into our platform.",
                color: "blue",
              },
              {
                step: 2,
                title: "AI Analysis",
                desc: "Our AI analyzes your document against compliance frameworks and identifies potential issues.",
                color: "green",
              },
              {
                step: 3,
                title: "Get Results",
                desc: "Receive detailed compliance scores, issue highlights, and actionable recommendations.",
                color: "purple",
              },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div
                  className={cn(
                    "w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg transition-all duration-300 group-hover:scale-110",
                    item.color === "blue" && "bg-gradient-to-br from-blue-500 to-blue-600",
                    item.color === "green" && "bg-gradient-to-br from-green-500 to-green-600",
                    item.color === "purple" && "bg-gradient-to-br from-purple-500 to-purple-600",
                  )}
                >
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Ensure Your Compliance?</h2>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Join hundreds of companies using PolicyMatch to stay compliant and avoid costly penalties.
          </p>
          <Link href="/scanner">
            <Button
              size="lg"
              className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Start Your Free Analysis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                PolicyMatch
              </span>
            </div>

            <div className="flex items-center gap-6 text-slate-600">
              <a href="#" className="hover:text-slate-900 transition-colors duration-200">
                Privacy
              </a>
              <a href="#" className="hover:text-slate-900 transition-colors duration-200">
                Terms
              </a>
              <a href="#" className="hover:text-slate-900 transition-colors duration-200">
                Support
              </a>
            </div>
          </div>

          <div className="border-t border-slate-200 mt-8 pt-8 text-center text-slate-500">
            <p>&copy; 2024 PolicyMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
