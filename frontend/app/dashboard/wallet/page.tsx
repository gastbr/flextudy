"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Plus, ArrowUpRight, ArrowDownLeft, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function WalletPage() {
  // This page is only accessible to students

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Wallet</h1>
          <p className="text-muted-foreground">Manage your credits and view transaction history</p>
        </div>

        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Credits</span>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Credit Balance</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="text-5xl font-bold mb-2">45</div>
            <div className="text-muted-foreground">Available Credits</div>
            <Button className="mt-6">Purchase More Credits</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <CreditCard className="h-4 w-4 mr-2" />
              Manage Payment Methods
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              View Upcoming Classes
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Credit Packages</CardTitle>
          <CardDescription>Purchase credit packages at discounted rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PackageCard title="Starter" credits={20} price={19.99} popular={false} />
            <PackageCard title="Standard" credits={50} price={44.99} popular={true} />
            <PackageCard title="Premium" credits={100} price={79.99} popular={false} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="purchases">Purchases</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <TransactionList />
            </TabsContent>
            <TabsContent value="purchases">
              <TransactionList type="purchase" />
            </TabsContent>
            <TabsContent value="usage">
              <TransactionList type="usage" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

interface PackageCardProps {
  title: string
  credits: number
  price: number
  popular: boolean
}

function PackageCard({ title, credits, price, popular }: PackageCardProps) {
  return (
    <div className={`border rounded-lg p-6 ${popular ? "border-primary" : "border-border"}`}>
      {popular && <Badge className="mb-2">Most Popular</Badge>}
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-2 mb-4">
        <span className="text-3xl font-bold">{credits}</span>
        <span className="text-muted-foreground"> credits</span>
      </div>
      <div className="text-muted-foreground mb-6">${price.toFixed(2)}</div>
      <Button className="w-full" variant={popular ? "default" : "outline"}>
        Purchase
      </Button>
    </div>
  )
}

interface TransactionListProps {
  type?: "purchase" | "usage"
}

function TransactionList({ type }: TransactionListProps) {
  // Sample transaction data
  const transactions = [
    {
      id: 1,
      type: "purchase",
      amount: 50,
      description: "Credit Package: Standard",
      date: "May 10, 2023",
      status: "completed",
    },
    {
      id: 2,
      type: "usage",
      amount: -10,
      description: "Class: Introduction to Mathematics",
      date: "May 12, 2023",
      status: "completed",
    },
    {
      id: 3,
      type: "usage",
      amount: -5,
      description: "Class: Spanish for Beginners",
      date: "May 14, 2023",
      status: "completed",
    },
    {
      id: 4,
      type: "purchase",
      amount: 20,
      description: "Credit Package: Starter",
      date: "May 15, 2023",
      status: "processing",
    },
  ]

  // Filter transactions by type if specified
  const filteredTransactions = type ? transactions.filter((t) => t.type === type) : transactions

  return (
    <div className="space-y-4">
      {filteredTransactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center justify-between py-3 border-b last:border-0">
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center ${
                transaction.type === "purchase" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
              }`}
            >
              {transaction.type === "purchase" ? (
                <ArrowDownLeft className="h-5 w-5" />
              ) : (
                <ArrowUpRight className="h-5 w-5" />
              )}
            </div>
            <div>
              <div className="font-medium">{transaction.description}</div>
              <div className="text-sm text-muted-foreground">{transaction.date}</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className={`font-medium ${transaction.amount > 0 ? "text-green-600" : ""}`}>
              {transaction.amount > 0 ? "+" : ""}
              {transaction.amount} credits
            </div>
            <Badge
              variant="outline"
              className={`text-xs ${
                transaction.status === "processing" ? "bg-yellow-100 text-yellow-800 border-yellow-200" : ""
              }`}
            >
              {transaction.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

