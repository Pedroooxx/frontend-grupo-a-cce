/**
 * Services index file for easier imports
 */

// Authentication
export * from "./authService";

// Entity services
export * from "./agentService";
export * from "./userService";
export {
  participantService,
  useGetParticipantById,
  useCreateParticipant,
  useUpdateParticipant,
  useDeleteParticipant,
} from "./participantService";
export {
  teamService,
  useGetAllTeams,
  useGetTeamById,
  useCreateTeam,
  useUpdateTeam,
  useDeleteTeam,
  useValidateTeam,
} from "./teamService";
export {
  championshipService,
  useGetAllChampionships,
  useGetChampionshipById,
  useCreateChampionship,
  useUpdateChampionship,
  useDeleteChampionship,
} from "./championshipService";
export * from "./subscriptionService";
export * from "./matchService";
export * from "./statisticsService";

// Base services (used by other services)
export * from "./reactQueryService";

// Re-exporting to resolve ambiguity
export { useGetAllParticipants } from "./participantService";
export { useGetChampionshipMatches } from "./championshipService";
