"use client"

import { useState, useEffect } from "react"
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
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { useAuth } from "@/lib/context/AuthContext"
import { Loader2, Check, X, Info } from "lucide-react"
import Link from "next/link"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Validação de CPF
function isValidCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/[^\d]/g, '')

  // Deve ter 11 dígitos
  if (cleanCPF.length !== 11) return false

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false

  // Validação do primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let mod = sum % 11
  const digit1 = mod < 2 ? 0 : 11 - mod

  if (Number.parseInt(cleanCPF.charAt(9)) !== digit1) return false

  // Validação do segundo dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  mod = sum % 11
  const digit2 = mod < 2 ? 0 : 11 - mod

  return Number.parseInt(cleanCPF.charAt(10)) === digit2
}

// Formatação de CPF (XXX.XXX.XXX-XX)
function formatCPF(cpf: string): string {
  const digits = cpf.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`
}

const registerSchema = z
  .object({
    name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
    email: z
      .string()
      .min(1, { message: "Email é obrigatório" })
      .email({ message: "Email inválido" }),
    password: z
      .string()
      .min(8, { message: "Senha deve ter pelo menos 8 caracteres" })
      .regex(/[A-Z]/, { message: "Senha deve conter pelo menos uma letra maiúscula" })
      .regex(/[a-z]/, { message: "Senha deve conter pelo menos uma letra minúscula" })
      .regex(/[0-9]/, { message: "Senha deve conter pelo menos um número" })
      .regex(/[^A-Za-z0-9]/, { message: "Senha deve conter pelo menos um caractere especial" }),
    confirmPassword: z.string(),
    cpf: z
      .string()
      .min(11, { message: "CPF inválido" })
      .refine((cpf) => isValidCPF(cpf.replace(/\D/g, '')), {
        message: "CPF inválido"
      }),
    dateOfBirth: z
      .string()
      .refine((date) => {
        if (!date) return false;
        const birthDate = new Date(date)
        const today = new Date()
        const age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()

        // Verifica se tem pelo menos 18 anos
        if (age < 18 || (age === 18 && monthDiff < 0)) {
          return false
        }

        // Verifica se a data não é no futuro e não é muito antiga (mais de 120 anos)
        return birthDate <= today && age <= 120
      }, {
        message: "Você deve ter pelo menos 18 anos para se registrar"
      }),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "Você deve aceitar os termos e condições",
    }),
    privacyAccepted: z.boolean().refine((val) => val === true, {
      message: "Você deve aceitar a política de privacidade",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

// Função para calcular a força da senha
function calculatePasswordStrength(password: string): number {
  let score = 0;

  // Comprimento básico
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Complexidade
  if (/[A-Z]/.test(password)) score += 1;  // Maiúsculas
  if (/[a-z]/.test(password)) score += 1;  // Minúsculas
  if (/[0-9]/.test(password)) score += 1;  // Números
  if (/[^A-Za-z0-9]/.test(password)) score += 1;  // Caracteres especiais

  // Penalidades
  if (/(.)\1{2,}/.test(password)) score -= 1;  // Repetições de caracteres
  if (/^(?:password|123456|qwerty)$/i.test(password)) score -= 3;  // Senha comum

  // Limitar o score entre 0 e 5
  return Math.max(0, Math.min(5, score));
}

function getStrengthText(strength: number): { text: string; color: string } {
  switch (strength) {
    case 0:
      return { text: "Muito fraca", color: "text-red-500" };
    case 1:
      return { text: "Fraca", color: "text-red-500" };
    case 2:
      return { text: "Razoável", color: "text-yellow-500" };
    case 3:
      return { text: "Média", color: "text-yellow-500" };
    case 4:
      return { text: "Forte", color: "text-green-500" };
    case 5:
      return { text: "Muito forte", color: "text-green-500" };
    default:
      return { text: "", color: "" };
  }
}

// Definindo a interface para os dados do formulário de registro
interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  cpf: string;
  dateOfBirth: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

export default function RegisterForm() {
  const { register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [registerError, setRegisterError] = useState<string | null>(null)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const router = useRouter()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      cpf: "",
      dateOfBirth: "",
      termsAccepted: false,
      privacyAccepted: false,
    },
  })

  const watchPassword = form.watch("password");

  // Atualizar a força da senha quando a senha mudar
  useEffect(() => {
    const strength = calculatePasswordStrength(watchPassword);
    setPasswordStrength(strength);
  }, [watchPassword]);

  // Função para formatar o CPF enquanto o usuário digita
  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    const { value } = e.target;
    onChange(formatCPF(value));
  };

  async function onSubmit(values: RegisterFormData) {
    setIsLoading(true)
    setRegisterError(null)

    try {
      // Enviar requisição diretamente para API em vez de usar o método register do AuthContext
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
          cpf: values.cpf.replace(/\D/g, ''), // Remover formatação
          dateOfBirth: values.dateOfBirth,
          termsAccepted: values.termsAccepted,
          privacyAccepted: values.privacyAccepted,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao registrar usuário');
      }

      // Registro bem-sucedido
      toast.success("Registro realizado com sucesso! Faça login para continuar.");
      router.push("/auth/login");
    } catch (error: unknown) {
      console.error(error)
      const errorMessage = (error as Error)?.message || "Ocorreu um erro ao fazer registro. Tente novamente."
      setRegisterError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const strengthInfo = getStrengthText(passwordStrength);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {registerError && (
          <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 text-sm">
            {registerError}
          </div>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input placeholder="João Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="seu@email.com" {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input
                    placeholder="000.000.000-00"
                    value={field.value}
                    onChange={(e) => handleCPFChange(e, field.onChange)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de nascimento</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Você deve ter pelo menos 18 anos
                </FormDescription>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input type="password" placeholder="********" {...field} />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-semibold">Requisitos de senha:</h4>
                          <ul className="text-sm space-y-1">
                            <li className="flex items-center">
                              {field.value.length >= 8 ? (
                                <Check className="mr-2 h-4 w-4 text-green-500" />
                              ) : (
                                <X className="mr-2 h-4 w-4 text-red-500" />
                              )}
                              Pelo menos 8 caracteres
                            </li>
                            <li className="flex items-center">
                              {/[A-Z]/.test(field.value) ? (
                                <Check className="mr-2 h-4 w-4 text-green-500" />
                              ) : (
                                <X className="mr-2 h-4 w-4 text-red-500" />
                              )}
                              Pelo menos uma letra maiúscula
                            </li>
                            <li className="flex items-center">
                              {/[a-z]/.test(field.value) ? (
                                <Check className="mr-2 h-4 w-4 text-green-500" />
                              ) : (
                                <X className="mr-2 h-4 w-4 text-red-500" />
                              )}
                              Pelo menos uma letra minúscula
                            </li>
                            <li className="flex items-center">
                              {/[0-9]/.test(field.value) ? (
                                <Check className="mr-2 h-4 w-4 text-green-500" />
                              ) : (
                                <X className="mr-2 h-4 w-4 text-red-500" />
                              )}
                              Pelo menos um número
                            </li>
                            <li className="flex items-center">
                              {/[^A-Za-z0-9]/.test(field.value) ? (
                                <Check className="mr-2 h-4 w-4 text-green-500" />
                              ) : (
                                <X className="mr-2 h-4 w-4 text-red-500" />
                              )}
                              Pelo menos um caractere especial
                            </li>
                          </ul>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </FormControl>
              {field.value && (
                <div className="mt-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs">Força da senha:</span>
                    <span className={`text-xs font-semibold ${strengthInfo.color}`}>
                      {strengthInfo.text}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        {
                          "bg-red-500": passwordStrength <= 1,
                          "bg-yellow-500": passwordStrength > 1 && passwordStrength <= 3,
                          "bg-green-500": passwordStrength > 3,
                        }
                      )}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="termsAccepted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm">
                  Eu li e concordo com os{" "}
                  <Link
                    href="/terms"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                    target="_blank"
                  >
                    termos e condições
                  </Link>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="privacyAccepted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm">
                  Eu li e concordo com a{" "}
                  <Link
                    href="/privacy"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                    target="_blank"
                  >
                    política de privacidade
                  </Link>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full py-6 bg-blue-highlight hover:bg-blue-700 text-white font-medium"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registrando...
            </>
          ) : (
            "Criar conta"
          )}
        </Button>

        <div className="text-center text-sm mt-4">
          <p className="text-gray-700 dark:text-gray-200">
            Já tem uma conta?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Faça login
            </Link>
          </p>
        </div>
      </form>
    </Form>
  )
}
