import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutContext } from "./LayoutContext";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";
import ImgCasino from "/src/assets/svg/casino.svg";
import ImgLiveCasino from "/src/assets/svg/live-casino.svg";
import ImgSports from "/src/assets/svg/sports.svg";
import ImgMobileCasino from "/src/assets/svg/mobile-casino.svg";
import ImgMobileLiveCasino from "/src/assets/svg/mobile-live-casino.svg";
import ImgMobileSports from "/src/assets/svg/mobile-sports.svg";
import ImgProfile from "/src/assets/svg/profile.svg";
import ImgLogout from "/src/assets/svg/logout.svg";
import ImgPhone from "/src/assets/svg/phone.svg";
import ImgMenu from "/src/assets/svg/menu.svg";
import ImgClose from "/src/assets/svg/close.svg";

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
            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-[101] flex flex-col-reverse bg-primary-900">
                <div className="flex w-full items-end justify-between border-t border-theme-secondary/10 rounded-t-2xl py-2">
                    {/* Casino */}
                    <button
                        onClick={handleNavigation({ href: "/casino" })}
                        className="group relative flex flex-1 flex-col items-center gap-1 px-2 py-1 text-primary-50"
                    >
                        <div className="p-1">
                            <img src={ImgMobileCasino} alt="Casino" className="h-5 w-5" />
                        </div>
                        <span className="truncate text-center text-[0.625rem] font-bold leading-normal opacity-50 group-hover:opacity-100 group-focus:opacity-100">
                            Casino
                        </span>
                    </button>

                    {/* Live Casino & Sports */}
                    {showFullMenu && (
                        <>
                            <button
                                onClick={handleNavigation({ href: "/live-casino" })}
                                className="group relative flex flex-1 flex-col items-center gap-1 px-2 py-1 text-primary-50"
                            >
                                <div className="p-1">
                                    <img src={ImgMobileLiveCasino} alt="Casino en vivo" className="h-5 w-5" />
                                </div>
                                <span className="truncate text-center text-[0.625rem] font-bold leading-normal opacity-50 group-hover:opacity-100 group-focus:opacity-100">
                                    Casino en vivo
                                </span>
                            </button>

                            <button
                                onClick={handleNavigation({ href: "/sports" })}
                                className="group relative flex flex-1 flex-col items-center gap-1 px-2 py-1 text-primary-50"
                            >
                                <div className="p-1">
                                    <img src={ImgMobileSports} alt="Deportes" className="h-5 w-5" />
                                </div>
                                <span className="truncate text-center text-[0.625rem] font-bold leading-normal opacity-50 group-hover:opacity-100 group-focus:opacity-100">
                                    Deportes
                                </span>
                            </button>
                        </>
                    )}

                    {/* Search */}
                    <button className="group relative flex flex-1 flex-col items-center gap-1 px-2 py-1 text-primary-50" onClick={() => setShowMobileSearch(true)}>
                        <div className="p-1">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                        </div>
                        <span className="truncate text-center text-[0.625rem] font-bold leading-normal opacity-50 group-hover:opacity-100 group-focus:opacity-100">
                            Buscar
                        </span>
                    </button>

                    {/* Divider */}
                    <div className="h-full w-px bg-primary-50/10" />

                    {/* Menu Button - Changes to Close Icon when open */}
                    <button
                        onClick={toggleSidebar}
                        className="group relative flex flex-1 flex-col items-center gap-1 px-2 py-1 text-primary-50"
                    >
                        <div className="p-1">
                            <img
                                src={isSidebarExpanded ? ImgClose : ImgMenu}
                                alt={isSidebarExpanded ? "Cerrar menú" : "Abrir menú"}
                                className="h-5 w-5"
                            />
                        </div>
                        <span className="truncate text-center text-[0.625rem] font-bold leading-normal opacity-50 group-hover:opacity-100 group-focus:opacity-100">
                            Menú
                        </span>
                    </button>
                </div>
            </nav>

            {/* Mobile Sidebar Overlay */}
            {isSidebarExpanded && (
                <>
                    <div className="fixed inset-0 z-40 bg-black/50" onClick={toggleSidebar} />

                    <aside className="bg-primary-900 text-primary-50 border-theme-secondary/10 flex h-full flex-col justify-between gap-4 border-r text-base [grid-area:_nav] fixed left-0 right-0 top-0 z-[100] max-h-[calc(100dvh-3.25rem)] min-h-[calc(100dvh-3.25rem)] lg:max-w-[15rem] w-full translate-x-0">
                        <nav className="flex flex-col gap-2 p-4">
                            {menuItems.map((item) => (
                                // ... (same sidebar content as before)
                                <div key={item.id} className="relative">
                                    <div className="flex flex-col gap-2 rounded-2xl border border-theme-secondary/10 p-0 hover:border-theme-secondary/20 hover:bg-theme-secondary/[0.02]">
                                        <div className="flex w-full flex-col rounded-2xl">
                                            <div
                                                className="flex items-center justify-between gap-2 pr-4"
                                                {...(item.subItems.length > 0 ? { onClick: () => toggleMenu(item.id) } : {})}
                                            >
                                                <button
                                                    onClick={handleNavigation(item)}
                                                    className="flex flex-1 items-center gap-4 py-4 pl-4 text-sm font-bold"
                                                >
                                                    <img src={item.image} alt={item.name} className="h-5 w-5" />
                                                    <span className="uppercase text-theme-secondary-50">{item.name}</span>
                                                </button>

                                                {item.subItems.length > 0 && (
                                                    <svg
                                                        className={`h-6 w-6 rounded p-1 text-theme-secondary transition-transform duration-200 bg-theme-secondary-300/10 ${isMenuExpanded(item.id) ? "rotate-180" : ""}`}
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                    >
                                                        <path d="m6 9 6 6 6-6" />
                                                    </svg>
                                                )}
                                            </div>

                                            {item.subItems.length > 0 && isMenuExpanded(item.id) && (
                                                <div className="pb-2">
                                                    <div className="flex flex-col gap-1 px-2">
                                                        {item.subItems.map((sub) => (
                                                            <button
                                                                key={sub.href}
                                                                onClick={handleNavigation({ href: sub.href })}
                                                                className={`flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left text-base font-normal text-white hover:bg-theme-secondary/5 lg:text-sm ${isActiveSubmenu(sub.href) ? "bg-theme-secondary/10 text-theme-secondary" : ""}`}
                                                            >
                                                                <span>{sub.name}</span>
                                                                {sub.name === "Hot" && (
                                                                    <span className="rounded-full bg-theme-secondary px-1.5 py-0.5 text-[0.625rem] font-semibold text-dark-grey-900">
                                                                        POPULARES
                                                                    </span>
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </nav>
                    </aside>
                </>
            )}
        </>
    );
};

export default MobileFooter;