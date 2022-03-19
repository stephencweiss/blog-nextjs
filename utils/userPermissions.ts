import { User } from "../types/index";

export function isAdmin(user?: User): boolean {
  return Boolean(user?.admin);
}

export function canViewPrivateNotes(user?: User): boolean {
  return isAdmin(user);
}
