import React, { FormEvent, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, ChevronDown, ClipboardCheck, FileBarChart2, FileText, Pencil, Plus, Printer, Search, UserRoundPlus, UsersRound, WalletCards } from "lucide-react";
import {
  calculateHrFinancialTotals,
  SEMED_HR_ATTENDANCE_STATUSES,
  SEMED_HR_SERVER_STATUSES,
  SemedHrAttendanceInput,
  SemedHrAttendancePeriod,
  SemedHrAudit,
  SemedHrFinancialRecord,
  SemedHrFinancialRecordInput,
  SemedHrServer,
  SemedHrServerInput,
  SemedLocalAccessUser,
  SemedNutritionSchool,
} from "./sigaLocalStore";
import "./siga-hr.css";

type HrSection = "servers" | "financial" | "payslip" | "attendance" | "reports";
type Notice = { tone: "success" | "error"; text: string } | null;

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const monthName = (value: string) => value ? new Date(`${value}-01T12:00:00`).toLocaleDateString("pt-BR", { month: "long", year: "numeric" }) : "—";
const initials = (name: string) => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

const sectionLabels: Record<HrSection, string> = {
  servers: "Cadastro de Servidores",
  financial: "Ficha Financeira",
  payslip: "Holerite",
  attendance: "Frequência e movimento",
  reports: "Relatórios",
};

function ServerForm({ initial, schools, onSave, onCancel }: { initial?: SemedHrServer; schools: SemedNutritionSchool[]; onSave: (input: SemedHrServerInput) => void; onCancel: () => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave({
      registration: String(form.get("registration") ?? ""), displayName: String(form.get("displayName") ?? ""), cpf: String(form.get("cpf") ?? ""),
      jobTitle: String(form.get("jobTitle") ?? ""), schoolUnitId: String(form.get("schoolUnitId") ?? ""), status: String(form.get("status") ?? "Ativo") as SemedHrServerInput["status"],
      admissionDate: String(form.get("admissionDate") ?? ""), hasPhone: form.get("hasPhone") === "on", hasEmail: form.get("hasEmail") === "on", hasIc: form.get("hasIc") === "on",
      baseSalary: Number(form.get("baseSalary") ?? 0), id: initial?.id,
    });
  }
  return <form className="siga-data-form siga-hr-form" onSubmit={submit}>
    <div className="siga-form-heading"><h2>{initial ? "Editar servidor" : "Novo servidor"}</h2><span>Dados demonstrativos locais; campos pessoais são minimizados nesta simulação.</span></div>
    <div className="siga-form-two"><label>Matrícula<input required name="registration" defaultValue={initial?.registration} placeholder="Ex.: RH-DEMO-004" /></label><label>Nome completo<input required name="displayName" defaultValue={initial?.displayName} placeholder="Servidor demonstrativo" /></label></div>
    <div className="siga-form-two"><label>CPF demonstrativo<input name="cpf" inputMode="numeric" maxLength={11} defaultValue={initial?.cpf} placeholder="Opcional — 11 dígitos" /></label><label>Cargo<input required name="jobTitle" defaultValue={initial?.jobTitle} placeholder="Cargo demonstrativo" /></label></div>
    <div className="siga-form-two"><label>Unidade<select required name="schoolUnitId" defaultValue={initial?.schoolUnitId ?? ""}><option value="">Selecione</option>{schools.map((school) => <option key={school.id} value={school.id}>{school.name}</option>)}</select></label><label>Situação<select name="status" defaultValue={initial?.status ?? "Ativo"}>{SEMED_HR_SERVER_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label></div>
    <div className="siga-form-two"><label>Admissão<input name="admissionDate" type="date" defaultValue={initial?.admissionDate} /></label><label>Vencimento-base<input name="baseSalary" type="number" min="0" step="0.01" defaultValue={initial?.baseSalary ?? 0} /></label></div>
    <fieldset className="siga-hr-check-row"><legend>Completude cadastral</legend><label><input name="hasPhone" type="checkbox" defaultChecked={initial?.hasPhone} />Telefone informado</label><label><input name="hasEmail" type="checkbox" defaultChecked={initial?.hasEmail} />E-mail informado</label><label><input name="hasIc" type="checkbox" defaultChecked={initial?.hasIc} />IC informado</label></fieldset>
    <div className="siga-form-actions"><button type="button" className="siga-secondary-button" onClick={onCancel}>Cancelar</button><button className="siga-primary-button" type="submit">{initial ? "Salvar alterações" : "Cadastrar servidor"}</button></div>
  </form>;
}

function FinancialForm({ servers, onSave, onCancel }: { servers: SemedHrServer[]; onSave: (input: SemedHrFinancialRecordInput) => void; onCancel: () => void }) {
  const [items, setItems] = useState([{ description: "Vencimento demonstrativo", kind: "Provento" as const, amount: 0 }]);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave({ serverId: String(form.get("serverId") ?? ""), referenceMonth: String(form.get("referenceMonth") ?? ""), notes: String(form.get("notes") ?? ""), items });
  }
  return <form className="siga-data-form siga-hr-form" onSubmit={submit}>
    <div className="siga-form-heading"><h2>Registrar ficha financeira</h2><span>Composição local por competência, proventos e descontos demonstrativos.</span></div>
    <div className="siga-form-two"><label>Servidor<select required name="serverId" defaultValue=""><option value="">Selecione</option>{servers.map((server) => <option key={server.id} value={server.id}>{server.registration} — {server.displayName}</option>)}</select></label><label>Competência<input required name="referenceMonth" type="month" defaultValue="2026-08" /></label></div>
    <div className="siga-hr-financial-items"><div><span>Descrição</span><span>Tipo</span><span>Valor</span><span /></div>{items.map((item, index) => <div key={`${item.description}-${index}`}><input value={item.description} onChange={(event) => setItems((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, description: event.target.value } : row))} /><select value={item.kind} onChange={(event) => setItems((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, kind: event.target.value as typeof row.kind } : row))}><option>Provento</option><option>Desconto</option></select><input type="number" min="0" step="0.01" value={item.amount} onChange={(event) => setItems((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, amount: Number(event.target.value) } : row))} /><button type="button" aria-label="Remover lançamento" onClick={() => setItems((current) => current.filter((_, rowIndex) => rowIndex !== index))}>×</button></div>)}</div>
    <button type="button" className="siga-hr-inline-action" onClick={() => setItems((current) => [...current, { description: "", kind: "Provento", amount: 0 }])}><Plus size={15} />Adicionar lançamento</button>
    <label>Observações<textarea name="notes" rows={2} placeholder="Registro local demonstrativo" /></label>
    <div className="siga-form-actions"><button type="button" className="siga-secondary-button" onClick={onCancel}>Cancelar</button><button className="siga-primary-button" type="submit">Salvar ficha</button></div>
  </form>;
}

function AttendanceForm({ servers, schools, onSave, onCancel }: { servers: SemedHrServer[]; schools: SemedNutritionSchool[]; onSave: (input: SemedHrAttendanceInput) => void; onCancel: () => void }) {
  const [selectedIds, setSelectedIds] = useState<string[]>(servers.slice(0, 1).map((server) => server.id));
  const [plannedDays, setPlannedDays] = useState(22);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave({ code: String(form.get("code") ?? ""), referenceMonth: String(form.get("referenceMonth") ?? ""), schoolUnitId: String(form.get("schoolUnitId") ?? ""), plannedDays, calendarEvents: [], entries: selectedIds.map((serverId) => ({ serverId, workedDays: plannedDays, absences: 0, notes: "" })), status: String(form.get("status") ?? "Em preparação") as SemedHrAttendanceInput["status"], returnReason: "" });
  }
  return <form className="siga-data-form siga-hr-form" onSubmit={submit}>
    <div className="siga-form-heading"><h2>Nova competência de frequência</h2><span>Calendário, servidor, ocorrência e encaminhamento são tratados como fluxo local.</span></div>
    <div className="siga-form-two"><label>Código<input required name="code" placeholder="Ex.: SIGA-FREQ-DEMO-002" /></label><label>Competência<input required name="referenceMonth" type="month" defaultValue="2026-08" /></label></div>
    <div className="siga-form-two"><label>Unidade<select required name="schoolUnitId" defaultValue=""><option value="">Selecione</option>{schools.map((school) => <option key={school.id} value={school.id}>{school.name}</option>)}</select></label><label>Dias previstos<input type="number" min="1" max="31" value={plannedDays} onChange={(event) => setPlannedDays(Number(event.target.value) || 0)} /></label></div>
    <label>Situação<select name="status" defaultValue="Em preparação">{SEMED_HR_ATTENDANCE_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label>
    <fieldset className="siga-hr-server-picker"><legend>Servidores incluídos</legend>{servers.map((server) => <label key={server.id}><input type="checkbox" checked={selectedIds.includes(server.id)} onChange={(event) => setSelectedIds((current) => event.target.checked ? [...current, server.id] : current.filter((id) => id !== server.id))} />{server.registration} — {server.displayName}</label>)}</fieldset>
    <div className="siga-form-actions"><button type="button" className="siga-secondary-button" onClick={onCancel}>Cancelar</button><button className="siga-primary-button" type="submit">Salvar competência</button></div>
  </form>;
}

export default function SemedHumanResourcesPage({ currentUser, schools, servers, financialRecords, attendancePeriods, auditLog, canWriteServers, canWriteFinancial, canWriteAttendance, onSaveServer, onSaveFinancial, onSaveAttendance, onNotify }: {
  currentUser: SemedLocalAccessUser; schools: SemedNutritionSchool[]; servers: SemedHrServer[]; financialRecords: SemedHrFinancialRecord[]; attendancePeriods: SemedHrAttendancePeriod[]; auditLog: SemedHrAudit[];
  canWriteServers: boolean; canWriteFinancial: boolean; canWriteAttendance: boolean;
  onSaveServer: (input: SemedHrServerInput) => { error: string | null; server: SemedHrServer | null };
  onSaveFinancial: (input: SemedHrFinancialRecordInput) => { error: string | null; record: SemedHrFinancialRecord | null };
  onSaveAttendance: (input: SemedHrAttendanceInput) => { error: string | null; period: SemedHrAttendancePeriod | null };
  onNotify: (message: string) => void;
}) {
  const [section, setSection] = useState<HrSection>("servers");
  const [query, setQuery] = useState(""); const [serverStatus, setServerStatus] = useState("Todos"); const [schoolId, setSchoolId] = useState("Todos");
  const [form, setForm] = useState<"server" | "financial" | "attendance" | "">(""); const [editingServer, setEditingServer] = useState<SemedHrServer | undefined>(); const [expanded, setExpanded] = useState("");
  const filteredServers = useMemo(() => servers.filter((server) => `${server.registration} ${server.displayName} ${server.jobTitle}`.toLowerCase().includes(query.toLowerCase()) && (serverStatus === "Todos" || server.status === serverStatus) && (schoolId === "Todos" || server.schoolUnitId === schoolId)), [query, schoolId, serverStatus, servers]);
  const activeServers = servers.filter((server) => server.status === "Ativo").length;
  const pendingServers = servers.filter((server) => server.status === "Aguardando revisão").length;
  const financialForQuery = financialRecords.filter((record) => record.referenceMonth.includes(query) || servers.find((server) => server.id === record.serverId)?.displayName.toLowerCase().includes(query.toLowerCase()));
  const saveServer = (input: SemedHrServerInput) => { const result = onSaveServer(input); if (result.error) return onNotify(result.error); setForm(""); setEditingServer(undefined); onNotify("Servidor demonstrativo salvo na simulação local."); };
  const saveFinancial = (input: SemedHrFinancialRecordInput) => { const result = onSaveFinancial(input); if (result.error) return onNotify(result.error); setForm(""); onNotify("Ficha financeira local registrada."); };
  const saveAttendance = (input: SemedHrAttendanceInput) => { const result = onSaveAttendance(input); if (result.error) return onNotify(result.error); setForm(""); onNotify("Competência de frequência salva na simulação local."); };
  const schoolName = (id: string) => schools.find((school) => school.id === id)?.name ?? "Unidade não identificada";

  return <section className="siga-module-surface siga-hr-page">
    <header className="siga-hr-header"><div><p className="siga-kicker">Gestão de pessoas</p><h1>Recursos Humanos</h1><span>Consultas, competências e registros funcionais demonstrativos por perfil.</span></div><div className="siga-hr-header-meta"><span><UsersRound size={17} />{activeServers} servidor(es) ativo(s)</span><small>Perfil atual: {currentUser.profile}</small></div></header>
    <section className="siga-summary-grid"><article className="siga-metric-card neutral"><span>Servidores</span><strong>{servers.length}</strong></article><article className="siga-metric-card good"><span>Ativos</span><strong>{activeServers}</strong></article><article className="siga-metric-card warning"><span>Revisão cadastral</span><strong>{pendingServers}</strong></article><article className="siga-metric-card money"><span>Competências</span><strong>{attendancePeriods.length}</strong></article></section>
    <nav className="siga-module-tabs siga-hr-tabs" aria-label="Áreas de Recursos Humanos">{(Object.keys(sectionLabels) as HrSection[]).map((key) => <button key={key} className={section === key ? "active" : ""} onClick={() => { setSection(key); setForm(""); }} type="button">{key === "servers" ? <UsersRound size={16} /> : key === "financial" ? <WalletCards size={16} /> : key === "payslip" ? <FileText size={16} /> : key === "attendance" ? <CalendarDays size={16} /> : <FileBarChart2 size={16} />}{sectionLabels[key]}</button>)}</nav>
    {section === "servers" ? <>
      <section className="siga-hr-toolbar"><span><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Matrícula, servidor ou cargo..." /></span><select value={serverStatus} onChange={(event) => setServerStatus(event.target.value)}><option>Todos</option>{SEMED_HR_SERVER_STATUSES.map((status) => <option key={status}>{status}</option>)}</select><select value={schoolId} onChange={(event) => setSchoolId(event.target.value)}><option value="Todos">Todas as unidades</option>{schools.map((school) => <option key={school.id} value={school.id}>{school.name}</option>)}</select>{canWriteServers ? <button className="siga-primary-button" type="button" onClick={() => { setEditingServer(undefined); setForm(form === "server" ? "" : "server"); }}><UserRoundPlus size={16} />Novo servidor</button> : null}</section>
      {form === "server" ? <ServerForm initial={editingServer} schools={schools} onSave={saveServer} onCancel={() => { setForm(""); setEditingServer(undefined); }} /> : null}
      <section className="siga-list-panel"><div className="siga-list-heading"><div><p>Base funcional</p><h2>Cadastro de Servidores</h2></div><span>{filteredServers.length} de {servers.length} registros</span></div><div className="siga-hr-server-list">{filteredServers.map((server) => <article className={`siga-hr-server-row ${expanded === server.id ? "expanded" : ""}`} key={server.id}><button type="button" className="siga-hr-server-main" onClick={() => setExpanded(expanded === server.id ? "" : server.id)}><span className="siga-hr-avatar">{initials(server.displayName)}</span><span><strong>{server.displayName}</strong><small>{server.registration} · {server.jobTitle}</small></span><em className={`siga-hr-status ${server.status === "Ativo" ? "good" : server.status === "Aguardando revisão" ? "warning" : "neutral"}`}>{server.status}</em><ChevronDown size={18} /></button>{expanded === server.id ? <div className="siga-hr-server-detail"><dl><div><dt>Unidade</dt><dd>{schoolName(server.schoolUnitId)}</dd></div><div><dt>Admissão</dt><dd>{server.admissionDate ? new Date(`${server.admissionDate}T12:00:00`).toLocaleDateString("pt-BR") : "—"}</dd></div><div><dt>Vencimento-base</dt><dd>{money.format(server.baseSalary)}</dd></div><div><dt>Completude</dt><dd>{[server.hasPhone && "telefone", server.hasEmail && "e-mail", server.hasIc && "IC"].filter(Boolean).join(" · ") || "pendente"}</dd></div></dl>{canWriteServers ? <button type="button" className="siga-secondary-button" onClick={() => { setEditingServer(server); setForm("server"); }}><Pencil size={15} />Editar cadastro</button> : null}</div> : null}</article>)}</div></section>
    </> : null}
    {section === "financial" ? <><section className="siga-hr-action-bar"><div><p>Competência financeira</p><h2>Ficha Financeira</h2><span>Proventos, descontos e composição local por servidor.</span></div>{canWriteFinancial ? <button type="button" className="siga-primary-button" onClick={() => setForm(form === "financial" ? "" : "financial")}><Plus size={16} />Nova ficha</button> : null}</section>{form === "financial" ? <FinancialForm servers={servers} onSave={saveFinancial} onCancel={() => setForm("")} /> : null}<section className="siga-hr-financial-grid">{financialForQuery.map((record) => { const server = servers.find((item) => item.id === record.serverId); const totals = calculateHrFinancialTotals(record); return <article key={record.id}><span>{monthName(record.referenceMonth)}</span><strong>{server?.displayName ?? "Servidor demonstrativo"}</strong><dl><div><dt>Proventos</dt><dd>{money.format(totals.earnings)}</dd></div><div><dt>Descontos</dt><dd>{money.format(totals.discounts)}</dd></div><div><dt>Líquido</dt><dd>{money.format(totals.net)}</dd></div></dl></article>; })}</section></> : null}
    {section === "payslip" ? <section className="siga-list-panel"><div className="siga-list-heading"><div><p>Comprovante local</p><h2>Holerite</h2></div><button type="button" className="siga-secondary-button" onClick={() => window.print()}><Printer size={15} />Imprimir consulta</button></div><p className="siga-hr-caption">A impressão utiliza apenas registros demonstrativos da simulação local.</p><div className="siga-hr-payslip-list">{financialRecords.map((record) => { const server = servers.find((item) => item.id === record.serverId); const totals = calculateHrFinancialTotals(record); return <article key={record.id}><div><span>{server?.registration}</span><strong>{server?.displayName}</strong><small>{monthName(record.referenceMonth)}</small></div><div><span>Valor líquido</span><strong>{money.format(totals.net)}</strong></div><button type="button" onClick={() => window.print()}><Printer size={16} />Visualizar</button></article>; })}</div></section> : null}
    {section === "attendance" ? <><section className="siga-hr-action-bar"><div><p>Competência mensal</p><h2>Frequência e movimento</h2><span>Calendário, dias previstos e encaminhamento da rotina demonstrativa.</span></div>{canWriteAttendance ? <button type="button" className="siga-primary-button" onClick={() => setForm(form === "attendance" ? "" : "attendance")}><ClipboardCheck size={16} />Nova competência</button> : null}</section>{form === "attendance" ? <AttendanceForm servers={servers.filter((server) => server.status !== "Inativo")} schools={schools} onSave={saveAttendance} onCancel={() => setForm("")} /> : null}<div className="siga-hr-attendance-list">{attendancePeriods.map((period) => <article key={period.id}><div><span>{period.code}</span><strong>{monthName(period.referenceMonth)}</strong><small>{schoolName(period.schoolUnitId)} · {period.entries.length} servidor(es)</small></div><div><span>Dias previstos</span><strong>{period.plannedDays}</strong></div><em className={period.status === "Enviada ao RH" ? "good" : period.status === "Devolvida para correção" ? "danger" : "warning"}>{period.status}</em></article>)}</div></> : null}
    {section === "reports" ? <section className="siga-hr-report-grid"><article><span>Visão gerencial</span><strong>{activeServers} servidor(es) ativo(s)</strong><p>Cadastros, situação e completude organizados por unidade.</p></article><article><span>Folhas importadas</span><strong>{financialRecords.length} competência(s)</strong><p>Consulta local por competência e composição financeira.</p></article><article><span>Frequência</span><strong>{attendancePeriods.filter((period) => period.status === "Enviada ao RH").length} enviada(s)</strong><p>Competências com acompanhamento de encaminhamento.</p></article><section className="siga-list-panel"><div className="siga-list-heading"><div><p>Auditoria local</p><h2>Histórico de Recursos Humanos</h2></div><span>{auditLog.length} evento(s)</span></div><div className="siga-hr-audit-list">{auditLog.length ? auditLog.map((entry) => <article key={entry.id}><CheckCircle2 size={16} /><span><strong>{entry.summary}</strong><small>{new Date(entry.createdAt).toLocaleString("pt-BR")}</small></span></article>) : <p className="siga-empty-state">Nenhuma ação de Recursos Humanos foi registrada nesta simulação.</p>}</div></section></section> : null}
  </section>;
}
