import {
  Ban,
  CheckCircle2,
  History,
  KeyRound,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  UserCheck,
  UserCog,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import React, { FormEvent, useMemo, useState } from "react";
import {
  defaultModuleKeysForProfile,
  SEMED_USER_PROFILES,
  type SemedLocalAccessUser,
  type SemedLocalUser,
  type SemedLocalUserAudit,
  type SemedLocalUserInput,
  type SemedLocalUserOperation,
  type SemedLocalUserPermission,
  type SemedModuleKey,
  type SemedUserProfile,
} from "./sigaLocalStore";

const schoolUnits = [
  { id: "school-01", label: "Unidade Municipal Horizonte" },
  { id: "school-02", label: "Centro Municipal do Saber" },
  { id: "school-03", label: "Escola Comunitária Caminhos" },
];

const permissionGroups: { label: string; items: { key: SemedModuleKey; label: string }[] }[] = [
  { label: "Base administrativa", items: [
    { key: "inicio", label: "Início" }, { key: "gestao", label: "Gestão" }, { key: "cadastros_gerais", label: "Cadastros" },
    { key: "contratos", label: "Contratos" }, { key: "documentos", label: "Documentos" }, { key: "financeiro", label: "Financeiro" },
  ] },
  { label: "Rede e pessoas", items: [
    { key: "unidades_escolares", label: "Unidades Escolares" }, { key: "educa_paco", label: "Educa Paço" }, { key: "rh", label: "Recursos Humanos" },
    { key: "rh.cadastro_servidores", label: "RH · Cadastro" }, { key: "rh.ficha_financeira", label: "RH · Ficha Financeira" },
    { key: "rh.holerite", label: "RH · Holerite" }, { key: "rh.frequencia", label: "RH · Frequência" }, { key: "rh.relatorios", label: "RH · Relatórios" },
  ] },
  { label: "Operação", items: [
    { key: "nutricao", label: "Nutrição" }, { key: "estoque", label: "Estoque" }, { key: "estoque.industrializado", label: "Estoque · Industrializado" },
    { key: "estoque.agricultura_familiar", label: "Estoque · Agricultura Familiar" }, { key: "estoque.kit_aluno", label: "Estoque · Kit do Aluno" },
    { key: "estoque.categorias", label: "Estoque · Categorias" }, { key: "estoque.relatorios", label: "Estoque · Relatórios" }, { key: "frota", label: "Frota" },
  ] },
];
const permissionOptions = permissionGroups.flatMap((group) => group.items);

type UsersPageProps = {
  currentUser: SemedLocalAccessUser;
  users: SemedLocalUser[];
  permissions: SemedLocalUserPermission[];
  auditLog: SemedLocalUserAudit[];
  onCreate: (input: SemedLocalUserInput) => SemedLocalUserOperation;
  onUpdate: (userId: string, input: SemedLocalUserInput) => SemedLocalUserOperation;
  onSetActive: (userId: string, active: boolean) => boolean;
  onIssuePassword: (userId: string) => SemedLocalUserOperation;
  onTerminateSessions: (userId: string) => number;
  onNotify: (message: string) => void;
};

type UserFormState = {
  displayName: string;
  registration: string;
  cpf: string;
  profile: SemedUserProfile;
  active: boolean;
  schoolUnitId: string;
  serverRegistrationId: string;
  moduleKeys: SemedModuleKey[];
};

const emptyForm: UserFormState = {
  displayName: "", registration: "", cpf: "", profile: "Técnico", active: true, schoolUnitId: "", serverRegistrationId: "", moduleKeys: ["inicio"],
};

function maskCpf(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 11 ? `***.${digits.slice(3, 6)}.${digits.slice(6, 9)}-**` : "—";
}

function displayDateTime(value: string) {
  return value ? new Date(value).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "Nunca";
}

function userPermissionKeys(userId: string, permissions: SemedLocalUserPermission[]) {
  return permissions.filter((permission) => permission.userId === userId && permission.granted).map((permission) => permission.moduleKey);
}

function UserEditor({ initial, permissions, onClose, onSave }: { initial: SemedLocalUser | null; permissions: SemedLocalUserPermission[]; onClose: () => void; onSave: (input: SemedLocalUserInput) => SemedLocalUserOperation }) {
  const [form, setForm] = useState<UserFormState>(() => initial ? {
    displayName: initial.displayName,
    registration: initial.registration,
    cpf: initial.cpf,
    profile: initial.profile,
    active: initial.active,
    schoolUnitId: initial.schoolUnitId,
    serverRegistrationId: initial.serverRegistrationId,
    moduleKeys: userPermissionKeys(initial.id, permissions),
  } : emptyForm);
  const [message, setMessage] = useState("");
  const loginByCpf = form.profile === "Auditoria Externa" || form.profile === "Contadora Municipal";
  const needsSchool = form.profile === "Gestor Escolar" || form.profile === "Secretário Escolar";
  const editablePermissions = form.profile === "Técnico";

  function changeProfile(profile: SemedUserProfile) {
    const cpfProfile = profile === "Auditoria Externa" || profile === "Contadora Municipal";
    setForm((current) => ({ ...current, profile, registration: cpfProfile ? "" : current.registration, cpf: cpfProfile ? current.cpf : "", schoolUnitId: profile === "Gestor Escolar" || profile === "Secretário Escolar" ? current.schoolUnitId : "", moduleKeys: profile === "Técnico" ? current.moduleKeys : defaultModuleKeysForProfile(profile) }));
    setMessage("");
  }

  function togglePermission(key: SemedModuleKey) {
    setForm((current) => ({ ...current, moduleKeys: current.moduleKeys.includes(key) ? current.moduleKeys.filter((item) => item !== key) : [...current.moduleKeys, key] }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = onSave(form);
    if (result.error) return setMessage(result.error);
    onClose();
  }

  return <div className="siga-user-editor-scrim" role="presentation">
    <form className="siga-user-editor" onSubmit={submit}>
      <header><div><p>{initial ? "Manutenção de acesso" : "Novo acesso"}</p><h2>{initial ? `Editar ${initial.displayName}` : "Cadastrar usuário"}</h2><span>Dados demonstrativos locais, sem vínculo com o ambiente original.</span></div><button type="button" aria-label="Fechar cadastro" onClick={onClose}><X size={18} /></button></header>
      <div className="siga-user-form-grid">
        <label className="wide">Nome completo<input required value={form.displayName} onChange={(event) => setForm((current) => ({ ...current, displayName: event.target.value }))} placeholder="Nome do usuário" /></label>
        <label>Perfil<select aria-label="Perfil" value={form.profile} onChange={(event) => changeProfile(event.target.value as SemedUserProfile)}>{SEMED_USER_PROFILES.map((profile) => <option key={profile}>{profile}</option>)}</select></label>
        <label>Situação<select value={form.active ? "Ativo" : "Inativo"} onChange={(event) => setForm((current) => ({ ...current, active: event.target.value === "Ativo" }))}><option>Ativo</option><option>Inativo</option></select></label>
        <label>Tipo de acesso<select aria-label="Tipo de acesso" value={loginByCpf ? "cpf" : "matricula"} disabled><option value="matricula">Matrícula</option><option value="cpf">CPF</option></select></label>
        {loginByCpf ? <label>CPF para acesso<input required inputMode="numeric" value={form.cpf} onChange={(event) => setForm((current) => ({ ...current, cpf: event.target.value }))} placeholder="000.000.000-00" /></label> : <label>Matrícula para acesso<input required value={form.registration} onChange={(event) => setForm((current) => ({ ...current, registration: event.target.value }))} placeholder="00000000-0" /></label>}
        <label>Vínculo no RH<input value={form.serverRegistrationId} onChange={(event) => setForm((current) => ({ ...current, serverRegistrationId: event.target.value }))} placeholder="Matrícula funcional opcional" /></label>
        {needsSchool ? <label className="wide">Unidade escolar<select required value={form.schoolUnitId} onChange={(event) => setForm((current) => ({ ...current, schoolUnitId: event.target.value }))}><option value="">Selecione uma unidade</option>{schoolUnits.map((unit) => <option key={unit.id} value={unit.id}>{unit.label}</option>)}</select></label> : null}
      </div>
      <section className="siga-user-permissions"><div><p>Permissões de módulos</p><span>{editablePermissions ? "Selecione os módulos e submódulos liberados para o Técnico." : "Este perfil recebe permissões automáticas conforme a regra funcional definida."}</span></div>{editablePermissions ? <div className="siga-permission-groups">{permissionGroups.map((group) => <fieldset key={group.label}><legend>{group.label}</legend>{group.items.map((item) => <label key={item.key}><input type="checkbox" checked={form.moduleKeys.includes(item.key)} onChange={() => togglePermission(item.key)} /><span>{item.label}</span></label>)}</fieldset>)}</div> : <div className="siga-auto-permission"><ShieldCheck size={18} aria-hidden="true" /><strong>{defaultModuleKeysForProfile(form.profile).length} permissões automáticas</strong><span>Edição manual bloqueada para este perfil; as regras serão aplicadas no salvamento.</span></div>}</section>
      {message ? <p className="siga-form-message" role="alert">{message}</p> : null}
      <footer><button type="button" className="siga-secondary-button" onClick={onClose}>Cancelar</button><button type="submit" className="siga-primary-button">{initial ? "Salvar alterações" : "Cadastrar usuário"}</button></footer>
    </form>
  </div>;
}

export default function SemedUsersPage({ currentUser, users, permissions, auditLog, onCreate, onUpdate, onSetActive, onIssuePassword, onTerminateSessions, onNotify }: UsersPageProps) {
  const [query, setQuery] = useState("");
  const [profileFilter, setProfileFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [loginTypeFilter, setLoginTypeFilter] = useState("Todos");
  const [permissionFilter, setPermissionFilter] = useState("Todas");
  const [editor, setEditor] = useState<SemedLocalUser | "new" | null>(null);
  const [expandedUserId, setExpandedUserId] = useState("");
  const [auditUserId, setAuditUserId] = useState("");
  const [provisional, setProvisional] = useState<{ user: string; password: string } | null>(null);

  const filteredUsers = useMemo(() => users.filter((user) => {
    const haystack = `${user.displayName} ${user.registration} ${user.username} ${user.profile} ${user.schoolUnitId} ${user.serverRegistrationId}`.toLocaleLowerCase("pt-BR");
    const permissionKeys = userPermissionKeys(user.id, permissions);
    return haystack.includes(query.toLocaleLowerCase("pt-BR")) && (profileFilter === "Todos" || user.profile === profileFilter) && (statusFilter === "Todos" || (statusFilter === "Ativos" ? user.active : !user.active)) && (loginTypeFilter === "Todos" || user.loginType === loginTypeFilter) && (permissionFilter === "Todas" || permissionKeys.includes(permissionFilter as SemedModuleKey));
  }).sort((left, right) => left.displayName.localeCompare(right.displayName, "pt-BR")), [loginTypeFilter, permissionFilter, permissions, profileFilter, query, statusFilter, users]);

  const canManage = currentUser.profile === "Administrador";
  const auditEntries = auditLog.filter((entry) => entry.userId === auditUserId);

  function saveNew(input: SemedLocalUserInput) {
    const result = onCreate(input);
    if (!result.error && result.user && result.provisionalPassword) {
      setProvisional({ user: result.user.displayName, password: result.provisionalPassword });
      onNotify("Usuário cadastrado na simulação local.");
    }
    return result;
  }

  function saveExisting(user: SemedLocalUser, input: SemedLocalUserInput) {
    const result = onUpdate(user.id, input);
    if (!result.error) onNotify("Cadastro do usuário atualizado localmente.");
    return result;
  }

  function issuePassword(user: SemedLocalUser) {
    const result = onIssuePassword(user.id);
    if (result.provisionalPassword) setProvisional({ user: user.displayName, password: result.provisionalPassword });
    if (!result.error) onNotify("Nova senha provisória gerada e sessões encerradas.");
  }

  return <section className="siga-management-page siga-users-page">
    <header className="siga-page-heading"><div><p className="siga-kicker">Administração de acesso</p><h1>Usuários</h1><span>Cadastre usuários por matrícula ou CPF, aplique perfis e acompanhe alterações na base demonstrativa local.</span></div>{canManage ? <button className="siga-page-primary" type="button" onClick={() => setEditor("new")}><Plus size={16} aria-hidden="true" />Novo usuário</button> : null}</header>

    <section className="siga-user-summary">
      <article><UsersRound size={18} /><span>Total</span><strong>{users.length}</strong></article>
      <article className="good"><UserCheck size={18} /><span>Ativos</span><strong>{users.filter((user) => user.active).length}</strong></article>
      <article className="warning"><KeyRound size={18} /><span>Primeiro acesso</span><strong>{users.filter((user) => user.mustChangePassword).length}</strong></article>
      <article className="neutral"><ShieldCheck size={18} /><span>Perfis externos</span><strong>{users.filter((user) => user.loginType === "cpf").length}</strong></article>
    </section>

    {!canManage ? <div className="siga-users-restricted"><Ban size={21} /><div><strong>Administração restrita</strong><span>Somente o perfil Administrador pode cadastrar e alterar usuários.</span></div></div> : null}

    <section className="siga-users-panel">
      <div className="siga-user-toolbar"><label><Search size={16} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nome, matrícula, perfil ou vínculo..." /></label><select aria-label="Filtrar por perfil" value={profileFilter} onChange={(event) => setProfileFilter(event.target.value)}><option>Todos</option>{SEMED_USER_PROFILES.map((profile) => <option key={profile}>{profile}</option>)}</select><select aria-label="Filtrar por situação" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>Todos</option><option>Ativos</option><option>Inativos</option></select><select aria-label="Filtrar por tipo de login" value={loginTypeFilter} onChange={(event) => setLoginTypeFilter(event.target.value)}><option value="Todos">Todos os acessos</option><option value="matricula">Matrícula</option><option value="cpf">CPF</option></select><select aria-label="Filtrar por permissão" value={permissionFilter} onChange={(event) => setPermissionFilter(event.target.value)}><option value="Todas">Todas as permissões</option>{permissionOptions.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}</select></div>
      <div className="siga-users-list">{filteredUsers.map((user) => {
        const expanded = expandedUserId === user.id;
        const userPermissions = userPermissionKeys(user.id, permissions);
        return <article className={expanded ? "expanded" : ""} key={user.id}>
          <button className="siga-user-row" type="button" onClick={() => setExpandedUserId(expanded ? "" : user.id)}><span className="siga-user-avatar"><UserRound size={17} /></span><span className="siga-user-main"><small>{user.loginType === "cpf" ? "Acesso por CPF" : `Matrícula ${user.registration || user.username}`}</small><strong>{user.displayName}</strong><em>{user.schoolUnitId ? schoolUnits.find((unit) => unit.id === user.schoolUnitId)?.label : user.serverRegistrationId || "Vínculo institucional local"}</em></span><span className="siga-user-profile">{user.profile}</span><span className={`siga-status-pill ${user.active ? "good" : ""}`}>{user.active ? "Ativo" : "Inativo"}</span></button>
          {expanded ? <div className="siga-user-detail"><div className="siga-user-detail-grid"><span><small>Identificador</small>{user.loginType === "cpf" ? maskCpf(user.cpf) : user.registration || user.username}</span><span><small>Último acesso</small>{displayDateTime(user.lastLoginAt)}</span><span><small>Primeiro acesso</small>{user.mustChangePassword ? "Pendente" : "Concluído"}</span><span><small>Permissões</small>{userPermissions.length} módulo(s)</span></div><div className="siga-user-actions">{canManage ? <><button type="button" onClick={() => setEditor(user)}><Pencil size={14} />Editar</button><button type="button" onClick={() => issuePassword(user)}><KeyRound size={14} />Nova senha provisória</button><button type="button" onClick={() => { const count = onTerminateSessions(user.id); onNotify(`${count} sessão(ões) local(is) encerrada(s).`); }}><ShieldCheck size={14} />Encerrar sessões</button><button type="button" className={user.active ? "danger" : "success"} onClick={() => { onSetActive(user.id, !user.active); onNotify(`Usuário ${user.active ? "desativado" : "ativado"} localmente.`); }}>{user.active ? <Ban size={14} /> : <CheckCircle2 size={14} />}{user.active ? "Desativar" : "Ativar"}</button></> : null}<button type="button" onClick={() => setAuditUserId(user.id)}><History size={14} />Auditoria</button></div></div> : null}
        </article>;
      })}{!filteredUsers.length ? <div className="siga-master-empty"><Search size={20} /><strong>Nenhum usuário encontrado</strong><span>Ajuste a pesquisa ou os filtros aplicados.</span></div> : null}</div>
    </section>

    {editor ? <UserEditor initial={editor === "new" ? null : editor} permissions={permissions} onClose={() => setEditor(null)} onSave={(input) => editor === "new" ? saveNew(input) : saveExisting(editor, input)} /> : null}
    {provisional ? <div className="siga-provisional-scrim"><section className="siga-provisional-card"><span><KeyRound size={20} /></span><p>Senha provisória local</p><h2>{provisional.user}</h2><code>{provisional.password}</code><small>Copie agora. O valor é exibido uma única vez e não é registrado na auditoria.</small><button type="button" onClick={() => setProvisional(null)}>Entendi, fechar</button></section></div> : null}
    {auditUserId ? <div className="siga-user-editor-scrim"><section className="siga-user-audit"><header><div><p>Histórico administrativo</p><h2>Auditoria do usuário</h2><span>{users.find((user) => user.id === auditUserId)?.displayName}</span></div><button type="button" onClick={() => setAuditUserId("")}><X size={18} /></button></header><div>{auditEntries.length ? auditEntries.map((entry) => <article key={entry.id}><span><UserCog size={16} /></span><div><small>{displayDateTime(entry.createdAt)}</small><strong>{entry.action.replace("usuario.", "")}</strong><p>{entry.summary}</p></div></article>) : <div className="siga-master-empty"><History size={20} /><strong>Sem alterações registradas</strong><span>As próximas ações administrativas aparecerão neste histórico local.</span></div>}</div></section></div> : null}
  </section>;
}
