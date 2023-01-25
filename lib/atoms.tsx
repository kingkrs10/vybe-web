import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
// import { getCurrentUser } from "@/lib/session";

const menuAtom = atom(false);
const selectedMenuAtom = atomWithStorage("menu", "");
const ticketsAtom = atomWithStorage("tickets", []);
const guestsAtom = atomWithStorage("guests", []);
const sessionAtom = atomWithStorage("session", []);
const checkoutStepAtom = atomWithStorage("checkout", 1);
const guestFilledAtom = atom(false);

export {
  menuAtom,
  selectedMenuAtom,
  ticketsAtom,
  checkoutStepAtom,
  guestFilledAtom,
  sessionAtom,
  guestsAtom,
};
