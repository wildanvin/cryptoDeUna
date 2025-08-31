import { Wallet } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center space-x-2">
          <Wallet className="h-6 w-6 text-accent" />
          <span className="text-xl font-bold text-card-foreground">CryptoDeUna</span>
        </div>
      </div>
    </header>
  )
}
