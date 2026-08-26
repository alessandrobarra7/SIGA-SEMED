import React, { useEffect, useMemo, useState } from "react";
import { Archive, CalendarRange, ChevronDown, Download, Plus, Printer, Search, Wheat, X } from "lucide-react";
import {
  SEMED_NUTRITION_ANNUAL_STATUSES,
  SEMED_NUTRITION_MODALITIES,
  SEMED_NUTRITION_WEEKLY_STATUSES,
  nutritionMondays,
  type SemedNutritionAnnualInput,
  type SemedNutritionAnnualItem,
  type SemedNutritionAnnualPlan,
  type SemedNutritionAnnualResult,
  type SemedNutritionCatalogItem,
  type SemedNutritionContract,
  type SemedNutritionSchool,
  type SemedNutritionStage,
  type SemedNutritionWeeklyInput,
  type SemedNutritionWeeklyItem,
  type SemedNutritionWeeklyPlan,
} from "./sigaLocalStore";
import "./siga-nutrition.css";

type WeeklyAnalysis = {
  product: SemedNutritionContract["products"][number];
  item: SemedNutritionWeeklyItem;
  otherPlanned: number;
  available: number;
  projected: number;
  remaining: number;
  level: "critical" | "warning" | "good";
};

type Props = {
  initialView: "weekly" | "annual";
  schools: SemedNutritionSchool[];
  contracts: SemedNutritionContract[];
  weeklyPlans: SemedNutritionWeeklyPlan[];
  stages: SemedNutritionStage[];
  catalog: SemedNutritionCatalogItem[];
  annualPlans: SemedNutritionAnnualPlan[];
  canWriteWeekly: boolean;
  canWriteAnnual: boolean;
  getWeeklyAnalysis: (plan: Pick<SemedNutritionWeeklyPlan, "id" | "contractId" | "items">) => WeeklyAnalysis[];
  getAnnualResults: (plan: Pick<SemedNutritionAnnualPlan, "items" | "enrollmentSnapshot" | "monthDays">) => SemedNutritionAnnualResult[];
  onSaveWeekly: (input: SemedNutritionWeeklyInput) => { error: string | null; plan: SemedNutritionWeeklyPlan | null };
  onArchiveWeekly: (planId: string) => boolean;
  onSaveAnnual: (input: SemedNutritionAnnualInput) => { error: string | null; plan: SemedNutritionAnnualPlan | null };
  onArchiveAnnual: (planId: string) => boolean;
  onNotify: (message: string) => void;
};

const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const number = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 3 });
const date = (value: string) => new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
const sum = (values: number[]) => Math.round(values.reduce((total, value) => total + Number(value || 0), 0) * 1000) / 1000;

function Metric({ label, value, tone }: { label: string; value: string | number; tone: string }) {
  return <article className={`siga-nutrition-metric ${tone}`}><span>{label}</span><strong>{value}</strong></article>;
}

function WeeklyEditor({ initial, contracts, schools, getAnalysis, onClose, onSave }: {
  initial?: SemedNutritionWeeklyPlan;
  contracts: SemedNutritionContract[];
  schools: SemedNutritionSchool[];
  getAnalysis: Props["getWeeklyAnalysis"];
  onClose: () => void;
  onSave: Props["onSaveWeekly"];
}) {
  const firstContract = contracts.find((item) => item.status === "Ativo");
  const [contractId, setContractId] = useState(initial?.contractId ?? firstContract?.id ?? "");
  const [schoolId, setSchoolId] = useState(initial?.schoolId ?? "");
  const [referenceMonth, setReferenceMonth] = useState(initial?.referenceMonth ?? "2026-08");
  const [modality, setModality] = useState(initial?.educationModality ?? "Ensino Fundamental");
  const [status, setStatus] = useState(initial?.status ?? "Em análise");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [message, setMessage] = useState("");
  const contract = contracts.find((item) => item.id === contractId);
  const weekDates = nutritionMondays(referenceMonth);
  const [items, setItems] = useState<SemedNutritionWeeklyItem[]>(() => contract?.products.map((product) => ({ productId: product.id, weeklyQuantities: weekDates.map((_, index) => initial?.items.find((item) => item.productId === product.id)?.weeklyQuantities[index] ?? 0) })) ?? []);
  const analysis = getAnalysis({ id: initial?.id ?? "", contractId, items });
  const availableSchools = schools.filter((school) => contract?.schoolIds.includes(school.id));

  function chooseContract(id: string) {
    const selected = contracts.find((item) => item.id === id);
    setContractId(id);
    setSchoolId("");
    setItems(selected?.products.map((product) => ({ productId: product.id, weeklyQuantities: weekDates.map(() => 0) })) ?? []);
  }

  function updateMonth(value: string) {
    const dates = nutritionMondays(value);
    setReferenceMonth(value);
    setItems((current) => current.map((item) => ({ ...item, weeklyQuantities: dates.map((_, index) => item.weeklyQuantities[index] ?? 0) })));
  }

  function updateWeek(productId: string, index: number, value: number) {
    setItems((current) => current.map((item) => item.productId === productId ? { ...item, weeklyQuantities: item.weeklyQuantities.map((quantity, week) => week === index ? Math.max(0, value || 0) : quantity) } : item));
  }

  function distribute(productId: string, target: number) {
    const base = weekDates.length ? target / weekDates.length : 0;
    setItems((current) => current.map((item) => item.productId === productId ? { ...item, weeklyQuantities: weekDates.map((_, index) => Math.max(0, index === weekDates.length - 1 ? target - base * (weekDates.length - 1) : base)) } : item));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const result = onSave({ id: initial?.id, contractId, schoolId, referenceMonth, educationModality: modality as SemedNutritionWeeklyInput["educationModality"], status: status as SemedNutritionWeeklyInput["status"], items, notes });
    if (result.error) return setMessage(result.error);
    onClose();
  }

  return <div className="siga-dialog-scrim" role="presentation"><form className="siga-nutrition-dialog weekly" onSubmit={submit}>
    <header><div><p>Projeção semanal de fornecimento</p><h2>{initial ? "Editar projeção" : "Nova projeção"}</h2><span>O saldo real somente será baixado após a confirmação da entrega.</span></div><button type="button" aria-label="Fechar projeção" onClick={onClose}><X size={18} /></button></header>
    <section className="siga-nutrition-form-grid">
      <label>Contrato<select aria-label="Contrato" value={contractId} onChange={(event) => chooseContract(event.target.value)}><option value="">Selecione o contrato</option>{contracts.filter((item) => item.status === "Ativo" || item.id === initial?.contractId).map((item) => <option key={item.id} value={item.id}>{item.number} · {item.entityName}</option>)}</select></label>
      <label>Escola<select aria-label="Escola" value={schoolId} onChange={(event) => setSchoolId(event.target.value)}><option value="">Selecione a escola</option>{availableSchools.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.inep}</option>)}</select></label>
      <label>Mês<input aria-label="Mês de referência" type="month" value={referenceMonth} onChange={(event) => updateMonth(event.target.value)} /></label>
      <label>Modalidade<select aria-label="Modalidade" value={modality} onChange={(event) => setModality(event.target.value as typeof modality)}>{SEMED_NUTRITION_MODALITIES.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>Situação<select aria-label="Situação da projeção" value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>{SEMED_NUTRITION_WEEKLY_STATUSES.filter((item) => item !== "Arquivado" || initial?.status === "Arquivado").map((item) => <option key={item}>{item}</option>)}</select></label>
      <label className="wide">Observações<textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Critérios, ajustes ou orientações para as guias" /></label>
    </section>
    <section className="siga-nutrition-analysis-grid"><Metric label="Produtos analisados" value={analysis.length} tone="navy" /><Metric label="Semanas" value={weekDates.length} tone="green" /><Metric label="Quantidade projetada" value={number.format(sum(analysis.map((item) => item.projected)))} tone="orange" /><Metric label="Saldos insuficientes" value={analysis.filter((item) => item.level === "critical").length} tone="danger" /></section>
    <section className="siga-weekly-products"><div className="siga-nutrition-section-heading"><div><h3>Projeção por produto e semana</h3><p>Os cálculos consideram guias e outras projeções ativas.</p></div></div>
      {analysis.length ? analysis.map((row) => <article className={`siga-weekly-product ${row.level}`} key={row.product.id}>
        <div className="product"><strong>{row.product.name}</strong><span>{row.product.unit}</span></div>
        <div className="balances"><span>Contratado <b>{number.format(row.product.contractedQuantity)}</b></span><span>Em guias <b>{number.format(row.product.committedQuantity)}</b></span><span>Outras projeções <b>{number.format(row.otherPlanned)}</b></span></div>
        <div className="weeks">{weekDates.map((week, index) => <label key={week}>{date(week)}<input aria-label={`${row.product.name} semana ${index + 1}`} inputMode="decimal" value={row.item.weeklyQuantities[index] ?? 0} onChange={(event) => updateWeek(row.product.id, index, Number(event.target.value))} /></label>)}</div>
        <div className="projection"><span>Total <b>{number.format(row.projected)}</b></span><span>Saldo após <b>{number.format(row.remaining)}</b></span><button type="button" onClick={() => distribute(row.product.id, row.projected || Math.max(0, row.available))}>Distribuir igualmente</button><button type="button" onClick={() => distribute(row.product.id, Math.max(0, row.available))}>Ajustar ao saldo</button></div>
      </article>) : <p className="siga-nutrition-empty">Selecione um contrato ativo para visualizar produtos e saldos.</p>}
    </section>
    {message ? <p className="siga-form-message">{message}</p> : null}
    <footer><button type="button" className="siga-secondary-button" onClick={onClose}>Cancelar</button><button type="submit" className="siga-primary-button">Salvar projeção</button></footer>
  </form></div>;
}

function AnnualEditor({ initial, stages, catalog, getResults, onClose, onSave }: {
  initial?: SemedNutritionAnnualPlan;
  stages: SemedNutritionStage[];
  catalog: SemedNutritionCatalogItem[];
  getResults: Props["getAnnualResults"];
  onClose: () => void;
  onSave: Props["onSaveAnnual"];
}) {
  const [name, setName] = useState(initial?.name ?? "Cardápio anual demonstrativo");
  const [year, setYear] = useState(initial?.referenceYear ?? 2026);
  const [stageName, setStageName] = useState(initial?.educationStage ?? stages[0]?.name ?? "Creche");
  const [periodStart, setPeriodStart] = useState(initial?.periodStart ?? 2);
  const [periodEnd, setPeriodEnd] = useState(initial?.periodEnd ?? 12);
  const [status, setStatus] = useState(initial?.status ?? "Em elaboração");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [monthDays, setMonthDays] = useState(initial?.monthDays ?? [0, 20, 22, 20, 21, 20, 10, 22, 21, 20, 20, 10]);
  const [items, setItems] = useState<SemedNutritionAnnualItem[]>(initial?.items ?? []);
  const [draft, setDraft] = useState({ name: "", source: "Industrializado", category: "", basis: "Por oferta", perCapita: 0, unit: "g", offers: 1 });
  const [message, setMessage] = useState("");
  const stage = stages.find((item) => item.name === stageName) ?? stages[0];
  const results = getResults({ items, monthDays, enrollmentSnapshot: { totalStudents: stage?.totalStudents ?? 0, capturedAt: initial?.enrollmentSnapshot.capturedAt ?? new Date().toISOString() } });

  function addProduct() {
    if (!draft.name.trim() || draft.perCapita <= 0) return setMessage("Informe o produto e um per capita maior que zero.");
    const matched = catalog.find((item) => item.source === draft.source && item.name.toLocaleLowerCase("pt-BR") === draft.name.trim().toLocaleLowerCase("pt-BR"));
    const unit = draft.unit as SemedNutritionAnnualItem["consumptionUnit"];
    setItems((current) => [...current, {
      id: `nutrition-item-${Date.now()}`, name: draft.name.trim(), source: draft.source as SemedNutritionAnnualItem["source"], category: draft.category.trim(), catalogKey: matched?.key ?? "",
      basis: draft.basis as SemedNutritionAnnualItem["basis"], consumptionUnit: unit, supplyUnit: unit === "g" ? "KG" : unit === "ml" ? "L" : "UN", perCapita: draft.perCapita,
      monthlyOffers: months.map((_, index) => index + 1 >= periodStart && index + 1 <= periodEnd ? draft.basis === "Mensal consolidado" ? 1 : draft.offers : 0),
    }]);
    setDraft((current) => ({ ...current, name: "", category: "", perCapita: 0 }));
    setMessage("Produto incluído no planejamento local.");
  }

  function updateOffers(id: string, month: number, value: number) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, monthlyOffers: item.monthlyOffers.map((quantity, index) => index === month ? Math.max(0, value || 0) : quantity) } : item));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const result = onSave({ id: initial?.id, name, referenceYear: year, modality: stage?.modality ?? "", educationStage: stageName, periodStart, periodEnd, monthDays, items, status: status as SemedNutritionAnnualInput["status"], notes });
    if (result.error) return setMessage(result.error);
    onClose();
  }

  return <div className="siga-dialog-scrim" role="presentation"><form className="siga-nutrition-dialog annual" onSubmit={submit}>
    <header><div><p>Planejamento anual da alimentação escolar</p><h2>{initial ? "Editar planejamento" : "Novo planejamento"}</h2><span>Per capita, matrículas, períodos e necessidade de aquisição.</span></div><button type="button" aria-label="Fechar planejamento" onClick={onClose}><X size={18} /></button></header>
    <section className="siga-nutrition-form-grid annual-fields">
      <label>Cardápio<input aria-label="Nome do cardápio" value={name} onChange={(event) => setName(event.target.value)} /></label><label>Ano<input aria-label="Ano do planejamento" type="number" value={year} onChange={(event) => setYear(Number(event.target.value))} /></label>
      <label>Modalidade<input value={stage?.modality ?? ""} readOnly /></label><label>Etapa<select aria-label="Etapa de ensino" value={stageName} onChange={(event) => setStageName(event.target.value)}>{stages.map((item) => <option key={item.name}>{item.name}</option>)}</select></label>
      <label>Início<select aria-label="Mês inicial" value={periodStart} onChange={(event) => setPeriodStart(Number(event.target.value))}>{months.map((item, index) => <option key={item} value={index + 1}>{item}</option>)}</select></label><label>Fim<select aria-label="Mês final" value={periodEnd} onChange={(event) => setPeriodEnd(Number(event.target.value))}>{months.map((item, index) => <option key={item} value={index + 1}>{item}</option>)}</select></label>
      <label>Situação<select aria-label="Situação do planejamento" value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>{SEMED_NUTRITION_ANNUAL_STATUSES.filter((item) => item !== "Arquivado" || initial?.status === "Arquivado").map((item) => <option key={item}>{item}</option>)}</select></label><label className="wide">Observações<textarea value={notes} onChange={(event) => setNotes(event.target.value)} /></label>
    </section>
    <section className="siga-enrollment-card"><div><span>Etapa selecionada</span><strong>{stageName}</strong><small>{stage?.modality}</small></div><div><span>Matrículas agregadas</span><strong>{stage?.totalStudents ?? 0}</strong><small>Fotografia demonstrativa no salvamento</small></div></section>
    <section className="siga-nutrition-section"><div className="siga-nutrition-section-heading"><div><h3>Calendário do atendimento</h3><p>Dias letivos previstos em cada mês do período.</p></div></div><div className="siga-month-grid">{months.map((item, index) => { const active = index + 1 >= periodStart && index + 1 <= periodEnd; return <label className={active ? "active" : ""} key={item}>{item}<input aria-label={`Dias letivos de ${item}`} disabled={!active} type="number" min="0" value={active ? monthDays[index] ?? 0 : 0} onChange={(event) => setMonthDays((current) => current.map((value, month) => month === index ? Number(event.target.value) : value))} /></label>; })}</div></section>
    <section className="siga-nutrition-section"><div className="siga-nutrition-section-heading"><div><h3>Produtos e per capita</h3><p>Adicione produtos e configure as ofertas mensais.</p></div></div><div className="siga-product-add-grid">
      <label>Produto<input list="nutrition-local-catalog" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /><datalist id="nutrition-local-catalog">{catalog.filter((item) => item.source === draft.source).map((item) => <option key={item.key} value={item.name} />)}</datalist></label>
      <label>Origem<select value={draft.source} onChange={(event) => setDraft({ ...draft, source: event.target.value })}><option>Industrializado</option><option>Agricultura Familiar</option></select></label><label>Categoria<input value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} /></label>
      <label>Base<select value={draft.basis} onChange={(event) => setDraft({ ...draft, basis: event.target.value })}><option>Por oferta</option><option>Mensal consolidado</option></select></label><label>Per capita<input inputMode="decimal" value={draft.perCapita || ""} onChange={(event) => setDraft({ ...draft, perCapita: Number(event.target.value) })} /></label>
      <label>Unidade<select value={draft.unit} onChange={(event) => setDraft({ ...draft, unit: event.target.value })}><option value="g">g</option><option value="ml">ml</option><option value="un">un</option></select></label><label>Ofertas/mês<input disabled={draft.basis === "Mensal consolidado"} inputMode="decimal" value={draft.offers} onChange={(event) => setDraft({ ...draft, offers: Number(event.target.value) })} /></label><button type="button" onClick={addProduct}><Plus size={16} />Adicionar produto</button>
    </div>
    <div className="siga-annual-items">{results.map((result) => <article key={result.id}><header><div><strong>{result.name}</strong><span>{result.source} · {result.perCapita} {result.consumptionUnit} · {result.basis}</span></div><button type="button" aria-label={`Remover ${result.name}`} onClick={() => setItems((current) => current.filter((item) => item.id !== result.id))}><X size={15} /></button></header><div className="siga-month-offers">{months.map((month, index) => <label key={month}>{month}<input aria-label={`${result.name} ofertas em ${month}`} disabled={!monthDays[index] || result.basis === "Mensal consolidado"} type="number" min="0" value={result.monthlyOffers[index] ?? 0} onChange={(event) => updateOffers(result.id, index, Number(event.target.value))} /></label>)}</div><footer><span>Ofertas consideradas <b>{number.format(sum(result.monthlyEffectiveOffers))}</b></span><span>Necessidade <b>{number.format(result.totalNeed)} {result.supplyUnit}</b></span><span>Cobertura <b>{number.format(result.coverage)} {result.supplyUnit}</b></span><span>Comprar/contratar <b>{number.format(result.toAcquire)} {result.supplyUnit}</b></span></footer></article>)}</div></section>
    {message ? <p className="siga-form-message">{message}</p> : null}<footer><button type="button" className="siga-secondary-button" onClick={onClose}>Cancelar</button><button type="submit" className="siga-primary-button">Salvar planejamento</button></footer>
  </form></div>;
}

function exportAnnualPlan(plan: SemedNutritionAnnualPlan, results: SemedNutritionAnnualResult[]) {
  const rows = [["PLANEJAMENTO", plan.name], ["ANO", String(plan.referenceYear)], ["MODALIDADE", plan.modality], ["ETAPA", plan.educationStage], ["ALUNOS", String(plan.enrollmentSnapshot.totalStudents)], [], ["PRODUTO", "ORIGEM", "UNIDADE", "PER CAPITA", ...months, "TOTAL ANUAL", "COBERTURA ATUAL", "COMPRAR/CONTRATAR"]];
  results.forEach((item) => rows.push([item.name, item.source, item.supplyUnit, String(item.perCapita), ...item.monthlyNeeds.map(String), String(item.totalNeed), String(item.coverage), String(item.toAcquire)]));
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(";")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a"); anchor.href = url; anchor.download = `planejamento-nutricao-${plan.referenceYear}.csv`; anchor.click(); URL.revokeObjectURL(url);
}

export default function SemedNutritionPage(props: Props) {
  const [view, setView] = useState(props.initialView);
  const [weeklyEditor, setWeeklyEditor] = useState<SemedNutritionWeeklyPlan | "new" | null>(null);
  const [annualEditor, setAnnualEditor] = useState<SemedNutritionAnnualPlan | "new" | null>(null);
  const [query, setQuery] = useState(""); const [month, setMonth] = useState(""); const [modality, setModality] = useState(""); const [status, setStatus] = useState("");
  const [year, setYear] = useState(""); const [stage, setStage] = useState("");
  useEffect(() => setView(props.initialView), [props.initialView]);
  const weeklyFiltered = useMemo(() => props.weeklyPlans.filter((plan) => {
    const school = props.schools.find((item) => item.id === plan.schoolId); const contract = props.contracts.find((item) => item.id === plan.contractId);
    const text = `${school?.name} ${school?.inep} ${contract?.number} ${contract?.entityName}`.toLocaleLowerCase("pt-BR");
    return text.includes(query.toLocaleLowerCase("pt-BR")) && (!month || plan.referenceMonth === month) && (!modality || plan.educationModality === modality) && (!status || plan.status === status);
  }), [modality, month, props.contracts, props.schools, props.weeklyPlans, query, status]);
  const annualFiltered = useMemo(() => props.annualPlans.filter((plan) => `${plan.name} ${plan.modality} ${plan.educationStage}`.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR")) && (!year || plan.referenceYear === Number(year)) && (!stage || plan.educationStage === stage) && (!status || plan.status === status)), [props.annualPlans, query, stage, status, year]);
  const selectedViewCanWrite = view === "weekly" ? props.canWriteWeekly : props.canWriteAnnual;

  function switchView(next: "weekly" | "annual") { setView(next); setQuery(""); setMonth(""); setModality(""); setStatus(""); setYear(""); setStage(""); }

  return <section className="siga-nutrition-page" aria-labelledby="nutrition-title">
    <header className="siga-nutrition-hero"><div><p>Alimentação escolar</p><h1 id="nutrition-title">Nutrição</h1><span>Planejamento de cardápios, quantitativos, projeções semanais e análise dos saldos disponíveis.</span></div><Wheat size={28} aria-hidden="true" /></header>
    <nav className="siga-nutrition-tabs" aria-label="Áreas de Nutrição"><button className={view === "weekly" ? "active" : ""} type="button" onClick={() => switchView("weekly")}>Planejamento semanal e análise de saldos</button><button className={view === "annual" ? "active" : ""} type="button" onClick={() => switchView("annual")}>Planejamento anual da alimentação</button></nav>
    {!selectedViewCanWrite ? <p className="siga-workspace-notice">Perfil em modo somente leitura neste submódulo.</p> : null}
    {view === "weekly" ? <>
      <section className="siga-nutrition-heading"><div><h2>Planejamento e análise de saldos</h2><p>Projete entregas semanais antes de emitir guias e acompanhe o impacto no contrato.</p></div>{props.canWriteWeekly ? <button type="button" onClick={() => setWeeklyEditor("new")}><Plus size={16} />Nova projeção</button> : null}</section>
      <section className="siga-nutrition-metrics"><Metric label="Projeções" value={props.weeklyPlans.length} tone="navy" /><Metric label="Em análise" value={props.weeklyPlans.filter((item) => item.status === "Em análise").length} tone="green" /><Metric label="Aprovadas para guia" value={props.weeklyPlans.filter((item) => item.status === "Aprovado para guia").length} tone="purple" /><Metric label="Escolas" value={new Set(props.weeklyPlans.map((item) => item.schoolId)).size} tone="orange" /><Metric label="Meses planejados" value={new Set(props.weeklyPlans.map((item) => item.referenceMonth)).size} tone="slate" /></section>
      <section className="siga-nutrition-filters"><label className="search"><Search size={16} /><input aria-label="Pesquisar projeções" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Escola, INEP, contrato ou entidade" /></label><label>Mês<input aria-label="Filtrar por mês" type="month" value={month} onChange={(event) => setMonth(event.target.value)} /></label><label>Modalidade<select aria-label="Filtrar por modalidade" value={modality} onChange={(event) => setModality(event.target.value)}><option value="">Todas</option>{SEMED_NUTRITION_MODALITIES.map((item) => <option key={item}>{item}</option>)}</select></label><label>Situação<select aria-label="Filtrar por situação semanal" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Todas</option>{SEMED_NUTRITION_WEEKLY_STATUSES.map((item) => <option key={item}>{item}</option>)}</select></label></section>
      <section className="siga-nutrition-list">{weeklyFiltered.length ? weeklyFiltered.map((plan) => { const school = props.schools.find((item) => item.id === plan.schoolId); const contract = props.contracts.find((item) => item.id === plan.contractId); const analysis = props.getWeeklyAnalysis(plan); return <article key={plan.id}><button className="summary" type="button" onClick={() => props.canWriteWeekly && setWeeklyEditor(plan)}><span><small>{plan.referenceMonth} · {plan.educationModality}</small><strong>{school?.name}</strong><em>{contract?.number} · {contract?.entityName}</em></span><span><b className={`status ${plan.status.toLocaleLowerCase("pt-BR").replaceAll(" ", "-")}`}>{plan.status}</b><ChevronDown size={17} /></span></button><div className="quick"><span>Produtos <b>{analysis.length}</b></span><span>Projetado <b>{number.format(sum(analysis.map((item) => item.projected)))}</b></span><span>Saldo crítico <b>{analysis.filter((item) => item.level === "critical").length}</b></span>{props.canWriteWeekly && plan.status !== "Arquivado" ? <button type="button" onClick={() => { props.onArchiveWeekly(plan.id); props.onNotify("Projeção arquivada na simulação local."); }}><Archive size={14} />Arquivar</button> : null}</div></article>; }) : <div className="siga-nutrition-empty"><CalendarRange size={24} /><strong>Nenhuma projeção encontrada.</strong><span>Crie um planejamento para analisar os saldos antes da emissão das guias.</span></div>}</section>
    </> : <>
      <section className="siga-nutrition-heading"><div><h2>Planejamento anual da alimentação escolar</h2><p>Per capita, matrículas, períodos e necessidade de aquisição por etapa de ensino.</p></div>{props.canWriteAnnual ? <button type="button" onClick={() => setAnnualEditor("new")}><Plus size={16} />Novo planejamento</button> : null}</section>
      <section className="siga-nutrition-metrics"><Metric label="Planejamentos" value={props.annualPlans.length} tone="navy" /><Metric label="Aprovados" value={props.annualPlans.filter((item) => item.status === "Aprovado").length} tone="green" /><Metric label="Matrículas por etapa" value={props.stages.reduce((total, item) => total + item.totalStudents, 0)} tone="orange" /><Metric label="Produtos projetados" value={props.annualPlans.reduce((total, item) => total + item.items.length, 0)} tone="purple" /><Metric label="Etapas planejadas" value={new Set(props.annualPlans.map((item) => item.educationStage)).size} tone="slate" /></section>
      <section className="siga-nutrition-filters"><label className="search"><Search size={16} /><input aria-label="Pesquisar planejamentos anuais" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cardápio, modalidade ou etapa" /></label><label>Ano<input aria-label="Filtrar por ano" type="number" placeholder="Todos" value={year} onChange={(event) => setYear(event.target.value)} /></label><label>Etapa<select aria-label="Filtrar por etapa" value={stage} onChange={(event) => setStage(event.target.value)}><option value="">Todas</option>{props.stages.map((item) => <option key={item.name}>{item.name}</option>)}</select></label><label>Situação<select aria-label="Filtrar por situação anual" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Todas</option>{SEMED_NUTRITION_ANNUAL_STATUSES.map((item) => <option key={item}>{item}</option>)}</select></label></section>
      <section className="siga-nutrition-list">{annualFiltered.length ? annualFiltered.map((plan) => { const results = props.getAnnualResults(plan); return <article key={plan.id}><button className="summary" type="button" onClick={() => props.canWriteAnnual && setAnnualEditor(plan)}><span><small>{plan.referenceYear} · {plan.modality}</small><strong>{plan.name}</strong><em>{plan.educationStage}</em></span><span><b className={`status ${plan.status.toLocaleLowerCase("pt-BR").replaceAll(" ", "-")}`}>{plan.status}</b><ChevronDown size={17} /></span></button><div className="quick"><span>Alunos <b>{plan.enrollmentSnapshot.totalStudents}</b></span><span>Produtos <b>{plan.items.length}</b></span><span>Comprar/contratar <b>{number.format(sum(results.map((item) => item.toAcquire)))}</b></span><button type="button" onClick={() => exportAnnualPlan(plan, results)}><Download size={14} />CSV</button><button type="button" onClick={() => window.print()}><Printer size={14} />Imprimir</button>{props.canWriteAnnual && plan.status !== "Arquivado" ? <button type="button" onClick={() => { props.onArchiveAnnual(plan.id); props.onNotify("Planejamento anual arquivado na simulação local."); }}><Archive size={14} />Arquivar</button> : null}</div></article>; }) : <div className="siga-nutrition-empty"><CalendarRange size={24} /><strong>Nenhum planejamento anual encontrado.</strong><span>Revise os filtros ou crie um planejamento local.</span></div>}</section>
    </>}
    {weeklyEditor ? <WeeklyEditor initial={weeklyEditor === "new" ? undefined : weeklyEditor} contracts={props.contracts} schools={props.schools} getAnalysis={props.getWeeklyAnalysis} onClose={() => setWeeklyEditor(null)} onSave={(input) => { const result = props.onSaveWeekly(input); if (!result.error) props.onNotify("Projeção semanal salva na simulação local."); return result; }} /> : null}
    {annualEditor ? <AnnualEditor initial={annualEditor === "new" ? undefined : annualEditor} stages={props.stages} catalog={props.catalog} getResults={props.getAnnualResults} onClose={() => setAnnualEditor(null)} onSave={(input) => { const result = props.onSaveAnnual(input); if (!result.error) props.onNotify("Planejamento anual salvo na simulação local."); return result; }} /> : null}
  </section>;
}
