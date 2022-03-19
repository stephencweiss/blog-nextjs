import * as React from "react";
import { PillProps } from "@/components/Pill";
import { ExpandedNote } from "types/post";
export type PillInput = {
  id: string;
  count?: number;
  type: "category" | "isPrivate" | "tag";
  path?: string;
};

export function createPill({
  id,
  count = 0,
  type,
  path,
}: PillInput): PillProps {
  const Component = path ? `a` : `div`;
  return {
    id: `${type}-${id}`,
    path,
    component: (
      <Component className={`pill ${type}`}>
        {id}
        {count ? `-${count}` : ""}
      </Component>
    ),
  };
}

export function createPillsFromNote(note: ExpandedNote): PillProps[] {
  const { isPrivate, tags, category } = note;
  const privatePills = isPrivate
    ? [createPill({ id: "Private", type: "isPrivate" })]
    : [];
  const tagPills =
    tags?.map((tag) =>
      createPill({
        id: tag,
        type: "tag",
        path: `/search?q=${tag}&type=search&target=tag`,
      })
    ) ?? [];
  const categoryPills =
    category?.map((c) =>
      createPill({
        id: c,
        type: "category",
        path: `/search?q=${c}&type=search&target=category`,
      })
    ) ?? [];
  return [...privatePills, ...categoryPills, ...tagPills];
}
