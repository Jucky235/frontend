import { baseApiSlice } from "../apiSlice";

// =============================
// Types
// =============================

export interface UserRanking {
  user_id: string;
  name: string;

  social_rank: number;
  social_score: number;

  chat_message_count?: number;
  forum_post_count?: number;
  forum_comment_count?: number;

  post_upvotes_received?: number;
  comment_upvotes_received?: number;

  post_votes_given?: number;
  comment_votes_given?: number;

  posts_saved?: number;
}

export interface UserSkillSummary {
  user_id: string;

  skill_id: number;

  skill_name: string;

  category: string;

  parent_skill_id: number | null;

  total_questions: number;

  correct_questions: number;

  incorrect_questions: number;

  accuracy: number;
}

export interface UserSkillPerformance {
  user_id: string;

  skill_id: number;
  skill_name: string;

  parent_skill_id: number | null;
  parent_skill_name: string | null;

  attempted_questions: number;
  correct_questions: number;
  incorrect_questions: number;

  accuracy: number;
  confidence: "LOW" | "MEDIUM" | "HIGH";
}

export interface UserWeakSkill {
  skill_id: number;

  skill_name: string;

  parent_skill_name: string | null;

  attempted_questions: number;

  accuracy: number;

  confidence: "LOW" | "MEDIUM" | "HIGH";
}

// =============================
// API
// =============================

export const analyticsApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // =====================================================
    // Community Ranking
    // =====================================================

    getUserRanking: builder.query<UserRanking[], void>({
      query: () => ({
        url: "/analytics/ranking",
        method: "GET",
      }),

      providesTags: [
        {
          type: "Analytics",
          id: "RANKING",
        },
      ],
    }),

    // =====================================================
    // User Skill Summary
    // Dashboard overview
    // Parent skills only
    // =====================================================

    getUserSkillSummary: builder.query<UserSkillSummary[], string>({
      query: (userId) => ({
        url: `/analytics/users/${userId}/skills`,
        method: "GET",
      }),

      providesTags: (_result, _error, userId) => [
        {
          type: "Analytics",
          id: `SKILL_SUMMARY_${userId}`,
        },
      ],
    }),

    // =====================================================
    // User Skill Detail
    // Child skills
    // AI + detailed analysis
    // =====================================================

    getUserSkillPerformance: builder.query<UserSkillPerformance[], string>({
      query: (userId) => ({
        url: `/analytics/users/${userId}/skills/detail`,
        method: "GET",
      }),

      providesTags: (_result, _error, userId) => [
        {
          type: "Analytics",
          id: `SKILL_DETAIL_${userId}`,
        },
      ],
    }),

    // =====================================================
    // Weak Skills
    // AI roadmap generator
    // =====================================================

    getUserWeakSkills: builder.query<
      UserWeakSkill[],
      {
        userId: string;
        limit?: number;
      }
    >({
      query: ({ userId, limit = 10 }) => ({
        url: `/analytics/users/${userId}/weak-skills`,
        method: "GET",
        params: {
          limit,
        },
      }),

      providesTags: (_result, _error, { userId }) => [
        {
          type: "Analytics",
          id: `WEAK_SKILLS_${userId}`,
        },
      ],
    }),
  }),
});

// =============================
// Hooks
// =============================

export const {
  useGetUserRankingQuery,

  useGetUserSkillSummaryQuery,

  useGetUserSkillPerformanceQuery,

  useGetUserWeakSkillsQuery,
} = analyticsApiSlice;
