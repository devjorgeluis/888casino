import { createContext } from "react";

export const NavigationContext = createContext({
    selectedPage: "",
    setSelectedPage: () => { },
    getPage: () => { },
    showFullDivLoading: false,
    setShowFullDivLoading: () => { },
});