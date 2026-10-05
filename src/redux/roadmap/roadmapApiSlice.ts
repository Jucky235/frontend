import { baseApiSlice } from "../apiSlice";

// ==========================================
// --- TYPES & INTERFACES ---
// ==========================================

export type RoadmapNodeStatus =
  "LOCKED" | "AVAILABLE" | "IN_PROGRESS" | "COMPLETED";

// Exercise Types matching AI Generator
export interface FillBlankQuestion {
  sentence: string;
  options: string[];
  answer: string;
}

export interface FillBlankExercise {
  type: "fill_blank";
  title: string;
  questions: FillBlankQuestion[];
}

export interface WordMatchingPair {
  word: string;
  meaning: string;
}

export interface WordMatchingExercise {
  type: "word_matching";
  title: string;
  pairs: WordMatchingPair[];
}

export type Exercise = FillBlankExercise | WordMatchingExercise;

export interface NodeContent {
  exercises: Exercise[];
}

export interface SkillSummary {
  id: number;
  name: string;
  category: string;
  slug: string;
}

export interface RoadmapNode {
  id: string;
  roadmapId: string;
  skillId?: number | null;
  skill?: SkillSummary | null;
  content: NodeContent;
  order: number;
  status: RoadmapNodeStatus;
  isFinal: boolean;
  accuracyAtGeneration?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapData {
  id: string;
  userId: string;
  title: string;
  status: "ACTIVE" | "COMPLETED";
  nodes: RoadmapNode[];
  createdAt: string;
  updatedAt: string;
}

// Request Payload (Optional if using JWT on backend)
export interface GenerateRoadmapPayload {
  userId?: string;
}

// Response Wrapper matching Controller output
export interface GenerateRoadmapData {
  userId: string;
  roadmapId: string;
  generatedNodesCount: number;
  nodes: RoadmapNode[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// Update Node Status Payload
export interface UpdateNodeStatusPayload {
  nodeId: string;
  status: RoadmapNodeStatus;
  userId?: string; // Optional userId hint for precise tag invalidation
}

// ==========================================
// --- RTK QUERY ENDPOINT INJECTION ---
// ==========================================

export const roadmapApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get Roadmap for current authenticated user (or optional target userId)
    getUserRoadmap: builder.query<ApiResponse<RoadmapData>, string | void>({
      query: (userId) => ({
        url: "/roadmap",
        method: "GET",
        params: userId ? { userId } : undefined,
      }),
      providesTags: (result, _error, userId) => [
        { type: "Roadmap" as const, id: "LIST" },
        {
          type: "Roadmap" as const,
          id: result?.data?.userId || userId || "CURRENT",
        },
      ],
    }),

    // Generate or Re-generate Roadmap for User
    generateRoadmap: builder.mutation<
      ApiResponse<GenerateRoadmapData>,
      GenerateRoadmapPayload | void
    >({
      query: (body) => ({
        url: "/roadmap/generate",
        method: "POST",
        body: body ?? {},
      }),
      invalidatesTags: (result, _error, arg) => [
        { type: "Roadmap" as const, id: "LIST" },
        {
          type: "Roadmap" as const,
          id: result?.data?.userId || arg?.userId || "CURRENT",
        },
      ],
    }),

    // Update Progress/Status of a specific Roadmap Node
    updateNodeStatus: builder.mutation<
      ApiResponse<RoadmapNode>,
      UpdateNodeStatusPayload
    >({
      query: ({ nodeId, status }) => ({
        url: `/roadmap/nodes/${nodeId}/status`,
        method: "PATCH",
        body: { status },
      }),
      // Guarantee cache refetch across all matching queries
      invalidatesTags: (result, _error, arg) => [
        { type: "Roadmap" as const, id: "LIST" },
        { type: "Roadmap" as const, id: result?.data?.roadmapId },
        { type: "Roadmap" as const, id: arg.userId || "CURRENT" },
      ],
      // Optimistically update the local cache for immediate UI feedback
      async onQueryStarted(
        { nodeId, status, userId },
        { dispatch, queryFulfilled },
      ) {
        const patchResult = dispatch(
          roadmapApiSlice.util.updateQueryData(
            "getUserRoadmap",
            userId || "",
            (draft) => {
              if (!draft?.data?.nodes) return;
              const targetNode = draft.data.nodes.find((n) => n.id === nodeId);
              if (targetNode) {
                targetNode.status = status;
              }
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetUserRoadmapQuery,
  useGenerateRoadmapMutation,
  useUpdateNodeStatusMutation,
} = roadmapApiSlice;
