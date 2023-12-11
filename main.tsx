import { main, suspend } from "effection";
import { createRevolution, useIsland } from "revolution";
import { islands } from "./island.config.ts";

await main(function*() {
  let revolution = createRevolution({
    *app() {
      let Timer = yield* useIsland<{value: number}>("timer.tsx");

      return (
        <html>
          <body>
            <ul>
              <li><Timer value={0} /></li>
              <li><Timer value={10000} /></li>
            </ul>
          </body>
        </html>
      )
    },
    plugins: [islands],
  });

  let server = yield* revolution.start();
  console.log(`revolution -> http://${server.hostname}:${server.port}`);

  yield* suspend();
})
