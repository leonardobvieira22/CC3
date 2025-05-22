import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade - AI Crypto Trading Platform',
  description: 'Política de privacidade da plataforma de trading automatizado com inteligência artificial',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-8 sm:py-12 px-4 max-w-4xl">
      <div className="mb-6 sm:mb-8">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 transition-colors text-sm sm:text-base"
        >
          &larr; Voltar para a página inicial
        </Link>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Política de Privacidade</h1>

      <div className="prose prose-sm sm:prose-lg max-w-none">
        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg mb-8">
          <p className="font-semibold text-gray-700 dark:text-gray-300 italic">
            Última atualização: 21 de maio de 2025
          </p>
        </div>

        <p className="lead">
          A AI Crypto Trading leva a sério a sua privacidade. Esta política de privacidade descreve como coletamos, usamos, compartilhamos e protegemos suas informações pessoais quando você utiliza nossa plataforma de trading automatizado com inteligência artificial.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Informações que Coletamos</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">1.1 Informações de Cadastro</h3>
        <p>Quando você se registra em nossa plataforma, coletamos:</p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li>Nome completo</li>
          <li>Endereço de e-mail</li>
          <li>CPF</li>
          <li>Data de nascimento</li>
          <li>Senha (armazenada de forma criptografada)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">1.2 Dados de Uso</h3>
        <p>Durante sua interação com nossa plataforma, coletamos:</p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li>Registros de acesso (data, hora, IP)</li>
          <li>Ações realizadas na plataforma</li>
          <li>Preferências de configuração</li>
          <li>Estratégias de trading utilizadas</li>
          <li>Histórico de operações</li>
          <li>Dispositivos utilizados para acesso</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">1.3 Dados Financeiros</h3>
        <p>Para operações na plataforma, podemos coletar:</p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li>Informações de carteiras de criptomoedas</li>
          <li>Chaves de API de exchanges (sempre com permissões limitadas)</li>
          <li>Histórico de transações</li>
          <li>Informações de pagamento para assinaturas</li>
        </ul>

        <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg my-8 border-l-4 border-blue-500">
          <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-2">Importante</h3>
          <p className="text-blue-700 dark:text-blue-300">
            Nós <strong>nunca</strong> solicitamos ou armazenamos chaves de API com permissões de saque. Todas as integrações com exchanges são feitas utilizando apenas permissões de leitura e trading.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Como Utilizamos suas Informações</h2>

        <p>Utilizamos suas informações pessoais para:</p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li>Criar e gerenciar sua conta na plataforma</li>
          <li>Processar suas operações de trading</li>
          <li>Personalizar sua experiência na plataforma</li>
          <li>Melhorar nossos algoritmos e serviços</li>
          <li>Enviar comunicações sobre sua conta e serviços</li>
          <li>Garantir a segurança da plataforma</li>
          <li>Cumprir obrigações legais e regulatórias</li>
          <li>Prevenir fraudes e atividades suspeitas</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Base Legal para Processamento</h2>

        <p>Processamos suas informações pessoais com base nas seguintes justificativas legais:</p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li><strong>Execução contratual:</strong> Processamento necessário para prestar os serviços contratados</li>
          <li><strong>Consentimento:</strong> Quando você concorda expressamente com o processamento específico</li>
          <li><strong>Interesses legítimos:</strong> Para melhorar nossos serviços e proteger nossos direitos</li>
          <li><strong>Obrigação legal:</strong> Para cumprir leis e regulamentos aplicáveis</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Compartilhamento de Informações</h2>

        <p>Podemos compartilhar suas informações com:</p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li><strong>Prestadores de serviço:</strong> Empresas que nos auxiliam em processamento de pagamentos, hospedagem, análise de dados e outros serviços necessários</li>
          <li><strong>Exchanges de criptomoedas:</strong> Para executar suas operações de trading mediante sua autorização expressa</li>
          <li><strong>Autoridades:</strong> Quando exigido por lei, ordem judicial ou processo legal</li>
        </ul>

        <p className="mt-4">Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins de marketing sem seu consentimento explícito.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Segurança das Informações</h2>

        <p>Implementamos medidas técnicas e organizacionais para proteger suas informações, incluindo:</p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li>Criptografia de dados sensíveis em repouso e em trânsito</li>
          <li>Controles de acesso rigorosos</li>
          <li>Monitoramento de segurança 24/7</li>
          <li>Verificação em duas etapas</li>
          <li>Auditoria regular de segurança</li>
          <li>Treinamento de segurança para nossa equipe</li>
        </ul>

        <p className="mt-4">No entanto, nenhum método de transmissão pela Internet ou armazenamento eletrônico é 100% seguro. Portanto, não podemos garantir segurança absoluta.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Retenção de Dados</h2>

        <p>Mantemos suas informações pessoais apenas pelo tempo necessário para os fins descritos nesta política de privacidade ou conforme exigido por lei. Os períodos de retenção específicos variam dependendo do tipo de informação e dos requisitos legais aplicáveis.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Seus Direitos</h2>

        <p>De acordo com as leis de proteção de dados aplicáveis, você tem os seguintes direitos:</p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li><strong>Acesso:</strong> Direito de saber quais informações mantemos sobre você</li>
          <li><strong>Retificação:</strong> Direito de corrigir informações imprecisas ou incompletas</li>
          <li><strong>Exclusão:</strong> Direito de solicitar a exclusão de suas informações pessoais</li>
          <li><strong>Restrição:</strong> Direito de limitar o processamento de suas informações</li>
          <li><strong>Portabilidade:</strong> Direito de receber seus dados em formato estruturado</li>
          <li><strong>Objeção:</strong> Direito de se opor ao processamento de suas informações</li>
          <li><strong>Revogação de consentimento:</strong> Direito de retirar qualquer consentimento dado anteriormente</li>
        </ul>

        <p className="mt-4">Para exercer qualquer um desses direitos, entre em contato conosco por meio dos canais listados na seção "Contato".</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Cookies e Tecnologias Similares</h2>

        <p>Utilizamos cookies e tecnologias semelhantes para melhorar a experiência do usuário, analisar o uso do site e personalizar conteúdo. Você pode controlar o uso de cookies através das configurações do seu navegador.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Transferências Internacionais</h2>

        <p>Seus dados podem ser processados em servidores localizados fora do seu país de residência. Implementamos salvaguardas apropriadas para garantir que suas informações permaneçam protegidas de acordo com esta política de privacidade.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Alterações nesta Política</h2>

        <p>Podemos atualizar esta política de privacidade periodicamente para refletir alterações em nossas práticas de informação. Notificaremos sobre alterações significativas publicando a nova política em nosso site e, quando apropriado, notificando você diretamente.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">11. Contato</h2>

        <p>Se você tiver alguma dúvida sobre esta política de privacidade ou nossas práticas de dados, entre em contato conosco:</p>

        <div className="mt-4">
          <p><strong>Email:</strong> privacidade@aicrypto.com</p>
          <p><strong>Encarregado de Proteção de Dados (DPO):</strong> dpo@aicrypto.com</p>
          <p><strong>Endereço:</strong> Av. Paulista, 1000, São Paulo, SP, Brasil</p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg mt-12">
          <p className="italic text-sm text-gray-600 dark:text-gray-400">
            Esta política de privacidade foi atualizada pela última vez em 21 de maio de 2025.
          </p>
        </div>
      </div>
    </div>
  )
}
