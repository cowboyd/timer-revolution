import { createSignal, call, first, each, spawn, sleep, type Operation } from "effection";
import { render } from "$revolution";

export default function* TimerIsland(): Operation<void> {
  let reset = createSignal<void>();
  let start = createSignal<void>();
  let stop = createSignal<void>();

  let elapsed = 0;
  let t0 = performance.now();

  yield* spawn(function*() {
    for (let _ of yield* each(reset)) {
      elapsed = 0;
      t0 = performance.now();
      yield* renderView();
      yield* each.next();
    }
  });

  function* renderView() {
    yield* render(
      <Timer value={elapsed} start={start.send} stop={stop.send} reset={reset.send} />
    );
  }

  yield* renderView();

  while (true) {
    yield* first(start);
    t0 = performance.now();

    yield* call(function*() {
      yield* spawn(function*() {
        while (true) {
          elapsed = Math.round(elapsed + performance.now() - t0);
          yield* renderView();
          yield* sleep(100);
        }
      });

      yield* first(stop);
    });
  }
}

interface TimerOptions {
  value?: number;
  start?(): void;
  stop?(): void;
  reset?(): void;
}

function Timer(props: TimerOptions) {
  return (
    <>
      <button onclick={props.start}>start</button>
      <button onclick={props.stop}>stop</button>
      <button onclick={props.reset}>reset</button>

      <span>{String(props.value)} ms</span>
    </>
  );
}

export function placeholder() {
  return <Timer value={0}/ >
}
