"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Building2,
  Globe,
  Users,
  TrendingUp,
  MapPin,
  DollarSign,
  Briefcase,
  Target,
  Award,
  FileText,
  PieChart,
  History,
  Handshake,
} from "lucide-react"
import ReactMarkdown from "react-markdown"

interface CompanyProfile {
  Company_Name: string
  Company_Website: string
  Products_and_Services_Portfolio: string
  Headquarters: string
  End_Markets: string
  Key_Customers: string
  Number_of_Employees: string
  Key_Management: string
  Financial_Overview: string
  Historical_Timeline: string
  Key_Merger_and_Acquisitions: string
  Recent_Developments: string
  Financing_Details: string
  Ownership_Details: string
  Revenue_Breakdown: string
  Business_Overview: string
}

interface CompanyProfileResultsProps {
  data: CompanyProfile
}

const sectionConfig = [
  {
    key: "Business_Overview",
    title: "Business Overview",
    icon: Building2,
    description: "Core business model and operations",
  },
  {
    key: "Products_and_Services_Portfolio",
    title: "Products & Services",
    icon: Briefcase,
    description: "Complete portfolio of offerings",
  },
  {
    key: "Financial_Overview",
    title: "Financial Overview",
    icon: DollarSign,
    description: "Key financial metrics and performance",
  },
  {
    key: "Revenue_Breakdown",
    title: "Revenue Breakdown",
    icon: PieChart,
    description: "Revenue segmentation and analysis",
  },
  {
    key: "Key_Management",
    title: "Key Management",
    icon: Users,
    description: "Leadership team and executives",
  },
  {
    key: "End_Markets",
    title: "End Markets",
    icon: Target,
    description: "Target markets and customer segments",
  },
  {
    key: "Key_Customers",
    title: "Key Customers",
    icon: Handshake,
    description: "Major clients and partnerships",
  },
  {
    key: "Historical_Timeline",
    title: "Historical Timeline",
    icon: History,
    description: "Company milestones and evolution",
  },
  {
    key: "Key_Merger_and_Acquisitions",
    title: "M&A Activity",
    icon: Award,
    description: "Mergers and acquisitions history",
  },
  {
    key: "Recent_Developments",
    title: "Recent Developments",
    icon: TrendingUp,
    description: "Latest news and updates",
  },
  {
    key: "Financing_Details",
    title: "Financing Details",
    icon: FileText,
    description: "Funding and financial structure",
  },
  {
    key: "Ownership_Details",
    title: "Ownership Structure",
    icon: Building2,
    description: "Ownership and shareholding information",
  },
]

export default function CompanyProfileResults({ data }: CompanyProfileResultsProps) {
  return (
    <div className="space-y-6">
      {/* Company Header */}
      <Card className="shadow-lg border-l-4 border-l-blue-600">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Building2 className="h-8 w-8 text-blue-600" />
                {data.Company_Name}
              </CardTitle>
              <div className="flex items-center gap-2 text-gray-600">
                <Globe className="h-4 w-4" />
                <a
                  href={data.Company_Website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                >
                  {data.Company_Website}
                </a>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm">
              <MapPin className="h-3 w-3 mr-1" />
              {data.Headquarters ? data.Headquarters.split("\n")[0] : "N/A"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-sm text-gray-600">Employees</div>
              <div className="font-semibold">{data.Number_of_Employees || "N/A"}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <MapPin className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-sm text-gray-600">Headquarters</div>
              <div className="font-semibold text-sm">
                {data.Headquarters ? data.Headquarters.split("\n")[0].substring(0, 30) + "..." : "N/A"}
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Globe className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <div className="text-sm text-gray-600">Website</div>
              <div className="font-semibold text-sm">Active</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sectionConfig.map((section) => {
          const IconComponent = section.icon
          const content = data[section.key as keyof CompanyProfile]

          if (!content || content.trim() === "") return null

          return (
            <Card key={section.key} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <IconComponent className="h-5 w-5 text-blue-600" />
                  {section.title}
                </CardTitle>
                <p className="text-sm text-gray-600">{section.description}</p>
                <Separator />
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64 w-full">
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-base font-semibold mb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-sm font-medium mb-1">{children}</h3>,
                        h4: ({ children }) => <h4 className="text-sm font-medium mb-1">{children}</h4>,
                        p: ({ children }) => <p className="text-sm mb-2 leading-relaxed">{children}</p>,
                        ul: ({ children }) => <ul className="text-sm mb-2 pl-4 space-y-1 list-disc">{children}</ul>,
                        ol: ({ children }) => <ol className="text-sm mb-2 pl-4 space-y-1 list-disc">{children}</ol>,
                        li: ({ children }) => <li className="text-sm">{children}</li>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        table: ({ children }) => (
                          <table className="text-xs border-collapse border border-gray-300 w-full mb-2">
                            {children}
                          </table>
                        ),
                        th: ({ children }) => (
                          <th className="border border-gray-300 px-2 py-1 bg-gray-50 font-medium">{children}</th>
                        ),
                        td: ({ children }) => <td className="border border-gray-300 px-2 py-1">{children}</td>,
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-blue-200 pl-3 italic text-gray-700 mb-2">
                            {children}
                          </blockquote>
                        ),
                        a: ({ children }) => (
                          <a className="italic underline text-blue-500">{children}</a>
                        ),
                      }}
                    >
                      {content}
                    </ReactMarkdown>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
