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
  School,
  ShieldCheck,
  Truck,
  UserCog,
  UsersRound,
  Wheat,
} from "lucide-react";
import { useState } from "react";

export type ShellView =
  | "welcome"
  | "home"
  | "governance"
  | "masters"
  | "finance"
  | "documents"
  | "records"
  | "schools"
  | "educa"
  | "people"
  | "nutrition"
  | "stock"
  | "fleet"
  | "users";

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
      { label: "Relatórios", target: "schools" },
    ],
  },
  {
    id: "educa",
    label: "Educa Paço",
    icon: UsersRound,
    children: [
      { label: "Cadastro de Núcleos", target: "educa" },
      { label: "Relatórios", target: "educa" },
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
      { label: "Planejamento semanal", target: "nutrition" },
      { label: "Planejamento anual", target: "nutrition" },
    ],
  },
  {
    id: "stock",
    label: "Estoque",
    icon: Package,
    children: [
      { label: "Agricultura Familiar", target: "stock" },
      { label: "Industrializado", target: "stock" },
      { label: "Kit do Aluno", target: "stock" },
      { label: "Estoque Alimentação Escolar", target: "stock" },
      { label: "Estoque Material de Limpeza", target: "stock" },
      { label: "Estoque Material de Expediente", target: "stock" },
      { label: "Relatórios", target: "stock" },
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
];

function isSectionActive(item: NavigationItem, activeView: ShellView) {
  return item.id === activeView || item.children?.some((child) => child.target === activeView);
}

export function shellViewLabel(view: ShellView) {
  if (view === "welcome") return "Boas-vindas";
  return navigation.find((item) => item.id === view)?.label ?? "SIGA SEMED";
}

export default function SemedOperationalShell({
  user,
  activeView,
  onViewChange,
  onPassword,
  onLogout,
  logo,
  children,
}: {
  user: PreviewUser;
  activeView: ShellView;
  onViewChange: (view: ShellView) => void;
  onPassword: () => void;
  onLogout: () => void;
  logo: string;
  children: React.ReactNode;
}) {
  const [openGroup, setOpenGroup] = useState<ShellView | null>(null);

  function chooseView(view: ShellView) {
    onViewChange(view);
  }

  return (
    <div className="siga-shell">
      <aside className="siga-shell-sidebar" aria-label="Navegação principal">
        <button className="siga-shell-mark" type="button" onClick={() => chooseView("welcome")} aria-label="Abrir boas-vindas">
          <img src={logo} alt="SEMED" />
          <span>
            <small>Sistema integrado</small>
            <strong>SIGA SEMED</strong>
          </span>
        </button>

        <nav className="siga-shell-nav">
          {navigation.map((item) => {
            const Icon = item.icon;
            const selected = isSectionActive(item, activeView);
            const expanded = openGroup === item.id;
            if (!item.children) {
              return (
                <button
                  className={`siga-nav-item ${selected ? "active" : ""}`}
                  key={item.id}
                  type="button"
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
          <CalendarDays size={16} aria-hidden="true" />
          <span>Agenda e acompanhamento local</span>
        </div>
      </aside>

      <section className="siga-shell-main">
        <header className="siga-shell-header">
          <div className="siga-shell-header-title">
            <span>Secretaria Municipal de Educação</span>
            <strong>{shellViewLabel(activeView)}</strong>
            <small>Preview local · versão estrutural</small>
          </div>
          <div className="siga-shell-account">
            <button className="siga-header-icon" type="button" onClick={() => onViewChange("governance")} title="Alertas locais">
              <BellRing size={17} aria-hidden="true" />
            </button>
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
