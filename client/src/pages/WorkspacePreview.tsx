import React, { FormEvent, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Download,
  FileClock,
  FileText,
  KeyRound,
  ListChecks,
  LogOut,
  Pencil,
  Plus,
  Printer,
  RefreshCw,
  Search,
  StickyNote,
  Trash2,
  WalletCards,
  X,
} from "lucide-react";
import { validateFirstAccess } from "./sigaFlow";
import SemedOperationalShell, { ShellView, shellViewLabel } from "./SemedOperationalShell";
import { GovernancePage } from "./SemedManagementPages";
import SemedMastersPage from "./SemedMastersPage";
import SemedNutritionPage from "./SemedNutritionPage";
import SemedStockPage, { type StockSection } from "./SemedStockPage";
import SemedAgricultureFamilyPage from "./SemedAgricultureFamilyPage";
import SemedHumanResourcesPage from "./SemedHumanResourcesPage";
import SemedSchoolsEducaPage, { type SchoolsEducaSection } from "./SemedSchoolsEducaPage";
import SemedPddeFndePage from "./SemedPddeFndePage";
import SemedFinancePage from "./SemedFinancePage";
import SemedUsersPage from "./SemedUsersPage";
import SemedInstitutionSettingsPage from "./SemedInstitutionSettingsPage";
import SemedFleetPage from "./SemedFleetPage";
import SemedHomeOperationsPage from "./SemedHomeOperationsPage";
import { trpc } from "../lib/trpc";
import "./siga-identity-refresh.css";
import "./siga-financial-alert.css";
import {
  parseBrazilianAmount,
  type SemedLocalAccessUser,
  type SemedModuleKey,
  SemedDocument,
  SemedDocumentInput,
  SemedManagementApproval,
  SemedManagementTask,
  SemedRecord,
  SemedRecordInput,
  useSigaLocalRepository,
} from "./sigaLocalStore";

type User = SemedLocalAccessUser;
type Module = "records" | "documents";
type Alert = "A vencer" | "Vencido" | "Em dia";
type DeleteTarget = { kind: "registro" | "documento"; id: string; label: string };
type Editing = { kind: "record"; data: SemedRecord } | { kind: "document"; data: SemedDocument } | null;

const logo = "/manus-storage/paco-do-lumiar-logo_0229a064.png";
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const displayDate = (date: string) => (date ? new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR") : "—");
const dateValue = (date: string) => date.slice(0, 10);

const viewPermissionKey: Partial<Record<ShellView, SemedModuleKey>> = {
  home: "inicio", governance: "gestao", masters: "cadastros_gerais", finance: "financeiro", documents: "documentos", records: "contratos",
  schools: "unidades_escolares", "schools-classes": "unidades_escolares", "schools-pdde": "unidades.uex", "schools-reports": "unidades_escolares", educa: "educa_paco", "educa-reports": "educa_paco", people: "rh", "people-servers": "rh.cadastro_servidores", "people-financial": "rh.ficha_financeira", "people-payslip": "rh.holerite", "people-attendance": "rh.frequencia", "people-reports": "rh.relatorios", nutrition: "nutricao", "nutrition-weekly": "nutricao.planejamento_semanal", "nutrition-annual": "nutricao.planejamento_anual", stock: "estoque", "stock-family": "estoque.agricultura_familiar", "stock-industrial": "estoque.industrializado", "stock-kit": "estoque.kit_aluno", "stock-food": "estoque.categorias", "stock-cleaning": "estoque.categorias", "stock-office": "estoque.categorias", "stock-reports": "estoque.relatorios", fleet: "frota", users: "usuarios", settings: "configuracoes",
};

function recordAlert(record: SemedRecord): Alert {
  if (/VENCIDO/i.test(record.notes) || record.number === "044/2025") return "Vencido";
  if (record.number === "012/2026") return "A vencer";
  return "Em dia";
}

function documentAlert(document: SemedDocument): Alert {
  if (document.number === "238/2026") return "Vencido";
  if (document.number === "694/2026") return "A vencer";
  return "Em dia";
}

function AlertTag({ value }: { value: Alert }) {
  const tone = value === "Vencido" ? "danger" : value === "A vencer" ? "warning" : "good";
  return <span className={`siga-alert-tag ${tone}`}>{value}</span>;
}

function Metric({ label, value, tone }: { label: string; value: string | number; tone: string }) {
  return <article className={`siga-metric-card ${tone}`}><span>{label}</span><strong>{value}</strong></article>;
}

function AlertStrip({ items, emptyTitle, emptyDescription }: { items: { label: string; title: string; description: string; tone: Alert }[]; emptyTitle: string; emptyDescription: string }) {
  const content = items.length
    ? items.slice(0, 5)
    : [{ label: "Sem alertas", title: emptyTitle, description: emptyDescription, tone: "Em dia" as Alert }];
  return <div className="siga-alerts-strip" aria-label="Alertas de acompanhamento">
    {content.map((item, index) => <article className={`siga-alert-item ${item.tone === "Vencido" ? "danger" : item.tone === "A vencer" ? "warning" : "good"}`} key={`${item.title}-${index}`}><span>{item.label}</span><strong>{item.title}</strong><small>{item.description}</small></article>)}
  </div>;
}

function RecordForm({ initial, onSave, onCancel }: { initial?: SemedRecord; onSave: (input: SemedRecordInput) => void; onCancel: () => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave({
      kind: form.get("kind") as SemedRecordInput["kind"], number: String(form.get("number") ?? ""), object: String(form.get("object") ?? ""),
      party: String(form.get("party") ?? ""), department: String(form.get("department") ?? ""), responsible: String(form.get("responsible") ?? ""),
      amount: Number(String(form.get("amount") ?? "0").replace(",", ".")) || 0, financialCategory: form.get("financialCategory") as SemedRecordInput["financialCategory"],
      paymentDueDate: String(form.get("paymentDueDate") ?? ""), startDate: String(form.get("startDate") ?? ""), endDate: String(form.get("endDate") ?? ""),
      status: String(form.get("status") ?? ""), notes: String(form.get("notes") ?? ""), alertDays: Number(form.get("alertDays")) || 30,
    });
  }

  return <form className="siga-data-form" onSubmit={submit}>
    <div className="siga-form-heading"><h2>{initial ? `Editar ${initial.number}` : "Novo registro"}</h2><span>Cadastro de contrato ou processo, com campos financeiros e de prazo da referência.</span></div>
    <label>Tipo<select name="kind" defaultValue={initial?.kind ?? "Contrato"}><option>Contrato</option><option>Processo</option></select></label>
    <label>Número<input name="number" required defaultValue={initial?.number} placeholder="Ex.: 012/2026" /></label>
    <label>Objeto ou assunto<input name="object" required defaultValue={initial?.object} placeholder="Descreva o contrato ou processo" /></label>
    <label>Fornecedor, interessado ou setor<input name="party" defaultValue={initial?.party} placeholder="Empresa, escola ou setor solicitante" /></label>
    <label>Setor<input name="department" defaultValue={initial?.department} placeholder="Ex.: Transporte Escolar" /></label>
    <label>Responsável<input name="responsible" defaultValue={initial?.responsible} placeholder="Nome ou equipe" /></label>
    <div className="siga-form-two"><label>Início<input name="startDate" required type="date" defaultValue={dateValue(initial?.startDate ?? "")} /></label><label>Vencimento<input name="endDate" required type="date" defaultValue={dateValue(initial?.endDate ?? "")} /></label></div>
    <div className="siga-form-two"><label>Valor<input name="amount" inputMode="decimal" defaultValue={initial?.amount ?? 0} placeholder="0,00" /></label><label>Alertar com<input name="alertDays" type="number" min="1" max="365" defaultValue={initial?.alertDays ?? 30} /></label></div>
    <div className="siga-form-two"><label>Controle financeiro<select name="financialCategory" defaultValue={initial?.financialCategory ?? "Contrato geral"}><option>Sem controle</option><option>Contrato geral</option><option>Aluguel</option></select></label><label>Próximo pagamento<input name="paymentDueDate" type="date" defaultValue={dateValue(initial?.paymentDueDate ?? "")} /></label></div>
    <label>Situação<select name="status" defaultValue={initial?.status ?? "Vigente"}><option>Vigente</option><option>Em andamento</option><option>Aguardando análise</option><option>Concluído</option><option>Suspenso</option><option>Cancelado</option></select></label>
    <label>Observações<textarea name="notes" rows={3} defaultValue={initial?.notes} placeholder="Pendências, providências ou detalhes importantes" /></label>
    <div className="siga-form-actions"><button className="siga-secondary-button" type="button" onClick={onCancel}>Cancelar</button><button className="siga-primary-button" type="submit">{initial ? "Atualizar" : "Cadastrar"}</button></div>
  </form>;
}

function DocumentForm({ initial, onSave, onCancel }: { initial?: SemedDocument; onSave: (input: SemedDocumentInput) => void; onCancel: () => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave({ kind: form.get("kind") as SemedDocumentInput["kind"], number: String(form.get("number") ?? ""), templateKey: String(form.get("templateKey") ?? ""), subject: String(form.get("subject") ?? ""), destination: String(form.get("destination") ?? ""), recipient: String(form.get("recipient") ?? ""), relatedRecord: String(form.get("relatedRecord") ?? ""), responsible: String(form.get("responsible") ?? ""), documentDate: String(form.get("documentDate") ?? ""), dueDate: String(form.get("dueDate") ?? ""), status: String(form.get("status") ?? ""), summary: String(form.get("summary") ?? ""), notes: String(form.get("notes") ?? "") });
  }
  return <form className="siga-data-form" onSubmit={submit}>
    <div className="siga-form-heading"><h2>{initial ? `Editar ${initial.number}` : "Novo documento"}</h2><span>Cadastro compatível com ofício, memorando e despacho.</span></div>
    <label>Tipo<select name="kind" defaultValue={initial?.kind ?? "Ofício"}><option>Ofício</option><option>Memorando</option><option>Despacho</option></select></label>
    <label>Modelo<input name="templateKey" defaultValue={initial?.templateKey} placeholder="Modelo do documento" /></label>
    <div className="siga-form-two"><label>Número<input name="number" required defaultValue={initial?.number} placeholder="Ex.: 694/2026" /></label><label>Data<input name="documentDate" type="date" defaultValue={dateValue(initial?.documentDate ?? "")} /></label></div>
    <label>Assunto<input name="subject" required defaultValue={initial?.subject} placeholder="Assunto do documento" /></label>
    <div className="siga-form-two"><label>Setor destino<input name="destination" defaultValue={initial?.destination} /></label><label>Destinatário<input name="recipient" defaultValue={initial?.recipient} /></label></div>
    <div className="siga-form-two"><label>Vínculo<input name="relatedRecord" defaultValue={initial?.relatedRecord} /></label><label>Responsável<input name="responsible" defaultValue={initial?.responsible} /></label></div>
    <div className="siga-form-two"><label>Prazo de resposta<input name="dueDate" type="date" defaultValue={dateValue(initial?.dueDate ?? "")} /></label><label>Situação<select name="status" defaultValue={initial?.status ?? "Em elaboração"}><option>Em elaboração</option><option>Enviado</option><option>Aguardando resposta</option><option>Pendente</option><option>Concluído</option><option>Cancelado</option></select></label></div>
    <label>Resumo do pedido<textarea name="summary" rows={4} defaultValue={initial?.summary} /></label>
    <label>Observações ou pendências<textarea name="notes" rows={3} defaultValue={initial?.notes} /></label>
    <div className="siga-form-actions"><button className="siga-secondary-button" type="button" onClick={onCancel}>Cancelar</button><button className="siga-primary-button" type="submit">{initial ? "Atualizar" : "Cadastrar"}</button></div>
  </form>;
}

function SecurityPanel({ user, onClose, onSaved }: { user: User; onClose: () => void; onSaved: (newPassword: string) => void }) {
  const [currentPassword, setCurrentPassword] = useState(""); const [newPassword, setNewPassword] = useState(""); const [confirmation, setConfirmation] = useState(""); const [message, setMessage] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const error = validateFirstAccess(currentPassword, newPassword, confirmation); if (error) return setMessage(error); onSaved(newPassword); }
  return <div className="siga-security-scrim" role="presentation"><form className="siga-security-panel" onSubmit={submit}><header><div><p>Segurança</p><h2>Alterar senha</h2><span>{user.displayName}</span></div><button type="button" aria-label="Fechar" onClick={onClose}><X size={18} /></button></header><label>Senha atual<input required type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></label><label>Nova senha<input minLength={10} required type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></label><label>Confirmar nova senha<input minLength={10} required type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></label>{message ? <p className="siga-form-message">{message}</p> : null}<footer><button type="button" className="siga-secondary-button" onClick={onClose}>Cancelar</button><button className="siga-primary-button" type="submit">Salvar senha</button></footer></form></div>;
}

function DeleteConfirmation({ target, onClose, onConfirm }: { target: DeleteTarget; onClose: () => void; onConfirm: (confirmation: string) => void }) {
  const [confirmation, setConfirmation] = useState(""); const [message, setMessage] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (confirmation.trim().toUpperCase() !== "EXCLUIR") return setMessage("Digite EXCLUIR para confirmar a ação."); onConfirm(confirmation); }
  return <div className="siga-dialog-scrim" role="presentation"><form className="siga-confirmation-panel" onSubmit={submit}><header><div><p>Confirmação de exclusão</p><h2>Excluir {target.kind}</h2></div><button type="button" aria-label="Fechar confirmação" onClick={onClose}><X size={18} /></button></header><p>Você está confirmando a exclusão local de <strong>{target.label}</strong>. A ação será aplicada somente à simulação deste navegador.</p><label>Digite <strong>EXCLUIR</strong><input autoFocus value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="EXCLUIR" /></label>{message ? <p className="siga-form-message">{message}</p> : null}<footer><button type="button" className="siga-secondary-button" onClick={onClose}>Cancelar</button><button className="siga-danger-button" type="submit">Confirmar exclusão</button></footer></form></div>;
}

function PaymentForm({ record, onClose, onSave }: { record: SemedRecord; onClose: () => void; onSave: (paymentDate: string, amount: number, notes: string, nextPaymentDueDate: string) => string | null }) {
  const [paymentDate, setPaymentDate] = useState("2026-08-25"); const [amount, setAmount] = useState(""); const [notes, setNotes] = useState(""); const [nextPaymentDueDate, setNextPaymentDueDate] = useState(record.paymentDueDate); const [message, setMessage] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const value = parseBrazilianAmount(amount); if (!value) return setMessage("Informe um valor de baixa válido."); const error = onSave(paymentDate, value, notes, nextPaymentDueDate); if (error) setMessage(error); }
  return <form className="siga-payment-form" onSubmit={submit}><div className="siga-payment-heading"><div><small>Financeiro local</small><strong>Registrar baixa — {record.number}</strong></div><button type="button" aria-label="Fechar baixa" onClick={onClose}><X size={16} /></button></div><p>Saldo local disponível: <strong>{money.format(record.balanceAmount)}</strong></p><div className="siga-form-two"><label>Data da baixa<input required type="date" value={paymentDate} onChange={(event) => setPaymentDate(event.target.value)} /></label><label>Valor pago<input required inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0,00" /></label></div><label>Próximo pagamento<input type="date" value={nextPaymentDueDate} onChange={(event) => setNextPaymentDueDate(event.target.value)} /></label><label>Observação<input value={notes} onChange={(event) => setNotes(event.target.value)} /></label>{message ? <p className="siga-form-message">{message}</p> : null}<footer><button type="button" className="siga-secondary-button" onClick={onClose}>Cancelar</button><button type="submit" className="siga-primary-button">Registrar baixa</button></footer></form>;
}

function exportSimulation(records: SemedRecord[], documents: SemedDocument[]) {
  const header = ["entidade", "id", "tipo", "numero", "assunto", "setor_ou_destino", "situacao", "criado_em"];
  const rows = [...records.map((record) => ["semed_records", record.id, record.kind, record.number, record.object, record.department, record.status, record.createdAt]), ...documents.map((document) => ["semed_documents", document.id, document.kind, document.number, document.subject, document.destination, document.status, document.createdAt])];
  const csv = [header, ...rows].map((row) => row.map((value) => `"${String(value).replaceAll("\"", "\"\"")}"`).join(";")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "siga-semed-simulacao-local.csv"; anchor.click(); URL.revokeObjectURL(url);
}

function WelcomeCenter({ user, onStart }: { user: User; onStart: () => void }) {
  const firstName = user.displayName.split(" ")[0] || "Equipe";
  return <section className="siga-welcome" aria-labelledby="welcome-title">
    <div className="siga-welcome-hero">
      <div>
        <p className="siga-kicker kicker kicker--institutional">Painel institucional</p>
        <h1 id="welcome-title">Olá, {firstName}.</h1>
        <p className="siga-welcome-copy">Este é o centro de acompanhamento do SIGA SEMED. Consulte o resumo da operação, navegue pelos módulos e mantenha os fluxos de trabalho organizados em uma única área.</p>
        <div className="siga-welcome-actions">
          <button type="button" className="siga-welcome-primary" onClick={onStart}>Ir para o painel <ArrowRight size={17} aria-hidden="true" /></button>
          <span><CheckCircle2 size={16} aria-hidden="true" />Ambiente demonstrativo local</span>
        </div>
      </div>
      <aside className="siga-welcome-status">
        <span>Visão de hoje</span>
        <strong>Rotina institucional</strong>
        <p>Os atalhos abaixo preservam a organização do sistema de referência, com dados próprios do preview.</p>
        <div>
          <CalendarDays size={19} aria-hidden="true" />
          <small>Agenda semanal disponível no painel inicial</small>
        </div>
      </aside>
    </div>
    <div className="siga-welcome-briefing">
      <article><span className="siga-briefing-icon navy"><ListChecks size={18} aria-hidden="true" /></span><div><strong>Gestão centralizada</strong><p>Alertas, tarefas, anexos e aprovações organizados por contexto.</p></div></article>
      <article><span className="siga-briefing-icon green"><FileText size={18} aria-hidden="true" /></span><div><strong>Documentos e contratos</strong><p>Fluxos locais existentes permanecem disponíveis no menu lateral.</p></div></article>
      <article><span className="siga-briefing-icon orange"><Clock3 size={18} aria-hidden="true" /></span><div><strong>Rotina acompanhada</strong><p>Prazos e pendências podem ser revisados diretamente pela visão Início.</p></div></article>
    </div>
  </section>;
}

function HomeDashboard({ records, documents, tasks = [], approvals = [], agendaEvents = [], userNotes = [], currentUser, canReadGovernance = false, canWriteHome = false, onSaveUserNote, onViewChange }: { records: SemedRecord[]; documents: SemedDocument[]; tasks?: SemedManagementTask[]; approvals?: SemedManagementApproval[]; agendaEvents?: import("./sigaLocalStore").SemedAgendaEvent[]; userNotes?: import("./sigaLocalStore").SemedUserNote[]; currentUser: User; canReadGovernance?: boolean; canWriteHome?: boolean; onSaveUserNote: (content: string) => Promise<{ error: string | null }>; onViewChange: (view: ShellView) => void }) {
  const [note, setNote] = useState("");
  const [deadlineMonth, setDeadlineMonth] = useState(() => tasks.find((task) => task.dueDate)?.dueDate.slice(0, 7) ?? new Date().toISOString().slice(0, 7));
  const agendaDays = useMemo(() => {
    const activeEvents = agendaEvents.filter((event) => event.userId === currentUser.id && event.status !== "Cancelado").slice().sort((first, second) => `${first.eventDate}${first.startTime}`.localeCompare(`${second.eventDate}${second.startTime}`)).slice(0, 5);
    return activeEvents.length ? activeEvents.map((event, index) => ({ day: new Date(`${event.eventDate}T12:00:00`).toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "").toUpperCase(), date: event.eventDate.slice(8, 10), tone: ["navy", "green", "orange", "slate"][index % 4], items: [event.title] })) : Array.from({ length: 5 }, (_, index) => { const date = new Date(); date.setDate(date.getDate() + index); return { day: date.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "").toUpperCase(), date: String(date.getDate()).padStart(2, "0"), tone: ["navy", "green", "orange", "slate"][index % 4], items: ["Sem evento local"] }; });
  }, [agendaEvents, currentUser.id]);
  const ownNotes = useMemo(() => userNotes.filter((item) => item.userId === currentUser.id).sort((first, second) => second.updatedAt.localeCompare(first.updatedAt)).slice(0, 3), [currentUser.id, userNotes]);
  const dueRecords = records.filter((record) => recordAlert(record) !== "Em dia").length;
  const dueDocuments = documents.filter((document) => documentAlert(document) !== "Em dia").length;
  const openManagementTasks = tasks.filter((task) => !["Concluída", "Cancelada"].includes(task.status)).length;
  const pendingManagementApprovals = approvals.filter((approval) => approval.status === "Pendente").length;
  const openAlerts = dueRecords + dueDocuments + (canReadGovernance ? openManagementTasks + pendingManagementApprovals : 0);
  const monthlyManagementDeadlines = useMemo(() => tasks.filter((task) => task.dueDate.startsWith(deadlineMonth) && !["Concluída", "Cancelada"].includes(task.status)).slice().sort((first, second) => first.dueDate.localeCompare(second.dueDate)), [deadlineMonth, tasks]);
  const deadlineMonthLabel = new Date(`${deadlineMonth}-01T12:00:00`).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  function shiftDeadlineMonth(offset: number) { const value = new Date(`${deadlineMonth}-01T12:00:00`); value.setMonth(value.getMonth() + offset); setDeadlineMonth(`${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}`); }

  async function saveNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = note.trim();
    if (!value) return;
    const result = await onSaveUserNote(value);
    if (!result.error) setNote("");
  }

  const quickActions: { label: string; detail: string; tone: string; view: ShellView }[] = [
    { label: "Novo documento", detail: "Documentos", tone: "green", view: "documents" },
    { label: "Cadastrar unidade", detail: "Unidades escolares", tone: "orange", view: "schools" },
    { label: "Novo usuário", detail: "Usuários", tone: "blue", view: "users" },
    { label: "Relatórios gerenciais", detail: "Gestão", tone: "pink", view: "governance" },
  ];

  return <section className="siga-home siga-home-editorial" aria-labelledby="home-title">
    <header className="siga-home-editorial-intro">
      <div>
        <p className="siga-kicker kicker kicker--institutional">Página inicial</p>
        <h1 id="home-title">Acompanhamento da semana</h1>
        <p>Visão local de agenda, prioridades e acesso rápido aos fluxos já disponíveis.</p>
      </div>
      <div className="siga-home-editorial-illustration" aria-hidden="true" />
    </header>

    <div className="siga-home-editorial-metrics">
      <article className="siga-editorial-metric green"><span className="siga-home-stat-icon green"><ClipboardCheck size={22} aria-hidden="true" /></span><div><strong>{records.length}</strong><small className="kicker kicker--card">Registros locais</small><button type="button" onClick={() => onViewChange("records")}>Ver contratos <ArrowRight size={14} /></button></div></article>
      <article className="siga-editorial-metric blue"><span className="siga-home-stat-icon navy"><ListChecks size={22} aria-hidden="true" /></span><div><strong>{canReadGovernance ? openManagementTasks : agendaDays.length}</strong><small className="kicker kicker--card">{canReadGovernance ? "Tarefas em aberto" : "Rotinas na semana"}</small><button type="button" onClick={() => onViewChange("governance")}>Ver gestão <ArrowRight size={14} /></button></div></article>
      <article className="siga-editorial-metric pink"><span className="siga-home-stat-icon orange"><FileText size={22} aria-hidden="true" /></span><div><strong>{documents.length}</strong><small className="kicker kicker--card">Documentos locais</small><button type="button" onClick={() => onViewChange("documents")}>Ver documentos <ArrowRight size={14} /></button></div></article>
      <article className="siga-editorial-metric orange"><span className="siga-home-stat-icon orange"><FileClock size={22} aria-hidden="true" /></span><div><strong>{openAlerts}</strong><small className="kicker kicker--card">Alertas em aberto</small><button type="button" onClick={() => onViewChange(canReadGovernance ? "governance" : "finance")}>{canReadGovernance ? "Ver gestão" : "Ver financeiro"} <ArrowRight size={14} /></button></div></article>
    </div>

    <div className="siga-home-editorial-main-grid">
      <section className="siga-agenda-card" aria-labelledby="agenda-title">
        <div className="siga-card-heading"><div><p className="kicker kicker--section">Acompanhamento da semana</p><h2 id="agenda-title">Agenda institucional</h2></div><button type="button" className="siga-home-outline" onClick={() => onViewChange("governance")}><CalendarDays size={15} aria-hidden="true" />Ver calendário</button></div>
        <div className="siga-week-grid">{agendaDays.map((item) => <article key={item.day} className={`siga-week-day ${item.tone}`}><small className="kicker kicker--card">{item.day}</small><strong>{item.date}</strong>{item.items.map((agendaItem) => <span key={agendaItem}>{agendaItem}</span>)}</article>)}</div>
        {canReadGovernance ? <section className="siga-home-monthly-deadlines" aria-label="Visão mensal de prazos de Gestão"><header><div><p className="kicker kicker--section">Prazos de Gestão</p><h3>{deadlineMonthLabel}</h3></div><div><button type="button" aria-label="Mês anterior" onClick={() => shiftDeadlineMonth(-1)}><ChevronLeft size={15} aria-hidden="true" /></button><button type="button" aria-label="Próximo mês" onClick={() => shiftDeadlineMonth(1)}><ChevronRight size={15} aria-hidden="true" /></button></div></header>{monthlyManagementDeadlines.length ? <div>{monthlyManagementDeadlines.map((task) => <button type="button" key={task.id} onClick={() => onViewChange("governance")}><time dateTime={task.dueDate}>{new Date(`${task.dueDate}T12:00:00`).toLocaleDateString("pt-BR", { day: "2-digit" })}</time><span><strong>{task.title}</strong><small className="kicker kicker--card">{task.area} · {task.priority}</small></span></button>)}</div> : <p>Nenhum prazo aberto de Gestão neste mês.</p>}</section> : null}
      </section>

      <section className="siga-home-quick-actions" aria-labelledby="quick-actions-title">
        <div className="siga-card-heading"><div><p className="kicker kicker--section">Acesso rápido</p><h2 id="quick-actions-title">Ações rápidas</h2></div></div>
        <div>{quickActions.map((action) => <button key={action.label} className={action.tone} type="button" onClick={() => onViewChange(action.view)}><span>{action.label}<small className="kicker kicker--card">{action.detail}</small></span><ArrowRight size={16} aria-hidden="true" /></button>)}</div>
      </section>
    </div>

    <div className="siga-home-editorial-bottom-grid">
      <section className="siga-notes-card" aria-labelledby="notes-title">
        <div className="siga-card-heading"><div><p className="kicker kicker--section">Mural de comunicados</p><h2 id="notes-title">Lembretes desta sessão</h2></div><StickyNote size={18} aria-hidden="true" /></div>
        <form onSubmit={saveNote} className="siga-quick-note-form"><input aria-label="Nova anotação" disabled={!canWriteHome} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Registrar um lembrete local" /><button type="submit" disabled={!canWriteHome} aria-label="Adicionar anotação"><Plus size={16} aria-hidden="true" /></button></form>
        <div className="siga-quick-notes">{ownNotes.length ? ownNotes.map((item) => <p key={item.id}>{item.content}</p>) : <p className="empty">Nenhum lembrete local criado para este usuário.</p>}</div>
      </section>
      <section className="siga-home-pending" aria-label="Atividades pendentes">
        <div className="siga-card-heading"><div><p className="kicker kicker--section">Atividades pendentes</p><h2>Prioridades locais</h2></div><button type="button" onClick={() => onViewChange("governance")}>Ver todas</button></div>
        <div><span><FileText size={15} />Documentos para assinatura <b>{dueDocuments}</b></span><span><FileClock size={15} />Contratos para renovação <b>{dueRecords}</b></span>{canReadGovernance ? <><span><ClipboardCheck size={15} />Tarefas de Gestão <b>{openManagementTasks}</b></span><span><ListChecks size={15} />Aprovações aguardando <b>{pendingManagementApprovals}</b></span></> : <span><ClipboardCheck size={15} />Rotinas da semana <b>{agendaDays.length}</b></span>}</div>
      </section>
    </div>
  </section>;
}

function ModulePlaceholder({ view, onHome }: { view: ShellView; onHome: () => void }) {
  if (view.startsWith("stock-") || view === "finance" || view === "fleet") return null;
  const label = shellViewLabel(view);
  return <section className="siga-module-placeholder"><div className="siga-placeholder-mark"><ClipboardCheck size={22} aria-hidden="true" /></div><p className="siga-kicker kicker kicker--institutional">Módulo mapeado</p><h1>{label}</h1><p>O shell, a navegação e a posição deste módulo já foram reproduzidos. A composição interna será incorporada no próximo grupo, preservando filtros, abas e fluxos observados na referência.</p><button type="button" onClick={onHome}>Voltar ao Início</button></section>;
}

export default function WorkspacePreview({ user, onLogout, onPasswordChanged }: { user: User; onLogout: () => void; onPasswordChanged?: () => void }) {
  const repository = useSigaLocalRepository();
  const domainAvailability = trpc.semed.domain.availability.useQuery(undefined, { staleTime: 60_000, retry: false });
  const domainIdentity = trpc.semed.domain.me.useQuery(undefined, { enabled: domainAvailability.data?.enabled === true, retry: false });
  const useDomainPersistence = domainAvailability.data?.enabled === true && domainIdentity.data?.id === user.id;
  const remoteMasters = trpc.semed.masters.list.useQuery(undefined, { enabled: useDomainPersistence, retry: false });
  const saveRemoteMaster = trpc.semed.masters.save.useMutation();
  const remoteAgenda = trpc.semed.agenda.list.useQuery(undefined, { enabled: useDomainPersistence, retry: false });
  const saveRemoteAgenda = trpc.semed.agenda.save.useMutation();
  const remoteMessages = trpc.semed.messages.list.useQuery(undefined, { enabled: useDomainPersistence, retry: false });
  const saveRemoteMessage = trpc.semed.messages.save.useMutation();
  const markRemoteMessageRead = trpc.semed.messages.markRead.useMutation();
  const remoteNotes = trpc.semed.notes.list.useQuery(undefined, { enabled: useDomainPersistence, retry: false });
  const saveRemoteNote = trpc.semed.notes.save.useMutation();
  const remoteSchools = trpc.semed.schools.list.useQuery(undefined, { enabled: useDomainPersistence, retry: false });
  const saveRemoteSchool = trpc.semed.schools.save.useMutation();
  const remoteSchoolClasses = trpc.semed.schools.classes.list.useQuery(undefined, { enabled: useDomainPersistence, retry: false });
  const saveRemoteSchoolClass = trpc.semed.schools.classes.save.useMutation();
  const [module, setModule] = useState<Module>("records"); const [activeView, setActiveView] = useState<ShellView>("welcome"); const [formOpen, setFormOpen] = useState(false); const [expanded, setExpanded] = useState(""); const [query, setQuery] = useState(""); const [kind, setKind] = useState("Todos"); const [status, setStatus] = useState("Todos"); const [department, setDepartment] = useState("Todos"); const [notice, setNotice] = useState(""); const [securityOpen, setSecurityOpen] = useState(false); const [paymentRecordId, setPaymentRecordId] = useState(""); const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null); const [editing, setEditing] = useState<Editing>(null);
  const masterRecords = useDomainPersistence && remoteMasters.data ? remoteMasters.data : repository.masterRecords;
  const agendaEvents = useDomainPersistence && remoteAgenda.data ? remoteAgenda.data : repository.agendaEvents;
  const userMessages = useDomainPersistence && remoteMessages.data ? remoteMessages.data.messages : repository.userMessages;
  const userMessageReads = useDomainPersistence && remoteMessages.data ? remoteMessages.data.reads : repository.userMessageReads;
  const userNotes = useDomainPersistence && remoteNotes.data ? remoteNotes.data : repository.userNotes;
  const schoolUnitsForSchools = useDomainPersistence && remoteSchools.data ? remoteSchools.data as import("./sigaLocalStore").SemedSchoolUnit[] : repository.schoolUnits;
  const schoolClassesForSchools = useDomainPersistence && remoteSchoolClasses.data ? remoteSchoolClasses.data as import("./sigaLocalStore").SemedSchoolClass[] : repository.schoolClasses;
  const departments = useMemo(() => Array.from(new Set(repository.records.map((record) => record.department))).sort(), [repository.records]);
  const filteredRecords = useMemo(() => repository.records.filter((record) => `${record.number} ${record.object} ${record.department} ${record.party}`.toLowerCase().includes(query.toLowerCase()) && (kind === "Todos" || record.kind === kind) && (status === "Todos" || record.status === status || recordAlert(record) === status) && (department === "Todos" || record.department === department)), [department, kind, query, repository.records, status]);
  const filteredDocuments = useMemo(() => repository.documents.filter((document) => `${document.number} ${document.subject} ${document.destination} ${document.relatedRecord}`.toLowerCase().includes(query.toLowerCase()) && (kind === "Todos" || document.kind === kind) && (status === "Todos" || document.status === status || documentAlert(document) === status)), [kind, query, repository.documents, status]);
  const totalBalance = repository.records.filter((record) => record.kind === "Contrato").reduce((total, record) => total + record.balanceAmount, 0);
  const canWriteRecords = repository.canWrite(user.id, "contratos");
  const canWriteDocuments = repository.canWrite(user.id, "documentos");
  const recordAlerts = repository.records.filter((record) => recordAlert(record) !== "Em dia").map((record) => ({ label: recordAlert(record), title: `${record.kind} ${record.number}`, description: record.object, tone: recordAlert(record) }));
  const documentAlerts = repository.documents.filter((document) => documentAlert(document) !== "Em dia").map((document) => ({ label: documentAlert(document), title: `${document.kind} ${document.number}`, description: document.subject, tone: documentAlert(document) }));
  const openDocuments = repository.documents.filter((document) => !/CONCLU[IÍ]DO|CANCELADO/i.test(document.status));
  const recordForm = editing?.kind === "record" ? editing.data : undefined; const documentForm = editing?.kind === "document" ? editing.data : undefined;

  function switchModule(next: Module) { setModule(next); setActiveView(next === "records" ? "records" : "documents"); setFormOpen(false); setExpanded(""); setQuery(""); setKind("Todos"); setStatus("Todos"); setDepartment("Todos"); setPaymentRecordId(""); setEditing(null); }
  function changeView(next: ShellView) { const resolved = next === "nutrition" ? "nutrition-weekly" : next === "stock" ? "stock-industrial" : next; const permissionKey = viewPermissionKey[resolved]; if (permissionKey && !repository.canRead(user.id, permissionKey)) { setNotice("Usuário sem permissão para acessar este módulo."); return; } if (resolved === "records") return switchModule("records"); if (resolved === "documents") return switchModule("documents"); setActiveView(resolved); setFormOpen(false); setExpanded(""); setPaymentRecordId(""); setEditing(null); }
  function closeForm() { setFormOpen(false); setEditing(null); }
  function saveRecord(input: SemedRecordInput) { const isEdit = Boolean(recordForm); const result = recordForm ? repository.updateRecord(recordForm.id, input, user.id) : repository.createRecord(input, user.id); if (result) { closeForm(); setExpanded(result.id); setNotice(`${isEdit ? "Registro atualizado" : "Registro cadastrado"} na simulação local.`); } else setNotice("Usuário sem permissão para alterar contratos."); }
  function saveDocument(input: SemedDocumentInput) { const isEdit = Boolean(documentForm); const result = documentForm ? repository.updateDocument(documentForm.id, input, user.id) : repository.createDocument(input, user.id); if (result) { closeForm(); setExpanded(result.id); setNotice(`${isEdit ? "Documento atualizado" : "Documento cadastrado"} na simulação local.`); } else setNotice("Usuário sem permissão para alterar documentos."); }
  function confirmDelete(confirmation: string) { const target = deleteTarget; if (!target) return; const deleted = target.kind === "registro" ? repository.deleteRecord(target.id, user.id, confirmation) : repository.deleteDocument(target.id, user.id, confirmation); if (!deleted) return setNotice("Exclusão não confirmada ou usuário sem permissão."); setDeleteTarget(null); setExpanded(""); setNotice(`${target.kind === "registro" ? "Registro" : "Documento"} excluído somente da simulação local.`); }
  async function saveMasterRecord(input: import("./sigaLocalStore").SemedMasterRecordInput) {
    if (!useDomainPersistence) return repository.saveMasterRecord(input, user.id);
    try {
      const record = await saveRemoteMaster.mutateAsync(input);
      await remoteMasters.refetch();
      return { error: null, record };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Não foi possível salvar o cadastro no banco.", record: null };
    }
  }
  async function saveAgendaEvent(input: import("./sigaLocalStore").SemedAgendaEventInput) {
    if (!useDomainPersistence) return repository.saveAgendaEvent(input, user.id);
    try { await saveRemoteAgenda.mutateAsync(input); await remoteAgenda.refetch(); return { error: null }; } catch (error) { return { error: error instanceof Error ? error.message : "Não foi possível salvar o evento no banco." }; }
  }
  async function saveUserMessage(input: import("./sigaLocalStore").SemedUserMessageInput) {
    if (!useDomainPersistence) return repository.saveUserMessage(input, user.id);
    try { await saveRemoteMessage.mutateAsync(input); await remoteMessages.refetch(); return { error: null }; } catch (error) { return { error: error instanceof Error ? error.message : "Não foi possível enviar a mensagem pelo banco." }; }
  }
  async function markUserMessageRead(messageId: string) {
    if (!useDomainPersistence) return repository.markUserMessageRead(messageId, user.id);
    try { await markRemoteMessageRead.mutateAsync({ id: messageId }); await remoteMessages.refetch(); return true; } catch { return false; }
  }
  async function saveUserNote(content: string) {
    if (!useDomainPersistence) return repository.saveUserNote({ content }, user.id);
    try { await saveRemoteNote.mutateAsync({ content }); await remoteNotes.refetch(); return { error: null }; } catch (error) { return { error: error instanceof Error ? error.message : "Não foi possível salvar o lembrete no banco." }; }
  }
  async function saveSchoolUnit(input: import("./sigaLocalStore").SemedSchoolUnitInput) {
    if (!useDomainPersistence) return repository.saveSchoolUnit(input, user.id);
    try { await saveRemoteSchool.mutateAsync(input); await remoteSchools.refetch(); return { error: null }; } catch (error) { return { error: error instanceof Error ? error.message : "Não foi possível salvar a unidade no banco." }; }
  }
  async function saveSchoolClass(input: import("./sigaLocalStore").SemedSchoolClassInput) {
    if (!useDomainPersistence) return repository.saveSchoolClass(input, user.id);
    try { await saveRemoteSchoolClass.mutateAsync(input); await remoteSchoolClasses.refetch(); return { error: null }; } catch (error) { return { error: error instanceof Error ? error.message : "Não foi possível salvar a turma no banco." }; }
  }

  const isRecords = module === "records";
  const canWriteCurrent = isRecords ? canWriteRecords : canWriteDocuments;
  const localContent = <section className="siga-module-surface">
    <section className="siga-summary-grid"><Metric label="Registros" value={repository.records.length} tone="neutral" /><Metric label="Ativos" value={repository.records.filter((record) => record.status === "Vigente").length} tone="good" /><Metric label="A vencer" value={repository.records.filter((record) => recordAlert(record) === "A vencer").length} tone="warning" /><Metric label="Vencidos" value={repository.records.filter((record) => recordAlert(record) === "Vencido").length} tone="danger" /><Metric label="Saldo a pagar" value={money.format(totalBalance)} tone="money" /></section>
    <nav className="siga-module-tabs"><button className={isRecords ? "active" : ""} type="button" onClick={() => switchModule("records")}><WalletCards size={17} />Contratos e Processos <em>{repository.records.length}</em></button><button className={!isRecords ? "active" : ""} type="button" onClick={() => switchModule("documents")}><ClipboardCheck size={17} />Documentos <em>{repository.documents.length}</em></button></nav>
    {!canWriteCurrent ? <p className="siga-workspace-notice">Perfil em modo somente leitura neste módulo.</p> : null}
    <section className="siga-workspace-grid">
      <section className="siga-form-panel"><button type="button" className="siga-panel-trigger" onClick={() => { setEditing(null); setFormOpen((current) => !current); }}><span><small>{isRecords ? "Cadastro" : "Documentos"}</small><strong>{editing ? (isRecords ? "Editar registro" : "Editar documento") : isRecords ? "Novo registro" : "Novo documento"}</strong></span><ChevronDown className={formOpen ? "open" : ""} size={19} /></button>{formOpen ? isRecords ? <RecordForm initial={recordForm} onSave={saveRecord} onCancel={closeForm} /> : <DocumentForm initial={documentForm} onSave={saveDocument} onCancel={closeForm} /> : <p className="siga-form-hint">{isRecords ? "Abra o cadastro para incluir ou editar contratos e processos, mantendo campos financeiros e de prazo." : "Abra o cadastro para criar ou editar ofícios, memorandos e despachos com modelos, vínculos e prazos."}</p>}</section>
      {isRecords ? <section className="siga-list-panel"><div className="siga-list-heading"><div><p>Acompanhamento</p><h2>Relatório e alertas</h2></div><span>{filteredRecords.length} de {repository.records.length} registros</span></div><AlertStrip items={recordAlerts} emptyTitle="Prazos em dia" emptyDescription="Nenhum vencimento dentro da janela configurada." /><div className="siga-filters records"><span><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Número, objeto, fornecedor, setor..." /></span><select aria-label="Filtrar por tipo" value={kind} onChange={(event) => setKind(event.target.value)}><option>Todos</option><option>Contrato</option><option>Processo</option></select><select aria-label="Filtrar por situação" value={status} onChange={(event) => setStatus(event.target.value)}><option>Todos</option><option>Em dia</option><option>A vencer</option><option>Vencido</option><option>Vigente</option><option>Em andamento</option></select><select aria-label="Filtrar por setor" value={department} onChange={(event) => setDepartment(event.target.value)}><option>Todos</option>{departments.map((item) => <option key={item}>{item}</option>)}</select></div><div className="siga-record-list">{filteredRecords.map((record) => <RecordAccordion key={record.id} record={record} expanded={expanded === record.id} paymentOpen={paymentRecordId === record.id} onToggle={() => setExpanded(expanded === record.id ? "" : record.id)} onTogglePayment={() => setPaymentRecordId(paymentRecordId === record.id ? "" : record.id)} onEdit={() => { setEditing({ kind: "record", data: record }); setFormOpen(true); }} onDelete={() => setDeleteTarget({ kind: "registro", id: record.id, label: `${record.kind} ${record.number}` })} onPayment={(paymentDate, amount, notes, nextPaymentDueDate) => { const result = repository.createPayment({ recordId: record.id, paymentDate, amount, notes, nextPaymentDueDate }, user.id); if (!result.error) { setPaymentRecordId(""); setNotice("Baixa registrada na simulação local."); } return result.error; }} onRemovePayment={(paymentId) => { repository.deletePayment(paymentId, user.id); setNotice("Baixa removida da simulação local."); }} />)}</div></section> : <section className="siga-list-panel"><div className="siga-list-heading"><div><p>Controle documental</p><h2>Ofícios, memorandos e despachos</h2></div><span>{filteredDocuments.length} de {repository.documents.length} documentos</span></div><section className="siga-document-kpis"><Metric label="Documentos" value={repository.documents.length} tone="neutral" /><Metric label="Em aberto" value={openDocuments.length} tone="good" /><Metric label="A vencer" value={repository.documents.filter((document) => documentAlert(document) === "A vencer").length} tone="warning" /><Metric label="Vencidos" value={repository.documents.filter((document) => documentAlert(document) === "Vencido").length} tone="danger" /><Metric label="Modelos" value={6} tone="money" /></section><AlertStrip items={documentAlerts} emptyTitle="Documentos em dia" emptyDescription="Nenhuma resposta vencendo dentro da janela padrão." /><div className="siga-filters"><span><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Número, assunto, setor, vínculo..." /></span><select aria-label="Filtrar por tipo" value={kind} onChange={(event) => setKind(event.target.value)}><option>Todos</option><option>Ofício</option><option>Memorando</option><option>Despacho</option></select><select aria-label="Filtrar por situação" value={status} onChange={(event) => setStatus(event.target.value)}><option>Todos</option><option>Em dia</option><option>A vencer</option><option>Vencido</option><option>Em elaboração</option><option>Aguardando resposta</option></select></div><div className="siga-record-list">{filteredDocuments.map((document) => <DocumentAccordion key={document.id} document={document} expanded={expanded === document.id} onToggle={() => setExpanded(expanded === document.id ? "" : document.id)} onEdit={() => { setEditing({ kind: "document", data: document }); setFormOpen(true); }} onDelete={() => setDeleteTarget({ kind: "documento", id: document.id, label: `${document.kind} ${document.number}` })} />)}</div></section>}
    </section>
  </section>;

  return <>
    {securityOpen ? <SecurityPanel user={user} onClose={() => setSecurityOpen(false)} onSaved={(newPassword) => { repository.changePassword(user.id, newPassword); onPasswordChanged?.(); setSecurityOpen(false); setNotice("Senha atualizada na simulação local."); }} /> : null}
    {deleteTarget ? <DeleteConfirmation target={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} /> : null}
    <SemedOperationalShell user={user} activeView={activeView} onViewChange={changeView} onPassword={() => setSecurityOpen(true)} onLogout={onLogout} isViewAllowed={(view) => { const permissionKey = viewPermissionKey[view]; return permissionKey ? repository.canRead(user.id, permissionKey) : true; }} logo={logo}>
      {notice ? <p className="siga-workspace-notice">{notice}<button type="button" onClick={() => setNotice("")}>×</button></p> : null}
      {activeView === "welcome" ? <WelcomeCenter user={user} onStart={() => changeView("home")} /> : null}
      {activeView === "home" ? <><HomeDashboard records={repository.records} documents={repository.documents} tasks={repository.managementTasks} approvals={repository.managementApprovals} agendaEvents={agendaEvents} userNotes={userNotes} currentUser={user} canReadGovernance={repository.canRead(user.id, "gestao")} canWriteHome={repository.canWrite(user.id, "inicio")} onSaveUserNote={saveUserNote} onViewChange={changeView} /><SemedHomeOperationsPage user={user} users={repository.users} events={agendaEvents} messages={userMessages} messageReads={userMessageReads} canWrite={repository.canWrite(user.id, "inicio")} onSaveEvent={saveAgendaEvent} onSaveMessage={saveUserMessage} onMarkMessageRead={markUserMessageRead} onNotify={setNotice} /></> : null}
      {activeView === "governance" ? <GovernancePage onNavigate={changeView} readOnly={!repository.canWrite(user.id, "gestao")} canApprove={repository.canGovernanceAction(user.id, "gestao", "aprovar")} actorUserId={user.id} users={repository.users} tasks={repository.managementTasks} attachments={repository.managementAttachments} approvals={repository.managementApprovals} approvalComments={repository.managementApprovalComments} records={repository.records} documents={repository.documents} auditLog={repository.governanceAuditLog} onSaveTask={(input) => repository.saveManagementTask(input, user.id).error} onSaveAttachment={(input) => repository.saveManagementAttachment(input, user.id).error} onSaveApproval={(input) => repository.saveManagementApproval(input, user.id).error} onSaveApprovalComment={(approvalId, content) => repository.addManagementApprovalComment(approvalId, content, user.id).error} onNotify={setNotice} /> : null}
      {activeView === "masters" ? <SemedMastersPage records={masterRecords} canWrite={useDomainPersistence ? domainIdentity.data?.profile === "Administrador" : repository.canWrite(user.id, "cadastros_gerais")} onSave={saveMasterRecord} onNotify={setNotice} /> : null}
      {activeView === "finance" ? <SemedFinancePage sources={repository.financeSources} rules={repository.financeRules} planningEntries={repository.financePlanningEntries} revenues={repository.financeRevenues} executions={repository.financeExecutions} contractCount={repository.records.length} hrRecordCount={repository.hrFinancialRecords.length} canWrite={repository.canWrite(user.id, "financeiro")} canManageRules={user.profile === "Administrador" && repository.canWrite(user.id, "financeiro")} onSaveSource={(input) => repository.saveFinanceSource(input, user.id)} onSaveRule={(input) => repository.saveFinanceRule(input, user.id)} onSavePlanning={(input) => repository.saveFinancePlanningEntry(input, user.id)} onSaveRevenue={(input) => repository.saveFinanceRevenue(input, user.id)} onSaveExecution={(input) => repository.saveFinanceExecution(input, user.id)} onNotify={setNotice} /> : null}
      {activeView === "users" ? <SemedUsersPage currentUser={user} users={repository.users} permissions={repository.userPermissions} auditLog={repository.userAuditLog} onCreate={(input) => repository.createUser(input, user.id)} onUpdate={(userId, input) => repository.updateUser(userId, input, user.id)} onSetActive={(userId, active) => repository.setUserActive(userId, active, user.id)} onIssuePassword={(userId) => repository.issueProvisionalPassword(userId, user.id)} onTerminateSessions={(userId) => repository.terminateUserSessions(userId, user.id)} onNotify={setNotice} /> : null}
      {activeView === "settings" ? <SemedInstitutionSettingsPage settings={repository.institutionSettings} auditLog={repository.institutionSettingsAuditLog} governanceAuditLog={repository.governanceAuditLog} actorUserId={user.id} readOnly={user.profile !== "Administrador"} onSave={repository.saveInstitutionSettings} /> : null}
      {activeView === "fleet" ? <SemedFleetPage vehicles={repository.fleetVehicles} fuelLogs={repository.fleetFuelLogs} maintenances={repository.fleetMaintenances} occurrences={repository.fleetOccurrences} actorUserId={user.id} canWrite={repository.canWrite(user.id, "frota")} canCancel={repository.canGovernanceAction(user.id, "frota", "cancelar")} canResolve={repository.canGovernanceAction(user.id, "frota", "aprovar")} onSaveVehicle={(input) => repository.saveFleetVehicle(input, user.id)} onSaveFuel={(input) => repository.saveFleetFuel(input, user.id)} onSaveMaintenance={(input) => repository.saveFleetMaintenance(input, user.id)} onSaveOccurrence={(input) => repository.saveFleetOccurrence(input, user.id)} onNotify={setNotice} /> : null}
{activeView === "nutrition-weekly" || activeView === "nutrition-annual" ? <SemedNutritionPage initialView={activeView === "nutrition-annual" ? "annual" : "weekly"} schools={repository.nutritionSchools} contracts={repository.nutritionContracts} weeklyPlans={repository.nutritionWeeklyPlans} stages={repository.nutritionStages} catalog={repository.nutritionCatalog} annualPlans={repository.nutritionAnnualPlans} canWriteWeekly={repository.canWrite(user.id, "nutricao.planejamento_semanal")} canWriteAnnual={repository.canWrite(user.id, "nutricao.planejamento_anual")} getWeeklyAnalysis={repository.weeklyNutritionAnalysis} getAnnualResults={repository.annualNutritionResults} onSaveWeekly={(input) => repository.saveNutritionWeeklyPlan(input, user.id)} onArchiveWeekly={(planId) => repository.archiveNutritionWeeklyPlan(planId, user.id)} onSaveAnnual={(input) => repository.saveNutritionAnnualPlan(input, user.id)} onArchiveAnnual={(planId) => repository.archiveNutritionAnnualPlan(planId, user.id)} onNotify={setNotice} /> : null}
		{(activeView === "people" || activeView.startsWith("people-")) ? <SemedHumanResourcesPage initialSection={activeView === "people-financial" ? "financial" : activeView === "people-payslip" ? "payslip" : activeView === "people-attendance" ? "attendance" : activeView === "people-reports" ? "reports" : "servers"} currentUser={user} schools={repository.nutritionSchools} servers={repository.hrServers} financialRecords={repository.hrFinancialRecords} attendancePeriods={repository.hrAttendancePeriods} auditLog={repository.hrAuditLog} canWriteServers={repository.canWrite(user.id, "rh.cadastro_servidores")} canWriteFinancial={repository.canWrite(user.id, "rh.ficha_financeira")} canWriteAttendance={repository.canWrite(user.id, "rh.frequencia")} onSaveServer={(input) => repository.saveHrServer(input, user.id)} onSaveFinancial={(input) => repository.saveHrFinancialRecord(input, user.id)} onSaveAttendance={(input) => repository.saveHrAttendancePeriod(input, user.id)} onNotify={setNotice} /> : null}
		      {activeView === "schools" || activeView === "schools-classes" || activeView === "schools-reports" || activeView === "educa" || activeView === "educa-reports" ? <SemedSchoolsEducaPage initialSection={activeView as SchoolsEducaSection} currentUser={user} schoolUnits={schoolUnitsForSchools} schoolClasses={schoolClassesForSchools} educaNuclei={repository.educaNuclei} canWriteSchools={useDomainPersistence ? domainIdentity.data?.profile === "Administrador" : repository.canWrite(user.id, "unidades_escolares")} canWriteEduca={repository.canWrite(user.id, "educa_paco")} onSaveSchool={saveSchoolUnit} onSaveSchoolClass={saveSchoolClass} onSaveNucleus={(input) => repository.saveEducaNucleus(input, user.id)} onNotify={setNotice} /> : null}
	      {activeView === "schools-pdde" ? <SemedPddeFndePage schoolUnits={repository.schoolUnits} executingUnits={repository.schoolExecutingUnits} accounts={repository.schoolFndeAccounts} accountabilityEntries={repository.schoolFndeAccountability} canWrite={repository.canWrite(user.id, "unidades.uex")} onSaveExecutingUnit={(input) => repository.saveSchoolExecutingUnit(input, user.id)} onSaveAccount={(input) => repository.saveSchoolFndeAccount(input, user.id)} onSaveAccountability={(input) => repository.saveSchoolFndeAccountability(input, user.id)} onNotify={setNotice} /> : null}
		      {activeView === "stock-family" ? <SemedAgricultureFamilyPage entities={repository.afEntities} contracts={repository.afContracts} contractProducts={repository.afContractProducts} plans={repository.afSupplyPlans} guides={repository.afGuides} guideItems={repository.afGuideItems} billings={repository.afBillings} schoolUnits={repository.schoolUnits} canWrite={repository.canWrite(user.id, "estoque.agricultura_familiar")} actorName={user.displayName} onSaveEntity={(input) => repository.saveAfEntity(input, user.id)} onSaveContract={(input) => repository.saveAfContract(input, user.id)} onSaveProduct={(input) => repository.saveAfContractProduct(input, user.id)} onSavePlan={(input) => repository.saveAfSupplyPlan(input, user.id)} onSaveGuide={(input) => repository.saveAfGuide(input, user.id)} onSaveGuideItem={(input) => repository.saveAfGuideItem(input, user.id)} onReceiveGuide={(guideId, receivedByName) => repository.receiveAfGuide(guideId, receivedByName, user.id)} onSaveBilling={(input) => repository.saveAfBilling(input, user.id)} onNotify={setNotice} /> : null}
		      {activeView.startsWith("stock-") && activeView !== "stock-family" ? <SemedStockPage initialSection={activeView.replace("stock-", "") as StockSection} schools={repository.nutritionSchools} contracts={repository.nutritionContracts} items={repository.stockItems} movements={repository.stockMovements} audits={repository.stockAudits} schoolStocks={repository.schoolStocks} counts={repository.schoolStockCounts} schoolMovements={repository.schoolStockMovements} kitOrders={repository.kitOrders} canWriteIndustrial={repository.canWrite(user.id, "estoque.industrializado")} canWriteKit={repository.canWrite(user.id, "estoque.kit_aluno")} canWriteCategories={repository.canWrite(user.id, "estoque.categorias")} onSaveItem={(input) => repository.saveStockItem(input, user.id)} onRegisterMovement={(input) => repository.registerStockMovement(input, user.id)} onStartAudit={(scope, notes) => repository.startStockAudit(scope, user.id, notes)} onFinishAudit={(auditId, entries) => repository.finishStockAudit(auditId, entries, user.id)} onSaveSchoolCount={(stockId, quantity, notes) => repository.saveSchoolStockCount(stockId, quantity, notes, user.id)} onRegisterSchoolMovement={(stockId, type, quantity, reference, notes) => repository.registerSchoolStockMovement(stockId, type, quantity, reference, notes, user.id)} onSaveKitOrder={(input) => repository.saveKitOrder(input, user.id)} onNotify={setNotice} /> : null}
		{activeView === "records" || activeView === "documents" ? localContent : null}
		      {![("welcome"), "home", "governance", "masters", "people", "users", "settings", "nutrition-weekly", "nutrition-annual", "schools", "schools-classes", "schools-pdde", "schools-reports", "educa", "educa-reports", "records", "documents"].includes(activeView) && !activeView.startsWith("stock-") && !activeView.startsWith("people-") ? <ModulePlaceholder view={activeView} onHome={() => changeView("home")} /> : null}
	    </SemedOperationalShell>
  </>;
}

function RecordAccordion({ record, expanded, paymentOpen, onToggle, onTogglePayment, onEdit, onDelete, onPayment, onRemovePayment }: { record: SemedRecord; expanded: boolean; paymentOpen: boolean; onToggle: () => void; onTogglePayment: () => void; onEdit: () => void; onDelete: () => void; onPayment: (date: string, amount: number, notes: string, dueDate: string) => string | null; onRemovePayment: (id: string) => void }) {
  return <article className={`siga-record-row ${expanded ? "expanded" : ""}`}><button type="button" className="siga-record-summary" onClick={onToggle}><span className="siga-record-main"><small>{record.kind}</small><strong>{record.number}</strong><em>{record.object}</em></span><span className="siga-record-meta"><AlertTag value={recordAlert(record)} /><ChevronDown className={expanded ? "open" : ""} size={18} /></span></button>{expanded ? <div className="siga-record-detail"><div className="siga-detail-grid"><span><small>Tipo</small>{record.kind}</span><span><small>Situação</small>{record.status}</span><span><small>Vencimento</small>{displayDate(record.endDate)}</span><span><small>Alerta</small>{recordAlert(record)}</span><span><small>Fornecedor, interessado ou setor</small>{record.party || "—"}</span><span><small>Setor</small>{record.department || "—"}</span><span><small>Responsável</small>{record.responsible || "—"}</span><span><small>Controle financeiro</small>{record.financialCategory}</span><span className="siga-detail-wide"><small>Objeto ou assunto</small>{record.object}</span></div>{record.kind === "Contrato" ? <><div className="siga-finance-detail"><div><small>Valor</small><strong>{money.format(record.amount)}</strong></div><div><small>Já pago</small><strong>{money.format(record.paidAmount)}</strong></div><div><small>Saldo a pagar</small><strong>{money.format(record.balanceAmount)}</strong></div><button type="button" onClick={onTogglePayment}>Registrar baixa</button></div>{record.hasOverpayment ? <p className="siga-financial-warning" role="alert">Pagamento acima do contratado: {money.format(record.overpaidAmount ?? 0)}. Revise as baixas locais e os eventuais aditivos antes de novos lançamentos.</p> : null}{paymentOpen ? <PaymentForm record={record} onClose={onTogglePayment} onSave={onPayment} /> : null}<div className="siga-payment-history"><div><small>Histórico de pagamentos</small><strong>{record.payments.length ? `${record.payments.length} baixa${record.payments.length > 1 ? "s" : ""} local${record.payments.length > 1 ? "is" : ""}` : "Nenhuma baixa registrada"}</strong></div>{record.payments.length ? <ul>{record.payments.map((payment) => <li key={payment.id}><span><strong>{money.format(payment.amount)}</strong><small>{displayDate(payment.paymentDate)}</small></span><em>{payment.notes}</em><button type="button" onClick={() => onRemovePayment(payment.id)}>Remover</button></li>)}</ul> : <p>Registre uma baixa para visualizar o histórico local deste contrato.</p>}</div></> : null}<p className="siga-notes"><small>Observações</small>{record.notes || "—"}</p><div className="siga-row-actions"><button type="button" onClick={onEdit}><Pencil size={15} />Editar</button><button type="button" className="danger" onClick={onDelete}><Trash2 size={15} />Excluir</button></div></div> : null}</article>;
}

function DocumentAccordion({ document, expanded, onToggle, onEdit, onDelete }: { document: SemedDocument; expanded: boolean; onToggle: () => void; onEdit: () => void; onDelete: () => void }) {
  return <article className={`siga-record-row ${expanded ? "expanded" : ""}`}><button type="button" className="siga-record-summary" onClick={onToggle}><span className="siga-record-main"><small>{document.kind}</small><strong>{document.number}</strong><em>{document.subject}</em></span><span className="siga-record-meta"><AlertTag value={documentAlert(document)} /><ChevronDown className={expanded ? "open" : ""} size={18} /></span></button>{expanded ? <div className="siga-record-detail"><div className="siga-detail-grid"><span><small>Tipo</small>{document.kind}</span><span><small>Situação</small>{document.status}</span><span><small>Data</small>{displayDate(document.documentDate)}</span><span><small>Prazo</small>{displayDate(document.dueDate)}</span><span><small>Modelo</small>{document.templateKey || "—"}</span><span><small>Destino</small>{document.destination || "—"}</span><span><small>Destinatário</small>{document.recipient || "—"}</span><span><small>Vínculo</small>{document.relatedRecord || "—"}</span><span className="siga-detail-wide"><small>Assunto</small>{document.subject}</span></div><div className="siga-document-preview"><div><small>Prévia</small><strong>Texto base do documento</strong></div><pre>{`ESTADO DO MARANHÃO\nPREFEITURA MUNICIPAL DE PAÇO DO LUMIAR\nSECRETARIA MUNICIPAL DE EDUCAÇÃO\n\n${document.kind.toUpperCase()} Nº ${document.number} — ${document.responsible}\n\nDESTINO: ${document.destination}\nASSUNTO: ${document.subject}\nREFERÊNCIA: ${document.relatedRecord}\n\n${document.summary}\n\n${document.notes}`}</pre></div><div className="siga-row-actions"><button type="button" onClick={onEdit}><Pencil size={15} />Editar</button><button type="button" className="danger" onClick={onDelete}><Trash2 size={15} />Excluir</button></div></div> : null}</article>;
}
