import React, { FormEvent, useMemo, useState } from "react";
import { Building2, ChevronRight, Pencil, Plus, Search, UsersRound } from "lucide-react";
import type { SemedMasterRecord, SemedMasterRecordInput } from "./sigaLocalStore";
import "./siga-management-complement.css";

const recordTypes = ["Pessoa", "Contato", "Departamento", "Cargo", "Fornecedor", "Entidade", "Outro"];

type MastersProps = {
  records: SemedMasterRecord[];
  canWrite: boolean;
  onSave: (input: SemedMasterRecordInput) => { error: string | null; record: SemedMasterRecord | null };
  onNotify: (message: string) => void;
};

function emptyRecord(): SemedMasterRecordInput {
  return { recordType: "Pessoa", code: "", name: "", document: "", email: "", phone: "", department: "", position: "", address: "", notes: "", status: "Ativo" };
}

export default function SemedMastersPage({ records, canWrite, onSave, onNotify }: MastersProps) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<SemedMasterRecordInput | null>(null);
  const visibleRecords = useMemo(() => records.filter((record) => (typeFilter === "Todos" || record.recordType === typeFilter) && `${record.code} ${record.name} ${record.document} ${record.department} ${record.position}`.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR"))).sort((left, right) => left.name.localeCompare(right.name, "pt-BR")), [query, records, typeFilter]);
  const typeCount = new Set(records.map((record) => record.recordType)).size;

  function openCreate() { setEditing(emptyRecord()); setFormOpen(true); }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = onSave({ id: editing?.id, recordType: String(form.get("recordType") ?? ""), code: String(form.get("code") ?? ""), name: String(form.get("name") ?? ""), document: String(form.get("document") ?? ""), email: String(form.get("email") ?? ""), phone: String(form.get("phone") ?? ""), department: String(form.get("department") ?? ""), position: String(form.get("position") ?? ""), address: String(form.get("address") ?? ""), notes: String(form.get("notes") ?? ""), status: String(form.get("status") ?? "Ativo") as SemedMasterRecord["status"] });
    if (result.error) return onNotify(result.error);
    setFormOpen(false); setEditing(null); onNotify("Cadastro institucional salvo somente no ambiente local.");
  }

  return <section className="siga-management-page siga-masters-page">
    <header className="siga-page-heading"><div><p className="siga-kicker kicker kicker--institutional">Cadastro geral</p><h1>Cadastros</h1><span>Pessoas, contatos, departamentos e cargos disponíveis como referência institucional local.</span></div>{canWrite ? <button className="siga-page-primary" type="button" onClick={() => formOpen ? setFormOpen(false) : openCreate()}><Plus size={16} aria-hidden="true" />{formOpen ? "Fechar cadastro" : "Novo cadastro"}</button> : null}</header>
    <section className="siga-master-panel" aria-label="Cadastros institucionais locais"><header><span className="siga-master-icon"><Building2 size={20} aria-hidden="true" /></span><div><p className="siga-kicker kicker--section">Base institucional</p><h2>Registros de referência</h2></div><span className="siga-master-count">{records.length} registro(s) · {typeCount} tipo(s)</span></header>
      <div className="siga-master-toolbar"><label><Search size={16} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar código, nome ou referência" /></label><label className="siga-master-type-filter">Tipo<select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}><option>Todos</option>{recordTypes.map((type) => <option key={type}>{type}</option>)}</select></label></div>
      {formOpen && editing && canWrite ? <form className="siga-master-create-form siga-master-expanded-form" onSubmit={submit}><label>Tipo de cadastro<select name="recordType" defaultValue={editing.recordType}>{recordTypes.map((type) => <option key={type}>{type}</option>)}</select></label><label>Código<input name="code" required defaultValue={editing.code} placeholder="Ex.: DEP-001" /></label><label>Nome<input name="name" required defaultValue={editing.name} placeholder="Nome institucional" /></label><label>Documento<input name="document" defaultValue={editing.document} placeholder="CPF, CNPJ ou referência" /></label><label>E-mail<input name="email" type="email" defaultValue={editing.email} placeholder="contato@exemplo.gov.br" /></label><label>Telefone<input name="phone" defaultValue={editing.phone} placeholder="(00) 00000-0000" /></label><label>Departamento<input name="department" defaultValue={editing.department} placeholder="Setor ou secretaria" /></label><label>Cargo ou função<input name="position" defaultValue={editing.position} placeholder="Cargo, papel ou atribuição" /></label><label className="wide">Endereço<input name="address" defaultValue={editing.address} placeholder="Endereço institucional" /></label><label>Situação<select name="status" defaultValue={editing.status}><option>Ativo</option><option>Inativo</option></select></label><label className="wide">Observações<textarea name="notes" defaultValue={editing.notes} rows={2} placeholder="Informações complementares de referência" /></label><div><span>O registro será gravado apenas no armazenamento local deste navegador.</span><button type="button" onClick={() => { setFormOpen(false); setEditing(null); }}>Cancelar</button><button type="submit">Salvar cadastro</button></div></form> : null}
      <div className="siga-master-list">{visibleRecords.map((record) => <article key={record.id}><span className="siga-master-row-icon">{record.recordType === "Departamento" ? <Building2 size={16} aria-hidden="true" /> : <UsersRound size={16} aria-hidden="true" />}</span><div><small>{record.code} · {record.recordType}</small><strong>{record.name}</strong><p>{[record.department, record.position, record.phone || record.email].filter(Boolean).join(" · ") || "Sem referência complementar"}</p></div><span className={`siga-status-pill ${record.status === "Ativo" ? "good" : "warning"}`}>{record.status}</span>{canWrite ? <button type="button" aria-label={`Editar ${record.name}`} onClick={() => { setEditing(record); setFormOpen(true); }}><Pencil size={16} aria-hidden="true" /></button> : <ChevronRight size={17} aria-hidden="true" />}</article>)}{!visibleRecords.length ? <div className="siga-master-empty"><Search size={20} aria-hidden="true" /><strong>Nenhum cadastro encontrado</strong><span>Cadastre pessoas, contatos, departamentos ou cargos para criar referências locais.</span></div> : null}</div>
    </section>
  </section>;
}
