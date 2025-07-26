"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Building2, Search, BarChart3, Users, TrendingUp, FileText, Zap } from "lucide-react"

interface LoadingPageProps {
  companyName: string
  status: string
  progress: number
}

const loadingIcons = [Search, BarChart3, Users, TrendingUp, FileText, Zap]

export default function LoadingPage({ companyName, status, progress }: LoadingPageProps) {
  const currentIconIndex = Math.floor((progress / 100) * loadingIcons.length)
  const CurrentIcon = loadingIcons[Math.min(currentIconIndex, loadingIcons.length - 1)]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardContent className="p-12 text-center space-y-8">
          {/* Company Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Analyzing {companyName}</h1>
            </div>
            <p className="text-gray-600">Generating comprehensive company profile...</p>
          </div>

          {/* Animated Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                <CurrentIcon className="h-12 w-12 text-blue-600 animate-bounce" />
              </div>
              <div className="absolute inset-0 w-24 h-24 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            </div>
          </div>

          {/* Status Message */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">{status}</h2>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={progress} className="w-full h-3" />
              <div className="flex justify-center">
                <span className="text-sm text-gray-500">{progress}% Complete</span>
              </div>
            </div>
          </div>

          {/* Processing Steps */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {[
              { icon: Search, label: "Data Collection", completed: progress > 15 },
              { icon: BarChart3, label: "Financial Analysis", completed: progress > 30 },
              { icon: Users, label: "Management Info", completed: progress > 45 },
              { icon: TrendingUp, label: "Market Analysis", completed: progress > 60 },
              { icon: FileText, label: "Report Generation", completed: progress > 80 },
              { icon: Zap, label: "Finalization", completed: progress >= 95 },
            ].map((step, index) => {
              const StepIcon = step.icon
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-all duration-500 ${
                    step.completed
                      ? "bg-green-50 border-green-200 text-green-800"
                      : progress > index * 15
                        ? "bg-blue-50 border-blue-200 text-blue-800 animate-pulse"
                        : "bg-gray-50 border-gray-200 text-gray-500"
                  }`}
                >
                  <StepIcon className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-xs font-medium">{step.label}</p>
                </div>
              )
            })}
          </div>

          {/* Enhanced Fun Facts */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Processing Status:</span> We're analyzing over 15 different data points
              including financial metrics, leadership profiles, market position, and competitive landscape.
              {progress < 50 && " Data collection in progress..."}
              {progress >= 50 && progress < 80 && " Analysis and processing underway..."}
              {progress >= 80 && " Finalizing comprehensive report..."}
            </p>
          </div>

          {/* Progress indicator for long waits */}
          {progress > 70 && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">Almost there!</span> Complex analysis is taking a bit longer. We're
                ensuring comprehensive and accurate results for your report.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
