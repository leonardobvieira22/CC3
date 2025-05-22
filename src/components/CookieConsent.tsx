"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

// Tipos
interface CookieSettings {
  essential: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [settings, setSettings] = useState<CookieSettings>({
    essential: true, // Sempre ativo, não pode ser desativado
    analytics: true,
    marketing: false,
    preferences: true,
  })

  // Verifica se o consentimento já foi dado
  useEffect(() => {
    const hasConsent = localStorage.getItem("cookieConsent")
    if (!hasConsent) {
      // Atraso de 1 segundo para mostrar o banner após o carregamento da página
      const timer = setTimeout(() => setShowBanner(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    setSettings({
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true,
    })

    localStorage.setItem(
      "cookieConsent",
      JSON.stringify({
        consent: true,
        settings: {
          essential: true,
          analytics: true,
          marketing: true,
          preferences: true,
        },
        timestamp: new Date().toISOString(),
      })
    )

    setShowBanner(false)
    setShowDialog(false)
  }

  const handleRejectNonEssential = () => {
    setSettings({
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false,
    })

    localStorage.setItem(
      "cookieConsent",
      JSON.stringify({
        consent: true,
        settings: {
          essential: true,
          analytics: false,
          marketing: false,
          preferences: false,
        },
        timestamp: new Date().toISOString(),
      })
    )

    setShowBanner(false)
    setShowDialog(false)
  }

  const handleCustomize = () => {
    setShowDialog(true)
    setShowBanner(false)
  }

  const handleSavePreferences = () => {
    localStorage.setItem(
      "cookieConsent",
      JSON.stringify({
        consent: true,
        settings,
        timestamp: new Date().toISOString(),
      })
    )

    setShowDialog(false)
  }

  return (
    <>
      {/* Banner de Consentimento de Cookies */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg"
          >
            <div className="container mx-auto max-w-screen-xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Sua privacidade é importante</h3>
                  <p className="text-gray-700 dark:text-gray-200 text-sm md:text-base">
                    Utilizamos cookies para personalizar conteúdo e anúncios, fornecer funcionalidades de mídia social e analisar nosso tráfego.
                    <Link href="/cookies" className="underline text-blue-highlight ml-1 hover:text-blue-700">
                      Saiba mais sobre como usamos seus dados
                    </Link>.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRejectNonEssential}
                    className="text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700"
                  >
                    Apenas Essenciais
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCustomize}
                    className="text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700"
                  >
                    Personalizar
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAcceptAll}
                    className="bg-blue-highlight hover:bg-blue-700 text-white"
                  >
                    Aceitar Todos
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diálogo de Configurações Detalhadas */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Configurações de Cookies</DialogTitle>
            <DialogDescription className="text-gray-700 dark:text-gray-200">
              Personalize suas preferências de cookies. Os cookies essenciais são necessários para o funcionamento básico do site.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="cookies" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="cookies">Gerenciar Cookies</TabsTrigger>
              <TabsTrigger value="info">Informações</TabsTrigger>
            </TabsList>

            <TabsContent value="cookies">
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="essential"
                      className="font-medium text-gray-900 dark:text-white"
                    >
                      Cookies Essenciais
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Necessários para o funcionamento básico do site
                    </p>
                  </div>
                  <Switch
                    id="essential"
                    checked={settings.essential}
                    disabled={true} // Sempre ativo
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="analytics"
                      className="font-medium text-gray-900 dark:text-white"
                    >
                      Cookies Analíticos
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Ajudam a entender como você usa o site
                    </p>
                  </div>
                  <Switch
                    id="analytics"
                    checked={settings.analytics}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, analytics: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="marketing"
                      className="font-medium text-gray-900 dark:text-white"
                    >
                      Cookies de Marketing
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Usados para mostrar anúncios relevantes
                    </p>
                  </div>
                  <Switch
                    id="marketing"
                    checked={settings.marketing}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, marketing: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="preferences"
                      className="font-medium text-gray-900 dark:text-white"
                    >
                      Cookies de Preferências
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Salvam suas preferências para melhorar a experiência
                    </p>
                  </div>
                  <Switch
                    id="preferences"
                    checked={settings.preferences}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, preferences: checked }))
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="info">
              <div className="py-4 space-y-4">
                <div>
                  <h4 className="text-base font-semibold mb-1 text-gray-900 dark:text-white">O que são cookies?</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    Cookies são pequenos arquivos de texto armazenados no seu dispositivo que ajudam os sites
                    a memorizar preferências e melhorar a experiência do usuário.
                  </p>
                </div>
                <div>
                  <h4 className="text-base font-semibold mb-1 text-gray-900 dark:text-white">Como usamos cookies?</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    Usamos cookies para personalizar conteúdo, fornecer funcionalidades de redes sociais e analisar nosso tráfego.
                    Também compartilhamos informações sobre o uso do nosso site com nossos parceiros.
                  </p>
                </div>
                <div>
                  <Link
                    href="/cookies"
                    className="text-sm text-blue-highlight hover:underline"
                  >
                    Leia nossa política de cookies completa
                  </Link>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleRejectNonEssential}
              className="w-full sm:w-auto"
            >
              Apenas Essenciais
            </Button>
            <Button
              variant="outline"
              onClick={handleAcceptAll}
              className="w-full sm:w-auto"
            >
              Aceitar Todos
            </Button>
            <Button
              onClick={handleSavePreferences}
              className="w-full sm:w-auto bg-blue-highlight hover:bg-blue-700 text-white"
            >
              Salvar Preferências
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
