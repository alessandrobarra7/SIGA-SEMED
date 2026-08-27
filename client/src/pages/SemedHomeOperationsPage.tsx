import React, { FormEvent, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Mail, Send } from "lucide-react";
import type { SemedAgendaEvent, SemedAgendaEventInput, SemedLocalAccessUser, SemedUserMessage, SemedUserMessageInput, SemedUserMessageRead } from "./sigaLocalStore";
import "./siga-home-operations.css";

const isoToday = () => new Date().toISOString().slice(0, 10);
const displayDate = (value: string) => value ? new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR") : "Sem prazo";

type Props = {
  user: SemedLocalAccessUser;
  users: SemedLocalAccessUser[];
  events: SemedAgendaEvent[];
  messages: SemedUserMessage[];
  messageReads: SemedUserMessageRead[];
  canWrite: boolean;
  onSaveEvent: (input: SemedAgendaEventInput) => { error: string | null };
  onSaveMessage: (input: SemedUserMessageInput) => { error: string | null };
  onMarkMessageRead: (messageId: string) => boolean;
  onNotify: (message: string) => void;
};

export default function SemedHomeOperationsPage({ user, users, events, messages, messageReads, canWrite, onSaveEvent, onSaveMessage, onMarkMessageRead, onNotify }: Props) {
  const [agendaOpen, setAgendaOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState(isoToday());
  const [eventType, setEventType] = useState("Compromisso");
  const [eventPriority, setEventPriority] = useState<SemedAgendaEvent["priority"]>("Média");
  const [eventTime, setEventTime] = useState("09:00");
  const [eventNotes, setEventNotes] = useState("");
  const [recipientUserId, setRecipientUserId] = useState("");
  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");

  const ownEvents = useMemo(() => events.filter((event) => event.userId === user.id && event.status !== "Cancelado").sort((first, second) => `${first.eventDate}${first.startTime}`.localeCompare(`${second.eventDate}${second.startTime}`)), [events, user.id]);
  const inbox = useMemo(() => messages.filter((message) => message.recipientUserId === user.id && (!message.expiresAt || message.expiresAt >= isoToday())).sort((first, second) => second.createdAt.localeCompare(first.createdAt)), [messages, user.id]);
  const unread = inbox.filter((message) => !messageReads.some((read) => read.messageId === message.id && read.userId === user.id)).length;
  const recipients = users.filter((candidate) => candidate.id !== user.id && candidate.active);

  function saveEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = onSaveEvent({ userId: user.id, title: eventTitle, eventDate, type: eventType, startTime: eventTime, priority: eventPriority, reminderDays: 1, notes: eventNotes, status: "Agendado" });
    if (result.error) return onNotify(result.error);
    setEventTitle(""); setEventNotes(""); setAgendaOpen(false); onNotify("Evento salvo na agenda local.");
  }

  function saveMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = onSaveMessage({ senderUserId: user.id, recipientUserId, subject: messageSubject, message: messageBody, priority: "Média", expiresAt: "" });
    if (result.error) return onNotify(result.error);
    setRecipientUserId(""); setMessageSubject(""); setMessageBody(""); setMessageOpen(false); onNotify("Mensagem enviada somente no ambiente local.");
  }

  return <section className="siga-home-operations" aria-label="Agenda, mensagens e lembretes locais">
    <div className="siga-home-operations-grid">
      <section className="siga-home-operation-card" aria-labelledby="agenda-local-title">
        <header><div><p className="siga-kicker">Agenda local</p><h2 id="agenda-local-title">Agenda e compromissos</h2><span>Eventos vinculados somente ao usuário atual neste navegador.</span></div><button type="button" className="siga-primary-button" disabled={!canWrite} onClick={() => setAgendaOpen((current) => !current)}><CalendarDays size={16} />Novo evento</button></header>
        {agendaOpen ? <form className="siga-data-form siga-home-operation-form" onSubmit={saveEvent}><label className="wide">Título do evento<input required value={eventTitle} onChange={(event) => setEventTitle(event.target.value)} placeholder="Ex.: Conferir planejamento local" /></label><label>Tipo<select value={eventType} onChange={(event) => setEventType(event.target.value)}><option>Compromisso</option><option>Reunião</option><option>Prazo</option><option>Atividade</option></select></label><label>Data<input required type="date" value={eventDate} onChange={(event) => setEventDate(event.target.value)} /></label><label>Horário<input type="time" value={eventTime} onChange={(event) => setEventTime(event.target.value)} /></label><label>Prioridade<select value={eventPriority} onChange={(event) => setEventPriority(event.target.value as SemedAgendaEvent["priority"])}><option>Baixa</option><option>Média</option><option>Alta</option></select></label><label className="wide">Observações<textarea value={eventNotes} onChange={(event) => setEventNotes(event.target.value)} rows={2} /></label><footer><button type="button" className="siga-secondary-button" onClick={() => setAgendaOpen(false)}>Cancelar</button><button type="submit" className="siga-primary-button">Salvar evento</button></footer></form> : null}
        <div className="siga-home-event-list">{ownEvents.length ? ownEvents.slice(0, 6).map((event) => <article key={event.id}><time dateTime={event.eventDate}>{displayDate(event.eventDate)}{event.startTime ? ` · ${event.startTime}` : ""}</time><div><strong>{event.title}</strong><small>{event.type} · Prioridade {event.priority}{event.notes ? ` · ${event.notes}` : ""}</small></div>{event.status === "Concluído" ? <span className="siga-status-pill good">Concluído</span> : <button type="button" aria-label={`Concluir ${event.title}`} disabled={!canWrite} onClick={() => { const result = onSaveEvent({ ...event, status: "Concluído" }); if (result.error) onNotify(result.error); else onNotify("Evento concluído localmente."); }}><CheckCircle2 size={16} />Concluir</button>}</article>) : <p className="siga-home-operation-empty">Nenhum evento cadastrado na agenda local.</p>}</div>
      </section>

      <section className="siga-home-operation-card" aria-labelledby="messages-local-title">
        <header><div><p className="siga-kicker">Comunicados internos</p><h2 id="messages-local-title">Mensagens</h2><span>{unread ? `${unread} mensagem(ns) não lida(s) para este perfil.` : "Não há mensagens não lidas para este perfil."}</span></div><button type="button" className="siga-secondary-button" disabled={!canWrite} onClick={() => setMessageOpen((current) => !current)}><Send size={16} />Nova mensagem</button></header>
        {messageOpen ? <form className="siga-data-form siga-home-operation-form" onSubmit={saveMessage}><label>Destinatário<select required value={recipientUserId} onChange={(event) => setRecipientUserId(event.target.value)}><option value="">Selecione</option>{recipients.map((recipient) => <option key={recipient.id} value={recipient.id}>{recipient.displayName} · {recipient.profile}</option>)}</select></label><label>Assunto<input required value={messageSubject} onChange={(event) => setMessageSubject(event.target.value)} placeholder="Assunto do comunicado" /></label><label className="wide">Mensagem<textarea required value={messageBody} onChange={(event) => setMessageBody(event.target.value)} rows={3} placeholder="Escreva o comunicado demonstrativo" /></label><footer><button type="button" className="siga-secondary-button" onClick={() => setMessageOpen(false)}>Cancelar</button><button type="submit" className="siga-primary-button">Enviar mensagem</button></footer></form> : null}
        <div className="siga-home-message-list">{inbox.length ? inbox.slice(0, 5).map((message) => { const isRead = messageReads.some((read) => read.messageId === message.id && read.userId === user.id); return <button type="button" key={message.id} className={isRead ? "read" : "unread"} onClick={() => { if (!isRead) onMarkMessageRead(message.id); }}><Mail size={16} /><span><strong>{message.subject}</strong><small>{message.senderName} · {message.message}</small></span>{!isRead ? <em>Nova</em> : null}</button>; }) : <p className="siga-home-operation-empty">Nenhum comunicado local disponível.</p>}</div>
      </section>
    </div>
  </section>;
}
