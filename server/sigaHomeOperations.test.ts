import { describe, expect, it } from "vitest";
import { createLocalSemedDatabase, markLocalUserMessageRead, saveLocalAgendaEvent, saveLocalUserMessage, saveLocalUserNote } from "../client/src/pages/sigaLocalStore";

describe("Agenda, mensagens e lembretes locais", () => {
  it("persiste evento, mensagem e lembrete somente no banco local", () => {
    const database = createLocalSemedDatabase();
    const event = saveLocalAgendaEvent(database, { userId: "u-admin", type: "Reunião", title: "Revisar planejamento local", eventDate: "2026-09-01", startTime: "09:00", priority: "Alta", reminderDays: 1, notes: "Registro demonstrativo", status: "Agendado" }, "u-admin", "2026-08-27T10:00:00.000Z");
    expect(event.error).toBeNull();
    expect(database.semedAgendaEvents[0]).toMatchObject({ title: "Revisar planejamento local", status: "Agendado", userId: "u-admin" });

    const message = saveLocalUserMessage(database, { senderUserId: "u-admin", recipientUserId: "u-tecnico1", subject: "Comunicado local", message: "Verifique a agenda demonstrativa.", priority: "Média", expiresAt: "" }, "u-admin", "2026-08-27T10:01:00.000Z");
    expect(message.error).toBeNull();
    expect(database.semedUserMessages[0]).toMatchObject({ senderUserId: "u-admin", recipientUserId: "u-tecnico1", senderName: "Administrador" });
    expect(markLocalUserMessageRead(database, message.message!.id, "u-tecnico1", "2026-08-27T10:02:00.000Z")).toBe(true);
    expect(database.semedUserMessageReads).toHaveLength(1);

    const note = saveLocalUserNote(database, { content: "Lembrete demonstrativo individual." }, "u-tecnico1", "2026-08-27T10:03:00.000Z");
    expect(note.error).toBeNull();
    expect(database.semedUserNotes[0]).toMatchObject({ userId: "u-tecnico1", content: "Lembrete demonstrativo individual." });
  });

  it("bloqueia leitura de mensagem por outro destinatário e escrita no Início sem permissão", () => {
    const database = createLocalSemedDatabase();
    const message = saveLocalUserMessage(database, { senderUserId: "u-admin", recipientUserId: "u-tecnico1", subject: "Aviso", message: "Mensagem local", priority: "Baixa", expiresAt: "" }, "u-admin");
    expect(markLocalUserMessageRead(database, message.message!.id, "u-tecnico2")).toBe(false);
    database.semedUserPermissions = database.semedUserPermissions.filter((permission) => !(permission.userId === "u-tecnico2" && permission.moduleKey === "inicio"));
    const denied = saveLocalAgendaEvent(database, { userId: "u-tecnico2", type: "Atividade", title: "Registro bloqueado", eventDate: "2026-09-02", startTime: "", priority: "Média", reminderDays: 0, notes: "", status: "Agendado" }, "u-tecnico2");
    expect(denied.error).toContain("sem permissão");
  });
});
