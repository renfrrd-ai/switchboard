import type { Board } from "./types";

/**
 * First-run data. Loaded once, when nothing has been saved on this device yet.
 * After that the saved board is the source of truth.
 */
export function seedBoard(): Board {
  return {
    projects: [
      { id: "csc211", area: "school", name: "CSC211 project", note: "FaceOff: age-range prediction, four approaches", stage: "Building", lastTouched: "2026-09-29", nextStep: "Get the eval data ready for the Oct 6 lab", active: false },
      { id: "clueline", area: "products", name: "Clueline", note: "AI error management", stage: "Planned", lastTouched: "2026-08-20", nextStep: "Scaffold @clueline/core in the clueline-js repo", active: true },
      { id: "trueluk", area: "products", name: "Trueluk", note: "Signup risk scoring", stage: "Planned", lastTouched: "2026-10-02", nextStep: "Create the repo and a one-page site", active: true },
      { id: "uofthub", area: "products", name: "UofTHub", note: "Project sharing for U of T students", stage: "Building", lastTouched: "2026-09-30", nextStep: "Finalize the laptop-lid design", active: true },
      { id: "skoolcentral", area: "products", name: "SkoolCentral", note: "UofTHub for any school", stage: "Idea", lastTouched: "2026-09-29", nextStep: "List what changes per school: logo, colors, subdomain", active: false },
      { id: "penciil", area: "products", name: "Penciil", note: "Assessment platform for schools", stage: "MVP", lastTouched: "2026-08-02", nextStep: "Start the CAC incorporation paperwork", active: false },
      { id: "winnersbase", area: "products", name: "WinnersBase", note: "Social network of Bases and Wins", stage: "Planned", lastTouched: "2026-08-15", nextStep: "Pick a Stitch template for the UI", active: false },
      { id: "devtool", area: "products", name: "devtool.fyi", note: "Directory of developer tools", stage: "Idea", lastTouched: "2026-10-02", nextStep: "List the first tools to feature", active: false },
      { id: "chess", area: "builds", name: "Ceiling chess", note: "Gaze-controlled chess on a projector", stage: "Building", lastTouched: "2026-09-23", nextStep: "Get the board showing through the projector with keyboard input", active: false },
      { id: "ropes", area: "builds", name: "Rope topology site", note: "3D knot puzzles to solve and share", stage: "Idea", lastTouched: "2026-09-24", nextStep: "Render one rope in 3D in the browser", active: false },
      { id: "hackathon", area: "builds", name: "Hackathon points system", note: "QR scans for points", stage: "Building", lastTouched: "2026-08-14", nextStep: "Build the scan endpoint with the duplicate-scan check", active: false },
      { id: "math", area: "content", name: "Mathematical Foundations", note: "Video series for MAT102 and CSC110", stage: "Planned", lastTouched: "2026-09-24", nextStep: "Record Video 0: how to use the series", active: false },
      { id: "aphorisms", area: "content", name: "Aphorisms", note: "Three-line sayings, social brand", stage: "Idea", lastTouched: "2026-08-14", nextStep: "Write the story framing for one aphorism and post it", active: false },
      { id: "panel", area: "commitments", name: "Workshop review panel", note: "Reviewing student workshop applications", stage: "Ongoing", lastTouched: "2026-10-01", nextStep: "", active: false },
    ],
    deadlines: [
      { id: "d1", date: "2026-10-06", label: "Eval data ready", source: "CSC211 lab milestone" },
      { id: "d2", date: "2026-10-13", label: "Deep learning approach added", source: "CSC211 lab milestone" },
      { id: "d3", date: "2026-10-20", label: "Progress report due", source: "CSC211, worth 4%" },
      { id: "d4", date: "2026-11-17", label: "LLM approach, full comparison, poster", source: "CSC211 lab milestone" },
      { id: "d5", date: "2026-11-27", label: "Poster submission", source: "CSC211" },
      { id: "d6", date: "2026-11-30", label: "Showcase in labs", source: "CSC211, Nov 30 to Dec 1" },
    ],
  };
}
