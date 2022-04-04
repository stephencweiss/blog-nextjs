import React, { ReactElement } from "react";
import { getLayout as getDefaultLayout } from "./default";

const PostLayout = ({ children }: React.PropsWithChildren<any>) => {
  return <article className="mt-10">{children}</article>;
};

export const getPostLayout = (page: ReactElement) =>
  getDefaultLayout(<PostLayout>{page}</PostLayout>);
