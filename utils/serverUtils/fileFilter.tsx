import fs from "fs/promises";
import path from "path";

/**
 * Within the parentDir, return only children which are valid files
 */
export const fileFilter = async (parentDir: string, fileName: string) => {
  const fullPath = path.join(parentDir, fileName);
  return (await fs.stat(fullPath)).isFile();
};
