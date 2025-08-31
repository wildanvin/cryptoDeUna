"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export function BalanceCard() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [balance, setBalance] = useState<string>("0.00")
  const [usdValue, setUsdValue] = useState<string>("0.00")
  const [isLoading, setIsLoading] = useState(true)

  const walletAddress = "0x70E1D904c1b50A4B77a38FfA4ec14217493484e3"
  const liskEndpoint = "https://lisk.drpc.org"

  const fetchEthPrice = async () => {
    try {
      const response = await fetch("https://api.coinbase.com/v2/prices/ETH-USD/spot")
      const data = await response.json()
      return Number.parseFloat(data.data.amount)
    } catch (error) {
      console.error("[v0] Error fetching ETH price:", error)
      return 0
    }
  }

  const fetchBalance = async () => {
    try {
      setIsRefreshing(true)
      console.log("[v0] Fetching balance from Lisk endpoint...")

      const response = await fetch(liskEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getBalance",
          params: [walletAddress, "latest"],
          id: 1,
        }),
      })

      const data = await response.json()
      console.log("[v0] Balance response:", data)

      if (data.result) {
        // Convert from wei to ETH (LSK has 18 decimals like ETH)
        const balanceInWei = BigInt(data.result)
        const balanceInLSK = Number(balanceInWei) / Math.pow(10, 18)
        setBalance(balanceInLSK.toFixed(4))

        const ethPrice = await fetchEthPrice()
        const usdAmount = balanceInLSK * ethPrice
        setUsdValue(usdAmount.toFixed(2))
      }
    } catch (error) {
      console.error("[v0] Error fetching balance:", error)
      setBalance("Error")
      setUsdValue("Error")
    } finally {
      setIsRefreshing(false)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBalance()
  }, [])

  const handleRefresh = () => {
    fetchBalance()
  }

  return (
    <Card className="w-full border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wallet className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-bold">💰 Fondos Disponibles</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-8 w-8 p-0 hover:bg-primary/10"
          >
            <RefreshCw className={`h-4 w-4 text-primary ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="text-center space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-lg text-muted-foreground">Cargando...</span>
            </div>
          ) : (
            <div className="space-y-2">
              <span className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {balance} ETH
              </span>
              <div className="text-xl font-semibold text-muted-foreground">≈ ${usdValue} USD</div>
            </div>
          )}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 text-primary px-3 py-1 rounded-full text-sm font-semibold inline-block">
            🌟 Lisk Network
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 border border-primary/10">
          <p className="text-xs text-muted-foreground mb-2 font-medium">📍 Dirección de Fondos:</p>
          <p className="text-sm font-mono text-card-foreground break-all bg-background/50 p-2 rounded-lg">
            {walletAddress}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
