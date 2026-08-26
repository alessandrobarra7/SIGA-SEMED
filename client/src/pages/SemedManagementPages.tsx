import {
  Archive,
  BellRing,
  BookOpen,
  Building2,
  CalendarCheck2,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileBarChart2,
  FileText,
  Filter,
  FolderOpen,
  GraduationCap,
  LibraryBig,
  MapPin,
  Plus,
  School,
  Search,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import React, { FormEvent, useMemo, useState } from "react";
import type { ShellView } from "./SemedOperationalShell";

export type GovernanceTab = "tasks" | "alerts" | "reports" | "attachments" | "approvals";
type MasterTab = "schools" | "nuclei" | "buildings" | "library";
type MasterRow = { title: string; code: string; context: string; status: string; tag: string };

const governanceTabs: { id: GovernanceTab; label: string; icon: typeof ClipboardCheck }[] = [
  { id: "tasks", label: "Minhas tarefas", icon: ClipboardCheck },
  { id: "alerts", label: "Alertas", icon: BellRing },
  { id: "reports", label: "Relatórios", icon: FileBarChart2 },
  { id: "attachments", label: "Anexos", icon: FolderOpen },
  { id: "approvals", label: "Aprovações", icon: ShieldCheck },
];

const taskData = [
  { title: "Revisar prazos de contratos", section: "Contratos", due: "Prioridade alta", status: "Em andamento", tone: "orange" },
  { title: "Conferir pendências documentais", section: "Documentos", due: "Para esta semana", status: "Aguardando", tone: "navy" },
  { title: "Atualizar acompanhamento de unidades", section: "Cadastros", due: "Planejado", status: "Programada", tone: "green" },
];

const attachmentData = [
  { id: "ann-1", name: "Plano de acompanhamento semanal", context: "Gestão · Rotina", type: "Registro local" },
  { id: "ann-2", name: "Síntese de contratos ativos", context: "Contratos · Acompanhamento", type: "Relatório local" },
  { id: "ann-3", name: "Checklist de documentos", context: "Documentos · Controle", type: "Modelo local" },
];

const approvalData = [
  { id: "apr-1", title: "Conferência de documento", context: "Documentos · Encaminhamento local", requester: "Equipe administrativa" },
  { id: "apr-2", title: "Validação de atualização cadastral", context: "Cadastros · Unidade demonstrativa", requester: "Coordenação técnica" },
];

const masterTabs: { id: MasterTab; label: string; description: string; icon: typeof School }[] = [
  { id: "schools", label: "Escolas", description: "Unidades educacionais da rede", icon: School },
  { id: "nuclei", label: "Núcleos", description: "Atividades complementares", icon: UsersRound },
  { id: "buildings", label: "Prédios Administrativos", description: "Estruturas de apoio", icon: Building2 },
  { id: "library", label: "Biblioteca", description: "Acervo e espaços de leitura", icon: LibraryBig },
];

const masterRows: Record<MasterTab, MasterRow[]> = {
  schools: [
    { title: "Unidade Municipal Horizonte", code: "ESC-001", context: "Ensino Fundamental · Rede urbana", status: "Ativa", tag: "Unidade escolar" },
    { title: "Centro Municipal do Saber", code: "ESC-002", context: "Educação Infantil · Rede urbana", status: "Ativa", tag: "Unidade escolar" },
    { title: "Escola Comunitária Caminhos", code: "ESC-003", context: "Educação Infantil · Convênio", status: "Em atualização", tag: "Unidade escolar" },
  ],
  nuclei: [
    { title: "Núcleo Pedagógico Centro", code: "EP-001", context: "Atividades de reforço e cultura", status: "Ativo", tag: "Pedagógico" },
    { title: "Núcleo Esportivo Norte", code: "EP-002", context: "Práticas esportivas e convivência", status: "Ativo", tag: "Esportivo" },
    { title: "Núcleo Pleno Comunitário", code: "EP-003", context: "Atividades integradas", status: "Planejamento", tag: "Pleno" },
  ],
  buildings: [
    { title: "Sede Administrativa", code: "PAD-001", context: "Coordenações e setores técnicos", status: "Em uso", tag: "Administrativo" },
    { title: "Centro de Formação", code: "PAD-002", context: "Capacitação e encontros", status: "Em uso", tag: "Formação" },
    { title: "Almoxarifado de Apoio", code: "PAD-003", context: "Apoio logístico da SEMED", status: "Monitorado", tag: "Logística" },
  ],
  library: [
    { title: "Espaço de Leitura Central", code: "BIB-001", context: "Acervo geral e mediação", status: "Ativo", tag: "Biblioteca" },
    { title: "Biblioteca Comunitária", code: "BIB-002", context: "Leitura e ações culturais", status: "Ativa", tag: "Biblioteca" },
    { title: "Acervo Itinerante", code: "BIB-003", context: "Circulação entre unidades", status: "Em organização", tag: "Acervo" },
  ],
};

function SectionHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <header className="siga-page-heading"><div><p className="siga-kicker">{eyebrow}</p><h1>{title}</h1><span>{description}</span></div>{action}</header>;
}

function isPositiveStatus(status: string) {
  return ["Ativa", "Ativo", "Em uso"].includes(status);
}

export function GovernancePage({ onNavigate, initialTab = "tasks", readOnly = false }: { onNavigate: (view: ShellView) => void; initialTab?: GovernanceTab; readOnly?: boolean }) {
  const [tab, setTab] = useState<GovernanceTab>(initialTab);
  const [completedTask, setCompletedTask] = useState<string | null>(null);
  const [filter, setFilter] = useState("Todas");
  const [reportArea, setReportArea] = useState("Contratos");
  const [reportReady, setReportReady] = useState(false);
  const [openedAttachment, setOpenedAttachment] = useState<string | null>(null);
  const [approvalState, setApprovalState] = useState<Record<string, "approved" | "returned">>({});
  const visibleTasks = taskData.filter((item) => filter === "Todas" || item.section === filter);
  const pendingApprovals = approvalData.filter((item) => !approvalState[item.id]);

  return <section className="siga-management-page">
    <SectionHeading eyebrow="Central de gestão" title="Gestão" description="Atividades, alertas, relatórios, anexos e aprovações reunidos em uma visão administrativa local." action={<button className="siga-page-outline" type="button" onClick={() => onNavigate("home")}><CalendarCheck2 size={16} aria-hidden="true" />Voltar ao Início</button>} />
    <div className="siga-context-tabs" role="tablist" aria-label="Áreas de gestão">{governanceTabs.map((item) => { const Icon = item.icon; return <button className={tab === item.id ? "active" : ""} key={item.id} role="tab" type="button" onClick={() => setTab(item.id)}><Icon size={16} aria-hidden="true" />{item.label}</button>; })}</div>

    {tab === "tasks" ? <div className="siga-governance-layout">
      <section className="siga-governance-main-card"><div className="siga-card-heading"><div><p>Organização diária</p><h2>Minhas tarefas</h2></div>{!readOnly ? <button className="siga-icon-text-button" type="button"><Plus size={14} aria-hidden="true" />Nova tarefa</button> : null}</div><div className="siga-governance-toolbar"><span><Filter size={15} aria-hidden="true" />Filtrar por área</span><select value={filter} onChange={(event) => setFilter(event.target.value)}><option>Todas</option><option>Contratos</option><option>Documentos</option><option>Cadastros</option></select></div><div className="siga-task-list">{visibleTasks.map((task) => <article className={`siga-task-row ${task.tone}`} key={task.title}><button className={`siga-task-check ${completedTask === task.title ? "done" : ""}`} disabled={readOnly} type="button" aria-label={`Concluir ${task.title}`} onClick={() => setCompletedTask((current) => current === task.title ? null : task.title)}>{completedTask === task.title ? <CheckCircle2 size={15} aria-hidden="true" /> : null}</button><div><small>{task.section}</small><strong>{task.title}</strong><span>{task.due}</span></div><em>{completedTask === task.title ? "Concluída" : task.status}</em></article>)}</div></section>
      <aside className="siga-governance-side-card"><p className="siga-kicker">Próximo ciclo</p><h2>Agenda de acompanhamento</h2><div className="siga-deadline-row"><span>01</span><div><strong>Triagem de pendências</strong><small>Rotina administrativa local</small></div></div><div className="siga-deadline-row"><span>02</span><div><strong>Conferência de alertas</strong><small>Prazos e documentos em contexto</small></div></div><button type="button" onClick={() => onNavigate("documents")}>Abrir documentos <ChevronRight size={14} aria-hidden="true" /></button></aside>
    </div> : null}

    {tab === "alerts" ? <section className="siga-governance-grid"><article className="siga-info-state orange"><BellRing size={18} aria-hidden="true" /><div><strong>Alertas de prazo</strong><p>Contratos e documentos com acompanhamento ativo são apresentados na central local.</p></div><button type="button" onClick={() => onNavigate("records")}>Ver contratos</button></article><article className="siga-info-state green"><CheckCircle2 size={18} aria-hidden="true" /><div><strong>Operação organizada</strong><p>Não há novas pendências administrativas criadas nesta sessão demonstrativa.</p></div></article></section> : null}

    {tab === "reports" ? <section className="siga-report-workspace"><div className="siga-card-heading"><div><p>Visão consolidada</p><h2>Relatórios gerenciais</h2></div><FileBarChart2 size={21} aria-hidden="true" /></div><div className="siga-report-controls"><label>Área<select value={reportArea} onChange={(event) => { setReportArea(event.target.value); setReportReady(false); }}><option>Contratos</option><option>Documentos</option><option>Financeiro</option><option>Unidades</option></select></label><button type="button" onClick={() => setReportReady(true)}><FileText size={15} aria-hidden="true" />Preparar visão</button></div>{reportReady ? <div className="siga-report-result"><span>Resumo local</span><strong>{reportArea}</strong><p>Indicadores e pendências demonstrativas foram organizados para consulta neste contexto.</p><div><small>Filtro aplicado</small><b>Período atual</b></div><div><small>Situação</small><b>Em acompanhamento</b></div></div> : <div className="siga-report-hints"><span>Escolha uma área</span><span>Aplique a visão local</span><span>Consulte o resumo contextual</span></div>}</section> : null}

    {tab === "attachments" ? <section className="siga-attachment-panel"><div className="siga-card-heading"><div><p>Arquivos de trabalho</p><h2>Anexos administrativos</h2></div><Archive size={21} aria-hidden="true" /></div><div className="siga-attachment-list">{attachmentData.map((attachment) => <article key={attachment.id} className={openedAttachment === attachment.id ? "selected" : ""}><span><FileText size={17} aria-hidden="true" /></span><div><small>{attachment.context}</small><strong>{attachment.name}</strong><p>{attachment.type}</p></div><button type="button" onClick={() => setOpenedAttachment(attachment.id)}>{openedAttachment === attachment.id ? "Em consulta" : "Consultar"}</button></article>)}</div>{openedAttachment ? <p className="siga-inline-note">O anexo demonstrativo está em consulta local. Nenhum arquivo externo foi aberto, baixado ou transmitido.</p> : null}</section> : null}

    {tab === "approvals" ? <section className="siga-approval-workspace"><div className="siga-card-heading"><div><p>Decisões administrativas</p><h2>Aprovações</h2></div><ShieldCheck size={21} aria-hidden="true" /></div>{pendingApprovals.length ? <div className="siga-approval-list">{pendingApprovals.map((approval) => <article key={approval.id}><div><small>{approval.context}</small><strong>{approval.title}</strong><p>Solicitado por {approval.requester}</p></div>{!readOnly ? <div><button type="button" className="return" onClick={() => setApprovalState((current) => ({ ...current, [approval.id]: "returned" }))}>Devolver</button><button type="button" className="approve" onClick={() => setApprovalState((current) => ({ ...current, [approval.id]: "approved" }))}>Aprovar</button></div> : null}</article>)}</div> : <div className="siga-decision-summary"><CheckCircle2 size={21} aria-hidden="true" /><strong>Decisões desta sessão concluídas</strong><span>As solicitações demonstrativas foram tratadas somente no navegador.</span></div>}</section> : null}
  </section>;
}

export function MastersPage({ readOnly = false }: { readOnly?: boolean }) {
  const [tab, setTab] = useState<MasterTab>("schools");
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [newRows, setNewRows] = useState<Record<MasterTab, MasterRow[]>>({ schools: [], nuclei: [], buildings: [], library: [] });
  const current = masterTabs.find((item) => item.id === tab)!;
  const Icon = current.icon;
  const rows = useMemo(() => [...masterRows[tab], ...newRows[tab]].filter((row) => `${row.title} ${row.code} ${row.context}`.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR"))), [newRows, query, tab]);

  function addMasterRow(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") || "").trim();
    const context = String(data.get("context") || "").trim();
    if (!title || !context) return;
    const prefix = tab === "schools" ? "ESC" : tab === "nuclei" ? "EP" : tab === "buildings" ? "PAD" : "BIB";
    const row: MasterRow = { title, context, code: `${prefix}-LOC-${newRows[tab].length + 1}`, status: "Ativo", tag: current.label.slice(0, -1) || current.label };
    setNewRows((items) => ({ ...items, [tab]: [...items[tab], row] }));
    setFormOpen(false);
    setQuery("");
    event.currentTarget.reset();
  }

  return <section className="siga-management-page">
    <SectionHeading eyebrow="Cadastro geral" title="Cadastros" description="Estruturas institucionais organizadas para consulta, filtros e manutenção demonstrativa local." action={!readOnly ? <button className="siga-page-primary" type="button" onClick={() => setFormOpen((open) => !open)}><Plus size={16} aria-hidden="true" />{formOpen ? "Fechar cadastro" : "Novo cadastro"}</button> : undefined} />
    {formOpen ? <form className="siga-master-create-form" onSubmit={addMasterRow}><label>Nome do cadastro<input name="title" required placeholder={`Nome de ${current.label.toLocaleLowerCase("pt-BR")}`} /></label><label>Contexto<input name="context" required placeholder="Descrição local demonstrativa" /></label><div><span>O registro será criado apenas nesta sessão local.</span><button type="submit">Salvar cadastro</button></div></form> : null}
    <div className="siga-master-tabs">{masterTabs.map((item) => { const TabIcon = item.icon; return <button key={item.id} className={tab === item.id ? "active" : ""} type="button" onClick={() => { setTab(item.id); setQuery(""); setFormOpen(false); }}><TabIcon size={18} aria-hidden="true" /><span><strong>{item.label}</strong><small>{item.description}</small></span></button>; })}</div>
    <section className="siga-master-panel"><header><span className="siga-master-icon"><Icon size={20} aria-hidden="true" /></span><div><p className="siga-kicker">{current.description}</p><h2>{current.label}</h2></div><span className="siga-master-count">{rows.length} item(ns)</span></header><div className="siga-master-toolbar"><label><Search size={16} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Pesquisar ${current.label.toLocaleLowerCase("pt-BR")}`} /></label><button type="button"><MapPin size={15} aria-hidden="true" />Todos os contextos</button></div><div className="siga-master-list">{rows.map((row) => <article key={row.code}><span className="siga-master-row-icon">{tab === "library" ? <BookOpen size={16} aria-hidden="true" /> : <GraduationCap size={16} aria-hidden="true" />}</span><div><small>{row.code} · {row.tag}</small><strong>{row.title}</strong><p>{row.context}</p></div><span className={`siga-status-pill ${isPositiveStatus(row.status) ? "good" : "warning"}`}>{row.status}</span><button type="button" aria-label={`Abrir ${row.title}`}><ChevronRight size={17} aria-hidden="true" /></button></article>)}{!rows.length ? <div className="siga-master-empty"><Search size={20} aria-hidden="true" /><strong>Nenhum resultado encontrado</strong><span>Ajuste os termos de pesquisa para consultar a base demonstrativa.</span></div> : null}</div></section>
  </section>;
}
