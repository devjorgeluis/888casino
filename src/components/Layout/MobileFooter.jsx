import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutContext } from "./LayoutContext";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";


const MobileFooter = ({
    isSlotsOnly,
    isMobile,
    supportParent,
    openSupportModal,
    handleLogoutClick,
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isSidebarExpanded, toggleSidebar, setShowMobileSearch } = useContext(LayoutContext);
    const { contextData } = useContext(AppContext);

    const [expandedMenus, setExpandedMenus] = useState([]);
    const [liveCasinoMenus, setLiveCasinoMenus] = useState([]);
    const [hasFetchedLiveCasino, setHasFetchedLiveCasino] = useState(false);

    const isLoggedIn = !!contextData?.session;

    const toggleMenu = (menuId) => {
        setExpandedMenus((prev) =>
            prev.includes(menuId)
                ? prev.filter((item) => item !== menuId)
                : [...prev, menuId]
        );
    };

    const isMenuExpanded = (menuId) => expandedMenus.includes(menuId);

    // Fetch live casino categories
    useEffect(() => {
        if (!hasFetchedLiveCasino) {
            callApi(
                contextData,
                "GET",
                "/get-page?page=livecasino",
                (result) => {
                    if (result.status === 500 || result.status === 422) return;

                    const menus = [{ name: "Inicio", code: "home", href: "/live-casino#home" }];
                    result.data.categories.forEach((element) => {
                        menus.push({
                            name: element.name,
                            href: `/live-casino#${element.code}`,
                            code: element.code,
                        });
                    });

                    setLiveCasinoMenus(menus);
                    setHasFetchedLiveCasino(true);
                },
                null
            );
        }
    }, [hasFetchedLiveCasino, contextData]);

    // Auto-expand based on route
    useEffect(() => {
        const currentPath = location.pathname;
        const hash = location.hash.slice(1);

        if (currentPath.startsWith("/live-casino") && hash && !isMenuExpanded("live-casino")) {
            setExpandedMenus((prev) => [...prev, "live-casino"]);
        }

        if (currentPath.startsWith("/profile") && !isMenuExpanded("profile")) {
            setExpandedMenus((prev) => [...prev, "profile"]);
        }
    }, [location.pathname, location.hash]);

    const handleNavigation = (item) => () => {
        if (item.action) {
            item.action();
        } else if (item.href !== "#") {
            navigate(item.href);
        }
        if (isSidebarExpanded) {
            toggleSidebar();
        }
    };

    const isMenuActive = (item) => {
        const currentPath = location.pathname;
        const hash = location.hash;

        if (item.href === currentPath) return true;
        if (item.href.includes("#")) return location.pathname + location.hash === item.href;
        if (item.id === "profile" && currentPath.startsWith("/profile")) return true;
        return false;
    };

    const isActiveSubmenu = (href) => {
        if (href.includes("#")) return location.pathname + location.hash === href;
        return location.pathname === href;
    };

    const showFullMenu = isSlotsOnly === "false" || isSlotsOnly === false;

    const menuItems = [
        // ... (same as before - Casino, Live Casino, Sports, Profile, Support, Logout)
        {
            id: "casino",
            name: "Casino",
            image: ImgCasino,
            href: "/casino",
            subItems: [
                { name: "Lobby", href: "/casino#home" },
                { name: "Hot", href: "/casino#hot" },
                { name: "Jokers", href: "/casino#joker" },
                { name: "Juegos de Crash", href: "/casino#arcade" },
                { name: "Megaways", href: "/casino#megaways" },
                { name: "Ruletas", href: "/casino#roulette" },
            ],
        },
        ...(showFullMenu
            ? [
                {
                    id: "live-casino",
                    name: "Casino en Vivo",
                    image: ImgLiveCasino,
                    href: "/live-casino",
                    subItems: liveCasinoMenus,
                },
                {
                    id: "sports",
                    name: "Deportes",
                    image: ImgSports,
                    href: "/sports",
                    subItems: [
                        { name: "Inicio", href: "/sports" },
                        { name: "En Vivo", href: "/live-sports" },
                    ],
                },
            ]
            : []),
        // ... Profile, Support, Logout (same as before)
        ...(isLoggedIn
            ? [
                {
                    id: "profile",
                    name: "Cuenta",
                    image: ImgProfile,
                    href: "/profile",
                    subItems: [
                        { name: "Ajustes de Cuenta", href: "/profile/detail" },
                        { name: "Historial de transacciones", href: "/profile/transaction" },
                        { name: "Historial de Casino", href: "/profile/history" },
                    ],
                },
            ]
            : []),
        ...(supportParent
            ? [
                {
                    id: "support",
                    name: "Contactá a Tu Cajero",
                    image: ImgPhone,
                    href: "#",
                    subItems: [],
                    action: () => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        openSupportModal(true);
                    },
                },
            ]
            : []),
        ...(isLoggedIn
            ? [
                {
                    id: "logout",
                    name: "Cerrar sesión",
                    image: ImgLogout,
                    href: "#",
                    subItems: [],
                    action: handleLogoutClick,
                },
            ]
            : []),
    ];

    return (
        <>
            
        </>
    );
};

export default MobileFooter;