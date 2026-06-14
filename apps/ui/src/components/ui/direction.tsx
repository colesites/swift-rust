import * as React from "react";

export type Direction = "ltr" | "rtl";

const DirectionContext = React.createContext<Direction>("ltr");

export function DirectionProvider({ dir, children }: { dir: Direction; children: React.ReactNode }) {
  return (
    <DirectionContext.Provider value={dir}>
      <div dir={dir}>{children}</div>
    </DirectionContext.Provider>
  );
}

export function useDirection(): Direction {
  return React.useContext(DirectionContext);
}
