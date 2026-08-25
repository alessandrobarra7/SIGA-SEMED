import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, KeyRound, LockKeyhole, LogOut, ShieldCheck, UserRound } from "lucide-react";
import WorkspacePreview from "./WorkspacePreview";
import { validateFirstAccess } from "./sigaFlow";
import { SemedLocalAccessUser, useSigaLocalRepository } from "./sigaLocalStore";
import "./siga-pages.css";

type AccessScreen = "checking" | "login" | "firstAccess" | "workspace";

type PreviewUser = SemedLocalAccessUser & { sessionToken: string };

const ASSETS = {
  officialLogo: "/manus-storage/semed-logo_62496e33.png",
  paçoLumiar: "/manus-storage/paco-lumiar-login-reference_c8e73635.webp",
};

function InstitutionalContext() {
  return (
    <aside className="siga-auth-context" aria-label="Identidade institucional">
      <div className="siga-context-image" style={{ backgroundImage: `url(${ASSETS.paçoLumiar})` }} />
      <div className="siga-context-shade" />
      <div className="siga-context-content">
        <div className="siga-context-municipality">
          <img src={ASSETS.officialLogo} alt="Prefeitura de Paço do Lumiar — SEMED" />
          <span>Prefeitura de Paço do Lumiar<br />Secretaria Municipal de Educação</span>
        </div>
        <div className="siga-context-title">
          <p>Sistema Integrado de Gestão e Acompanhamento</p>
          <h1>SIGA SEMED</h1>
        </div>
      </div>
    </aside>
  );
}

function AccessFrame({ children }: { children: React.ReactNode }) {
  return (
    <main className="siga-auth-page">
      <section className="siga-auth-frame">
        <InstitutionalContext />
        <section className="siga-access-sheet">{children}</section>
      </section>
    </main>
  );
}

function CheckingAccess() {
  return (
    <AccessFrame>
      <div className="siga-checking-panel" aria-live="polite">
        <span className="siga-loading-dot" aria-hidden="true" />
        <p>Sistema Integrado de Gestão e Acompanhamento</p>
        <h2>Carregando acesso</h2>
      </div>
    </AccessFrame>
  );
}

function LoginPage({ onLoggedIn }: { onLoggedIn: (username: string) => boolean }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (!username.trim() || !password) {
      setMessage("Informe usuário e senha para continuar.");
      return;
    }
    setIsSubmitting(true);
    window.setTimeout(() => {
      if (!onLoggedIn(username)) setMessage("Usuário não encontrado na simulação local.");
      setIsSubmitting(false);
    }, 480);
  }

  return (
    <AccessFrame>
      <form className="siga-access-form" onSubmit={handleSubmit}>
        <div className="siga-sheet-heading">
          <p>Sistema Integrado de Gestão e Acompanhamento</p>
          <h2>SIGA SEMED</h2>
          <span>Acesso restrito à equipe técnica.</span>
        </div>

        <label className="siga-field">
          <span>Usuário</span>
          <span className="siga-input-wrap">
            <UserRound aria-hidden="true" size={18} />
            <input
              autoComplete="username"
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Ex.: tecnico1"
            />
          </span>
        </label>

        <label className="siga-field">
          <span>Senha</span>
          <span className="siga-input-wrap">
            <LockKeyhole aria-hidden="true" size={18} />
            <input
              autoComplete="current-password"
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Digite sua senha"
            />
          </span>
        </label>

        {message ? <p className="siga-form-message" role="alert">{message}</p> : null}

        <button className="siga-primary-button" type="submit" disabled={isSubmitting}>
          <ArrowRight aria-hidden="true" size={18} />
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </AccessFrame>
  );
}

function FirstAccessPage({ user, onCancel, onChanged }: { user: PreviewUser; onCancel: () => void; onChanged: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const validationMessage = validateFirstAccess(currentPassword, newPassword, confirmPassword);
    if (validationMessage) {
      setMessage(validationMessage);
      return;
    }
    setIsSubmitting(true);
    window.setTimeout(() => {
      onChanged();
      setIsSubmitting(false);
    }, 480);
  }

  return (
    <AccessFrame>
      <form className="siga-access-form siga-first-access-form" onSubmit={handleSubmit}>
        <div className="siga-sheet-heading">
          <p>Primeiro acesso</p>
          <h2>Alterar senha</h2>
          <span>{user.displayName}</span>
        </div>
        <p className="siga-required-note"><ShieldCheck aria-hidden="true" size={17} />Altere a senha temporária antes de acessar o sistema.</p>

        <label className="siga-field">
          <span>Senha atual</span>
          <span className="siga-input-wrap">
            <KeyRound aria-hidden="true" size={18} />
            <input autoComplete="current-password" required type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
          </span>
        </label>
        <label className="siga-field">
          <span>Nova senha</span>
          <span className="siga-input-wrap">
            <KeyRound aria-hidden="true" size={18} />
            <input autoComplete="new-password" minLength={10} required type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
          </span>
        </label>
        <label className="siga-field">
          <span>Confirmar nova senha</span>
          <span className="siga-input-wrap">
            <KeyRound aria-hidden="true" size={18} />
            <input autoComplete="new-password" minLength={10} required type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
          </span>
        </label>

        {message ? <p className="siga-form-message" role="alert">{message}</p> : null}

        <div className="siga-access-actions">
          <button className="siga-secondary-button" type="button" onClick={onCancel}><LogOut aria-hidden="true" size={17} />Sair</button>
          <button className="siga-primary-button" type="submit" disabled={isSubmitting}>{isSubmitting ? "Salvando..." : "Salvar senha"}</button>
        </div>
      </form>
    </AccessFrame>
  );
}

export default function Home() {
  const repository = useSigaLocalRepository();
  const [screen, setScreen] = useState<AccessScreen>("checking");
  const [user, setUser] = useState<PreviewUser | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setScreen("login"), 520);
    return () => window.clearTimeout(timer);
  }, []);

  if (screen === "checking") return <CheckingAccess />;
  if (screen === "login") return <LoginPage onLoggedIn={(username) => {
    const access = repository.login(username);
    if (!access) return false;
    const nextUser = { ...access.user, sessionToken: access.session.tokenHash };
    setUser(nextUser);
    setScreen(access.user.mustChangePassword ? "firstAccess" : "workspace");
    return true;
  }} />;
  if (screen === "firstAccess" && user) return <FirstAccessPage user={user} onCancel={() => { repository.logout(user.sessionToken); setUser(null); setScreen("login"); }} onChanged={() => {
    const updated = repository.completeFirstAccess(user.id);
    if (updated) setUser({ ...updated, sessionToken: user.sessionToken });
    setScreen("workspace");
  }} />;
  if (screen === "workspace" && user) return <WorkspacePreview user={user} onLogout={() => { repository.logout(user.sessionToken); setUser(null); setScreen("login"); }} />;
  return <LoginPage onLoggedIn={() => false} />;
}
