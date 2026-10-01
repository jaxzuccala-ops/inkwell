import { EventBus } from "../event-bus.js";
import { StatsService } from "../../services/stats.service.js";

EventBus.on("post.published", () => {
  StatsService.incrementPostsPublished();
});
