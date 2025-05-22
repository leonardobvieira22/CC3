"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { signIn } from "next-auth/react"
import { useAuth } from "@/lib/context/AuthContext"
import Link from "next/link"
import { Loader2 } from "lucide-react"

// Tipagem explícita para o formulário de login
interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email é obrigatório" })
    .email({ message: "Email inválido" }),
  password: z
    .string()
    .min(8, { message: "Senha deve ter pelo menos 8 caracteres" }),
  rememberMe: z.boolean().default(false),
})

export default function LoginForm() {
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema) as any, // Força compatibilidade de tipos
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true)
    setAuthError(null)

    try {
      // login pode retornar um objeto com { success, error }
      // ou lançar um erro, dependendo da implementação do AuthContext
      // Aqui vamos assumir que login retorna um objeto { success, error }
      const result = await login(values.email, values.password)

      if (result?.success) {
        toast.success("Login realizado com sucesso!")
        router.push("/dashboard")
        router.refresh()
        return
      }

      if (result?.error) {
        // Verificar se é um erro de email não verificado
        if (result.error === 'email_not_verified') {
          toast.error('É necessário verificar seu email antes de fazer login. Verifique sua caixa de entrada ou solicite um novo email de verificação.')
          router.push(`/auth/verify-email?email=${encodeURIComponent(values.email)}`)
          return
        }

        // Para outros erros
        toast.error(result.error === 'CredentialsSignin'
          ? 'Email ou senha incorretos. Verifique suas credenciais.'
          : result.error)
        setAuthError(result.error === 'CredentialsSignin'
          ? 'Email ou senha incorretos. Verifique suas credenciais.'
          : result.error)
        return
      }

      // Caso login retorne false (fallback)
      setAuthError("Email ou senha incorretos. Verifique suas credenciais.")
      toast.error("Email ou senha incorretos. Verifique suas credenciais.")
    } catch (error: unknown) {
      // Caso o login lance um erro
      if ((error as { message?: string })?.message === 'email_not_verified') {
        toast.error('É necessário verificar seu email antes de fazer login. Verifique sua caixa de entrada ou solicite um novo email de verificação.')
        router.push(`/auth/verify-email?email=${encodeURIComponent(values.email)}`)
        return
      }
      setAuthError("Ocorreu um erro ao fazer login. Tente novamente.")
      toast.error("Ocorreu um erro ao fazer login. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (error) {
      toast.error("Erro ao fazer login com Google. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubLogin = async () => {
    try {
      setIsLoading(true)
      await signIn("github", { callbackUrl: "/dashboard" })
    } catch (error) {
      toast.error("Erro ao fazer login com GitHub. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {authError && (
          <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
            {authError}
          </div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="seu@email.com"
                  {...field}
                  type="email"
                  autoComplete="email"
                  className="focus-visible:ring-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="********"
                  {...field}
                  autoComplete="current-password"
                  className="focus-visible:ring-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <input
                    id="rememberMe"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormLabel
                  htmlFor="rememberMe"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer"
                >
                  Lembrar-me
                </FormLabel>
              </FormItem>
            )}
          />

          <div className="text-sm">
            <Link
              href="/auth/forgot-password"
              className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Esqueceu sua senha?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full py-6 font-medium bg-blue-highlight hover:bg-blue-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">
              Ou continue com
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="py-5 font-medium"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="py-5 font-medium"
            onClick={handleGithubLogin}
            disabled={isLoading}
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.58C6 21.135 5.22 19.845 4.98 19.17C4.845 18.825 4.26 17.76 3.75 17.475C3.33 17.25 2.73 16.695 3.735 16.68C4.68 16.665 5.355 17.55 5.58 17.91C6.66 19.725 8.385 19.215 9.075 18.9C9.18 18.12 9.495 17.595 9.84 17.295C7.17 16.995 4.38 15.96 4.38 11.37C4.38 10.065 4.845 8.985 5.61 8.145C5.49 7.845 5.07 6.615 5.73 4.965C5.73 4.965 6.735 4.65 9.03 6.195C9.99 5.925 11.01 5.79 12.03 5.79C13.05 5.79 14.07 5.925 15.03 6.195C17.325 4.635 18.33 4.965 18.33 4.965C18.99 6.615 18.57 7.845 18.45 8.145C19.215 8.985 19.68 10.05 19.68 11.37C19.68 15.975 16.875 16.995 14.205 17.295C14.64 17.67 15.015 18.39 15.015 19.515C15.015 21.12 15 22.41 15 22.815C15 23.13 15.225 23.505 15.825 23.385C18.2072 22.578 20.2772 21.0538 21.7437 19.0127C23.2101 16.9715 23.9993 14.5143 24 12C24 5.37 18.63 0 12 0Z" />
            </svg>
            GitHub
          </Button>
        </div>

        <div className="text-center text-sm mt-4">
          <p className="text-gray-700 dark:text-gray-200">
            Não tem uma conta?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Registre-se
            </Link>
          </p>
        </div>
      </form>
    </Form>
  )
}
