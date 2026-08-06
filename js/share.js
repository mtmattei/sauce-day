// ============================================================================
//  Settle-up text. The transfer list already on the Spend screen, formatted as
//  plain text and put on the clipboard, so nobody retypes numbers into the
//  group chat at the end of the night. Pure formatting over calc.settlement();
//  this module owns no data and no state.
// ============================================================================
import { YEAR, flash } from "./db.js";
import { money } from "./calc.js";
import { h } from "./ui.js";

/** The settlement as chat-ready text. Exported on its own so it can be eyeballed
 *  (or one day tested) without a DOM. */
export function settleUpText(st) {
  const lines = [
    `Sauce Day ${YEAR} — ${money(st.total)} in, ${money(st.share)} each`,
    ...st.transfers.map(t => `${t.from} pays ${t.to} ${money(t.amount)}`)
  ];
  return lines.join("\n");
}

/** The button for the "Who pays whom" card. Renders nothing while there is
 *  nothing to settle. */
export function settleUpButton(st) {
  if (!st.transfers.length) return null;
  return h("div", { class: "btnrow" },
    h("button", { class: "btn", type: "button", onClick: async () => {
      try {
        await navigator.clipboard.writeText(settleUpText(st));
        flash("Copied — paste it in the chat");
      } catch {
        // clipboard API needs https or localhost; anywhere else, say so
        flash("Couldn't copy on this browser", true);
      }
    } }, "Copy for the chat"));
}
