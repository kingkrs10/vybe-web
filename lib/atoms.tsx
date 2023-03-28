import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
// import { getCurrentUser } from "@/lib/session";

const menuAtom = atom(false);
const selectedMenuAtom = atomWithStorage("menu", "");
const ticketsAtom = atomWithStorage("tickets", []);
const guestsAtom = atomWithStorage("guests", []);
const sessionAtom = atomWithStorage("session", []);
const totalAtom = atomWithStorage("total", {
  totalAmount: 0,
  subtotal: 0,
  fee: 0,
});
const checkoutStepAtom = atomWithStorage("checkout", 1);
const clientSecretAtom = atomWithStorage("clientSecret", "");
const guestFilledAtom = atom(false);
const completedPurchaseAtom = atom(false);

export {
  menuAtom,
  selectedMenuAtom,
  ticketsAtom,
  checkoutStepAtom,
  guestFilledAtom,
  sessionAtom,
  guestsAtom,
  totalAtom,
  completedPurchaseAtom,
  clientSecretAtom,
};
