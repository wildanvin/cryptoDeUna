import { BalanceCard } from "@/components/balance-card"
import { PaymentButton } from "@/components/payment-button"
import { Header } from "@/components/header"
import { MobileOnlyNotice } from "@/components/mobile-only-notice"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-md">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="relative">
              <h1 className="text-4xl font-bold text-foreground text-balance leading-tight">
                ¡Bienvenido a{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  CryptoDeUna
                </span>
                ! 🚀
              </h1>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full animate-pulse"></div>
            </div>
            <p className="text-lg text-muted-foreground text-balance font-medium">
              Compra ETH para Lisk Network - Tu primera experiencia web3 en Ecuador
            </p>
            <div className="flex justify-center">
              <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                ¡Súper fácil y rápido! ✨
              </div>
            </div>
          </div>

          <BalanceCard />
          <PaymentButton />

          

          <MobileOnlyNotice />

          <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/20">
            <h2 className="text-xl font-bold text-center mb-4 text-foreground">🌟 ¿Por qué Lisk?</h2>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-primary">⚡</span>
                <span className="text-muted-foreground">Transacciones ultra rápidas y baratas</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-accent">🔗</span>
                <span className="text-muted-foreground">Compatible con Ethereum (Layer 2)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-primary">🛡️</span>
                <span className="text-muted-foreground">Seguridad respaldada por Ethereum</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-accent">🌍</span>
                <span className="text-muted-foreground">Ecosistema DeFi en crecimiento</span>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">🔒 Transacciones seguras y confiables</p>
            <p className="text-xs text-muted-foreground">Powered by Lisk Network</p>

            <div className="bg-card rounded-xl p-4 border border-primary/10">
              <h3 className="text-lg font-semibold mb-3 text-foreground">🚀 Siguientes Pasos</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href="/ecosystem"
                  className="bg-primary/10 text-primary px-3 py-2 rounded-lg hover:bg-primary/20 transition-colors"
                >
                  🌐 Ecosistema L2
                </a>
                <a
                  href="/defi"
                  className="bg-accent/10 text-accent px-3 py-2 rounded-lg hover:bg-accent/20 transition-colors"
                >
                  💰 DeFi
                </a>
                <a
                  href="/multisigs"
                  className="bg-primary/10 text-primary px-3 py-2 rounded-lg hover:bg-primary/20 transition-colors"
                >
                  👥 Multisigs
                </a>
                <a
                  href="/ens"
                  className="bg-accent/10 text-accent px-3 py-2 rounded-lg hover:bg-accent/20 transition-colors"
                >
                  🏷️ ENS
                </a>
                <a
                  href="/wallets"
                  className="bg-primary/10 text-primary px-3 py-2 rounded-lg hover:bg-primary/20 transition-colors col-span-2"
                >
                  👛 Wallets & Seguridad
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
