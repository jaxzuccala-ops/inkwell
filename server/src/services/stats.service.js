let totalPostsPublished = 0;

export const StatsService = {
  incrementPostsPublished() {
    totalPostsPublished += 1;
  },

  getStats() {
    return {
      totalPostsPublished,
    };
  },
};