import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const menuAtom = atom(false);
const selectedMenuAtom = atomWithStorage("menu", "");
const ticketsAtom = atomWithStorage("tickets", []);

export { menuAtom, selectedMenuAtom, ticketsAtom };
