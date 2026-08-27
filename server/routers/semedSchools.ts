import { and, desc, eq, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { semedSchoolClasses, semedSchoolUnits } from "../../drizzle/schema";
import { getDb } from "../db";
import { domainProcedure, router } from "../_core/trpc";

const nonNegative = z.number().int().min(0).max(10_000_000).default(0);
const schoolUnitInput = z.object({
  id: z.string().trim().min(1).max(64).optional(), code: z.string().trim().min(1).max(96), name: z.string().trim().min(1).max(255), schoolType: z.string().trim().max(160).default(""), type: z.enum(["Municipal", "Conveniada"]), status: z.enum(["Ativa", "Inativa"]), censusYear: z.number().int().min(2000).max(2100), neighborhood: z.string().trim().max(160).default(""), address: z.string().trim().default(""), students: nonNegative, hasUex: z.boolean().default(false), hasMap: z.boolean().default(false), inep: z.string().trim().max(32).default(""), email: z.string().trim().max(320).default(""), managerName: z.string().trim().max(255).default(""), phone: z.string().trim().max(64).default(""), notes: z.string().trim().default(""),
  enrollmentCreche: nonNegative, enrollmentPreSchool: nonNegative, enrollmentFundamental1: nonNegative, enrollmentFundamental2: nonNegative, enrollmentEjaiInitial: nonNegative, enrollmentEjaiFinal: nonNegative,
  specialNeedsCreche: nonNegative, specialNeedsPreSchool: nonNegative, enrollmentGrade1: nonNegative, specialNeedsGrade1: nonNegative, enrollmentGrade2: nonNegative, specialNeedsGrade2: nonNegative, enrollmentGrade3: nonNegative, specialNeedsGrade3: nonNegative, enrollmentGrade4: nonNegative, specialNeedsGrade4: nonNegative, enrollmentGrade5: nonNegative, specialNeedsGrade5: nonNegative, enrollmentGrade6: nonNegative, specialNeedsGrade6: nonNegative, enrollmentGrade7: nonNegative, specialNeedsGrade7: nonNegative, enrollmentGrade8: nonNegative, specialNeedsGrade8: nonNegative, enrollmentGrade9: nonNegative, specialNeedsGrade9: nonNegative, specialNeedsEjaiInitial: nonNegative, specialNeedsEjaiFinal: nonNegative,
  propertyType: z.string().trim().max(120).default(""), locationZone: z.string().trim().max(64).default(""), landAreaM2: nonNegative, builtAreaM2: nonNegative, classroomsTotal: nonNegative, classroomsInUse: nonNegative, administrativeRooms: nonNegative, bathroomsTotal: nonNegative, accessibleBathrooms: nonNegative,
  kitchenStatus: z.string().trim().max(96).default(""), cafeteriaStatus: z.string().trim().max(96).default(""), libraryStatus: z.string().trim().max(96).default(""), computerLabStatus: z.string().trim().max(96).default(""), sportsCourtStatus: z.string().trim().max(96).default(""), accessibilityStatus: z.string().trim().max(96).default(""), waterSupply: z.string().trim().max(160).default(""), energySupply: z.string().trim().max(160).default(""), sewageSystem: z.string().trim().max(160).default(""), internetAccess: z.string().trim().max(160).default(""), conservationStatus: z.string().trim().max(96).default(""), structureNotes: z.string().trim().default(""),
});

const schoolClassInput = z.object({
  id: z.string().trim().min(1).max(64).optional(), unitInep: z.string().trim().min(1).max(32), schoolYear: z.number().int().min(2000).max(2100), schoolName: z.string().trim().max(255).default(""), className: z.string().trim().min(1).max(160), classType: z.string().trim().max(160).default(""), students: nonNegative, professionals: nonNegative, sourceRow: z.string().trim().max(96).default(""), source: z.string().trim().max(160).default("Cadastro local"), importedAt: z.string().trim().max(40).default(""),
});

const iso = (value: Date) => value.toISOString();
const key = (value: string) => value.trim().toUpperCase();
export function canManageSchools(actor: { profile: string; permissions: string[] }) {
  if (actor.profile === "Administrador") return true;
  if (actor.profile === "Auditoria Externa" || actor.profile === "Gestor Escolar" || actor.profile === "Secretário Escolar" || actor.profile === "Contadora Municipal") return false;
  return actor.permissions.some((permission) => permission === "unidades_escolares" || permission.startsWith("unidades_escolares."));
}

export function canManageSchoolClasses(actor: { profile: string; permissions: string[] }) {
  return canManageSchools(actor) || (actor.profile === "Técnico" && actor.permissions.includes("unidades.turmas"));
}

async function requireDatabase() {
  const database = await getDb();
  if (!database) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "A persistência de Unidades Escolares não está disponível. O modo local permanece ativo." });
  return database;
}

function toSchoolUnit(row: typeof semedSchoolUnits.$inferSelect) {
  return { ...row, createdAt: iso(row.createdAt), updatedAt: iso(row.updatedAt) };
}

function toSchoolClass(row: typeof semedSchoolClasses.$inferSelect) {
  return { ...row, createdAt: iso(row.createdAt), updatedAt: iso(row.updatedAt) };
}

export const semedSchoolsRouter = router({
  list: domainProcedure.query(async () => {
    const database = await requireDatabase();
    const rows = await database.select().from(semedSchoolUnits).orderBy(desc(semedSchoolUnits.updatedAt));
    return rows.map(toSchoolUnit);
  }),
  save: domainProcedure.input(schoolUnitInput).mutation(async ({ ctx, input }) => {
    if (!canManageSchools(ctx.domainUser)) throw new TRPCError({ code: "FORBIDDEN", message: "Usuário sem permissão para alterar Unidades Escolares." });
    const database = await requireDatabase();
    const code = key(input.code); const id = input.id ?? crypto.randomUUID(); const now = new Date();
    const duplicate = await database.select({ id: semedSchoolUnits.id }).from(semedSchoolUnits).where(eq(semedSchoolUnits.code, code)).limit(1);
    if (duplicate[0] && duplicate[0].id !== input.id) throw new TRPCError({ code: "CONFLICT", message: "Já existe uma unidade escolar com este código." });
    const { id: _, ...data } = input;
    const values = { ...data, code, updatedAt: now };
    if (input.id) await database.update(semedSchoolUnits).set(values).where(eq(semedSchoolUnits.id, id));
    else await database.insert(semedSchoolUnits).values({ ...values, id, createdAt: now });
    const row = (await database.select().from(semedSchoolUnits).where(eq(semedSchoolUnits.id, id)).limit(1))[0];
    if (!row) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Não foi possível confirmar a unidade escolar salva." });
    return toSchoolUnit(row);
  }),
  classes: router({
    list: domainProcedure.query(async () => {
      const database = await requireDatabase();
      const rows = await database.select().from(semedSchoolClasses).orderBy(desc(semedSchoolClasses.updatedAt));
      return rows.map(toSchoolClass);
    }),
    save: domainProcedure.input(schoolClassInput).mutation(async ({ ctx, input }) => {
      if (!canManageSchoolClasses(ctx.domainUser)) throw new TRPCError({ code: "FORBIDDEN", message: "Usuário sem permissão para alterar Turmas." });
      const database = await requireDatabase();
      const unitInep = key(input.unitInep); const className = input.className.trim(); const id = input.id ?? crypto.randomUUID(); const now = new Date();
      const unit = (await database.select().from(semedSchoolUnits).where(or(eq(semedSchoolUnits.inep, unitInep), eq(semedSchoolUnits.code, unitInep))).limit(1))[0];
      if (!unit) throw new TRPCError({ code: "BAD_REQUEST", message: "Unidade Escolar não encontrada para a turma." });
      const duplicate = await database.select({ id: semedSchoolClasses.id }).from(semedSchoolClasses).where(and(eq(semedSchoolClasses.unitInep, unitInep), eq(semedSchoolClasses.schoolYear, input.schoolYear), eq(semedSchoolClasses.className, className))).limit(1);
      if (duplicate[0] && duplicate[0].id !== input.id) throw new TRPCError({ code: "CONFLICT", message: "Já existe uma turma para a unidade, ano letivo e identificação informados." });
      const { id: _, ...data } = input;
      const values = { ...data, unitInep, className, schoolName: unit.name, updatedAt: now };
      if (input.id) await database.update(semedSchoolClasses).set(values).where(eq(semedSchoolClasses.id, id));
      else await database.insert(semedSchoolClasses).values({ ...values, id, createdAt: now });
      const row = (await database.select().from(semedSchoolClasses).where(eq(semedSchoolClasses.id, id)).limit(1))[0];
      if (!row) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Não foi possível confirmar a turma salva." });
      return toSchoolClass(row);
    }),
  }),
});
