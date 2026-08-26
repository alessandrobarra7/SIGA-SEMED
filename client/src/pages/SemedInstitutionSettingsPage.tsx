import { BellRing, Building2, CalendarDays, CheckCircle2, Clock3, FileKey2, Landmark, LockKeyhole, Save, ShieldCheck } from "lucide-react";
import React, { FormEvent, useEffect, useMemo, useState } from "react";
import type { SemedGovernanceAudit, SemedInstitutionSettings, SemedInstitutionSettingsInput, SemedInstitutionSettingsAudit } from "./sigaLocalStore";
import "./siga-institution-settings.css";

type SettingsSection = "identidade" | "exercicio" | "comunicacoes" | "seguranca";

const sections: { id: SettingsSection; label: string; description: string; icon: typeof Building2 }[] = [
  { id: "identidade", label: "Identificação", description: "Dados exibidos no ambiente local", icon: Building2 },
  { id: "exercicio", label: "Exercício", description: "Referência administrativa e calendário", icon: CalendarDays },
  { id: "comunicacoes", label: "Comunicações", description: "Alertas e avisos internos", icon: BellRing },
  { id: "seguranca", label: "Segurança", description: "Sessões e trilha de auditoria", icon: ShieldCheck },
];

function settingsInput(settings: SemedInstitutionSettings): SemedInstitutionSettingsInput {
  const { id: _id, updatedAt: _updatedAt, updatedBy: _updatedBy, ...input } = settings;
  return input;
}

function auditLabel(audit: SemedInstitutionSettingsAudit) {
  return audit.changedFields.length ? audit.changedFields.map((field) => ({ institutionName: "identificação", acronym: "sigla", municipality: "município", referenceYear: "exercício", timezone: "fuso horário", notificationsEnabled: "comunicações", deadlineAlertDays: "prazo de alerta", sessionDays: "sessões", minimumPasswordLength: "senha mínima", maintenanceMessage: "aviso interno" }[field] ?? field)).join(", ") : "parâmetros revisados";
}

export default function SemedInstitutionSettingsPage({
  settings,
  auditLog,
  governanceAuditLog,
  actorUserId,
  readOnly,
  onSave,
}: {
  settings: SemedInstitutionSettings;
  auditLog: SemedInstitutionSettingsAudit[];
  governanceAuditLog: SemedGovernanceAudit[];
  actorUserId: string;
  readOnly: boolean;
  onSave: (input: SemedInstitutionSettingsInput, actorUserId: string) => { error: string | null; settings: SemedInstitutionSettings | null };
}) {
  const [section, setSection] = useState<SettingsSection>("identidade");
  const [form, setForm] = useState<SemedInstitutionSettingsInput>(() => settingsInput(settings));
  const [notice, setNotice] = useState("");
  useEffect(() => setForm(settingsInput(settings)), [settings]);
  const latestAudit = useMemo(() => auditLog.slice(0, 5), [auditLog]);
  const latestGovernanceAudit = useMemo(() => governanceAuditLog.slice(0, 5), [governanceAuditLog]);

  function update<K extends keyof SemedInstitutionSettingsInput>(key: K, value: SemedInstitutionSettingsInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const result = onSave(form, actorUserId);
    if (result.error) return setNotice(result.error);
    setNotice("Configurações institucionais atualizadas somente no armazenamento local.");
  }

  return <section className="siga-settings-page" aria-labelledby="settings-title">
    <header className="siga-settings-hero">
      <div>
        <p className="siga-kicker"><Landmark size={15} aria-hidden="true" /> Administração local</p>
        <h1 id="settings-title">Configurações institucionais</h1>
        <p>Parâmetros demonstrativos da secretaria, do exercício e das rotinas internas. Nenhuma integração externa é utilizada.</p>
      </div>
      <div className="siga-settings-state"><CheckCircle2 size={18} aria-hidden="true" /><span>Armazenamento local ativo</span></div>
    </header>

    {notice ? <div className="siga-settings-notice" role="status">{notice}<button type="button" onClick={() => setNotice("")} aria-label="Fechar aviso">×</button></div> : null}

    <div className="siga-settings-layout">
      <nav className="siga-settings-nav" aria-label="Seções de configurações">
        {sections.map(({ id, label, description, icon: Icon }) => <button type="button" key={id} className={section === id ? "is-active" : ""} onClick={() => setSection(id)}>
          <Icon size={18} aria-hidden="true" /><span><strong>{label}</strong><small>{description}</small></span>
        </button>)}
        <div className="siga-settings-access"><LockKeyhole size={16} aria-hidden="true" /><span><strong>Acesso protegido</strong><small>Alterações são exclusivas do perfil Administrador.</small></span></div>
      </nav>

      <form className="siga-settings-form" onSubmit={submit}>
        {section === "identidade" ? <>
          <div className="siga-settings-section-heading"><Building2 size={21} aria-hidden="true" /><div><h2>Identificação institucional</h2><p>Informações apresentadas somente na simulação local.</p></div></div>
          <div className="siga-settings-grid">
            <label className="siga-settings-field is-wide">Nome institucional<input value={form.institutionName} onChange={(event) => update("institutionName", event.target.value)} disabled={readOnly} /></label>
            <label className="siga-settings-field">Sigla<input value={form.acronym} onChange={(event) => update("acronym", event.target.value)} disabled={readOnly} maxLength={16} /></label>
            <label className="siga-settings-field">Município<input value={form.municipality} onChange={(event) => update("municipality", event.target.value)} disabled={readOnly} /></label>
          </div>
        </> : null}

        {section === "exercicio" ? <>
          <div className="siga-settings-section-heading"><CalendarDays size={21} aria-hidden="true" /><div><h2>Exercício e referência</h2><p>Parâmetros administrativos independentes dos lançamentos já existentes.</p></div></div>
          <div className="siga-settings-grid">
            <label className="siga-settings-field">Exercício de referência<input type="number" min="2020" max="2100" value={form.referenceYear} onChange={(event) => update("referenceYear", Number(event.target.value))} disabled={readOnly} /></label>
            <label className="siga-settings-field">Fuso horário<select value={form.timezone} onChange={(event) => update("timezone", event.target.value)} disabled={readOnly}><option value="America/Fortaleza">América/Fortaleza</option><option value="America/Sao_Paulo">América/São Paulo</option><option value="America/Manaus">América/Manaus</option></select></label>
          </div>
          <div className="siga-settings-callout"><FileKey2 size={18} aria-hidden="true" /><p>O exercício organiza a apresentação das configurações; os registros de Financeiro, Nutrição e demais módulos continuam preservados.</p></div>
        </> : null}

        {section === "comunicacoes" ? <>
          <div className="siga-settings-section-heading"><BellRing size={21} aria-hidden="true" /><div><h2>Comunicações internas</h2><p>Preferências demonstrativas de alertas e avisos do painel.</p></div></div>
          <div className="siga-settings-grid">
            <label className="siga-settings-switch"><input type="checkbox" checked={form.notificationsEnabled} onChange={(event) => update("notificationsEnabled", event.target.checked)} disabled={readOnly} /><span /><div><strong>Ativar alertas internos</strong><small>Controla a preferência local de avisos no ambiente.</small></div></label>
            <label className="siga-settings-field">Antecedência para alertas (dias)<input type="number" min="1" max="120" value={form.deadlineAlertDays} onChange={(event) => update("deadlineAlertDays", Number(event.target.value))} disabled={readOnly} /></label>
            <label className="siga-settings-field is-wide">Aviso de manutenção local<textarea value={form.maintenanceMessage} onChange={(event) => update("maintenanceMessage", event.target.value)} disabled={readOnly} placeholder="Ex.: Ambiente demonstrativo em atualização." rows={4} /></label>
          </div>
        </> : null}

        {section === "seguranca" ? <>
          <div className="siga-settings-section-heading"><ShieldCheck size={21} aria-hidden="true" /><div><h2>Segurança e auditoria</h2><p>Limites locais e histórico das alterações institucionais.</p></div></div>
          <div className="siga-settings-grid">
            <label className="siga-settings-field">Duração de sessão (dias)<input type="number" min="1" max="30" value={form.sessionDays} onChange={(event) => update("sessionDays", Number(event.target.value))} disabled={readOnly} /></label>
            <label className="siga-settings-field">Tamanho mínimo de senha<input type="number" min="8" max="64" value={form.minimumPasswordLength} onChange={(event) => update("minimumPasswordLength", Number(event.target.value))} disabled={readOnly} /></label>
          </div>
          <div className="siga-settings-audit"><div className="siga-settings-audit-title"><Clock3 size={18} aria-hidden="true" /><h3>Auditoria local</h3></div>{latestAudit.length ? latestAudit.map((audit) => <article key={audit.id}><strong>{audit.summary}</strong><span>{auditLabel(audit)} · {new Date(audit.createdAt).toLocaleString("pt-BR")}</span></article>) : <p>Nenhuma alteração institucional local registrada.</p>}</div>
          <div className="siga-settings-audit"><div className="siga-settings-audit-title"><ShieldCheck size={18} aria-hidden="true" /><h3>Trilha transversal</h3></div>{latestGovernanceAudit.length ? latestGovernanceAudit.map((audit) => <article key={audit.id}><strong>{audit.summary}</strong><span>{audit.entityType} · {audit.action} · {new Date(audit.createdAt).toLocaleString("pt-BR")}</span></article>) : <p>Nenhuma ação crítica local registrada nesta sessão.</p>}</div>
        </> : null}

        <footer className="siga-settings-actions"><p>{readOnly ? "Apenas Administradores podem salvar alterações institucionais." : "As mudanças são registradas na auditoria local."}</p><button type="submit" disabled={readOnly}><Save size={18} aria-hidden="true" /> Salvar configurações</button></footer>
      </form>
    </div>
  </section>;
}
