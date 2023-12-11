import { islandPlugin } from "revolution";
import * as timerIsland from "./islands/timer.tsx";

export const islands = islandPlugin({
  islandsDir: import.meta.resolve("./islands"),
  modules: {
    "timer.tsx": timerIsland,
  }
})
