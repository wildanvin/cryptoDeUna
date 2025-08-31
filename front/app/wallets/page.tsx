import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function WalletsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-center mb-2">👛 Wallets & Seguridad</h1>
          <p className="text-center text-muted-foreground">Tu banco personal en el bolsillo</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🔑</span>
                <span>Seed Phrases</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Tu seed phrase son 12-24 palabras que son como la llave maestra de tu wallet. ¡Nunca las compartas!
              </p>
              <div className="bg-destructive/5 p-4 rounded-lg border border-destructive/20">
                <h4 className="font-semibold text-destructive mb-2">🚨 Reglas de oro:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Nunca las escribas en el teléfono</li>
                  <li>• Escríbelas en papel físico</li>
                  <li>• Guárdalas en lugar seguro</li>
                  <li>• Nunca las compartas con nadie</li>
                </ul>
              </div>
              <div className="bg-primary/5 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  💡 Ejemplo: "apple banana cat dog elephant..." - Estas palabras pueden recuperar tu wallet en
                  cualquier dispositivo.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🤖</span>
                <span>Account Abstraction</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Account Abstraction hace que usar crypto sea tan fácil como usar una app normal. Sin seed phrases
                complicadas.
              </p>
              <div className="bg-accent/5 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">✨ Beneficios:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Login con Google/Apple</li>
                  <li>• Recuperación por email</li>
                  <li>• Pagos automáticos</li>
                  <li>• Experiencia como app tradicional</li>
                </ul>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <Button variant="outline" className="justify-between bg-transparent" asChild>
                  <a href="https://www.coinbase.com/wallet" target="_blank" rel="noopener noreferrer">
                    Coinbase Smart Wallet
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" className="justify-between bg-transparent" asChild>
                  <a href="https://www.dynamic.xyz" target="_blank" rel="noopener noreferrer">
                    Dynamic Wallet
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📱</span>
                <span>Wallets Recomendadas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">🔰 Para Principiantes</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-between bg-transparent" asChild>
                      <a href="https://metamask.io" target="_blank" rel="noopener noreferrer">
                        MetaMask
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-between bg-transparent" asChild>
                      <a href="https://www.coinbase.com/wallet" target="_blank" rel="noopener noreferrer">
                        Coinbase Wallet
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>
                <div className="bg-accent/5 p-4 rounded-lg">
                  <h4 className="font-semibold text-accent mb-2">⚡ Para Avanzados</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-between bg-transparent" asChild>
                      <a href="https://rabby.io" target="_blank" rel="noopener noreferrer">
                        Rabby Wallet
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-between bg-transparent" asChild>
                      <a href="https://rainbow.me" target="_blank" rel="noopener noreferrer">
                        Rainbow Wallet
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
