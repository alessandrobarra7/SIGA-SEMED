/* DESIGN REMINDER: Caderno de Gestão Pública — layout institucional editorial; manter o topo, KPIs, abas, cadastro à esquerda e acompanhamento à direita na mesma geografia funcional. */
import { FormEvent, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpRight,
  BadgeCheck,
  BellRing,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  Copy,
  FileText,
  Filter,
  KeyRound,
  Landmark,
  LogOut,
  MoreHorizontal,
  Pencil,
  Plus,
  Printer,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  WalletCards,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ModuleKey = "records" | "documents";
type RecordKind = "Contrato" | "Processo";
type RiskState = "ok" | "warning" | "overdue" | "undated" | "closed";
type FinancialCategory = "Sem controle" | "Contrato geral" | "Aluguel";
type Payment = { id: string; date: string; amount: number; notes: string };

type RecordItem = {
  id: string;
  kind: RecordKind;
  number: string;
  object: string;
  party: string;
  department: string;
  responsible: string;
  amount: number;
  financialCategory: FinancialCategory;
  paymentDueDate: string;
  startDate: string;
  endDate: string;
  status: string;
  notes: string;
  alertDays: number;
  payments: Payment[];
};

type DocumentItem = {
  id: string;
  kind: "Ofício" | "Memorando" | "Despacho";
  number: string;
  template: string;
  subject: string;
  destination: string;
  recipient: string;
  relatedRecord: string;
  responsible: string;
  documentDate: string;
  dueDate: string;
  status: string;
  summary: string;
  notes: string;
};

type RecordForm = Omit<RecordItem, "payments" | "amount" | "alertDays"> & {
  amount: string;
  alertDays: string;
};
type DocumentForm = DocumentItem;

const ASSETS = {
  header: "/manus-storage/siga-semed-header-reference_29eaaefe.png",
  documents: "/manus-storage/siga-semed-documents-texture_a901e414.png",
  finance: "/manus-storage/siga-semed-finance-texture_0746dc66.png",
  mark: "/manus-storage/siga-semed-operational-mark_0bf6dce6.png",
  officialLogo: "/manus-storage/semed-logo_62496e33.png",
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 2,
});
const dateFormatter = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" });

const makeDate = (offset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
};

const initialRecords: RecordItem[] = [
  {
    id: "r-012",
    kind: "Contrato",
    number: "012/2026",
    object: "FORNECIMENTO DE MERENDA ESCOLAR",
    party: "COOPERATIVA VALE VERDE",
    department: "ALIMENTAÇÃO ESCOLAR",
    responsible: "EQUIPE TÉCNICA SEMED",
    amount: 348500,
    financialCategory: "Contrato geral",
    paymentDueDate: "",
    startDate: makeDate(-140),
    endDate: makeDate(12),
    status: "Vigente",
    notes: "PREPARAR ANÁLISE PARA POSSÍVEL PRORROGAÇÃO.",
    alertDays: 30,
    payments: [
      { id: "p-1", date: makeDate(-42), amount: 96000, notes: "NF 194 — COMPETÊNCIA MAIO" },
      { id: "p-2", date: makeDate(-13), amount: 74000, notes: "NF 210 — COMPETÊNCIA JUNHO" },
    ],
  },
  {
    id: "r-189",
    kind: "Processo",
    number: "189/2026",
    object: "AQUISIÇÃO DE KITS ESCOLARES",
    party: "SETOR DE COMPRAS",
    department: "ADMINISTRATIVO",
    responsible: "TÉCNICO RESPONSÁVEL",
    amount: 0,
    financialCategory: "Sem controle",
    paymentDueDate: "",
    startDate: makeDate(-45),
    endDate: makeDate(45),
    status: "Em andamento",
    notes: "AGUARDANDO CONSOLIDAÇÃO DAS DEMANDAS DAS ESCOLAS.",
    alertDays: 45,
    payments: [],
  },
  {
    id: "r-044",
    kind: "Contrato",
    number: "044/2025",
    object: "TRANSPORTE ESCOLAR RURAL",
    party: "TRANSEDU SERVIÇOS",
    department: "TRANSPORTE ESCOLAR",
    responsible: "COORDENAÇÃO DE TRANSPORTE",
    amount: 912000,
    financialCategory: "Contrato geral",
    paymentDueDate: "",
    startDate: makeDate(-300),
    endDate: makeDate(-8),
    status: "Vigente",
    notes: "VENCIDO. PRIORIZAR RENOVAÇÃO OU NOVO PROCEDIMENTO.",
    alertDays: 60,
    payments: [{ id: "p-3", date: makeDate(-60), amount: 398000, notes: "MEDIÇÕES CONFERIDAS" }],
  },
  {
    id: "r-027",
    kind: "Contrato",
    number: "027/2026",
    object: "MANUTENÇÃO PREDIAL DAS UNIDADES ESCOLARES",
    party: "CONSTRUTORA HORIZONTE",
    department: "INFRAESTRUTURA",
    responsible: "FISCAL DO CONTRATO",
    amount: 221750,
    financialCategory: "Contrato geral",
    paymentDueDate: "",
    startDate: makeDate(-20),
    endDate: makeDate(95),
    status: "Vigente",
    notes: "ACOMPANHAR BOLETINS MENSAIS DE EXECUÇÃO.",
    alertDays: 30,
    payments: [],
  },
  {
    id: "r-009",
    kind: "Contrato",
    number: "009/2026",
    object: "LOCAÇÃO DE IMÓVEL PARA ATENDIMENTO EDUCACIONAL",
    party: "IMOBILIÁRIA LUMIAR",
    department: "ADMINISTRATIVO",
    responsible: "NÚCLEO DE PATRIMÔNIO",
    amount: 126000,
    financialCategory: "Aluguel",
    paymentDueDate: makeDate(3),
    startDate: makeDate(-200),
    endDate: makeDate(162),
    status: "Vigente",
    notes: "PAGAMENTO MENSAL COM REAJUSTE ANUAL PREVISTO.",
    alertDays: 30,
    payments: [{ id: "p-4", date: makeDate(-26), amount: 10500, notes: "COMPETÊNCIA CORRENTE" }],
  },
];

const initialDocuments: DocumentItem[] = [
  {
    id: "d-1",
    kind: "Ofício",
    number: "694/2026",
    template: "Solicitação ao RH Central",
    subject: "SOLICITAÇÃO AO RH CENTRAL",
    destination: "RH CENTRAL",
    recipient: "COORDENAÇÃO DE PESSOAL",
    relatedRecord: "PROCESSO 189/2026",
    responsible: "GABSAAF/SEMED",
    documentDate: makeDate(-3),
    dueDate: makeDate(4),
    status: "Aguardando resposta",
    summary: "SOLICITA-SE PROVIDÊNCIAS QUANTO À ATUALIZAÇÃO DOS DADOS FUNCIONAIS INFORMADOS.",
    notes: "AGUARDAR RETORNO PARA JUNTADA AO PROCESSO.",
  },
  {
    id: "d-2",
    kind: "Memorando",
    number: "238/2026",
    template: "Abertura de processo de pagamento",
    subject: "SOLICITAÇÃO DE ABERTURA DE PROCESSO ADMINISTRATIVO PARA FINS DE PAGAMENTO",
    destination: "SECRETÁRIO MUNICIPAL DE EDUCAÇÃO | SEMED",
    recipient: "GABINETE",
    relatedRecord: "CONTRATO 012/2026",
    responsible: "EQUIPE TÉCNICA SEMED",
    documentDate: makeDate(-8),
    dueDate: makeDate(-1),
    status: "Pendente",
    summary: "ENCAMINHA-SE DOCUMENTAÇÃO PARA ABERTURA DO PROCESSO DE PAGAMENTO DA COMPETÊNCIA ATUAL.",
    notes: "CONFERIR NOTA FISCAL E CERTIDÕES ANTES DO ENVIO.",
  },
  {
    id: "d-3",
    kind: "Despacho",
    number: "041/2026",
    template: "Despacho administrativo de pagamento",
    subject: "SOLICITAÇÃO DE PAGAMENTO REFERENTE À NOTA FISCAL",
    destination: "GABSAAF/SEMED",
    recipient: "SECRETÁRIO MUNICIPAL DE EDUCAÇÃO",
    relatedRecord: "CONTRATO 027/2026",
    responsible: "CONTROLE INTERNO",
    documentDate: makeDate(-1),
    dueDate: makeDate(12),
    status: "Em elaboração",
    summary: "SUBMETE-SE A ANÁLISE A DOCUMENTAÇÃO RELATIVA À EXECUÇÃO CONTRATUAL E AO PAGAMENTO SOLICITADO.",
    notes: "",
  },
];

const emptyRecordForm = (): RecordForm => ({
  id: "",
  kind: "Contrato",
  number: "",
  object: "",
  party: "",
  department: "",
  responsible: "",
  amount: "",
  financialCategory: "Contrato geral",
  paymentDueDate: "",
  startDate: "",
  endDate: "",
  status: "Vigente",
  notes: "",
  alertDays: "30",
});

const emptyDocumentForm = (): DocumentForm => ({
  id: "",
  kind: "Ofício",
  number: "",
  template: "Solicitação ao RH Central",
  subject: "SOLICITAÇÃO AO RH CENTRAL",
  destination: "RH CENTRAL",
  recipient: "",
  relatedRecord: "",
  responsible: "",
  documentDate: "",
  dueDate: "",
  status: "Em elaboração",
  summary: "",
  notes: "",
});

function getDays(dateValue: string) {
  if (!dateValue) return Number.POSITIVE_INFINITY;
  const today = new Date();
  const base = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const target = Date.parse(`${dateValue}T00:00:00.000Z`);
  return Math.ceil((target - base) / 86_400_000);
}

function getRisk(status: string, dateValue: string, warningDays: number): RiskState {
  if (["Concluído", "Cancelado"].includes(status)) return "closed";
  if (!dateValue) return "undated";
  const days = getDays(dateValue);
  if (days < 0) return "overdue";
  if (days <= warningDays) return "warning";
  return "ok";
}

function riskLabel(risk: RiskState | string, days: number, context = "") {
  const prefix = context ? `${context} ` : "";
  if (risk === "closed") return "Encerrado";
  if (risk === "undated") return "Sem data";
  if (risk === "ok") return `${prefix}no prazo`;
  if (risk === "warning") return days === 0 ? `${prefix}vence hoje` : `${prefix}vence em ${days} dias`;
  return `${prefix}vencido há ${Math.abs(days)} dias`;
}

function formatDate(value: string) {
  return value ? dateFormatter.format(new Date(`${value}T00:00:00.000Z`)) : "—";
}

function toUpper(value: string) {
  return value.toLocaleUpperCase("pt-BR");
}

function parseAmount(value: string) {
  const numeric = Number(value.replace(/[^0-9,.-]/g, "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(numeric) ? numeric : 0;
}

function buildDocumentPreview(document: DocumentItem) {
  const title = document.kind === "Despacho" ? "DESPACHO ADMINISTRATIVO" : `${document.kind.toUpperCase()} Nº ${document.number || "___"} — GABSAAF/SEMED`;
  return [
    "ESTADO DO MARANHÃO",
    "PREFEITURA MUNICIPAL DE PAÇO DO LUMIAR",
    "SECRETARIA MUNICIPAL DE EDUCAÇÃO",
    "",
    title,
    `PAÇO DO LUMIAR — MA, ${formatDate(document.documentDate)}`,
    "",
    `AO(À): ${document.destination || "___"}`,
    document.recipient ? `A/C: ${document.recipient}` : "",
    `ASSUNTO: ${document.subject || "___"}`,
    document.relatedRecord ? `REFERÊNCIA: ${document.relatedRecord}` : "",
    "",
    "SENHOR(A),",
    "",
    document.summary || "DESCREVA AQUI O PEDIDO PRINCIPAL.",
    "",
    document.notes ? `OBSERVAÇÕES: ${document.notes}` : "",
    "",
    "ATENCIOSAMENTE,",
    "",
    document.responsible || "RESPONSÁVEL",
  ]
    .filter((line, index, all) => line || all[index - 1])
    .join("\n");
}

function LoginPage({ onEnter }: { onEnter: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!username || !password) {
      setNotice("Informe usuário e senha para acessar a demonstração.");
      return;
    }
    onEnter();
  }

  return (
    <main className="siga-login-shell">
      <div className="login-ambient" style={{ backgroundImage: `url(${ASSETS.documents})` }} />
      <form className="siga-login-card" onSubmit={submit}>
        <div className="login-brand-row">
          <img src={ASSETS.officialLogo} alt="Prefeitura de Paço do Lumiar — SEMED" className="login-official-logo" />
          <img src={ASSETS.mark} alt="Marca operacional SIGA SEMED" className="login-mark" />
        </div>
        <div className="login-copy">
          <p className="siga-kicker">Sistema Integrado de Gestão e Acompanhamento</p>
          <h1>SIGA <em>SEMED</em></h1>
          <p>Acesso reservado à equipe técnica. Entre para acompanhar contratos, processos e documentos.</p>
        </div>
        <label>Usuário<input autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Ex.: tecnico1" /></label>
        <label>Senha<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Digite sua senha" /></label>
        {notice ? <p className="inline-notice" role="status">{notice}</p> : null}
        <button className="primary-action full" type="submit"><ShieldCheck size={18} /> Entrar no sistema</button>
      </form>
    </main>
  );
}

function MetricCard({ label, value, tone, icon: Icon, detail }: { label: string; value: string | number; tone: string; icon: typeof FileText; detail: string }) {
  return (
    <article className={`metric-card ${tone}`}>
      <div className="metric-top"><span>{label}</span><Icon size={18} aria-hidden="true" /></div>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function StatusPill({ risk, children }: { risk: RiskState; children: string }) {
  return <span className={`status-pill ${risk}`}>{risk === "overdue" ? <AlertTriangle size={13} /> : risk === "warning" ? <Clock3 size={13} /> : risk === "ok" ? <BadgeCheck size={13} /> : <MoreHorizontal size={13} />}{children}</span>;
}

function InsightBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const width = total ? Math.max(7, (count / total) * 100) : 0;
  return <div className="insight-bar"><div className="insight-bar-label"><span>{label}</span><strong>{count}</strong></div><div className="insight-track"><span style={{ width: `${width}%`, backgroundColor: color }} /></div></div>;
}

function PasswordPanel({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [notice, setNotice] = useState("");
  return <div className="modal-scrim" role="dialog" aria-modal="true" aria-labelledby="password-title"><form className="password-dialog" onSubmit={(event) => { event.preventDefault(); if (password.length < 10 || password !== confirmation) { setNotice("Use ao menos 10 caracteres e confirme a nova senha."); return; } onSave(); }}><button className="dialog-close" type="button" aria-label="Fechar" onClick={onClose}>×</button><p className="siga-kicker">Segurança da conta</p><h2 id="password-title">Alterar senha</h2><p>Atualize suas credenciais sem sair da área de trabalho.</p><label>Senha atual<input type="password" required /></label><label>Nova senha<input type="password" required minLength={10} value={password} onChange={(event) => setPassword(event.target.value)} /></label><label>Confirmar nova senha<input type="password" required minLength={10} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></label>{notice ? <p className="inline-notice">{notice}</p> : null}<div className="dialog-actions"><button type="button" className="quiet-action" onClick={onClose}>Cancelar</button><button type="submit" className="primary-action">Salvar senha</button></div></form></div>;
}

function PaymentEditor({ record, onSave }: { record: RecordItem; onSave: (amount: number, notes: string) => void }) {
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  return <form className="payment-editor" onSubmit={(event) => { event.preventDefault(); const value = parseAmount(amount); if (!value) return; onSave(value, toUpper(notes)); setAmount(""); setNotes(""); }}><label>Data<input type="date" defaultValue={makeDate(0)} /></label><label>Valor pago<input inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0,00" /></label>{record.financialCategory === "Aluguel" ? <label>Próximo vencimento<input type="date" defaultValue={record.paymentDueDate} /></label> : null}<label className="wide-input">Observação<input value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="NF, competência ou ordem bancária" /></label><button type="submit" className="primary-action"><Plus size={16} /> Lançar baixa</button></form>;
}

function RecordRow({ record, open, onToggle, onEdit, onDelete, onPaymentAdd }: { record: RecordItem; open: boolean; onToggle: () => void; onEdit: () => void; onDelete: () => void; onPaymentAdd: (amount: number, notes: string) => void }) {
  const risk = getRisk(record.status, record.endDate, record.alertDays);
  const days = getDays(record.endDate);
  const paid = record.payments.reduce((total, payment) => total + payment.amount, 0);
  const balance = Math.max(0, record.amount - paid);
  const progress = record.amount ? Math.min(100, Math.round((paid / record.amount) * 100)) : 0;
  const isFinancial = record.kind === "Contrato" && record.financialCategory !== "Sem controle" && record.amount > 0;
  return <article className={`record-row ${risk} ${open ? "open" : ""}`}><button type="button" className="record-summary" onClick={onToggle} aria-expanded={open}><span className="record-identity"><strong>{record.number}</strong><small>{record.kind} · {record.department}</small></span><span className="record-quick-meta"><StatusPill risk={risk}>{riskLabel(risk, days)}</StatusPill><span className="record-object">{record.object}</span></span><ChevronDown className="chevron" size={19} /></button>{open ? <div className="record-expanded"><div className="detail-grid"><Detail label="Tipo" value={record.kind} /><Detail label="Situação" value={record.status} /><Detail label="Vencimento" value={formatDate(record.endDate)} /><Detail label="Alerta" value={riskLabel(risk, days)} /><Detail wide label="Objeto ou assunto" value={record.object} /><Detail label="Fornecedor, interessado ou setor" value={record.party || "—"} /><Detail label="Setor" value={record.department || "—"} /><Detail label="Responsável" value={record.responsible || "—"} /><Detail label="Valor" value={record.amount ? currency.format(record.amount) : "—"} /><Detail label="Controle financeiro" value={record.financialCategory} />{record.notes ? <Detail wide label="Observações" value={record.notes} /> : null}</div>{isFinancial ? <section className="finance-module" style={{ backgroundImage: `linear-gradient(90deg, rgba(18,58,99,.97), rgba(18,58,99,.86)), url(${ASSETS.finance})` }}><div className="finance-heading"><div><p className="siga-kicker inverse">Financeiro</p><h3>Baixas e saldo do contrato</h3></div><strong>{currency.format(balance)} <small>em aberto</small></strong></div><div className="finance-progress"><div><span>Execução financeira</span><strong>{progress}% pago</strong></div><div className="finance-track"><span style={{ width: `${progress}%` }} /></div><small>{currency.format(paid)} pago de {currency.format(record.amount)}</small></div><PaymentEditor record={record} onSave={onPaymentAdd} /><div className="payment-history">{record.payments.length ? record.payments.map((payment) => <div className="payment-line" key={payment.id}><span><strong>{currency.format(payment.amount)}</strong><small>{formatDate(payment.date)} · {payment.notes || "Sem observação"}</small></span><BadgeCheck size={17} /></div>) : <p>Nenhuma baixa lançada para este contrato.</p>}</div></section> : null}<div className="row-actions"><button type="button" className="quiet-action" onClick={onEdit}><Pencil size={15} /> Editar</button><button type="button" className="danger-action" onClick={onDelete}><Trash2 size={15} /> Excluir</button></div></div> : null}</article>;
}

function Detail({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return <div className={`detail-item ${wide ? "wide" : ""}`}><span>{label}</span><strong>{value}</strong></div>;
}

function DocumentRow({ document, open, onToggle, onEdit, onDelete, onCopy }: { document: DocumentItem; open: boolean; onToggle: () => void; onEdit: () => void; onDelete: () => void; onCopy: () => void }) {
  const risk = getRisk(document.status, document.dueDate, 7);
  const days = getDays(document.dueDate);
  return <article className={`record-row document-row ${risk} ${open ? "open" : ""}`}><button type="button" className="record-summary" onClick={onToggle} aria-expanded={open}><span className="record-identity"><strong>{document.kind} {document.number}</strong><small>{document.destination || "DESTINO A INFORMAR"}</small></span><span className="record-quick-meta"><StatusPill risk={risk}>{riskLabel(risk, days, "Resposta")}</StatusPill><span className="record-object">{document.subject}</span></span><ChevronDown className="chevron" size={19} /></button>{open ? <div className="record-expanded"><div className="detail-grid"><Detail label="Tipo" value={document.kind} /><Detail label="Situação" value={document.status} /><Detail label="Data" value={formatDate(document.documentDate)} /><Detail label="Prazo de resposta" value={riskLabel(risk, days)} /><Detail label="Modelo" value={document.template} /><Detail label="Destino" value={document.destination || "—"} /><Detail label="Destinatário" value={document.recipient || "—"} /><Detail label="Responsável" value={document.responsible || "—"} /><Detail wide label="Assunto" value={document.subject} />{document.relatedRecord ? <Detail wide label="Vínculo" value={document.relatedRecord} /> : null}{document.summary ? <Detail wide label="Resumo do pedido" value={document.summary} /> : null}</div><section className="document-preview-card"><div className="preview-heading"><div><p className="siga-kicker">Prévia</p><h3>Texto base do documento</h3></div><button className="quiet-action" type="button" onClick={onCopy}><Copy size={15} /> Copiar prévia</button></div><pre>{buildDocumentPreview(document)}</pre></section><div className="row-actions"><button type="button" className="quiet-action" onClick={onEdit}><Pencil size={15} /> Editar</button><button type="button" className="danger-action" onClick={onDelete}><Trash2 size={15} /> Excluir</button></div></div> : null}</article>;
}

export default function Home() {
  const [authenticated, setAuthenticated] = useState(true);
  const [activeModule, setActiveModule] = useState<ModuleKey>("records");
  const [records, setRecords] = useState<RecordItem[]>(initialRecords);
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [recordForm, setRecordForm] = useState<RecordForm>(emptyRecordForm());
  const [documentForm, setDocumentForm] = useState<DocumentForm>(emptyDocumentForm());
  const [recordFormOpen, setRecordFormOpen] = useState(false);
  const [documentFormOpen, setDocumentFormOpen] = useState(false);
  const [openRecordId, setOpenRecordId] = useState<string | null>(null);
  const [openDocumentId, setOpenDocumentId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [documentQuery, setDocumentQuery] = useState("");
  const [kindFilter, setKindFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [departmentFilter, setDepartmentFilter] = useState("Todos");
  const [documentKindFilter, setDocumentKindFilter] = useState("Todos");
  const [documentStatusFilter, setDocumentStatusFilter] = useState("Todos");
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("Preview operacional ativo: dados demonstrativos mantidos apenas no navegador.");

  const enrichedRecords = useMemo(() => records.map((record) => {
    const risk = getRisk(record.status, record.endDate, record.alertDays);
    const paymentRisk = record.financialCategory === "Aluguel" ? getRisk(record.status, record.paymentDueDate, 5) : "closed" as RiskState;
    const primaryRisk = risk === "overdue" || paymentRisk === "overdue" ? "overdue" : risk === "warning" || paymentRisk === "warning" ? "warning" : risk;
    const paid = record.payments.reduce((total, payment) => total + payment.amount, 0);
    return { ...record, risk: primaryRisk, days: Math.min(getDays(record.endDate), getDays(record.paymentDueDate)), paid, balance: Math.max(0, record.amount - paid) };
  }), [records]);

  const enrichedDocuments = useMemo(() => documents.map((document) => ({ ...document, risk: getRisk(document.status, document.dueDate, 7), days: getDays(document.dueDate) })), [documents]);

  const departments = useMemo(() => Array.from(new Set(records.map((record) => record.department))).filter(Boolean).sort(), [records]);
  const filteredRecords = useMemo(() => enrichedRecords.filter((record) => {
    const haystack = [record.number, record.object, record.party, record.department, record.responsible, record.status].join(" ").toLocaleLowerCase("pt-BR");
    return (!query || haystack.includes(query.toLocaleLowerCase("pt-BR"))) && (kindFilter === "Todos" || record.kind === kindFilter) && (statusFilter === "Todos" || record.status === statusFilter || record.risk === statusFilter) && (departmentFilter === "Todos" || record.department === departmentFilter);
  }), [departmentFilter, enrichedRecords, kindFilter, query, statusFilter]);
  const filteredDocuments = useMemo(() => enrichedDocuments.filter((document) => {
    const haystack = [document.kind, document.number, document.subject, document.destination, document.recipient, document.status].join(" ").toLocaleLowerCase("pt-BR");
    return (!documentQuery || haystack.includes(documentQuery.toLocaleLowerCase("pt-BR"))) && (documentKindFilter === "Todos" || document.kind === documentKindFilter) && (documentStatusFilter === "Todos" || document.status === documentStatusFilter || document.risk === documentStatusFilter);
  }), [documentKindFilter, documentQuery, documentStatusFilter, enrichedDocuments]);

  const summary = useMemo(() => {
    const active = enrichedRecords.filter((record) => record.risk !== "closed");
    return { total: records.length, active: active.length, warning: active.filter((record) => record.risk === "warning").length, overdue: active.filter((record) => record.risk === "overdue").length, balance: active.reduce((total, record) => total + (record.financialCategory === "Sem controle" ? 0 : record.balance), 0) };
  }, [enrichedRecords, records.length]);
  const documentSummary = useMemo(() => ({ total: documents.length, open: enrichedDocuments.filter((document) => document.risk !== "closed").length, warning: enrichedDocuments.filter((document) => document.risk === "warning").length, overdue: enrichedDocuments.filter((document) => document.risk === "overdue").length }), [documents.length, enrichedDocuments]);
  const alerts = useMemo(() => [...enrichedRecords.filter((record) => ["warning", "overdue"].includes(record.risk)).map((record) => ({ id: record.id, title: `${record.kind} ${record.number}`, description: record.object, risk: record.risk, days: record.days })), ...enrichedDocuments.filter((document) => ["warning", "overdue"].includes(document.risk)).map((document) => ({ id: document.id, title: `${document.kind} ${document.number}`, description: document.subject, risk: document.risk, days: document.days }))].sort((a, b) => a.days - b.days).slice(0, 5), [enrichedDocuments, enrichedRecords]);

  const recordStatusData = useMemo(() => ["Vigente", "Em andamento", "Aguardando análise", "Concluído"].map((name) => ({ name, value: records.filter((record) => record.status === name).length })), [records]);
  const recordRiskData = useMemo(() => [
    { label: "No prazo", count: enrichedRecords.filter((record) => record.risk === "ok").length, color: "#35a943" },
    { label: "A vencer", count: enrichedRecords.filter((record) => record.risk === "warning").length, color: "#d4861b" },
    { label: "Vencidos", count: enrichedRecords.filter((record) => record.risk === "overdue").length, color: "#cf3f45" },
    { label: "Sem data", count: enrichedRecords.filter((record) => record.risk === "undated").length, color: "#7a8a99" },
  ], [enrichedRecords]);
  const documentKindData = useMemo(() => ["Ofício", "Memorando", "Despacho"].map((name) => ({ name, value: documents.filter((document) => document.kind === name).length })), [documents]);

  function exportCsv() {
    const rows = [["Tipo", "Número", "Objeto", "Setor", "Situação", "Valor", "Saldo"], ...filteredRecords.map((record) => [record.kind, record.number, record.object, record.department, record.status, currency.format(record.amount), currency.format(record.balance)])];
    const data = `\uFEFF${rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";")).join("\n")}`;
    const blob = new Blob([data], { type: "text/csv;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = "relatorio-siga-semed-preview.csv";
    link.click();
    URL.revokeObjectURL(href);
    setNotice("CSV dos registros filtrados preparado para download.");
  }

  function saveRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: RecordItem = { ...recordForm, id: recordForm.id || `r-${Date.now()}`, amount: parseAmount(recordForm.amount), alertDays: Number(recordForm.alertDays || 30), payments: recordForm.id ? records.find((record) => record.id === recordForm.id)?.payments ?? [] : [] };
    setRecords((current) => recordForm.id ? current.map((record) => record.id === next.id ? next : record) : [next, ...current]);
    setRecordForm(emptyRecordForm());
    setRecordFormOpen(false);
    setNotice(recordForm.id ? "Registro atualizado no preview." : "Registro cadastrado no preview.");
  }

  function saveDocument(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = { ...documentForm, id: documentForm.id || `d-${Date.now()}` };
    setDocuments((current) => documentForm.id ? current.map((document) => document.id === next.id ? next : document) : [next, ...current]);
    setDocumentForm(emptyDocumentForm());
    setDocumentFormOpen(false);
    setNotice(documentForm.id ? "Documento atualizado no preview." : "Documento cadastrado no preview.");
  }

  function editRecord(record: RecordItem) {
    setRecordForm({ ...record, amount: String(record.amount).replace(".", ","), alertDays: String(record.alertDays) });
    setRecordFormOpen(true);
    setNotice(`Editando ${record.kind.toLowerCase()} ${record.number}.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function editDocument(document: DocumentItem) {
    setDocumentForm(document);
    setActiveModule("documents");
    setDocumentFormOpen(true);
    setNotice(`Editando ${document.kind.toLowerCase()} ${document.number}.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!authenticated) return <LoginPage onEnter={() => { setAuthenticated(true); setNotice("Sessão de demonstração iniciada."); }} />;

  return <main className="siga-app-shell">
    <header className="siga-header" style={{ backgroundImage: `linear-gradient(90deg, rgba(18,58,99,.98) 0%, rgba(18,58,99,.91) 54%, rgba(18,58,99,.96) 100%), url(${ASSETS.header})` }}>
      <div className="header-brand"><img src={ASSETS.officialLogo} alt="Prefeitura de Paço do Lumiar — SEMED" className="official-logo" /><div className="header-brand-copy"><p className="siga-kicker inverse">Sistema Integrado de Gestão e Acompanhamento</p><h1>SIGA <em>SEMED</em></h1><p>Contratos, processos, documentos, prazos e controles de acompanhamento técnico.</p></div></div>
      <div className="header-tools"><div className="user-card"><span>Mariana Almeida</span><small>Coordenação técnica</small></div><button className="header-icon" title="Minha senha" aria-label="Minha senha" onClick={() => setShowPassword(true)}><KeyRound size={18} /></button><button className="header-icon" title="Atualizar dados" aria-label="Atualizar dados" onClick={() => setNotice("Dados de demonstração atualizados na tela.")}><RefreshCw size={18} /></button><button className="header-icon" title="Imprimir relatório" aria-label="Imprimir relatório" onClick={() => window.print()}><Printer size={18} /></button><button className="header-icon accent" title="Exportar CSV" aria-label="Exportar CSV" onClick={exportCsv}><ArrowDownToLine size={18} /></button><button className="header-icon" title="Sair" aria-label="Sair" onClick={() => setAuthenticated(false)}><LogOut size={18} /></button></div>
    </header>

    {notice ? <div className="siga-notice" role="status"><BadgeCheck size={17} /><span>{notice}</span><button type="button" aria-label="Fechar aviso" onClick={() => setNotice("")}>×</button></div> : null}

    <section className="metric-grid" aria-label="Resumo geral"><MetricCard label="Registros" value={summary.total} tone="slate" icon={FileText} detail="Contratos e processos cadastrados" /><MetricCard label="Ativos" value={summary.active} tone="green" icon={BadgeCheck} detail="Acompanhamento em curso" /><MetricCard label="A vencer" value={summary.warning} tone="amber" icon={Clock3} detail="Dentro da janela de alerta" /><MetricCard label="Vencidos" value={summary.overdue} tone="red" icon={AlertTriangle} detail="Exigem encaminhamento" /><MetricCard label="Saldo a pagar" value={currency.format(summary.balance)} tone="blue" icon={WalletCards} detail="Contratos com controle financeiro" /></section>

    <nav className="module-tabs" aria-label="Módulos do sistema"><button className={activeModule === "records" ? "active" : ""} type="button" onClick={() => setActiveModule("records")}><FileText size={18} /> Contratos e Processos <span>{summary.total}</span></button><button className={activeModule === "documents" ? "active" : ""} type="button" onClick={() => setActiveModule("documents")}><ClipboardCheck size={18} /> Documentos <span>{documentSummary.total}</span></button></nav>

    {activeModule === "records" ? <section className="workspace-grid">
      <aside className={`form-panel ${recordFormOpen ? "open" : ""}`}>
        <button className="form-panel-trigger" type="button" onClick={() => setRecordFormOpen((current) => !current)} aria-expanded={recordFormOpen}><span><small>Cadastro</small><strong>{recordForm.id ? "Editar registro" : "Novo registro"}</strong></span><ChevronDown size={20} /></button>
        {recordFormOpen ? <form className="siga-form" onSubmit={saveRecord}><div className="segmented-control"><button className={recordForm.kind === "Contrato" ? "active" : ""} type="button" onClick={() => setRecordForm((current) => ({ ...current, kind: "Contrato", financialCategory: current.financialCategory === "Sem controle" ? "Contrato geral" : current.financialCategory }))}>Contrato</button><button className={recordForm.kind === "Processo" ? "active" : ""} type="button" onClick={() => setRecordForm((current) => ({ ...current, kind: "Processo", financialCategory: "Sem controle", paymentDueDate: "" }))}>Processo</button></div><FormInput label="Número" value={recordForm.number} required onChange={(value) => setRecordForm((current) => ({ ...current, number: toUpper(value) }))} placeholder="Ex.: 012/2026" /><FormArea label="Objeto ou assunto" value={recordForm.object} required onChange={(value) => setRecordForm((current) => ({ ...current, object: toUpper(value) }))} placeholder="Descreva o contrato ou processo" /><FormInput label="Fornecedor, interessado ou setor" value={recordForm.party} onChange={(value) => setRecordForm((current) => ({ ...current, party: toUpper(value) }))} placeholder="Empresa, escola ou setor solicitante" /><div className="form-two"><FormInput label="Setor" value={recordForm.department} onChange={(value) => setRecordForm((current) => ({ ...current, department: toUpper(value) }))} placeholder="Ex.: Transporte Escolar" /><FormInput label="Responsável" value={recordForm.responsible} onChange={(value) => setRecordForm((current) => ({ ...current, responsible: toUpper(value) }))} placeholder="Nome ou equipe" /></div><div className="form-two"><FormInput label="Início" type="date" value={recordForm.startDate} onChange={(value) => setRecordForm((current) => ({ ...current, startDate: value }))} /><FormInput label="Vencimento" type="date" value={recordForm.endDate} onChange={(value) => setRecordForm((current) => ({ ...current, endDate: value }))} /></div><div className="form-two"><FormInput label="Valor" inputMode="decimal" value={recordForm.amount} onChange={(value) => setRecordForm((current) => ({ ...current, amount: value }))} placeholder="0,00" /><FormSelect label="Alertar com" value={recordForm.alertDays} onChange={(value) => setRecordForm((current) => ({ ...current, alertDays: value }))} options={["15", "30", "45", "60", "90"]} format={(value) => `${value} dias`} /></div><div className="form-two"><FormSelect label="Controle financeiro" value={recordForm.financialCategory} onChange={(value) => setRecordForm((current) => ({ ...current, financialCategory: value as FinancialCategory, paymentDueDate: value === "Aluguel" ? current.paymentDueDate : "" }))} options={["Sem controle", "Contrato geral", "Aluguel"]} /><FormInput label="Próximo pagamento" type="date" disabled={recordForm.financialCategory !== "Aluguel"} value={recordForm.paymentDueDate} onChange={(value) => setRecordForm((current) => ({ ...current, paymentDueDate: value }))} /></div><FormSelect label="Situação" value={recordForm.status} onChange={(value) => setRecordForm((current) => ({ ...current, status: value }))} options={["Vigente", "Em andamento", "Aguardando análise", "Concluído", "Suspenso", "Cancelado"]} /><FormArea label="Observações" value={recordForm.notes} onChange={(value) => setRecordForm((current) => ({ ...current, notes: toUpper(value) }))} placeholder="Pendências, providências ou detalhes" /><div className="form-actions">{recordForm.id ? <button className="quiet-action" type="button" onClick={() => { setRecordForm(emptyRecordForm()); setRecordFormOpen(false); }}>Cancelar edição</button> : null}<button className="primary-action" type="submit"><Plus size={16} /> {recordForm.id ? "Atualizar" : "Cadastrar"}</button></div></form> : <div className="collapsed-form-note"><Landmark size={20} /><p>Abra o cadastro para incluir um novo contrato ou processo sem sair da área de acompanhamento.</p></div>}
      </aside>
      <section className="report-panel"><div className="panel-heading"><div><p className="siga-kicker">Acompanhamento</p><h2>Relatório e alertas</h2><p>Leia prioridades, filtre o acervo e abra cada registro sem interromper o contexto.</p></div><span className="result-count">{filteredRecords.length} de {records.length} registros</span></div><div className="analytics-grid"><article className="chart-card"><div className="chart-heading"><div><span>Visão administrativa</span><h3>Registros por situação</h3></div><BadgeCheck size={18} /></div><ResponsiveContainer width="100%" height={188}><BarChart data={recordStatusData} margin={{ left: -24, right: 4, top: 8 }}><CartesianGrid vertical={false} stroke="#e8edf1" /><XAxis dataKey="name" tick={{ fill: "#647483", fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis allowDecimals={false} tick={{ fill: "#647483", fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip cursor={{ fill: "#eff5f5" }} /><Bar dataKey="value" radius={[6, 6, 0, 0]}>{recordStatusData.map((entry, index) => <Cell key={entry.name} fill={["#123a63", "#16766f", "#35a943", "#90a2ad"][index]} />)}</Bar></BarChart></ResponsiveContainer></article><article className="risk-card"><div className="chart-heading"><div><span>Prioridade operacional</span><h3>Risco de prazo</h3></div><BellRing size={18} /></div><div className="risk-bars">{recordRiskData.map((item) => <InsightBar key={item.label} label={item.label} count={item.count} total={records.length} color={item.color} />)}</div><p>Os alertas continuam na sequência abaixo; esta leitura só facilita a triagem.</p></article></div><div className="alert-strip" aria-label="Alertas prioritários">{alerts.length ? alerts.map((alert) => <article className={`alert-card ${alert.risk}`} key={alert.id}><span>{alert.risk === "overdue" ? "Vencido" : "A vencer"}</span><strong>{alert.title}</strong><small>{alert.description}</small><em>{riskLabel(alert.risk, alert.days)}</em></article>) : <article className="alert-card ok"><span>Sem alertas</span><strong>Prazos em dia</strong><small>Nenhum vencimento dentro da janela configurada.</small></article>}</div><div className="filters-panel"><div className="filter-heading"><Filter size={16} /><span>Filtrar registros</span></div><label className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Número, objeto, fornecedor, setor..." /></label><select value={kindFilter} onChange={(event) => setKindFilter(event.target.value)}><option>Todos</option><option>Contrato</option><option>Processo</option></select><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>Todos</option><option value="warning">A vencer</option><option value="overdue">Vencidos</option><option>Vigente</option><option>Em andamento</option><option>Concluído</option></select><select value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)}><option>Todos</option>{departments.map((department) => <option key={department}>{department}</option>)}</select></div><div className="records-list">{filteredRecords.length ? filteredRecords.map((record) => <RecordRow key={record.id} record={record} open={openRecordId === record.id} onToggle={() => setOpenRecordId((current) => current === record.id ? null : record.id)} onEdit={() => editRecord(record)} onDelete={() => { if (window.confirm(`Excluir ${record.number}?`)) { setRecords((current) => current.filter((item) => item.id !== record.id)); setNotice(`${record.number} excluído no preview.`); } }} onPaymentAdd={(amount, notes) => { setRecords((current) => current.map((item) => item.id === record.id ? { ...item, payments: [...item.payments, { id: `p-${Date.now()}`, date: makeDate(0), amount, notes }] } : item)); setNotice("Baixa registrada e saldo atualizado no preview."); }} />) : <EmptyState label="Nenhum registro encontrado para os filtros atuais." />}</div></section>
    </section> : <section className="workspace-grid">
      <aside className={`form-panel ${documentFormOpen ? "open" : ""}`}>
        <button className="form-panel-trigger" type="button" onClick={() => setDocumentFormOpen((current) => !current)} aria-expanded={documentFormOpen}><span><small>Documentos</small><strong>{documentForm.id ? "Editar documento" : "Novo documento"}</strong></span><ChevronDown size={20} /></button>
        {documentFormOpen ? <form className="siga-form" onSubmit={saveDocument}><div className="segmented-control three"><button className={documentForm.kind === "Ofício" ? "active" : ""} type="button" onClick={() => setDocumentForm((current) => ({ ...current, kind: "Ofício", template: "Solicitação ao RH Central" }))}>Ofício</button><button className={documentForm.kind === "Memorando" ? "active" : ""} type="button" onClick={() => setDocumentForm((current) => ({ ...current, kind: "Memorando", template: "Análise ou parecer" }))}>Memorando</button><button className={documentForm.kind === "Despacho" ? "active" : ""} type="button" onClick={() => setDocumentForm((current) => ({ ...current, kind: "Despacho", template: "Despacho administrativo de pagamento" }))}>Despacho</button></div><FormSelect label="Modelo" value={documentForm.template} onChange={(value) => setDocumentForm((current) => ({ ...current, template: value }))} options={["Solicitação ao RH Central", "Exoneração de servidor(a)", "Análise ou parecer", "Abertura de processo de pagamento", "Encaminhamento de processo", "Despacho administrativo de pagamento"]} /><div className="form-two"><FormInput label="Número" required value={documentForm.number} onChange={(value) => setDocumentForm((current) => ({ ...current, number: toUpper(value) }))} placeholder="Ex.: 694/2026" /><FormInput label="Data" type="date" value={documentForm.documentDate} onChange={(value) => setDocumentForm((current) => ({ ...current, documentDate: value }))} /></div><FormInput label="Assunto" required value={documentForm.subject} onChange={(value) => setDocumentForm((current) => ({ ...current, subject: toUpper(value) }))} /><div className="form-two"><FormInput label="Setor destino" value={documentForm.destination} onChange={(value) => setDocumentForm((current) => ({ ...current, destination: toUpper(value) }))} /><FormInput label="Destinatário" value={documentForm.recipient} onChange={(value) => setDocumentForm((current) => ({ ...current, recipient: toUpper(value) }))} /></div><div className="form-two"><FormInput label="Vínculo" value={documentForm.relatedRecord} onChange={(value) => setDocumentForm((current) => ({ ...current, relatedRecord: toUpper(value) }))} /><FormInput label="Responsável" value={documentForm.responsible} onChange={(value) => setDocumentForm((current) => ({ ...current, responsible: toUpper(value) }))} /></div><div className="form-two"><FormInput label="Prazo de resposta" type="date" value={documentForm.dueDate} onChange={(value) => setDocumentForm((current) => ({ ...current, dueDate: value }))} /><FormSelect label="Situação" value={documentForm.status} onChange={(value) => setDocumentForm((current) => ({ ...current, status: value }))} options={["Em elaboração", "Enviado", "Aguardando resposta", "Pendente", "Concluído", "Cancelado"]} /></div><FormArea label="Resumo do pedido" value={documentForm.summary} onChange={(value) => setDocumentForm((current) => ({ ...current, summary: toUpper(value) }))} /><FormArea label="Observações ou pendências" value={documentForm.notes} onChange={(value) => setDocumentForm((current) => ({ ...current, notes: toUpper(value) }))} /><section className="form-preview" style={{ backgroundImage: `linear-gradient(180deg, rgba(247,244,238,.96), rgba(247,244,238,.96)), url(${ASSETS.documents})` }}><p className="siga-kicker">Prévia em edição</p><pre>{buildDocumentPreview(documentForm)}</pre></section><div className="form-actions"><button className="quiet-action" type="button" onClick={() => { navigator.clipboard?.writeText(buildDocumentPreview(documentForm)); setNotice("Prévia copiada para a área de transferência."); }}><Copy size={16} /> Copiar prévia</button>{documentForm.id ? <button className="quiet-action" type="button" onClick={() => { setDocumentForm(emptyDocumentForm()); setDocumentFormOpen(false); }}>Cancelar edição</button> : null}<button className="primary-action" type="submit"><Plus size={16} /> {documentForm.id ? "Atualizar" : "Cadastrar"}</button></div></form> : <div className="collapsed-form-note"><ClipboardCheck size={20} /><p>Abra o cadastro para criar um ofício, memorando ou despacho com a mesma sequência de campos do sistema.</p></div>}
      </aside>
      <section className="report-panel document-report" style={{ backgroundImage: `linear-gradient(180deg, rgba(255,255,255,.98), rgba(255,255,255,.98)), url(${ASSETS.documents})` }}><div className="panel-heading"><div><p className="siga-kicker">Controle documental</p><h2>Ofícios, memorandos e despachos</h2><p>Organize prazos de resposta, modelos e encaminhamentos sem mudar o fluxo atual.</p></div><span className="result-count">{filteredDocuments.length} de {documents.length} documentos</span></div><div className="document-metrics"><MetricCard label="Documentos" value={documentSummary.total} tone="slate" icon={FileText} detail="Acervo documental" /><MetricCard label="Em aberto" value={documentSummary.open} tone="green" icon={ClipboardCheck} detail="Acompanhamento ativo" /><MetricCard label="A vencer" value={documentSummary.warning} tone="amber" icon={Clock3} detail="Respostas pendentes" /><MetricCard label="Vencidos" value={documentSummary.overdue} tone="red" icon={AlertTriangle} detail="Prioridade imediata" /></div><div className="analytics-grid document-charts"><article className="chart-card"><div className="chart-heading"><div><span>Composição do acervo</span><h3>Documentos por tipo</h3></div><FileText size={18} /></div><ResponsiveContainer width="100%" height={174}><BarChart data={documentKindData} layout="vertical" margin={{ left: 8, right: 12 }}><CartesianGrid horizontal={false} stroke="#e8edf1" /><XAxis type="number" allowDecimals={false} tick={{ fill: "#647483", fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis dataKey="name" type="category" width={78} tick={{ fill: "#475867", fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip cursor={{ fill: "#eff5f5" }} /><Bar dataKey="value" radius={[0, 6, 6, 0]} fill="#16766f" /></BarChart></ResponsiveContainer></article><article className="risk-card"><div className="chart-heading"><div><span>Prazos de resposta</span><h3>Leitura documental</h3></div><ArrowUpRight size={18} /></div><div className="risk-bars"><InsightBar label="No prazo" count={enrichedDocuments.filter((document) => document.risk === "ok").length} total={documents.length} color="#35a943" /><InsightBar label="A vencer" count={documentSummary.warning} total={documents.length} color="#d4861b" /><InsightBar label="Vencidos" count={documentSummary.overdue} total={documents.length} color="#cf3f45" /></div><p>Os modelos e as prévias continuam acessíveis dentro de cada documento.</p></article></div><div className="filters-panel document-filters"><div className="filter-heading"><Filter size={16} /><span>Filtrar documentos</span></div><label className="search-field"><Search size={17} /><input value={documentQuery} onChange={(event) => setDocumentQuery(event.target.value)} placeholder="Número, assunto, setor, vínculo..." /></label><select value={documentKindFilter} onChange={(event) => setDocumentKindFilter(event.target.value)}><option>Todos</option><option>Ofício</option><option>Memorando</option><option>Despacho</option></select><select value={documentStatusFilter} onChange={(event) => setDocumentStatusFilter(event.target.value)}><option>Todos</option><option value="warning">A vencer</option><option value="overdue">Vencidos</option><option>Em elaboração</option><option>Aguardando resposta</option><option>Pendente</option></select></div><div className="records-list">{filteredDocuments.length ? filteredDocuments.map((document) => <DocumentRow key={document.id} document={document} open={openDocumentId === document.id} onToggle={() => setOpenDocumentId((current) => current === document.id ? null : document.id)} onEdit={() => editDocument(document)} onDelete={() => { if (window.confirm(`Excluir ${document.number}?`)) { setDocuments((current) => current.filter((item) => item.id !== document.id)); setNotice(`${document.number} excluído no preview.`); } }} onCopy={() => { navigator.clipboard?.writeText(buildDocumentPreview(document)); setNotice("Prévia do documento copiada."); }} />) : <EmptyState label="Nenhum documento encontrado para os filtros atuais." />}</div></section>
    </section>}
    {showPassword ? <PasswordPanel onClose={() => setShowPassword(false)} onSave={() => { setShowPassword(false); setNotice("Senha atualizada no preview de frontend."); }} /> : null}
  </main>;
}

function FormInput({ label, value, onChange, type = "text", required = false, placeholder, disabled = false, inputMode }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; placeholder?: string; disabled?: boolean; inputMode?: "decimal" }) {
  return <label>{label}<input type={type} required={required} disabled={disabled} value={value} inputMode={inputMode} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></label>;
}
function FormArea({ label, value, onChange, required = false, placeholder }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; placeholder?: string }) {
  return <label>{label}<textarea required={required} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} rows={3} /></label>;
}
function FormSelect({ label, value, onChange, options, format = (value: string) => value }: { label: string; value: string; onChange: (value: string) => void; options: string[]; format?: (value: string) => string }) {
  return <label>{label}<select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option} value={option}>{format(option)}</option>)}</select></label>;
}
function EmptyState({ label }: { label: string }) {
  return <div className="empty-state"><Search size={20} /><p>{label}</p></div>;
}
