import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Uso - AI Crypto Trading Platform',
  description: 'Termos e condições de uso da plataforma de trading automatizado com inteligência artificial',
}

export default function TermsPage() {
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

      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Termos de Uso</h1>

      <div className="prose prose-sm sm:prose-lg max-w-none">
        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg mb-8">
          <p className="font-semibold text-gray-700 dark:text-gray-300 italic">
            Última atualização: 21 de maio de 2025
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Aceitação dos Termos</h2>
        <p>
          Ao acessar ou usar a plataforma AI Crypto Trading, você concorda em cumprir estes Termos de Uso e todas as leis e regulamentos aplicáveis. Se você não concordar com algum destes termos, está proibido de usar ou acessar este site.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Descrição do Serviço</h2>
        <p>
          A AI Crypto Trading Platform é uma plataforma de trading de criptomoedas que utiliza algoritmos de inteligência artificial para analisar mercados e executar operações automatizadas. Nossos serviços incluem:
        </p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li>Análise automatizada de mercados de criptomoedas</li>
          <li>Execução de operações de trading baseadas em algoritmos de IA</li>
          <li>Ferramentas de backtesting para validação de estratégias</li>
          <li>Painéis de controle para monitoramento de investimentos</li>
          <li>Paper trading para simulação de estratégias sem risco financeiro</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Elegibilidade</h2>
        <p>
          Para utilizar nossa plataforma, você deve:
        </p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li>Ter pelo menos 18 anos de idade</li>
          <li>Fornecer informações precisas e completas durante o processo de registro</li>
          <li>Manter suas informações de conta atualizadas</li>
          <li>Ser o único responsável pela segurança de sua senha e conta</li>
          <li>Notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Riscos de Investimento</h2>
        <p>
          O investimento em criptomoedas envolve riscos significativos. Ao usar nossa plataforma, você reconhece e aceita que:
        </p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li>O valor das criptomoedas pode flutuar drasticamente e você pode perder todo o seu investimento</li>
          <li>Resultados passados não garantem resultados futuros</li>
          <li>Algoritmos automatizados não garantem lucratividade</li>
          <li>Você é o único responsável por suas decisões de investimento</li>
          <li>Nossa plataforma fornece ferramentas, mas não aconselhamento financeiro</li>
        </ul>

        <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-lg my-8 border-l-4 border-yellow-500">
          <h3 className="text-xl font-semibold text-yellow-700 dark:text-yellow-400 mb-2">Aviso de Risco</h3>
          <p className="text-yellow-700 dark:text-yellow-300">
            O investimento em criptomoedas é especulativo e de alto risco. Nunca invista mais do que pode se dar ao luxo de perder. O trading automatizado pode amplificar tanto ganhos quanto perdas.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Responsabilidades do Usuário</h2>
        <p>
          Ao usar nossa plataforma, você concorda em:
        </p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li>Não usar a plataforma para qualquer finalidade ilegal ou não autorizada</li>
          <li>Não tentar acessar áreas restritas da plataforma</li>
          <li>Não interferir ou interromper o funcionamento da plataforma</li>
          <li>Não automatizar o acesso à plataforma sem autorização prévia</li>
          <li>Não compartilhar sua conta com terceiros</li>
          <li>Cumprir todas as leis e regulamentos aplicáveis</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Taxas e Pagamentos</h2>
        <p>
          As taxas cobradas pela utilização da plataforma estão detalhadas em nossa página de preços. Ao se registrar em um plano pago, você concorda com:
        </p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li>O processamento automático de pagamentos recorrentes até o cancelamento</li>
          <li>A possibilidade de alterações nas taxas mediante aviso prévio de 30 dias</li>
          <li>A não devolução de valores em caso de cancelamento no meio do período de cobrança</li>
          <li>A responsabilidade por todos os impostos aplicáveis sobre os serviços</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Propriedade Intelectual</h2>
        <p>
          Todo o conteúdo, recursos e funcionalidades disponíveis na plataforma AI Crypto Trading, incluindo, mas não se limitando a, textos, gráficos, logotipos, ícones, imagens, clipes de áudio, downloads digitais, compilações de dados e software, são propriedade da AI Crypto Trading ou de seus licenciadores e são protegidos por leis de direitos autorais, marcas registradas e outras leis de propriedade intelectual.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Limitação de Responsabilidade</h2>
        <p>
          Em nenhuma circunstância a AI Crypto Trading, seus diretores, funcionários, parceiros, agentes, fornecedores ou afiliados serão responsáveis por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo, sem limitação, perda de lucros, dados, uso, boa vontade ou outras perdas intangíveis, resultantes de:
        </p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li>Seu acesso ou uso ou incapacidade de acessar ou usar o serviço</li>
          <li>Qualquer conduta ou conteúdo de terceiros nos serviços</li>
          <li>Conteúdo obtido dos serviços</li>
          <li>Acesso não autorizado, uso ou alteração de suas transmissões ou conteúdo</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Modificações dos Termos</h2>
        <p>
          Reservamo-nos o direito de modificar ou substituir estes termos a qualquer momento. Se uma revisão for material, tentaremos fornecer um aviso de pelo menos 30 dias antes que os novos termos entrem em vigor. O que constitui uma alteração material será determinado a nosso critério.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Lei Aplicável</h2>
        <p>
          Estes termos serão regidos e interpretados de acordo com as leis brasileiras, independentemente de seus conflitos de disposições legais.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">11. Contato</h2>
        <p>
          Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco em:
        </p>
        <p className="mt-2">
          <strong>Email:</strong> termos@aicrypto.com<br />
          <strong>Endereço:</strong> Av. Paulista, 1000, São Paulo, SP, Brasil
        </p>
      </div>
    </div>
  )
}
