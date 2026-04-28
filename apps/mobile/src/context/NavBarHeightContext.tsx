import React, { createContext, useContext, useState } from 'react';

const NavBarHeightContext = createContext({ height: 0, setHeight: (_: number) => {} });

export function NavBarHeightProvider({ children }: { children: React.ReactNode }) {
  const [height, setHeight] = useState(0);
  return (
    <NavBarHeightContext.Provider value={{ height, setHeight }}>
      {children}
    </NavBarHeightContext.Provider>
  );
}

export const useNavBarHeight = () => useContext(NavBarHeightContext);
