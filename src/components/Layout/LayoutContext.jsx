import { createContext } from "react";

export const LayoutContext = createContext({
    isLogin: false,
    userBalance: "",
    supportWhatsApp: "",
    supportTelegram: "",
    supportEmail: "",
    supportParent: "",
    handleLoginClick: () => { },
    handleLogoutClick: () => { },
    handleChangePasswordClick: () => { },
    refreshBalance: () => { },
    setShowFullDivLoading: () => { },
    isSidebarExpanded: true,
    toggleSidebar: () => { },
    launchGameFromSearch: () => {},
});
