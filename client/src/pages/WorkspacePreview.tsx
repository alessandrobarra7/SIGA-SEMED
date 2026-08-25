import { FormEvent, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
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
import { GovernancePage, MastersPage } from "./SemedManagementPages";
import {
  parseBrazilianAmount,
  SemedDocument,
  SemedDocumentInput,
  SemedRecord,
  SemedRecordInput,
  useSigaLocalRepository,
} from "./sigaLocalStore";

type User = { id?: string; username?: string; displayName: string; role: string };
type Module = "records" | "documents";
type Alert = "A vencer" | "Vencido" | "Em dia";
type DeleteTarget = { kind: "registro" | "documento"; id: string; label: string };
type Editing = { kind: "record"; data: SemedRecord } | { kind: "document"; data: SemedDocument } | null;

const logo = "/manus-storage/semed-logo_62496e33.png";
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const displayDate = (date: string) => (date ? new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR") : "—");
const dateValue = (date: string) => date.slice(0, 10);

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

function SecurityPanel({ user, onClose, onSaved }: { user: User; onClose: () => void; onSaved: () => void }) {
  const [currentPassword, setCurrentPassword] = useState(""); const [newPassword, setNewPassword] = useState(""); const [confirmation, setConfirmation] = useState(""); const [message, setMessage] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const error = validateFirstAccess(currentPassword, newPassword, confirmation); if (error) return setMessage(error); onSaved(); }
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

const agendaDays = [
  { day: "SEG", date: "25", tone: "navy", items: ["Acompanhamento de prazos"] },
  { day: "TER", date: "26", tone: "green", items: ["Rotina de documentos"] },
  { day: "QUA", date: "27", tone: "orange", items: ["Conferência administrativa"] },
  { day: "QUI", date: "28", tone: "slate", items: ["Atualização de pendências"] },
  { day: "SEX", date: "29", tone: "navy", items: ["Fechamento semanal"] },
];

function WelcomeCenter({ user, onStart }: { user: User; onStart: () => void }) {
  const firstName = user.displayName.split(" ")[0] || "Equipe";
  return <section className="siga-welcome" aria-labelledby="welcome-title">
    <div className="siga-welcome-hero">
      <div>
        <p className="siga-kicker">Painel institucional</p>
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

function HomeDashboard({ records, documents, onViewChange }: { records: SemedRecord[]; documents: SemedDocument[]; onViewChange: (view: ShellView) => void }) {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<string[]>([]);
  const dueRecords = records.filter((record) => recordAlert(record) !== "Em dia").length;
  const dueDocuments = documents.filter((document) => documentAlert(document) !== "Em dia").length;

  function saveNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = note.trim();
    if (!value) return;
    setNotes((current) => [value, ...current].slice(0, 3));
    setNote("");
  }

  return <section className="siga-home" aria-labelledby="home-title">
    <header className="siga-home-heading">
      <div><p className="siga-kicker">Página inicial</p><h1 id="home-title">Acompanhamento da semana</h1><span>Visão local de agenda, prioridades e acesso rápido aos fluxos já disponíveis.</span></div>
      <button type="button" className="siga-home-outline" onClick={() => onViewChange("governance")}><ListChecks size={16} aria-hidden="true" />Ver minhas tarefas</button>
    </header>

    <div className="siga-home-overview">
      <article className="siga-home-hero-card"><span>Resumo operacional</span><strong>Organize o acompanhamento sem sair do contexto.</strong><p>Consulte prazos, documentos e contratos locais a partir dos atalhos do painel.</p><div><button type="button" onClick={() => onViewChange("records")}>Abrir contratos</button><button type="button" onClick={() => onViewChange("documents")}>Abrir documentos</button></div></article>
      <article className="siga-home-stat"><span className="siga-home-stat-icon orange"><FileClock size={17} aria-hidden="true" /></span><strong>{dueRecords}</strong><small>contrato(s) com alerta</small></article>
      <article className="siga-home-stat"><span className="siga-home-stat-icon green"><ClipboardCheck size={17} aria-hidden="true" /></span><strong>{dueDocuments}</strong><small>documento(s) com alerta</small></article>
      <article className="siga-home-stat"><span className="siga-home-stat-icon navy"><CalendarDays size={17} aria-hidden="true" /></span><strong>{agendaDays.length}</strong><small>rotinas na semana</small></article>
    </div>

    <div className="siga-home-grid">
      <section className="siga-agenda-card" aria-labelledby="agenda-title">
        <div className="siga-card-heading"><div><p>Agenda institucional</p><h2 id="agenda-title">Semana de acompanhamento</h2></div><span>Agosto</span></div>
        <div className="siga-week-grid">{agendaDays.map((item) => <article key={item.day} className={`siga-week-day ${item.tone}`}><small>{item.day}</small><strong>{item.date}</strong>{item.items.map((agendaItem) => <span key={agendaItem}>{agendaItem}</span>)}</article>)}</div>
        <footer><CalendarDays size={15} aria-hidden="true" />Calendário demonstrativo alinhado à rotina administrativa.</footer>
      </section>

      <section className="siga-notes-card" aria-labelledby="notes-title">
        <div className="siga-card-heading"><div><p>Anotações rápidas</p><h2 id="notes-title">Lembretes desta sessão</h2></div><StickyNote size={18} aria-hidden="true" /></div>
        <form onSubmit={saveNote} className="siga-quick-note-form"><input aria-label="Nova anotação" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Registrar um lembrete local" /><button type="submit" aria-label="Adicionar anotação"><Plus size={16} aria-hidden="true" /></button></form>
        <div className="siga-quick-notes">{notes.length ? notes.map((item, index) => <p key={`${item}-${index}`}>{item}</p>) : <p className="empty">Nenhuma anotação criada nesta sessão.</p>}</div>
      </section>
    </div>
  </section>;
}

function ModulePlaceholder({ view, onHome }: { view: ShellView; onHome: () => void }) {
  const label = shellViewLabel(view);
  return <section className="siga-module-placeholder"><div className="siga-placeholder-mark"><ClipboardCheck size={22} aria-hidden="true" /></div><p className="siga-kicker">Módulo mapeado</p><h1>{label}</h1><p>O shell, a navegação e a posição deste módulo já foram reproduzidos. A composição interna será incorporada no próximo grupo, preservando filtros, abas e fluxos observados na referência.</p><button type="button" onClick={onHome}>Voltar ao Início</button></section>;
}

export default function WorkspacePreview({ user, onLogout, onPasswordChanged }: { user: User; onLogout: () => void; onPasswordChanged?: () => void }) {
  const repository = useSigaLocalRepository();
  const [module, setModule] = useState<Module>("records"); const [activeView, setActiveView] = useState<ShellView>("welcome"); const [formOpen, setFormOpen] = useState(false); const [expanded, setExpanded] = useState(""); const [query, setQuery] = useState(""); const [kind, setKind] = useState("Todos"); const [status, setStatus] = useState("Todos"); const [department, setDepartment] = useState("Todos"); const [notice, setNotice] = useState(""); const [securityOpen, setSecurityOpen] = useState(false); const [paymentRecordId, setPaymentRecordId] = useState(""); const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null); const [editing, setEditing] = useState<Editing>(null);
  const departments = useMemo(() => Array.from(new Set(repository.records.map((record) => record.department))).sort(), [repository.records]);
  const filteredRecords = useMemo(() => repository.records.filter((record) => `${record.number} ${record.object} ${record.department} ${record.party}`.toLowerCase().includes(query.toLowerCase()) && (kind === "Todos" || record.kind === kind) && (status === "Todos" || record.status === status || recordAlert(record) === status) && (department === "Todos" || record.department === department)), [department, kind, query, repository.records, status]);
  const filteredDocuments = useMemo(() => repository.documents.filter((document) => `${document.number} ${document.subject} ${document.destination} ${document.relatedRecord}`.toLowerCase().includes(query.toLowerCase()) && (kind === "Todos" || document.kind === kind) && (status === "Todos" || document.status === status || documentAlert(document) === status)), [kind, query, repository.documents, status]);
  const totalBalance = repository.records.filter((record) => record.kind === "Contrato").reduce((total, record) => total + record.balanceAmount, 0);
  const recordAlerts = repository.records.filter((record) => recordAlert(record) !== "Em dia").map((record) => ({ label: recordAlert(record), title: `${record.kind} ${record.number}`, description: record.object, tone: recordAlert(record) }));
  const documentAlerts = repository.documents.filter((document) => documentAlert(document) !== "Em dia").map((document) => ({ label: documentAlert(document), title: `${document.kind} ${document.number}`, description: document.subject, tone: documentAlert(document) }));
  const openDocuments = repository.documents.filter((document) => !/CONCLU[IÍ]DO|CANCELADO/i.test(document.status));
  const recordForm = editing?.kind === "record" ? editing.data : undefined; const documentForm = editing?.kind === "document" ? editing.data : undefined;

  function switchModule(next: Module) { setModule(next); setActiveView(next === "records" ? "records" : "documents"); setFormOpen(false); setExpanded(""); setQuery(""); setKind("Todos"); setStatus("Todos"); setDepartment("Todos"); setPaymentRecordId(""); setEditing(null); }
  function changeView(next: ShellView) { if (next === "records") return switchModule("records"); if (next === "documents") return switchModule("documents"); setActiveView(next); setFormOpen(false); setExpanded(""); setPaymentRecordId(""); setEditing(null); }
  function closeForm() { setFormOpen(false); setEditing(null); }
  function saveRecord(input: SemedRecordInput) { const isEdit = Boolean(recordForm); const result = recordForm ? repository.updateRecord(recordForm.id, input) : repository.createRecord(input); if (result) { closeForm(); setExpanded(result.id); setNotice(`${isEdit ? "Registro atualizado" : "Registro cadastrado"} na simulação local.`); } }
  function saveDocument(input: SemedDocumentInput) { const isEdit = Boolean(documentForm); const result = documentForm ? repository.updateDocument(documentForm.id, input) : repository.createDocument(input); if (result) { closeForm(); setExpanded(result.id); setNotice(`${isEdit ? "Documento atualizado" : "Documento cadastrado"} na simulação local.`); } }
  function confirmDelete(confirmation: string) { const target = deleteTarget; if (!target) return; const deleted = target.kind === "registro" ? repository.deleteRecord(target.id, confirmation) : repository.deleteDocument(target.id, confirmation); if (!deleted) return setNotice("Exclusão não confirmada na simulação local."); setDeleteTarget(null); setExpanded(""); setNotice(`${target.kind === "registro" ? "Registro" : "Documento"} excluído somente da simulação local.`); }

  const isRecords = module === "records";
  const localContent = <section className="siga-module-surface">
    <section className="siga-summary-grid"><Metric label="Registros" value={repository.records.length} tone="neutral" /><Metric label="Ativos" value={repository.records.filter((record) => record.status === "Vigente").length} tone="good" /><Metric label="A vencer" value={repository.records.filter((record) => recordAlert(record) === "A vencer").length} tone="warning" /><Metric label="Vencidos" value={repository.records.filter((record) => recordAlert(record) === "Vencido").length} tone="danger" /><Metric label="Saldo a pagar" value={money.format(totalBalance)} tone="money" /></section>
    <nav className="siga-module-tabs"><button className={isRecords ? "active" : ""} type="button" onClick={() => switchModule("records")}><WalletCards size={17} />Contratos e Processos <em>{repository.records.length}</em></button><button className={!isRecords ? "active" : ""} type="button" onClick={() => switchModule("documents")}><ClipboardCheck size={17} />Documentos <em>{repository.documents.length}</em></button></nav>
    <section className="siga-workspace-grid">
      <section className="siga-form-panel"><button type="button" className="siga-panel-trigger" onClick={() => { setEditing(null); setFormOpen((current) => !current); }}><span><small>{isRecords ? "Cadastro" : "Documentos"}</small><strong>{editing ? (isRecords ? "Editar registro" : "Editar documento") : isRecords ? "Novo registro" : "Novo documento"}</strong></span><ChevronDown className={formOpen ? "open" : ""} size={19} /></button>{formOpen ? isRecords ? <RecordForm initial={recordForm} onSave={saveRecord} onCancel={closeForm} /> : <DocumentForm initial={documentForm} onSave={saveDocument} onCancel={closeForm} /> : <p className="siga-form-hint">{isRecords ? "Abra o cadastro para incluir ou editar contratos e processos, mantendo campos financeiros e de prazo." : "Abra o cadastro para criar ou editar ofícios, memorandos e despachos com modelos, vínculos e prazos."}</p>}</section>
      {isRecords ? <section className="siga-list-panel"><div className="siga-list-heading"><div><p>Acompanhamento</p><h2>Relatório e alertas</h2></div><span>{filteredRecords.length} de {repository.records.length} registros</span></div><AlertStrip items={recordAlerts} emptyTitle="Prazos em dia" emptyDescription="Nenhum vencimento dentro da janela configurada." /><div className="siga-filters records"><span><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Número, objeto, fornecedor, setor..." /></span><select aria-label="Filtrar por tipo" value={kind} onChange={(event) => setKind(event.target.value)}><option>Todos</option><option>Contrato</option><option>Processo</option></select><select aria-label="Filtrar por situação" value={status} onChange={(event) => setStatus(event.target.value)}><option>Todos</option><option>Em dia</option><option>A vencer</option><option>Vencido</option><option>Vigente</option><option>Em andamento</option></select><select aria-label="Filtrar por setor" value={department} onChange={(event) => setDepartment(event.target.value)}><option>Todos</option>{departments.map((item) => <option key={item}>{item}</option>)}</select></div><div className="siga-record-list">{filteredRecords.map((record) => <RecordAccordion key={record.id} record={record} expanded={expanded === record.id} paymentOpen={paymentRecordId === record.id} onToggle={() => setExpanded(expanded === record.id ? "" : record.id)} onTogglePayment={() => setPaymentRecordId(paymentRecordId === record.id ? "" : record.id)} onEdit={() => { setEditing({ kind: "record", data: record }); setFormOpen(true); }} onDelete={() => setDeleteTarget({ kind: "registro", id: record.id, label: `${record.kind} ${record.number}` })} onPayment={(paymentDate, amount, notes, nextPaymentDueDate) => { const result = repository.createPayment({ recordId: record.id, paymentDate, amount, notes, nextPaymentDueDate }); if (!result.error) { setPaymentRecordId(""); setNotice("Baixa registrada na simulação local."); } return result.error; }} onRemovePayment={(paymentId) => { repository.deletePayment(paymentId); setNotice("Baixa removida da simulação local."); }} />)}</div></section> : <section className="siga-list-panel"><div className="siga-list-heading"><div><p>Controle documental</p><h2>Ofícios, memorandos e despachos</h2></div><span>{filteredDocuments.length} de {repository.documents.length} documentos</span></div><section className="siga-document-kpis"><Metric label="Documentos" value={repository.documents.length} tone="neutral" /><Metric label="Em aberto" value={openDocuments.length} tone="good" /><Metric label="A vencer" value={repository.documents.filter((document) => documentAlert(document) === "A vencer").length} tone="warning" /><Metric label="Vencidos" value={repository.documents.filter((document) => documentAlert(document) === "Vencido").length} tone="danger" /><Metric label="Modelos" value={6} tone="money" /></section><AlertStrip items={documentAlerts} emptyTitle="Documentos em dia" emptyDescription="Nenhuma resposta vencendo dentro da janela padrão." /><div className="siga-filters"><span><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Número, assunto, setor, vínculo..." /></span><select aria-label="Filtrar por tipo" value={kind} onChange={(event) => setKind(event.target.value)}><option>Todos</option><option>Ofício</option><option>Memorando</option><option>Despacho</option></select><select aria-label="Filtrar por situação" value={status} onChange={(event) => setStatus(event.target.value)}><option>Todos</option><option>Em dia</option><option>A vencer</option><option>Vencido</option><option>Em elaboração</option><option>Aguardando resposta</option></select></div><div className="siga-record-list">{filteredDocuments.map((document) => <DocumentAccordion key={document.id} document={document} expanded={expanded === document.id} onToggle={() => setExpanded(expanded === document.id ? "" : document.id)} onEdit={() => { setEditing({ kind: "document", data: document }); setFormOpen(true); }} onDelete={() => setDeleteTarget({ kind: "documento", id: document.id, label: `${document.kind} ${document.number}` })} />)}</div></section>}
    </section>
  </section>;

  return <>
    {securityOpen ? <SecurityPanel user={user} onClose={() => setSecurityOpen(false)} onSaved={() => { if (user.id) repository.changePassword(user.id); onPasswordChanged?.(); setSecurityOpen(false); setNotice("Senha atualizada na simulação local."); }} /> : null}
    {deleteTarget ? <DeleteConfirmation target={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} /> : null}
    <SemedOperationalShell user={user} activeView={activeView} onViewChange={changeView} onPassword={() => setSecurityOpen(true)} onLogout={onLogout} logo={logo}>
      {notice ? <p className="siga-workspace-notice">{notice}<button type="button" onClick={() => setNotice("")}>×</button></p> : null}
      {activeView === "welcome" ? <WelcomeCenter user={user} onStart={() => changeView("home")} /> : null}
      {activeView === "home" ? <HomeDashboard records={repository.records} documents={repository.documents} onViewChange={changeView} /> : null}
      {activeView === "governance" ? <GovernancePage onNavigate={changeView} /> : null}
      {activeView === "masters" ? <MastersPage /> : null}
      {activeView === "records" || activeView === "documents" ? localContent : null}
      {!["welcome", "home", "governance", "masters", "records", "documents"].includes(activeView) ? <ModulePlaceholder view={activeView} onHome={() => changeView("home")} /> : null}
    </SemedOperationalShell>
  </>;
}

function RecordAccordion({ record, expanded, paymentOpen, onToggle, onTogglePayment, onEdit, onDelete, onPayment, onRemovePayment }: { record: SemedRecord; expanded: boolean; paymentOpen: boolean; onToggle: () => void; onTogglePayment: () => void; onEdit: () => void; onDelete: () => void; onPayment: (date: string, amount: number, notes: string, dueDate: string) => string | null; onRemovePayment: (id: string) => void }) {
  return <article className={`siga-record-row ${expanded ? "expanded" : ""}`}><button type="button" className="siga-record-summary" onClick={onToggle}><span className="siga-record-main"><small>{record.kind}</small><strong>{record.number}</strong><em>{record.object}</em></span><span className="siga-record-meta"><AlertTag value={recordAlert(record)} /><ChevronDown className={expanded ? "open" : ""} size={18} /></span></button>{expanded ? <div className="siga-record-detail"><div className="siga-detail-grid"><span><small>Tipo</small>{record.kind}</span><span><small>Situação</small>{record.status}</span><span><small>Vencimento</small>{displayDate(record.endDate)}</span><span><small>Alerta</small>{recordAlert(record)}</span><span><small>Fornecedor, interessado ou setor</small>{record.party || "—"}</span><span><small>Setor</small>{record.department || "—"}</span><span><small>Responsável</small>{record.responsible || "—"}</span><span><small>Controle financeiro</small>{record.financialCategory}</span><span className="siga-detail-wide"><small>Objeto ou assunto</small>{record.object}</span></div>{record.kind === "Contrato" ? <><div className="siga-finance-detail"><div><small>Valor</small><strong>{money.format(record.amount)}</strong></div><div><small>Já pago</small><strong>{money.format(record.paidAmount)}</strong></div><div><small>Saldo a pagar</small><strong>{money.format(record.balanceAmount)}</strong></div><button type="button" onClick={onTogglePayment}>Registrar baixa</button></div>{paymentOpen ? <PaymentForm record={record} onClose={onTogglePayment} onSave={onPayment} /> : null}<div className="siga-payment-history"><div><small>Histórico de pagamentos</small><strong>{record.payments.length ? `${record.payments.length} baixa${record.payments.length > 1 ? "s" : ""} local${record.payments.length > 1 ? "is" : ""}` : "Nenhuma baixa registrada"}</strong></div>{record.payments.length ? <ul>{record.payments.map((payment) => <li key={payment.id}><span><strong>{money.format(payment.amount)}</strong><small>{displayDate(payment.paymentDate)}</small></span><em>{payment.notes}</em><button type="button" onClick={() => onRemovePayment(payment.id)}>Remover</button></li>)}</ul> : <p>Registre uma baixa para visualizar o histórico local deste contrato.</p>}</div></> : null}<p className="siga-notes"><small>Observações</small>{record.notes || "—"}</p><div className="siga-row-actions"><button type="button" onClick={onEdit}><Pencil size={15} />Editar</button><button type="button" className="danger" onClick={onDelete}><Trash2 size={15} />Excluir</button></div></div> : null}</article>;
}

function DocumentAccordion({ document, expanded, onToggle, onEdit, onDelete }: { document: SemedDocument; expanded: boolean; onToggle: () => void; onEdit: () => void; onDelete: () => void }) {
  return <article className={`siga-record-row ${expanded ? "expanded" : ""}`}><button type="button" className="siga-record-summary" onClick={onToggle}><span className="siga-record-main"><small>{document.kind}</small><strong>{document.number}</strong><em>{document.subject}</em></span><span className="siga-record-meta"><AlertTag value={documentAlert(document)} /><ChevronDown className={expanded ? "open" : ""} size={18} /></span></button>{expanded ? <div className="siga-record-detail"><div className="siga-detail-grid"><span><small>Tipo</small>{document.kind}</span><span><small>Situação</small>{document.status}</span><span><small>Data</small>{displayDate(document.documentDate)}</span><span><small>Prazo</small>{displayDate(document.dueDate)}</span><span><small>Modelo</small>{document.templateKey || "—"}</span><span><small>Destino</small>{document.destination || "—"}</span><span><small>Destinatário</small>{document.recipient || "—"}</span><span><small>Vínculo</small>{document.relatedRecord || "—"}</span><span className="siga-detail-wide"><small>Assunto</small>{document.subject}</span></div><div className="siga-document-preview"><div><small>Prévia</small><strong>Texto base do documento</strong></div><pre>{`ESTADO DO MARANHÃO\nPREFEITURA MUNICIPAL DE PAÇO DO LUMIAR\nSECRETARIA MUNICIPAL DE EDUCAÇÃO\n\n${document.kind.toUpperCase()} Nº ${document.number} — ${document.responsible}\n\nDESTINO: ${document.destination}\nASSUNTO: ${document.subject}\nREFERÊNCIA: ${document.relatedRecord}\n\n${document.summary}\n\n${document.notes}`}</pre></div><div className="siga-row-actions"><button type="button" onClick={onEdit}><Pencil size={15} />Editar</button><button type="button" className="danger" onClick={onDelete}><Trash2 size={15} />Excluir</button></div></div> : null}</article>;
}
