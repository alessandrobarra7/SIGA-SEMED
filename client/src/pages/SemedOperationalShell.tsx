import {
  BellRing,
  BookOpen,
  CalendarDays,
  Car,
  ChevronDown,
  ClipboardCheck,
  FileText,
  FolderKanban,
  Landmark,
  LayoutDashboard,
  LogOut,
  Package,
  Search,
  School,
  ShieldCheck,
  Settings2,
  Truck,
  UserCog,
  UsersRound,
  Wheat,
} from "lucide-react";
import React, { useState } from "react";
import "./siga-identity-refresh.css";

export type ShellView =
  | "welcome"
  | "home"
  | "governance"
  | "masters"
  | "finance"
  | "documents"
  | "records"
  | "schools"
  | "schools-reports"
  | "educa"
  | "educa-reports"
  | "people"
  | "nutrition"
  | "nutrition-weekly"
  | "nutrition-annual"
  | "stock"
  | "stock-family"
  | "stock-industrial"
  | "stock-kit"
  | "stock-food"
  | "stock-cleaning"
  | "stock-office"
  | "stock-reports"
  | "fleet"
  | "users"
  | "settings";

type PreviewUser = { displayName: string; role: string };

type NavigationItem = {
  id: ShellView;
  label: string;
  icon: typeof LayoutDashboard;
  children?: { label: string; target: ShellView }[];
};

const navigation: NavigationItem[] = [
  { id: "home", label: "Início", icon: LayoutDashboard },
  { id: "governance", label: "Gestão", icon: ClipboardCheck },
  { id: "masters", label: "Cadastros", icon: BookOpen },
  { id: "finance", label: "Financeiro", icon: Landmark },
  { id: "documents", label: "Documentos", icon: FileText },
  { id: "records", label: "Contratos", icon: FolderKanban },
  {
    id: "schools",
    label: "Unidades Escolares",
    icon: School,
    children: [
      { label: "Cadastro", target: "schools" },
      { label: "Relatórios", target: "schools-reports" },
    ],
  },
  {
    id: "educa",
    label: "Educa Paço",
    icon: UsersRound,
    children: [
      { label: "Cadastro de Núcleos", target: "educa" },
      { label: "Relatórios", target: "educa-reports" },
    ],
  },
  {
    id: "people",
    label: "Recursos Humanos",
    icon: UserCog,
    children: [
      { label: "Cadastro de Servidores", target: "people" },
      { label: "Ficha Financeira", target: "people" },
      { label: "Holerite", target: "people" },
      { label: "Frequência e movimento", target: "people" },
      { label: "Relatórios", target: "people" },
    ],
  },
  {
    id: "nutrition",
    label: "Nutrição",
    icon: Wheat,
    children: [
      { label: "Planejamento semanal", target: "nutrition-weekly" },
      { label: "Planejamento anual", target: "nutrition-annual" },
    ],
  },
  {
    id: "stock",
    label: "Estoque",
    icon: Package,
    children: [
      { label: "Agricultura Familiar", target: "stock-family" },
      { label: "Industrializado", target: "stock-industrial" },
      { label: "Kit do Aluno", target: "stock-kit" },
      { label: "Estoque Alimentação Escolar", target: "stock-food" },
      { label: "Estoque Material de Limpeza", target: "stock-cleaning" },
      { label: "Estoque Material de Expediente", target: "stock-office" },
      { label: "Relatórios", target: "stock-reports" },
    ],
  },
  {
    id: "fleet",
    label: "Frota",
    icon: Truck,
    children: [
      { label: "Cadastro de Veículos", target: "fleet" },
      { label: "Abastecimento", target: "fleet" },
      { label: "Manutenção", target: "fleet" },
      { label: "Ocorrências", target: "fleet" },
      { label: "Relatórios", target: "fleet" },
    ],
  },
  { id: "users", label: "Usuários", icon: ShieldCheck },
  { id: "settings", label: "Configurações", icon: Settings2 },
];

function isSectionActive(item: NavigationItem, activeView: ShellView) {
  return item.id === activeView || item.children?.some((child) => child.target === activeView);
}

export function shellViewLabel(view: ShellView) {
  if (view === "welcome") return "Boas-vindas";
  if (view === "nutrition-weekly" || view === "nutrition-annual") return "Nutrição";
  if (view.startsWith("stock-")) return "Estoque";
  if (view.startsWith("schools")) return "Unidades Escolares";
  if (view.startsWith("educa")) return "Educa Paço";
  return navigation.find((item) => item.id === view)?.label ?? "SIGA SEMED";
}

const searchIndex = navigation.flatMap((item) => [
  { key: item.id, label: item.label, context: "Módulo", view: item.id },
  ...(item.children ?? []).map((child) => ({ key: `${item.id}-${child.target}-${child.label}`, label: child.label, context: item.label, view: child.target })),
]);

function normalizeSearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim();
}

export default function SemedOperationalShell({
  user,
  activeView,
  onViewChange,
  onPassword,
  onLogout,
  isViewAllowed,
  logo,
  children,
}: {
  user: PreviewUser;
  activeView: ShellView;
  onViewChange: (view: ShellView) => void;
  onPassword: () => void;
  onLogout: () => void;
  isViewAllowed?: (view: ShellView) => boolean;
  logo: string;
  children: React.ReactNode;
}) {
  const [openGroup, setOpenGroup] = useState<ShellView | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const userInitials = user.displayName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "SM";
  const normalizedSearch = normalizeSearch(searchQuery);
  const searchResults = normalizedSearch
    ? searchIndex.filter((entry) => isViewAllowed?.(entry.view) !== false && normalizeSearch(`${entry.label} ${entry.context}`).includes(normalizedSearch)).slice(0, 7)
    : [];

  function chooseView(view: ShellView) {
    onViewChange(view);
  }

  function chooseSearchResult(view: ShellView) {
    chooseView(view);
    setSearchQuery("");
    setSearchOpen(false);
  }

  return (
    <div className="siga-shell">
      <aside className="siga-shell-sidebar" aria-label="Navegação principal">
        <button className="siga-shell-mark" type="button" onClick={() => chooseView("welcome")} aria-label="Abrir boas-vindas">
          <img src={logo} alt="SEMED" />
          <span>
            <small>Prefeitura de Paço do Lumiar</small>
            <strong>SEMED</strong>
          </span>
        </button>

        <nav className="siga-shell-nav">
          {navigation.map((item) => {
            const Icon = item.icon;
            const selected = isSectionActive(item, activeView);
            const expanded = openGroup === item.id;
            const allowed = isViewAllowed?.(item.id) ?? true;
            if (!item.children) {
              return (
                <button
                  className={`siga-nav-item ${selected ? "active" : ""}`}
                  key={item.id}
                  type="button"
                  data-restricted={!allowed || undefined}
                  title={allowed ? item.label : `${item.label} · acesso restrito`}
                  onClick={() => chooseView(item.id)}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            }
            return (
              <div className={`siga-nav-group ${selected ? "has-active" : ""}`} key={item.id}>
                <button
                  className={`siga-nav-item ${selected ? "active" : ""}`}
                  type="button"
                  data-restricted={!allowed || undefined}
                  title={allowed ? item.label : `${item.label} · acesso restrito`}
                  aria-expanded={expanded}
                  onClick={() => setOpenGroup((current) => (current === item.id ? null : item.id))}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{item.label}</span>
                  <ChevronDown className={expanded ? "open" : ""} size={15} aria-hidden="true" />
                </button>
                {expanded ? (
                  <div className="siga-nav-submenu">
                    {item.children.map((child) => (
                      <button key={child.label} type="button" onClick={() => chooseView(child.target)}>
                        {child.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="siga-shell-sidebar-footer">
          <div className="siga-shell-sidebar-art" aria-hidden="true" />
          <div>
            <CalendarDays size={16} aria-hidden="true" />
            <span>Ambiente seguro<br />e monitorado</span>
          </div>
        </div>
      </aside>

      <section className="siga-shell-main">
        <header className="siga-shell-header">
          <div className="siga-shell-header-title">
            <span>Secretaria Municipal de Educação</span>
            <strong>{shellViewLabel(activeView)}</strong>
            <small>Visão geral e acesso rápido aos principais recursos.</small>
          </div>
          <div className="siga-shell-search" aria-label="Buscar no sistema">
            <Search size={17} aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              placeholder="Buscar no sistema..."
              aria-label="Buscar módulos e áreas do sistema"
              aria-expanded={searchOpen && Boolean(normalizedSearch)}
              aria-controls="siga-shell-search-results"
              onFocus={() => setSearchOpen(true)}
              onChange={(event) => { setSearchQuery(event.target.value); setSearchOpen(true); }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && searchResults[0]) { event.preventDefault(); chooseSearchResult(searchResults[0].view); }
                if (event.key === "Escape") { setSearchOpen(false); event.currentTarget.blur(); }
              }}
            />
            {searchOpen && normalizedSearch ? <div className="siga-shell-search-results" id="siga-shell-search-results" role="listbox">
              {searchResults.length ? searchResults.map((entry) => <button key={entry.key} type="button" role="option" onMouseDown={(event) => event.preventDefault()} onClick={() => chooseSearchResult(entry.view)}><span>{entry.label}</span><small>{entry.context}</small></button>) : <p>Nenhum módulo ou contexto encontrado.</p>}
            </div> : null}
          </div>
          <div className="siga-shell-account">
            <button className="siga-header-icon" type="button" onClick={() => onViewChange("governance")} title="Alertas locais">
              <BellRing size={17} aria-hidden="true" />
            </button>
            <span className="siga-shell-avatar" aria-hidden="true">{userInitials}</span>
            <div className="siga-shell-user">
              <span>{user.displayName}</span>
              <small>{user.role}</small>
            </div>
            <button className="siga-header-text-button" type="button" onClick={onPassword}>Minha senha</button>
            <button className="siga-header-icon exit" type="button" onClick={onLogout} title="Sair">
              <LogOut size={17} aria-hidden="true" />
            </button>
          </div>
        </header>
        <div className="siga-shell-content">{children}</div>
      </section>
    </div>
  );
}
