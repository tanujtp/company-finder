"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Globe, Play, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import LoadingPage from "./loading-page"

interface ApiResponse {
  result: {
    conversation_id: string
    message_id: string
  }
}

interface CompanyProfile {
  Company_Name: string
  Company_Website: string
  Products_and_Services_Portfolio: string
  Headquarters: string
  End_Markets: string
  Key_Customers: string
  Number_of_Employees: string
  Key_Management: any
  Financial_Overview: any
  Historical_Timeline: string
  Key_Merger_and_Acquisitions: string
  Recent_Developments: string
  Financing_Details: string
  Ownership_Details: string
  Revenue_Breakdown: any
  Business_Overview: string
}

export default function CompanyProfilePage() {
  const [companyName, setCompanyName] = useState("")
  const [companyWebsite, setCompanyWebsite] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  const [loadingStep, setLoadingStep] = useState(0)

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const pollForResults = async (conversationId: string, messageId: string) => {
    const maxAttempts = 180 // 15 minutes with 5-second intervals (15 * 60 / 5 = 180)
    let attempts = 0

    const loadingMessages = [
      "Initializing company analysis...",
      "Gathering financial data...",
      "Processing market information...",
      "Analyzing competitive landscape...",
      "Extracting management details...",
      "Compiling product portfolio...",
      "Reviewing recent developments...",
      "Analyzing revenue streams...",
      "Processing historical data...",
      "Finalizing comprehensive report...",
    ]

    while (attempts < maxAttempts) {
      try {
        // Update loading message based on progress
        const progressPercentage = (attempts / maxAttempts) * 100
        const messageIndex = Math.min(
          Math.floor((attempts / maxAttempts) * loadingMessages.length),
          loadingMessages.length - 1,
        )
        setStatus(loadingMessages[messageIndex])
        setLoadingStep(Math.floor(progressPercentage))

        console.log(`Polling attempt ${attempts + 1}/${maxAttempts} (${progressPercentage.toFixed(1)}%)`)

        const response = await fetch(
          `https://edge-service.simplai.ai/interact/api/v1/intract/conversation/fetchDetails?cId=${conversationId}&mId=${messageId}`,
          {
            headers: {
              "X-USER-ID": "72",
              "X-TENANT-ID": "11",
              "PIM-SID": "2b54602b-a3cd-4009-87d6-167494bf7436",
              "X-DEVICE-ID": "simplai",
              "Content-Type": "application/json",
            },
          },
        )

        if (!response.ok) {
          console.log(`HTTP error! status: ${response.status}`)
          attempts++
          await sleep(5000) // Wait 5 seconds before next attempt
          continue
        }

        // Get response text first to check if it's valid
        const responseText = await response.text()

        if (!responseText || responseText.trim() === "") {
          console.log("Empty response body, continuing to poll...")
          attempts++
          await sleep(5000)
          continue
        }

        // Try to parse JSON
        let data
        try {
          data = JSON.parse(responseText)
        } catch (jsonError) {
          console.log("Invalid JSON response:", responseText.substring(0, 200))
          attempts++
          await sleep(5000)
          continue
        }

        console.log("Received data structure:", {
          hasOutput: !!data?.output,
          outputType: typeof data?.output,
          outputKeys: data?.output ? Object.keys(data.output).slice(0, 10) : [],
          sampleData: data?.output
            ? Object.keys(data.output)
                .slice(0, 3)
                .map((key) => [key, typeof data.output[key]])
            : [],
        })

        // Check if we have the expected data structure with output object (not array)
        if (data && data.output && typeof data.output === "object" && !Array.isArray(data.output)) {
          const result = data.output

          // Check if we have the structured company profile data
          const hasValidCompanyData =
            result &&
            typeof result === "object" &&
            (result.Company_Name || result.Business_Overview || result.Financial_Overview) &&
            Object.keys(result).length > 5 // Ensure we have substantial data

          console.log("Data validation:", {
            hasResult: !!result,
            hasCompanyName: !!result?.Company_Name,
            hasBusinessOverview: !!result?.Business_Overview,
            hasFinancialOverview: !!result?.Financial_Overview,
            totalKeys: result ? Object.keys(result).length : 0,
            isValid: hasValidCompanyData,
          })

          if (hasValidCompanyData) {
            console.log("Valid company profile data received! Processing completion...")
            setStatus("Analysis complete! Processing results...")
            setLoadingStep(95)

            // Store results
            sessionStorage.setItem("companyProfileData", JSON.stringify(result))

            // Brief delay to show completion status
            await sleep(1000)

            setStatus("Redirecting to report...")
            setLoadingStep(100)

            // Redirect to report page
            setTimeout(() => {
              window.location.href = "/report"
            }, 500)
            return
          } else {
            console.log("Data structure exists but company profile not ready yet:", {
              resultKeys: result ? Object.keys(result) : [],
              hasCompanyName: !!result?.Company_Name,
              hasBusinessOverview: !!result?.Business_Overview,
              hasFinancialOverview: !!result?.Financial_Overview,
              sampleContent: result?.Company_Name ? result.Company_Name.substring(0, 50) : "N/A",
            })
          }
        } else {
          console.log("No valid output structure found:", {
            hasData: !!data,
            hasOutput: !!data?.output,
            outputType: typeof data?.output,
            isArray: Array.isArray(data?.output),
            outputStructure: data?.output
              ? Array.isArray(data.output)
                ? `Array[${data.output.length}]`
                : `Object with keys: ${Object.keys(data.output).slice(0, 5).join(", ")}`
              : "None",
          })
        }

        // If we get here, the data isn't ready yet
        attempts++
        await sleep(5000) // Wait exactly 5 seconds before next attempt
      } catch (error) {
        console.error("Polling error:", error)

        // If it's a network error, continue trying
        if (error instanceof TypeError && error.message.includes("fetch")) {
          console.log("Network error, retrying in 5 seconds...")
          attempts++
          await sleep(5000)
          continue
        }

        // For other errors, still continue but log them
        console.log("Non-network error, continuing to poll:", error)
        attempts++
        await sleep(5000)
      }
    }

    // If we've exhausted all attempts
    throw new Error(
      `Analysis timed out after 15 minutes (${maxAttempts} attempts). The service may be experiencing high load or the analysis is taking longer than expected. Please try again.`,
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!companyName.trim() || !companyWebsite.trim()) {
      setError("Please fill in both company name and website")
      return
    }

    setIsLoading(true)
    setError("")
    setStatus("Initiating analysis...")
    setLoadingStep(0)

    try {
      console.log("Initiating POST request to start analysis...")

      const requestBody = {
        tool_id: "687d1e0e52c9c1d6fc6f0165",
        language_code: "EN",
        source: "APP",
        action: "START_SCREEN",
        cust_attr: {},
        inputs: {
          company_name: companyName.trim(),
          company_website: companyWebsite.trim(),
        },
      }

      console.log("POST request body:", JSON.stringify(requestBody, null, 2))

      // Step 1: Initiate the tool with POST request
      const initResponse = await fetch("https://edge-service.simplai.ai/interact/api/ve1/intract/tool/conversation", {
        method: "POST",
        headers: {
          "X-DEVICE-ID": "simplai",
          "PIM-SID": "2b54602b-a3cd-4009-87d6-167494bf7436",
          "X-TENANT-ID": "11",
          "X-USER-ID": "72",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      console.log("POST request completed. Status:", initResponse.status)
      console.log("POST request headers sent:", {
        "Content-Type": "application/json",
        "X-USER-ID": "72",
        "X-TENANT-ID": "11",
        "PIM-SID": "2b54602b-a3cd-4009-87d6-167494bf7436",
        "X-DEVICE-ID": "simplai",
        Accept: "application/json",
      })

      if (!initResponse.ok) {
        const errorText = await initResponse.text()
        console.error("Init API Error Details:", {
          status: initResponse.status,
          statusText: initResponse.statusText,
          headers: Object.fromEntries(initResponse.headers.entries()),
          body: errorText,
        })

        // Try to parse the error response
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { message: errorText }
        }

        // Provide more specific error messages
        if (initResponse.status === 401) {
          throw new Error(
            `Authentication failed: ${errorData.result || "Access denied"}. Please verify your credentials and permissions.`,
          )
        } else if (initResponse.status === 403) {
          throw new Error(`Access forbidden: You don't have permission to access this resource.`)
        } else if (initResponse.status === 404) {
          throw new Error(`Tool configuration not found. Please verify the tool ID is correct and active.`)
        } else if (initResponse.status === 400) {
          throw new Error(`Invalid request format: ${errorData.message || "Please check the input parameters"}.`)
        } else {
          throw new Error(`Failed to initiate analysis: ${initResponse.status} - ${errorData.result || errorText}`)
        }
      }

      let initData: ApiResponse
      try {
        const responseText = await initResponse.text()
        console.log("POST response received:", responseText.substring(0, 200))
        initData = JSON.parse(responseText)
      } catch (jsonError) {
        console.error("Failed to parse init response as JSON")
        throw new Error("Invalid response from analysis service")
      }

      if (!initData.result?.conversation_id || !initData.result?.message_id) {
        console.error("Invalid init response structure:", initData)
        throw new Error("Invalid response from analysis service - missing conversation details")
      }

      console.log("Analysis initiated successfully:", {
        conversationId: initData.result.conversation_id,
        messageId: initData.result.message_id,
      })

      setStatus("Analysis started, processing data...")

      // Step 2: Poll for results
      await pollForResults(initData.result.conversation_id, initData.result.message_id)
    } catch (error) {
      console.error("Error:", error)

      if (error instanceof Error) {
        if (error.message.includes("fetch")) {
          setError("Network error: Please check your internet connection and try again")
        } else if (error.message.includes("timed out")) {
          setError(
            "Analysis timed out after 15 minutes. The service may be experiencing high load. Please try again later.",
          )
        } else {
          setError(error.message)
        }
      } else {
        setError("An unexpected error occurred. Please try again.")
      }

      setStatus("")
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingPage companyName={companyName} status={status} progress={loadingStep} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center gap-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Company Profile Analyzer</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get comprehensive insights about any company including financials, management, products, and market analysis
          </p>
        </div>

        {/* Input Form */}
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Company Information
            </CardTitle>
            <CardDescription>Enter the company details to generate a comprehensive profile analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  placeholder="e.g., Apple Inc."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-website">Company Website</Label>
                <Input
                  id="company-website"
                  placeholder="e.g., https://www.apple.com"
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading} size="lg">
                <Play className="mr-2 h-4 w-4" />
                Run Analysis
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
