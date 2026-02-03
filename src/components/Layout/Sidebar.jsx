import { useState, useEffect, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutContext } from "./LayoutContext";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";
import ImgCasino from "/src/assets/svg/casino.svg";
import ImgLiveCasino from "/src/assets/svg/live-casino.svg";
import ImgSports from "/src/assets/svg/sports.svg";
import ImgProfile from "/src/assets/svg/profile.svg";
import ImgLogout from "/src/assets/svg/logout.svg";
import ImgPhone from "/src/assets/svg/phone.svg";

const Sidebar = ({ isSlotsOnly, isMobile, supportParent, openSupportModal, handleLogoutClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isSidebarExpanded, toggleSidebar } = useContext(LayoutContext);
    const { contextData } = useContext(AppContext);

    const [expandedMenus, setExpandedMenus] = useState([]);
    const [liveCasinoMenus, setLiveCasinoMenus] = useState([]);
    const [hasFetchedLiveCasino, setHasFetchedLiveCasino] = useState(false);
    const [hoveredMenu, setHoveredMenu] = useState(null);
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
    const [isPopoverVisible, setIsPopoverVisible] = useState(false);

    const iconRefs = useRef({});
    const popoverRef = useRef(null);
    const hoverTimeoutRef = useRef(null);

    const isLoggedIn = !!contextData?.session;

    const toggleMenu = (menuId) => {
        if (!isSidebarExpanded) return;
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
            callApi(contextData, "GET", "/get-page?page=livecasino", (result) => {
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
            }, null);
        }
    }, [hasFetchedLiveCasino, contextData, isLoggedIn]);

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

    const handleMouseEnter = (itemId, event) => {
        if (!isSidebarExpanded) {
            clearTimeout(hoverTimeoutRef.current);
            const rect = event.currentTarget.getBoundingClientRect();
            setPopoverPosition({
                top: rect.top + window.scrollY,
                left: rect.right + 16,
            });
            hoverTimeoutRef.current = setTimeout(() => {
                setHoveredMenu(itemId);
                setIsPopoverVisible(true);
            }, 150);
        }
    };

    const handleMouseLeave = (event) => {
        if (!isSidebarExpanded) {
            clearTimeout(hoverTimeoutRef.current);
            const relatedTarget = event.relatedTarget;
            if (popoverRef.current && popoverRef.current.contains(relatedTarget)) return;

            hoverTimeoutRef.current = setTimeout(() => {
                setIsPopoverVisible(false);
                setHoveredMenu(null);
            }, 100);
        }
    };

    const handlePopoverMouseEnter = () => clearTimeout(hoverTimeoutRef.current);
    const handlePopoverMouseLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setIsPopoverVisible(false);
            setHoveredMenu(null);
        }, 100);
    };

    const isSlotsOnlyMode = isSlotsOnly === true || isSlotsOnly === "true";

    const menuItems = [
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
        ...(isSlotsOnlyMode
            ? []
            : [
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
            ]),
        ...(isLoggedIn
            ? [
                {
                    id: "profile",
                    name: "Cuenta",
                    image: ImgProfile,
                    href: "/profile/detail",
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

    const handleNavigation = (item) => (e) => {
        e?.stopPropagation();
        if (item.action) {
            item.action();
        } else if (item.href !== "#") {
            navigate(item.href);
        }
    };

    const isMenuActive = (item) => {
        const currentPath = location.pathname;
        const hash = location.hash;

        if (item.href === currentPath) return true;
        if (item.href.includes("#")) {
            return location.pathname + location.hash === item.href;
        }
        if (item.id === "profile" && currentPath.startsWith("/profile")) return true;
        return false;
    };

    const isActiveSubmenu = (href) => {
        if (href.includes("#")) {
            return location.pathname + location.hash === href;
        }
        return location.pathname === href;
    };

    return (
        <>
            <aside
                id="aside"
                className={`bg-primary-900 text-primary-50 border-theme-secondary/10 z-50 flex h-full flex-col justify-between gap-4 border-r text-base [grid-area:_nav] sticky top-[var(--header-height)] max-h-[calc(100svh-var(--header-height))] min-h-[unset] lg:max-w-[15rem] ${isSidebarExpanded ? "w-[16rem]" : "w-[4.25rem]"
                    }`}
            >
                <div className="w-full !overflow-x-clip h-full px-2 pb-0 pt-2 sm:p-12 sm:pb-0 sm:px-2 sm:pt-2">
                    <div className="w-full h-full relative">
                        <nav className="flex flex-col gap-2">
                            {menuItems.map((item) => {
                                const itemRef = (el) => (iconRefs.current[item.id] = el);
                                const isActive = isMenuActive(item);

                                if (!isSidebarExpanded) {
                                    return (
                                        <div
                                            key={item.id}
                                            className="group relative"
                                            ref={itemRef}
                                            onMouseEnter={(e) => handleMouseEnter(item.id, e)}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            <button
                                                onClick={handleNavigation(item)}
                                                className={`text-theme-secondary ring-theme-secondary/10 flex aspect-square w-full items-center justify-center gap-2.5 rounded-2xl p-4 ring-1 transition duration-75 hover:ring-theme-secondary hover:cursor-pointer ${isActive ? "bg-theme-secondary/20" : "bg-transparent"
                                                    }`}
                                            >
                                                <img src={item.image} alt={item.name} className="h-5 w-5" />
                                            </button>
                                        </div>
                                    );
                                }

                                // Expanded mode
                                return (
                                    <div key={item.id} className="relative">
                                        <div className="[&>[data-state='open']]:bg-theme-secondary/10 [&>[data-state='open']]:ring-1 flex flex-col gap-2 border-theme-secondary/10 w-full rounded-2xl border p-0 hover:border-theme-secondary/20 hover:bg-theme-secondary/[0.02] [&>[data-state='open']]:ring-theme-secondary/20">
                                            <div
                                                data-state={isMenuExpanded(item.id) ? "open" : "closed"}
                                                className="relative flex w-full flex-col rounded-2xl transition-all"
                                            >
                                                <div
                                                    className="flex items-center justify-between gap-2 pr-4 transition duration-75"
                                                    // Only toggle expand if it has subItems
                                                    {...(item.subItems.length > 0 ? { onClick: () => toggleMenu(item.id) } : {})}
                                                >
                                                    <button
                                                        onClick={handleNavigation(item)}
                                                        className="aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 max-w-full text-ellipsis ring-0 focus:outline-none focus-visible:outline-0 rounded-lg gap-4 inline-flex items-center justify-center flex-1 py-4 pl-4 text-sm font-bold !leading-tight transition-all lg:text-xs"
                                                    >
                                                        <span className="flex w-full items-center gap-2 text-left">
                                                            <img src={item.image} alt={item.name} className="h-5 w-5" />
                                                            <span className="uppercase text-theme-secondary-50">
                                                                {item.name}
                                                            </span>
                                                        </span>
                                                    </button>

                                                    {item.subItems.length > 0 && (
                                                        <svg
                                                            className={`cursor-pointer h-6 w-6 rounded p-1 text-theme-secondary transition-transform duration-200 bg-theme-secondary-300/10 ${isMenuExpanded(item.id) ? "rotate-180" : ""
                                                                }`}
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                        >
                                                            <path d="m6 9 6 6 6-6" />
                                                        </svg>
                                                    )}
                                                </div>

                                                {/* Submenu */}
                                                {item.subItems.length > 0 && (
                                                    <div
                                                        className="overflow-hidden"
                                                        style={{ display: isMenuExpanded(item.id) ? "block" : "none" }}
                                                    >
                                                        <div className="rounded-b-2xl bg-transparent p-0">
                                                            <div className="flex flex-col gap-1 px-2 pb-2 pt-1">
                                                                {item.subItems.map((sub) => (
                                                                    <button
                                                                        key={sub.href}
                                                                        onClick={handleNavigation({ href: sub.href })}
                                                                        className={`flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left text-base font-normal !leading-tight text-white hover:bg-theme-secondary/5 hover:text-white lg:text-sm ${isActiveSubmenu(sub.href)
                                                                                ? "bg-theme-secondary/10 text-theme-secondary"
                                                                                : ""
                                                                            }`}
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
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </aside>

            {/* Popover for collapsed mode */}
            {isPopoverVisible && hoveredMenu && !isSidebarExpanded && (
                <div
                    ref={popoverRef}
                    className="fixed z-[100] min-w-[15rem] rounded-2xl bg-theme-primary-950 p-4 shadow-2xl ring-1 ring-theme-secondary/10 transition-opacity"
                    style={{ top: popoverPosition.top, left: popoverPosition.left }}
                    onMouseEnter={handlePopoverMouseEnter}
                    onMouseLeave={handlePopoverMouseLeave}
                >
                    <button
                        onClick={handleNavigation(menuItems.find((i) => i.id === hoveredMenu))}
                        className="pb-2 text-lg font-bold uppercase text-theme-secondary-50 hover:text-white"
                    >
                        {menuItems.find((i) => i.id === hoveredMenu)?.name}
                    </button>

                    {menuItems
                        .find((i) => i.id === hoveredMenu)
                        ?.subItems.map((sub) => (
                            <button
                                key={sub.href}
                                onClick={handleNavigation({ href: sub.href })}
                                className="block w-full rounded-xl px-4 py-3 text-left text-base font-normal text-white hover:bg-theme-secondary/5 hover:text-white lg:text-sm"
                            >
                                <span>{sub.name}</span>
                                {sub.name === "Hot" && (
                                    <span className="ml-2 rounded-full bg-theme-secondary px-1.5 py-0.5 text-[0.625rem] font-semibold text-dark-grey-900">
                                        POPULARES
                                    </span>
                                )}
                            </button>
                        ))}
                </div>
            )}
        </>
    );
};

export default Sidebar;