import { z } from "zod";

// Base match creation schema
export const matchCreateSchema = z
  .object({
    championship_id: z
      .number({
        required_error: "Selecione um campeonato",
        invalid_type_error: "Selecione um campeonato válido",
      })
      .refine((val) => val > 0, {
        message: "Selecione um campeonato válido",
      }),
    teamA_id: z
      .number({
        required_error: "Selecione o primeiro time",
        invalid_type_error: "Selecione um time válido",
      })
      .refine((val) => val > 0, {
        message: "Selecione um time válido",
      }),
    teamB_id: z
      .number({
        required_error: "Selecione o segundo time",
        invalid_type_error: "Selecione um time válido",
      })
      .refine((val) => val > 0, {
        message: "Selecione um time válido",
      }),
    stage: z
      .string({
        required_error: "Informe a fase da partida",
      })
      .min(1, "A fase é obrigatória"),
    map: z
      .string({
        required_error: "Selecione o mapa",
      })
      .min(1, "O mapa é obrigatório"),
    date: z
      .string({
        required_error: "Selecione a data e hora",
      })
      .min(1, "A data é obrigatória"),
  })
  .refine((data) => data.teamA_id !== data.teamB_id, {
    message: "Os times devem ser diferentes",
    path: ["teamB_id"],
  });

// Match update/result schema
export const matchUpdateSchema = z.object({
  winner_team_id: z
    .number({
      required_error: "Selecione o time vencedor",
      invalid_type_error: "Selecione um time válido",
    })
    .refine((val) => val > 0, {
      message: "Selecione o time vencedor",
    }),
  score: z.object({
    teamA: z
      .number({
        required_error: "Informe a pontuação do time A",
        invalid_type_error: "A pontuação deve ser um número",
      })
      .min(0, "A pontuação deve ser positiva")
      .max(50, "Pontuação muito alta"),
    teamB: z
      .number({
        required_error: "Informe a pontuação do time B",
        invalid_type_error: "A pontuação deve ser um número",
      })
      .min(0, "A pontuação deve ser positiva")
      .max(50, "Pontuação muito alta"),
  }),
});

export type MatchCreateFormValues = z.infer<typeof matchCreateSchema>;
export type MatchUpdateFormValues = z.infer<typeof matchUpdateSchema>;

// Match interface matching the API response
export interface Match {
  match_id: number;
  championship_id: number;
  teamA_id: number;
  teamB_id: number;
  date: string;
  stage: "Oitavas de Final" | "Quartas de Final" | "Semifinal" | "Final";
  bracket: "upper" | "lower";
  winner_team_id: number | null;
  score: {
    teamA: number;
    teamB: number;
  } | null;
  map: string;
  status: "Agendada" | "Marcada" | "Finalizada";
  next_match_id: number | null;
  TeamA: {
    team_id: number;
    name: string;
  };
  TeamB: {
    team_id: number;
    name: string;
  };
  WinnerTeam: {
    team_id: number;
    name: string;
  } | null;
}

// Combined form values for editing
export interface MatchFormValues extends MatchCreateFormValues {
  match_id?: number;
  winner_team_id?: number;
  score?: {
    teamA: number;
    teamB: number;
  };
}

// Available maps list
export const AVAILABLE_MAPS = [
  "Ascent",
  "Bind",
  "Breeze",
  "Fracture",
  "Haven",
  "Icebox",
  "Lotus",
  "Pearl",
  "Split",
  "Sunset",
] as const;

// Available stages
export const AVAILABLE_STAGES = [
  "Oitavas de final",
  "Quartas de final",
  "Semifinal",
  "Final",
] as const;

// Runtime validation helpers
export const validateMatchCreate = (data: unknown): MatchCreateFormValues => {
  return matchCreateSchema.parse(data);
};

export const validateMatchUpdate = (data: unknown): MatchUpdateFormValues => {
  return matchUpdateSchema.parse(data);
};
