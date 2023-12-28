- Chart (V2)
  - [x] Limit bounds of zooming out
  - [ ] FPS meter
  - [ ] Intervals

- IntervalChart
  - Currently, IntervalChart story sometimes show empty canvas. Why?
  - Adding/Removing interval chart will cause all other elements to re-add their instructions
  - Maybe remove layout from drawing instructions and calculate it in the worker thread?

- [ ] Fix touchpad zooming performance by debouncing "manipulation end" event
- [ ] What about bitblt optimization of horizontal drag?..
- [ ] Move LabelSettings to <*Legend/> props
- [ ] Refactor worker.ts and think out a way to couple components and theirs in-worker drawing functions
- [ ] Merge YAxisProvider into BoundsManager
- [ ] Limit max zoom

- [x] Think about better "drawers" registration
- [x] Proper per-canvas FPS calculation (almost)
- [x] Get rid of react-scripts
