import * as React from "react";
import { PillProps } from "../components/Pill";
import { ExpandedNote } from "types/index";
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
      <Component className={`pill ${type} ${path ? "link" : ""}`}>
        {id}
        {count ? `-${count}` : ""}
      </Component>
    ),
  };
}

export function createCategoryPills({
  category,
}: Pick<ExpandedNote, "category">) {
  return (
    category?.map((c) =>
      createPill({
        id: c,
        type: "category",
        path: `/search?q=${c}&type=search&target=category`,
      })
    ) ?? []
  );
}

export function createTagPills({ tags }: Pick<ExpandedNote, "tags">) {
  return (
    tags?.map((tag) =>
      createPill({
        id: tag,
        type: "tag",
        path: `/search?q=${tag}&type=search&target=tags`,
      })
    ) ?? []
  );
}

export function createPillsFromNote(
  note: ExpandedNote,
  maxPillCount?: number
): PillProps[] {
  const { isPrivate } = note;
  const privatePills = isPrivate
    ? [createPill({ id: "private", type: "isPrivate" })]
    : [];
  const categoryPills = createCategoryPills(note);
  const tagPills = createTagPills(note);

  const pills = [...privatePills, ...categoryPills, ...tagPills];

  if (maxPillCount && pills.length > maxPillCount) {
    pills.splice(maxPillCount);
    pills.push(createPill({ id: "...", type: "tag" }));
  }

  return pills;
}
