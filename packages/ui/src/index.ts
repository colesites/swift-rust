export { default as COMPONENTS } from "./components.js";
export type { ComponentInfo } from "./components.js";

import * as p from "@clack/prompts";

export interface InitOptions {
  cwd?: string;
  targetDir?: string;
  yes?: boolean;
  overwrite?: boolean;
}

export interface AddOptions {
  cwd?: string;
  names?: string[];
  all?: boolean;
  targetDir?: string;
  yes?: boolean;
  overwrite?: boolean;
}

export interface AddResult {
  added: string[];
  skipped: string[];
  overwritten: string[];
}

export async function init(options: InitOptions = {}): Promise<void> {
  const { init } = await import("./cli.js");
  return init(options);
}

export async function add(options: AddOptions = {}): Promise<void> {
  const { add } = await import("./cli.js");
  return add(options);
}

export async function list(): Promise<void> {
  const { list } = await import("./cli.js");
  return list();
}

export async function prompt(
  message: string,
  options: { choices: string[]; multiple?: boolean },
): Promise<string | string[]> {
  if (options.multiple) {
    const result = await p.multiselect({
      message,
      options: options.choices.map((value) => ({ value, label: value })),
      required: true,
    });
    if (p.isCancel(result)) return [];
    return result as string[];
  }
  const result = await p.select({
    message,
    options: options.choices.map((value) => ({ value, label: value })),
  });
  if (p.isCancel(result)) return "";
  return result as string;
}
