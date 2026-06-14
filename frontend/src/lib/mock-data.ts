import {
  ChatMessage,
  DiagnosticCause,
  DiagnosticState,
  Product,
  SourceReference,
  SparePart,
} from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "scooter-rz1",
    name: "Electric Scooter · RZ1",
    category: "Personal mobility",
    icon: "scooter",
    lastService: "12 Mar 2026",
    nextService: "12 Sep 2026",
  },
  {
    id: "ac-coolbreeze",
    name: "Split AC · CoolBreeze 1.5T",
    category: "Home appliance",
    icon: "ac",
    lastService: "02 Jan 2026",
    nextService: "02 Jul 2026",
  },
  {
    id: "washer-spinmax",
    name: "Washing Machine · SpinMax 7kg",
    category: "Home appliance",
    icon: "washer",
    lastService: "20 Apr 2026",
    nextService: "20 Oct 2026",
  },
];

export const INITIAL_DIAGNOSTIC_STATE: DiagnosticState = {
  symptom: "Awaiting symptom",
  status: "idle",
  confidence: 0,
  causes: [],
  sources: [],
  spareParts: [],
};

/* -------------------------------------------------------------------------
   Scripted "horn stopped working" walkthrough — demonstrates the guided
   troubleshooting loop end to end. Each step is keyed by the step index;
   the chat panel advances through the array on every user reply.
   ------------------------------------------------------------------------- */

export interface ScenarioStep {
  assistantText: string;
  quickReplies?: string[];
  diagnosticPatch: Partial<DiagnosticState>;
}

const CAUSES_INITIAL: DiagnosticCause[] = [
  { id: "c1", label: "Blown horn fuse", status: "considering" },
  { id: "c2", label: "Faulty horn relay", status: "considering" },
  { id: "c3", label: "Loose or corroded wiring", status: "considering" },
  { id: "c4", label: "Worn-out horn unit", status: "considering" },
];

const SOURCES_FINAL: SourceReference[] = [
  { id: "s1", type: "diagram", title: "Horn assembly — wiring diagram", detail: "Manual, p. 42" },
  { id: "s2", type: "video", title: "Inspect & replace the horn unit", detail: "4:12 – 5:03" },
  { id: "s3", type: "pdf", title: "Electrical fault isolation chart", detail: "Service guide, p. 18" },
];

const SPARE_PARTS_FINAL: SparePart[] = [
  { id: "p1", name: "Horn assembly (12V)", partNumber: "RZ1-ELE-0117", quantity: 1, estimatedCost: "₹450" },
  { id: "p2", name: "Ground wire terminal", partNumber: "RZ1-WIR-0042", quantity: 1, estimatedCost: "₹35" },
];

export const HORN_SCENARIO: ScenarioStep[] = [
  {
    assistantText:
      "Got it — let's narrow this down together. When you press the horn button, do you hear anything at all, even a faint click from under the dashboard?",
    quickReplies: ["No sound at all", "Faint click, no horn sound", "Sound is weak or distorted"],
    diagnosticPatch: {
      symptom: "start the diagnosis",
      status: "diagnosing",
      confidence: 18,
      causes: CAUSES_INITIAL,
    },
  },
  {
    assistantText:
      "Thanks — a faint click usually means the relay is engaging but the horn itself isn't sounding. That makes a blown fuse unlikely, since the circuit clearly has power. Is the horn warning light on your dashboard on or off right now?",
    quickReplies: ["Warning light is on", "Warning light is off", "Not sure / no light for this"],
    diagnosticPatch: {
      confidence: 52,
      causes: [
        { id: "c1", label: "Blown horn fuse", status: "ruled-out" },
        { id: "c2", label: "Faulty horn relay", status: "considering" },
        { id: "c3", label: "Loose or corroded wiring", status: "considering" },
        { id: "c4", label: "Worn-out horn unit", status: "considering" },
      ],
    },
  },
  {
    assistantText:
      "That confirms it. With the relay clicking, no dashboard warning, and no sound from the horn itself, the relay and fuse are both fine — the fault is downstream at the horn unit or its ground connection. I'm now fairly confident this is a loose ground wire or a worn-out horn unit.\n\nHere's how to check it:\n1. Remove the front apron panel (4 screws, Phillips head).\n2. Locate the horn behind the headlight assembly — it's the small black disc with two wires.\n3. Check the ground wire (usually black) for corrosion or a loose bolt connection.\n4. If the connection looks clean, tap the horn body gently while a helper presses the button — a working unit will buzz faintly even if it's too quiet to hear normally.\n5. If there's still no sound, the horn unit itself needs replacing — it's a direct swap, no soldering required.",
    diagnosticPatch: {
      confidence: 86,
      status: "resolved",
      causes: [
        { id: "c1", label: "Blown horn fuse", status: "ruled-out" },
        { id: "c2", label: "Faulty horn relay", status: "ruled-out" },
        { id: "c3", label: "Loose or corroded wiring", status: "confirmed" },
        { id: "c4", label: "Worn-out horn unit", status: "confirmed" },
      ],
      sources: SOURCES_FINAL,
      spareParts: SPARE_PARTS_FINAL,
    },
  },
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "m0",
    sender: "user",
    text: "start the diagnosis",
    time: "09:41",
  },
];
