'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, CheckCircle2, XCircle, Clock, Send, RefreshCw, BarChart, PieChart, ListFilter, ChevronDown, MailCheck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Registrar componentes ChartJS
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface EmailLog {
  id: string;
  toEmail: string;
  toName: string | null;
  subject: string;
  emailType: string;
  status: string;
  statusDetails: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
}

interface EmailLogsResponse {
  logs: EmailLog[];
  total: number;
  pages: number;
  currentPage: number;
}

interface EmailStats {
  totalEmails: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  dailySent: Record<string, number>;
  // Estatísticas diárias para os últimos 7 dias
  lastWeek: {
    labels: string[];
    sent: number[];
    delivered: number[];
    failed: number[];
  };
}

export default function EmailLogsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<EmailLogsResponse | null>(null);
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    email: '',
    page: 1,
    limit: 20
  });
  const [selectedTab, setSelectedTab] = useState<'logs' | 'stats'>('logs');
  const [resendingEmail, setResendingEmail] = useState<string | null>(null);

  // Estado para o formulário de teste de email
  const [testEmail, setTestEmail] = useState({
    email: '',
    name: '',
    type: 'verify' // 'verify' ou 'reset'
  });
  const [sendingTest, setSendingTest] = useState(false);

  // Obter logs de email
  const fetchEmailLogs = async () => {
    setLoading(true);

    try {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.email) queryParams.append('email', filters.email);
      queryParams.append('page', filters.page.toString());
      queryParams.append('limit', filters.limit.toString());

      const response = await fetch(`/api/admin/email-logs?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error('Erro ao obter logs de email');
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Erro ao obter logs de email:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível carregar os logs de email',
      });
    } finally {
      setLoading(false);
    }
  };

  // Calcular estatísticas baseadas nos logs
  const calculateStats = (logs: EmailLog[]) => {
    if (!logs || logs.length === 0) return null;

    // Estatísticas básicas
    const totalEmails = logs.length;
    const byStatus: Record<string, number> = {};
    const byType: Record<string, number> = {};
    const dailySent: Record<string, number> = {};

    // Preparar dados para gráfico dos últimos 7 dias
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const lastWeek = {
      labels: last7Days.map(date => {
        // Formatar a data como DD/MM
        const [year, month, day] = date.split('-');
        return `${day}/${month}`;
      }),
      sent: Array(7).fill(0),
      delivered: Array(7).fill(0),
      failed: Array(7).fill(0),
    };

    // Processar cada log
    logs.forEach(log => {
      // Contagem por status
      byStatus[log.status] = (byStatus[log.status] || 0) + 1;

      // Contagem por tipo
      byType[log.emailType] = (byType[log.emailType] || 0) + 1;

      // Contagem diária
      const logDate = new Date(log.createdAt).toISOString().split('T')[0];
      dailySent[logDate] = (dailySent[logDate] || 0) + 1;

      // Dados para o gráfico dos últimos 7 dias
      const dayIndex = last7Days.indexOf(logDate);
      if (dayIndex !== -1) {
        if (log.status === 'SENT') {
          lastWeek.sent[dayIndex]++;
        } else if (log.status === 'DELIVERED') {
          lastWeek.delivered[dayIndex]++;
        } else if (log.status === 'FAILED') {
          lastWeek.failed[dayIndex]++;
        }
      }
    });

    return {
      totalEmails,
      byStatus,
      byType,
      dailySent,
      lastWeek
    };
  };

  // Enviar email de teste
  const sendTestEmail = async () => {
    if (!testEmail.email) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Por favor, informe um email válido',
      });
      return;
    }

    setSendingTest(true);

    try {
      const response = await fetch('/api/admin/email-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testEmail),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao enviar email de teste');
      }

      toast({
        title: 'Sucesso',
        description: 'Email de teste enviado com sucesso!',
      });

      // Recarregar logs após enviar um email de teste
      fetchEmailLogs();
    } catch (error) {
      console.error('Erro ao enviar email de teste:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao enviar email de teste',
      });
    } finally {
      setSendingTest(false);
    }
  };

  // Reenviar email
  const resendEmail = async (logId: string) => {
    setResendingEmail(logId);

    try {
      const response = await fetch('/api/admin/email-logs/resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao reenviar email');
      }

      toast({
        title: 'Sucesso',
        description: 'Email reenviado com sucesso!',
      });

      // Recarregar logs
      fetchEmailLogs();
    } catch (error) {
      console.error('Erro ao reenviar email:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao reenviar email',
      });
    } finally {
      setResendingEmail(null);
    }
  };

  // Efeito para carregar os logs no carregamento da página
  useEffect(() => {
    fetchEmailLogs();
  }, [filters.page, filters.limit]);

  // Efeito para calcular estatísticas quando os logs são carregados
  useEffect(() => {
    if (data && data.logs) {
      setStats(calculateStats(data.logs));
    }
  }, [data]);

  // Função para aplicar filtros
  const applyFilters = () => {
    setFilters({ ...filters, page: 1 }); // Resetar para primeira página ao aplicar filtros
    fetchEmailLogs();
  };

  // Função para limpar filtros
  const clearFilters = () => {
    setFilters({
      status: '',
      type: '',
      email: '',
      page: 1,
      limit: 20
    });
    fetchEmailLogs();
  };

  // Função para navegar na paginação
  const goToPage = (page: number) => {
    if (page < 1 || (data && page > data.pages)) return;
    setFilters({ ...filters, page });
  };

  // Função para obter a cor do status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            <Clock className="h-3 w-3" /> Pendente
          </Badge>
        );
      case 'SENT':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            <Send className="h-3 w-3" /> Enviado
          </Badge>
        );
      case 'DELIVERED':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <CheckCircle2 className="h-3 w-3" /> Entregue
          </Badge>
        );
      case 'FAILED':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            <XCircle className="h-3 w-3" /> Falhou
          </Badge>
        );
      case 'OPENED':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
            <MailCheck className="h-3 w-3" /> Aberto
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> {status.toLowerCase()}
          </Badge>
        );
    }
  };

  // Preparar dados para gráficos
  const prepareStatusChartData = () => {
    if (!stats) return null;

    const labels = Object.keys(stats.byStatus).map(status => {
      switch (status) {
        case 'PENDING': return 'Pendente';
        case 'SENT': return 'Enviado';
        case 'DELIVERED': return 'Entregue';
        case 'FAILED': return 'Falhou';
        case 'OPENED': return 'Aberto';
        case 'CLICKED': return 'Clicado';
        case 'BOUNCED': return 'Devolvido';
        case 'SPAM': return 'Spam';
        default: return status;
      }
    });

    return {
      labels,
      datasets: [
        {
          label: 'Emails por Status',
          data: Object.values(stats.byStatus),
          backgroundColor: [
            'rgba(255, 206, 86, 0.6)', // PENDING - amarelo
            'rgba(54, 162, 235, 0.6)', // SENT - azul
            'rgba(75, 192, 192, 0.6)', // DELIVERED - verde
            'rgba(255, 99, 132, 0.6)', // FAILED - vermelho
            'rgba(153, 102, 255, 0.6)', // OPENED - roxo
            'rgba(255, 159, 64, 0.6)', // CLICKED - laranja
            'rgba(199, 199, 199, 0.6)', // BOUNCED - cinza
            'rgba(255, 99, 71, 0.6)', // SPAM - tomate
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const prepareTypeChartData = () => {
    if (!stats) return null;

    const labels = Object.keys(stats.byType).map(type => {
      switch (type) {
        case 'VERIFICATION': return 'Verificação';
        case 'PASSWORD_RESET': return 'Recuperação de Senha';
        case 'NOTIFICATION': return 'Notificação';
        case 'ALERT': return 'Alerta';
        case 'TEST': return 'Teste';
        case 'OTHER': return 'Outro';
        default: return type;
      }
    });

    return {
      labels,
      datasets: [
        {
          label: 'Emails por Tipo',
          data: Object.values(stats.byType),
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)', // azul
            'rgba(255, 99, 132, 0.6)', // vermelho
            'rgba(75, 192, 192, 0.6)', // verde
            'rgba(255, 206, 86, 0.6)', // amarelo
            'rgba(153, 102, 255, 0.6)', // roxo
            'rgba(255, 159, 64, 0.6)', // laranja
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const prepareWeeklyChartData = () => {
    if (!stats) return null;

    return {
      labels: stats.lastWeek.labels,
      datasets: [
        {
          label: 'Enviados',
          data: stats.lastWeek.sent,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1,
        },
        {
          label: 'Entregues',
          data: stats.lastWeek.delivered,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1,
        },
        {
          label: 'Falhas',
          data: stats.lastWeek.failed,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1,
        },
      ],
    };
  };

  const weeklyChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Emails nos Últimos 7 Dias',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0, // Apenas números inteiros
        },
      },
    },
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Monitoramento de Emails</h1>

        <div className="flex gap-2">
          <Button
            variant={selectedTab === 'logs' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('logs')}
            className="flex items-center gap-2"
          >
            <ListFilter className="h-4 w-4" />
            Logs
          </Button>
          <Button
            variant={selectedTab === 'stats' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('stats')}
            className="flex items-center gap-2"
          >
            <BarChart className="h-4 w-4" />
            Estatísticas
          </Button>
        </div>
      </div>

      {selectedTab === 'logs' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Painel de filtros */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
                <CardDescription>Filtre os logs de email</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-filter">Email</Label>
                    <Input
                      id="email-filter"
                      placeholder="Filtrar por email"
                      value={filters.email}
                      onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status-filter">Status</Label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) => setFilters({ ...filters, status: value })}
                    >
                      <SelectTrigger id="status-filter">
                        <SelectValue placeholder="Todos os status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="PENDING">Pendente</SelectItem>
                        <SelectItem value="SENT">Enviado</SelectItem>
                        <SelectItem value="FAILED">Falhou</SelectItem>
                        <SelectItem value="DELIVERED">Entregue</SelectItem>
                        <SelectItem value="OPENED">Aberto</SelectItem>
                        <SelectItem value="CLICKED">Clicado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type-filter">Tipo</Label>
                    <Select
                      value={filters.type}
                      onValueChange={(value) => setFilters({ ...filters, type: value })}
                    >
                      <SelectTrigger id="type-filter">
                        <SelectValue placeholder="Todos os tipos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="VERIFICATION">Verificação</SelectItem>
                        <SelectItem value="PASSWORD_RESET">Recuperação de senha</SelectItem>
                        <SelectItem value="NOTIFICATION">Notificação</SelectItem>
                        <SelectItem value="ALERT">Alerta</SelectItem>
                        <SelectItem value="TEST">Teste</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button
                      variant="default"
                      onClick={applyFilters}
                      disabled={loading}
                    >
                      Aplicar Filtros
                    </Button>
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      disabled={loading}
                    >
                      Limpar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Painel de envio de teste */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Enviar Email de Teste</CardTitle>
                <CardDescription>Teste o envio de emails diretamente deste painel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="test-email">Email de destino</Label>
                    <Input
                      id="test-email"
                      placeholder="Digite o email de destino"
                      value={testEmail.email}
                      onChange={(e) => setTestEmail({ ...testEmail, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="test-name">Nome (opcional)</Label>
                    <Input
                      id="test-name"
                      placeholder="Nome do destinatário"
                      value={testEmail.name}
                      onChange={(e) => setTestEmail({ ...testEmail, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="test-type">Tipo de Email</Label>
                    <Select
                      value={testEmail.type}
                      onValueChange={(value) => setTestEmail({ ...testEmail, type: value })}
                    >
                      <SelectTrigger id="test-type">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="verify">Email de Verificação</SelectItem>
                        <SelectItem value="reset">Email de Recuperação de Senha</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="default"
                    onClick={sendTestEmail}
                    disabled={sendingTest || !testEmail.email}
                    className="mt-4"
                  >
                    {sendingTest ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : 'Enviar Email de Teste'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabela de logs */}
          <Card>
            <CardHeader>
              <CardTitle>Logs de Email</CardTitle>
              <CardDescription>
                {data ? `Exibindo ${data.logs.length} de ${data.total} logs` : 'Carregando logs...'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : data && data.logs.length > 0 ? (
                <>
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Assunto</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Detalhes</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.logs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell className="font-medium">
                              {new Date(log.createdAt).toLocaleString('pt-BR')}
                            </TableCell>
                            <TableCell>
                              {log.toEmail}
                              {log.toName && <span className="block text-xs text-muted-foreground">{log.toName}</span>}
                            </TableCell>
                            <TableCell>{log.subject}</TableCell>
                            <TableCell>
                              {log.emailType === 'VERIFICATION' && 'Verificação'}
                              {log.emailType === 'PASSWORD_RESET' && 'Recuperação de senha'}
                              {log.emailType === 'NOTIFICATION' && 'Notificação'}
                              {log.emailType === 'ALERT' && 'Alerta'}
                              {log.emailType === 'TEST' && 'Teste'}
                              {log.emailType === 'OTHER' && 'Outro'}
                            </TableCell>
                            <TableCell>{getStatusBadge(log.status)}</TableCell>
                            <TableCell className="max-w-xs truncate">
                              {log.statusDetails ? (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                                      Ver detalhes
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Detalhes do Email</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 mt-4">
                                      <div>
                                        <h4 className="font-medium">Status</h4>
                                        <p>{getStatusBadge(log.status)}</p>
                                      </div>
                                      <div>
                                        <h4 className="font-medium">Detalhes</h4>
                                        <p className="text-sm whitespace-pre-wrap break-words">{log.statusDetails}</p>
                                      </div>
                                      <div>
                                        <h4 className="font-medium">Data de criação</h4>
                                        <p className="text-sm">{new Date(log.createdAt).toLocaleString('pt-BR')}</p>
                                      </div>
                                      <div>
                                        <h4 className="font-medium">Última atualização</h4>
                                        <p className="text-sm">{new Date(log.updatedAt).toLocaleString('pt-BR')}</p>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              ) : (
                                <span className="text-xs text-muted-foreground">Sem detalhes</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8">
                                    <span className="sr-only">Abrir menu</span>
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => resendEmail(log.id)}
                                    disabled={resendingEmail === log.id}
                                    className="cursor-pointer"
                                  >
                                    {resendingEmail === log.id ? (
                                      <>
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        Reenviando...
                                      </>
                                    ) : (
                                      <>
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Reenviar Email
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Paginação avançada */}
                  {data.pages > 1 && (
                    <div className="mt-4 flex justify-center">
                      <Pagination
                        totalPages={data.pages}
                        currentPage={data.currentPage}
                        onPageChange={goToPage}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum log de email encontrado
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {selectedTab === 'stats' && stats && (
        <div className="space-y-6">
          {/* Cards de estatísticas gerais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total de Emails</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEmails}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Enviados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.byStatus.SENT || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalEmails > 0 ? `${((stats.byStatus.SENT || 0) / stats.totalEmails * 100).toFixed(1)}%` : '0%'} do total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Entregues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.byStatus.DELIVERED || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalEmails > 0 ? `${((stats.byStatus.DELIVERED || 0) / stats.totalEmails * 100).toFixed(1)}%` : '0%'} do total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Falhas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.byStatus.FAILED || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalEmails > 0 ? `${((stats.byStatus.FAILED || 0) / stats.totalEmails * 100).toFixed(1)}%` : '0%'} do total
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Emails por Status</CardTitle>
                <CardDescription>Distribuição de emails por status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {prepareStatusChartData() && (
                    <Pie
                      data={prepareStatusChartData()!}
                      options={{
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right',
                          }
                        }
                      }}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emails por Tipo</CardTitle>
                <CardDescription>Distribuição de emails por tipo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {prepareTypeChartData() && (
                    <Pie
                      data={prepareTypeChartData()!}
                      options={{
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right',
                          }
                        }
                      }}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de barras semanal */}
          <Card>
            <CardHeader>
              <CardTitle>Atividade de Emails nos Últimos 7 Dias</CardTitle>
              <CardDescription>Tendência diária de envios, entregas e falhas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {prepareWeeklyChartData() && (
                  <Bar
                    data={prepareWeeklyChartData()!}
                    options={weeklyChartOptions}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informações de configuração do Webhook */}
          <Card>
            <CardHeader>
              <CardTitle>Webhooks para Tracking de Email</CardTitle>
              <CardDescription>Configure webhooks no MailerSend para acompanhamento em tempo real</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Para habilitar o rastreamento de status dos emails em tempo real, configure um webhook no painel do MailerSend com os seguintes detalhes:</p>

                <div className="p-4 border rounded-md bg-muted">
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">URL do Webhook:</span>
                      <code className="ml-2 p-1 bg-background rounded">{`${window.location.origin}/api/webhooks/mailersend`}</code>
                    </div>
                    <div>
                      <span className="font-medium">Eventos a monitorar:</span>
                      <ul className="list-disc list-inside ml-4 mt-1">
                        <li>activity.sent</li>
                        <li>activity.delivered</li>
                        <li>activity.soft_bounced</li>
                        <li>activity.hard_bounced</li>
                        <li>activity.opened</li>
                        <li>activity.clicked</li>
                        <li>activity.spam_complaint</li>
                        <li>activity.unsubscribed</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <Button
                    onClick={() => toast({
                      title: "Informação copiada",
                      description: "URL do webhook copiada para a área de transferência",
                    })}
                    variant="outline"
                    className="mt-2"
                  >
                    Copiar URL do Webhook
                  </Button>

                  <a
                    href="https://www.mailersend.com/help/webhooks"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    Ver documentação do MailerSend
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
