import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Check,
  Play,
  Sparkles,
  RefreshCw,
  X,
  Star,
  Trophy,
  Globe,
  Rocket,
  Compass,
  Orbit,
  ArrowLeft,
} from "lucide-react";

import { selectUserProfile, setLocalProfile } from "@/redux/user/userSlice";
import { useGetUserProfileQuery } from "@/redux/user/userApiSlice";
import {
  useGetUserRoadmapQuery,
  useGenerateRoadmapMutation,
  useUpdateNodeStatusMutation,
  type RoadmapNode,
  type Exercise,
} from "@/redux/roadmap/roadmapApiSlice";

import FillBlankGame from "./fillBlankGame";
import MatchWordGame from "./matchWordGame";

interface GrandHorizontalRoadmapPageProps {
  userId?: string;
}

export default function GrandHorizontalRoadmapPage({
  userId: propUserId,
}: GrandHorizontalRoadmapPageProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: userProfileData, isLoading: isProfileLoading } =
    useGetUserProfileQuery();
  const profile = useSelector(selectUserProfile);

  React.useEffect(() => {
    if (userProfileData && !profile) {
      dispatch(setLocalProfile(userProfileData));
    }
  }, [userProfileData, profile, dispatch]);

  const userId = propUserId || profile?.id || userProfileData?.id || "";

  const {
    data: roadmapResponse,
    isLoading: isRoadmapLoading,
    isError,
  } = useGetUserRoadmapQuery(userId, {
    skip: !userId,
  });

  const [generateRoadmap, { isLoading: isGenerating }] =
    useGenerateRoadmapMutation();
  const [updateNodeStatus] = useUpdateNodeStatusMutation();

  const [selectedNode, setSelectedNode] = React.useState<RoadmapNode | null>(
    null,
  );
  const [activeExerciseIndex, setActiveExerciseIndex] = React.useState(0);
  const [hasAttemptedGeneration, setHasAttemptedGeneration] =
    React.useState(false);

  const roadmap = React.useMemo(() => {
    if (!roadmapResponse) return null;
    return (
      roadmapResponse?.data?.roadmap ||
      roadmapResponse?.data ||
      roadmapResponse?.result ||
      roadmapResponse
    );
  }, [roadmapResponse]);

  const nodes = React.useMemo(() => {
    if (!roadmap) return [];
    const rawNodes =
      roadmap?.nodes || roadmap?.roadmap_nodes || roadmap?.nodeList || [];
    if (!Array.isArray(rawNodes)) return [];
    return [...rawNodes].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [roadmap]);

  const handleGenerateRoadmap = async () => {
    if (!userId) return;
    try {
      await generateRoadmap({ userId }).unwrap();
    } catch (err) {
      console.error("Failed to generate roadmap:", err);
    }
  };

  // Automatically generate roadmap if none exists once data loading finishes
  React.useEffect(() => {
    const isMissingRoadmap = isError || !roadmap || nodes.length === 0;
    if (
      !isProfileLoading &&
      !isRoadmapLoading &&
      userId &&
      isMissingRoadmap &&
      !isGenerating &&
      !hasAttemptedGeneration
    ) {
      setHasAttemptedGeneration(true);
      handleGenerateRoadmap();
    }
  }, [
    isProfileLoading,
    isRoadmapLoading,
    userId,
    isError,
    roadmap,
    nodes,
    isGenerating,
    hasAttemptedGeneration,
  ]);

  // Dynamic Vertical Offsets for Horizontal Wave Track
  const getOffsetYPx = (index: number) => {
    const pattern = [0, -60, 0, 60];
    return pattern[index % 4];
  };

  const handleNodeClick = async (node: RoadmapNode) => {
    if (node.status === "LOCKED") return;

    setSelectedNode(node);
    setActiveExerciseIndex(0);

    if (node.status === "AVAILABLE") {
      try {
        await updateNodeStatus({
          nodeId: node.id,
          status: "IN_PROGRESS",
          userId,
        }).unwrap();

        setSelectedNode((prev) =>
          prev ? { ...prev, status: "IN_PROGRESS" } : null,
        );
      } catch (err) {
        console.error("Failed to update node status to IN_PROGRESS", err);
      }
    }
  };

  const handleExerciseComplete = async () => {
    if (!selectedNode) return;

    const totalExercises = selectedNode.content?.exercises?.length || 0;

    if (activeExerciseIndex + 1 < totalExercises) {
      setActiveExerciseIndex((prev) => prev + 1);
    } else {
      try {
        // 1. Complete current node
        await updateNodeStatus({
          nodeId: selectedNode.id,
          status: "COMPLETED",
          userId,
        }).unwrap();

        // 2. Find and unlock the next node if it is locked
        const currentIndex = nodes.findIndex((n) => n.id === selectedNode.id);
        const nextNode = nodes[currentIndex + 1];

        if (nextNode && nextNode.status === "LOCKED") {
          await updateNodeStatus({
            nodeId: nextNode.id,
            status: "AVAILABLE",
            userId,
          }).unwrap();
        }

        setSelectedNode(null);
      } catch (err) {
        console.error("Failed to complete node and unlock next node", err);
      }
    }
  };

  if (isProfileLoading || isRoadmapLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-brand animate-spin" />
        <p className="text-sm font-bold text-foreground-subtle">
          Building your space roadmap...
        </p>
      </div>
    );
  }

  const showNoRoadmapState = isError || !roadmap || nodes.length === 0;

  return (
    <div className="w-full min-h-screen flex flex-col p-4 sm:p-8 space-y-6 bg-background overflow-hidden relative">
      {/* Generating Modal Overlay (Triggers automatically or on manual retry) */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-background-card border border-border rounded-3xl p-8 shadow-2xl flex flex-col items-center space-y-4 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-brand/10 text-brand rounded-2xl flex items-center justify-center">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-foreground">
                Generating your roadmap
              </h3>
              <p className="text-xs text-foreground-subtle">
                Please wait while we craft your personalized learning journey...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* No Roadmap Fallback View (Shown as a backup if generation fails or hasn't finished) */}
      {showNoRoadmapState && !isGenerating ? (
        <div className="w-full min-h-[80vh] flex items-center justify-center p-6">
          <div className="w-full max-w-md text-center p-8 bg-background-card border border-border rounded-3xl space-y-5 shadow-lg">
            <div className="w-16 h-16 mx-auto bg-brand/10 text-brand rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground">
                No Active Roadmap Found
              </h2>
              <p className="text-xs text-foreground-subtle mt-1">
                Generate a personalized AI learning path to start practicing.
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                type="button"
                disabled={isGenerating || !userId}
                onClick={handleGenerateRoadmap}
                className="w-full py-3.5 rounded-2xl bg-brand text-white font-extrabold flex items-center justify-center space-x-2 shadow-lg shadow-brand/20 hover:bg-brand-hover transition-all disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                <span>Retry Generation</span>
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full py-3 rounded-2xl bg-background-hover border border-border text-foreground font-bold hover:bg-border/40 transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go Back</span>
              </button>
            </div>
          </div>
        </div>
      ) : !showNoRoadmapState ? (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background-card p-6 border border-border rounded-3xl shadow-sm w-full relative z-10">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-brand flex items-center gap-1.5">
                <Rocket className="w-4 h-4" /> Learning Pathway
              </span>
              <h1 className="text-2xl font-black text-foreground">
                {roadmap?.title || "Your Space Odyssey Roadmap"}
              </h1>
            </div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl bg-background-hover border border-border text-foreground font-bold hover:bg-border/40 transition-all flex items-center space-x-2 text-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
          </div>

          {/* Horizontal Track Container */}
          {(() => {
            const nodeWidthPx = 220;
            const startPaddingPx = 100;
            const totalTrackWidth = Math.max(
              nodes.length * nodeWidthPx + startPaddingPx * 2,
              1000,
            );
            const centerY = 200;

            return (
              <section className="relative flex-1 w-full bg-background-card/40 border border-border/80 rounded-3xl overflow-x-auto min-h-[500px] flex items-center py-12 px-6 shadow-inner">
                {/* Ambient Glows */}
                <div className="absolute top-12 left-1/4 w-72 h-72 bg-brand/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-12 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                <div
                  className="relative flex items-center h-[400px] my-auto"
                  style={{ width: `${totalTrackWidth}px` }}
                >
                  {/* Space Decorations */}
                  <div className="absolute inset-0 pointer-events-none select-none z-0">
                    <div className="absolute top-4 left-16 text-amber-500/30 animate-pulse">
                      <Globe className="w-14 h-14" />
                    </div>
                    <div className="absolute bottom-6 right-28 text-indigo-500/30">
                      <Orbit className="w-20 h-20" />
                    </div>
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 text-brand/25 -rotate-45">
                      <Rocket className="w-16 h-16" />
                    </div>
                    <div className="absolute bottom-8 left-1/3 text-emerald-500/20">
                      <Compass className="w-16 h-16" />
                    </div>
                    <Star className="absolute top-12 left-1/4 w-5 h-5 text-amber-400/40 fill-amber-400/20 animate-bounce" />
                    <Sparkles className="absolute bottom-16 left-1/2 w-6 h-6 text-sky-400/40" />
                    <Star className="absolute top-16 right-1/3 w-4 h-4 text-purple-400/40 fill-purple-400/20" />
                    <Sparkles className="absolute top-10 right-16 w-7 h-7 text-yellow-400/40" />
                    <Star className="absolute bottom-10 left-20 w-4 h-4 text-emerald-400/40" />
                  </div>

                  {/* SVG Connection Lines */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ zIndex: 1 }}
                  >
                    {nodes.map((_, index) => {
                      if (index === nodes.length - 1) return null;

                      const startX =
                        startPaddingPx + index * nodeWidthPx + nodeWidthPx / 2;
                      const endX =
                        startPaddingPx +
                        (index + 1) * nodeWidthPx +
                        nodeWidthPx / 2;

                      const startY = centerY + getOffsetYPx(index);
                      const endY = centerY + getOffsetYPx(index + 1);

                      return (
                        <path
                          key={index}
                          d={`M ${startX} ${startY} C ${
                            startX + 80
                          } ${startY}, ${endX - 80} ${endY}, ${endX} ${endY}`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          strokeLinecap="round"
                          className="text-border/80 opacity-60"
                        />
                      );
                    })}
                  </svg>

                  {/* Nodes */}
                  <div className="relative z-10 flex items-center w-full px-[100px]">
                    {nodes.map((node, index) => {
                      const offsetY = getOffsetYPx(index);
                      const isCompleted = node.status === "COMPLETED";
                      const isInProgress = node.status === "IN_PROGRESS";
                      const isAvailable = node.status === "AVAILABLE";
                      const isLocked = node.status === "LOCKED";

                      return (
                        <div
                          key={node.id || index}
                          className="relative flex flex-col items-center justify-center shrink-0 transition-all duration-300"
                          style={{
                            width: `${nodeWidthPx}px`,
                            transform: `translateY(${offsetY}px)`,
                          }}
                        >
                          {index % 2 === 0 && (
                            <Sparkles className="absolute -top-6 -right-2 w-4 h-4 text-amber-400/40 pointer-events-none" />
                          )}

                          {(isInProgress || isAvailable) && (
                            <div className="absolute -top-12 z-20 animate-bounce">
                              <div className="bg-brand text-white font-black text-[11px] uppercase tracking-wider px-3.5 py-1.5 rounded-xl shadow-lg border-2 border-white dark:border-neutral-900 flex items-center space-x-1">
                                <Sparkles className="w-3.5 h-3.5 fill-white" />
                                <span>
                                  {isInProgress ? "CONTINUE" : "START"}
                                </span>
                              </div>
                              <div className="w-2.5 h-2.5 bg-brand rotate-45 mx-auto -mt-1.5 border-r border-b border-white dark:border-neutral-900" />
                            </div>
                          )}

                          <button
                            type="button"
                            disabled={isLocked}
                            onClick={() => handleNodeClick(node)}
                            className={`relative group w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center font-black transition-all duration-150 border-b-4 active:border-b-0 active:translate-y-1 cursor-pointer ${
                              isCompleted
                                ? "bg-emerald-500 text-white border-emerald-700 shadow-emerald-500/30 shadow-lg hover:bg-emerald-400"
                                : isInProgress
                                  ? "bg-brand text-white border-brand-hover shadow-brand/40 shadow-xl ring-4 ring-brand/30 animate-pulse hover:bg-brand-hover"
                                  : isAvailable
                                    ? "bg-amber-500 text-white border-amber-700 shadow-amber-500/30 shadow-lg hover:bg-amber-400"
                                    : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 border-neutral-300 dark:border-neutral-900 cursor-not-allowed opacity-80"
                            }`}
                          >
                            {(isInProgress || isAvailable) && (
                              <span className="absolute inset-0 rounded-full animate-ping bg-brand/20 -z-10" />
                            )}

                            {node.isFinal ? (
                              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300" />
                            ) : isCompleted ? (
                              <Check className="w-8 h-8 sm:w-10 sm:h-10 stroke-[3]" />
                            ) : isInProgress ? (
                              <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
                            ) : isAvailable ? (
                              <Star className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
                            ) : (
                              <Lock className="w-7 h-7 sm:w-8 sm:h-8" />
                            )}
                          </button>

                          <div className="mt-3 text-center max-w-[160px]">
                            <p className="text-xs sm:text-sm font-black text-foreground line-clamp-1">
                              {node.isFinal
                                ? "Final Exam"
                                : node.skill?.name ||
                                  `Lesson ${node.order ?? index + 1}`}
                            </p>
                            <p className="text-[11px] font-bold text-foreground-subtle">
                              {node.content?.exercises?.length || 0} Exercises
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })()}
        </>
      ) : null}

      {/* Practice Game Modal */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-background-card border border-border rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <div>
                <span className="text-xs font-black uppercase text-brand tracking-wider">
                  Step #{selectedNode.order} Practice
                </span>
                <h2 className="text-lg font-black text-foreground">
                  Exercise {activeExerciseIndex + 1} of{" "}
                  {selectedNode.content?.exercises?.length || 1}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="p-2 rounded-full hover:bg-background-hover text-foreground-subtle hover:text-foreground transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(() => {
              const currentExercise: Exercise | undefined =
                selectedNode?.content?.exercises?.[activeExerciseIndex];

              return currentExercise ? (
                <div className="py-2">
                  {currentExercise.type === "fill_blank" && (
                    <FillBlankGame
                      exercise={currentExercise}
                      onComplete={handleExerciseComplete}
                    />
                  )}

                  {currentExercise.type === "word_matching" && (
                    <MatchWordGame
                      exercise={currentExercise}
                      onComplete={handleExerciseComplete}
                    />
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-foreground-subtle font-bold">
                  No exercises found in this node.
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
