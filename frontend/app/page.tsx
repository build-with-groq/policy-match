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
      icon: <Brain className="w-8 h-8 text-groq-primary" />,
      title: "AI-Powered Analysis",
      description: "Advanced AI scans your policies for compliance gaps and provides actionable insights in seconds.",
      color: "groq",
    },
    {
      icon: <Shield className="w-8 h-8 text-groq-primary" />,
      title: "Multi-Framework Support",
      description: "Support for GDPR, CCPA, HIPAA, SOX, and other major compliance frameworks worldwide.",
      color: "groq",
    },
    {
      icon: <Zap className="w-8 h-8 text-groq-primary" />,
      title: "Instant Results",
      description: "Get compliance scores and detailed reports in seconds, not hours or days.",
      color: "groq",
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
    <div className="min-h-screen bg-gradient-to-br from-white via-groq-primary-light to-orange-50 overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-groq-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute opacity-10 text-groq-primary animate-float",
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

      <header className="relative z-50 border-b border-white/20 bg-white/90 backdrop-blur-sm sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-groq-primary to-groq-primary-hover rounded-lg flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-groq-dark to-groq-primary bg-clip-text text-transparent">
                PolicyMatch
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-groq-dark hover:text-groq-primary transition-colors duration-200">
                Features
              </a>
              <a href="#how-it-works" className="text-groq-dark hover:text-groq-primary transition-colors duration-200">
                How it Works
              </a>
              <a href="#pricing" className="text-groq-dark hover:text-groq-primary transition-colors duration-200">
                Pricing
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <Button variant="ghost" className="hidden sm:inline-flex hover:bg-groq-primary-light text-groq-dark">
                Sign In
              </Button>
              <Link href="/scanner">
                <Button className="bg-groq-primary hover:bg-groq-primary-hover text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
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
              <Badge className="inline-flex items-center gap-2 bg-groq-primary-light text-groq-primary border-groq-primary/20 px-4 py-2 rounded-full">
                <Star className="w-4 h-4" />
                Trusted by 500+ Companies Worldwide
              </Badge>

              <div className="space-y-6">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-groq-dark via-groq-primary to-groq-primary-hover bg-clip-text text-transparent">
                    Ensure Policy
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-groq-primary to-groq-primary-hover bg-clip-text text-transparent">
                    Compliance
                  </span>
                  <br />
                  <span className="text-groq-dark">with AI Precision</span>
                </h1>

                <p className="text-xl text-groq-dark/70 leading-relaxed max-w-2xl">
                  Upload your policy documents and get instant compliance analysis across GDPR, CCPA, HIPAA, and more.
                  Identify gaps, get recommendations, and stay compliant effortlessly.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/scanner">
                  <Button
                    size="lg"
                    className="bg-groq-primary hover:bg-groq-primary-hover text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Start Free Analysis
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg bg-white/80 backdrop-blur-sm border-groq-primary/20 text-groq-dark hover:bg-groq-primary-light hover:shadow-lg transition-all duration-300"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>

              <p className="text-sm text-groq-dark/60">
                No credit card required • Free for first 3 documents • Enterprise-grade security
              </p>

              <div className="pt-8">
                <p className="text-sm font-medium text-groq-dark/70 mb-4">Supports all major compliance frameworks:</p>
                <div className="flex gap-3 overflow-hidden">
                  <div className="flex gap-3 animate-scroll">
                    {[...complianceFrameworks, ...complianceFrameworks].map((framework, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="whitespace-nowrap bg-white/60 backdrop-blur-sm border-groq-primary/20 text-groq-dark"
                      >
                        {framework}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={cn("relative", isVisible ? "animate-slide-up animation-delay-500" : "opacity-0")}>
              <div className="relative">
                <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-2xl border-0 transform hover:scale-105 transition-all duration-500">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-groq-primary-light to-orange-50 rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-br from-groq-primary to-groq-primary-hover rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-groq-dark">Privacy Policy.pdf</h3>
                        <p className="text-sm text-groq-dark/70">Analyzing compliance...</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-groq-dark/70">AI Analysis Progress</span>
                        <span className="font-medium text-groq-dark">{scanProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-groq-primary to-groq-primary-hover rounded-full transition-all duration-100 ease-out"
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
                      <div className="p-4 bg-groq-primary-light rounded-lg border border-groq-primary/20">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-groq-primary" />
                          <span className="font-semibold text-groq-primary">Issues</span>
                        </div>
                        <p className="text-2xl font-bold text-groq-primary">3</p>
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-groq-primary-light rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Brain className="w-5 h-5 text-groq-primary" />
                        <span className="font-semibold text-groq-dark">AI Insights</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-groq-primary rounded-full animate-pulse"></div>
                          <span className="text-groq-dark/80">Data retention clause needs clarification</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-groq-dark/80">GDPR consent mechanisms are compliant</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-br from-groq-primary to-groq-primary-hover rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Animated Stats */}
          <div
            className={cn(
              "grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20",
              isVisible ? "animate-slide-up animation-delay-1000" : "opacity-0",
            )}
          >
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="p-6 text-center bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-groq-primary-light to-orange-100 rounded-full flex items-center justify-center">
                  <div className="text-groq-primary">{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold text-groq-dark mb-2">{stat.number}</div>
                <div className="text-groq-dark/70 font-medium">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-groq-dark mb-6">
              Everything You Need for
              <span className="bg-gradient-to-r from-groq-primary to-groq-primary-hover bg-clip-text text-transparent">
                {" "}
                Compliance
              </span>
            </h2>
            <p className="text-xl text-groq-dark/70 max-w-3xl mx-auto">
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
                    ? "bg-gradient-to-br from-white to-groq-primary-light ring-2 ring-groq-primary/30"
                    : "bg-white/95 backdrop-blur-sm hover:bg-gradient-to-br hover:from-white hover:to-groq-primary-light",
                )}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div
                  className={cn(
                    "w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300",
                    "bg-gradient-to-br from-groq-primary-light to-orange-100",
                    activeFeature === index && "scale-110 shadow-lg",
                  )}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-groq-dark mb-4">{feature.title}</h3>
                <p className="text-groq-dark/70 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-groq-dark mb-6">Simple 3-Step Process</h2>
            <p className="text-xl text-groq-dark/70">Get compliance insights in minutes, not days</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: 1,
                title: "Upload Document",
                desc: "Simply drag and drop your policy document or paste the text directly into our platform.",
              },
              {
                step: 2,
                title: "AI Analysis",
                desc: "Our AI analyzes your document against compliance frameworks and identifies potential issues.",
              },
              {
                step: 3,
                title: "Get Results",
                desc: "Receive detailed compliance scores, issue highlights, and actionable recommendations.",
              },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-groq-primary to-groq-primary-hover flex items-center justify-center text-2xl font-bold text-white shadow-lg transition-all duration-300 group-hover:scale-110">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-groq-dark mb-4">{item.title}</h3>
                <p className="text-groq-dark/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-groq-dark via-groq-primary to-groq-primary-hover relative overflow-hidden">
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
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Join hundreds of companies using PolicyMatch to stay compliant and avoid costly penalties.
          </p>
          <Link href="/scanner">
            <Button
              size="lg"
              className="bg-white text-groq-primary hover:bg-gray-100 px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Start Your Free Analysis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-groq-dark border-t border-groq-dark py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-groq-primary to-groq-primary-hover rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">PolicyMatch</span>
            </div>

            <div className="flex items-center gap-6 text-white/70">
              <a href="#" className="hover:text-white transition-colors duration-200">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200">
                Support
              </a>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-8">
            <div className="text-center md:text-left text-white/60 mb-4 md:mb-0">
              <p>&copy; 2025 PolicyMatch. All rights reserved.</p>
            </div>

            <div className="flex items-center">
              <a
                href="https://groq.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80"
              >
                <img
                  src="https://console.groq.com/powered-by-groq.svg"
                  alt="Powered by Groq for fast inference."
                  className="h-8"
                />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
