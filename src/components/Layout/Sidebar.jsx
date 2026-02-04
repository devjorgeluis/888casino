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
            <div class="sc-gvsNSq jxqyxT cy-main-nav">
                <div class="sc-daLoug sc-dXijah hUcPdj bDBgJW">
                    <div class="sc-hhFrFd bCsUbK">
                        <div class="sc-yWEwC sc-bvtzcD cOhCUT bwJqBY cy-logo-container">
                            <a href="https://es.888casino.com/" class="sc-ciMfCw ja-dRuB"
                            ><img
                                    src="https://cgp-cdn.safe-iplay.com/cgp-assets/full/skins/888casino/defaults/images/888casinologo-pc.svg"
                                    alt="888 Online Casino"
                                    width="39"
                                    height="30"
                                    class="sc-gHXKQl eKXwKk logo cy-logo"
                                /></a>
                        </div>
                        <div class="sc-gSONCE sc-dxYMJA fxKZYg gpHIWH">
                            <div class="sc-htyjTb sc-dBaIIm ciAYHW dSZHWt cy-profile-box">
                                <div class="sc-cnXNfM eSsHcy">
                                    <a class="sc-ciMfCw ja-dRuB cy-profile-picture"
                                    ><img
                                            src="https://cgp-cdn.safe-iplay.com/cgp-assets/full/skins/888casino/defaults/images/avatars/reg/pre-login-reg.svg"
                                            alt="casino888 player"
                                            class="sc-ilDdSB bTEstA"
                                        /></a>
                                </div>
                                <div class="sc-cXPgEM dztcgo cy-profile-box-buttons">
                                    <div class="cy-profile-box-login-button">
                                        <button stroke-width="2" width="15" height="4" class="sc-ksJhlw dmlVbK">
                                            <span class="sc-fIysua sc-cRAjZL eZsMbN dcVKxz"
                                            ><span font-size="1.4" class="sc-bFbHAG fxFSPh">INICIAR</span></span
                                            >
                                        </button>
                                    </div>
                                </div>
                                <div class="sc-jEdnIG czquOb cy-profile-box-messages">
                                    <div class="sc-lHmqY hoHKdR cy-omg-indicator">
                                        <div class="sc-bWshSB djtslg">
                                            <div class="sc-hoiAEI eGeazf">
                                                <svg
                                                    width="3.5rem"
                                                    height="3.5rem"
                                                    viewBox="0 0 52 52"
                                                    version="1.1"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    class="sc-bqOBqt PBviZ"
                                                    fill="unset"
                                                >
                                                    <g stroke="currentColor" stroke-width="4.0" stroke-linejoin="round" fill="none">
                                                        <path
                                                            stroke="null"
                                                            d="m30.46234,46.08066c0,1.81614 -1.9091,3.28845 -4.26418,3.28845s-4.2659,-1.47231 -4.2659,-3.28845"
                                                        ></path>
                                                        <path
                                                            stroke="null"
                                                            d="m26.88256,4.12778l0,2.80532"
                                                            stroke-linecap="round"
                                                        ></path>
                                                        <path
                                                            stroke="null"
                                                            stroke-linecap="round"
                                                            d="m37.98898,19.64609a11.79253,12.12231 0 0 0 -23.58507,0l0,7.67188a17.08074,17.55839 0 0 1 -5.36024,12.05707l0,2.19171l34.30556,0l0,-2.19171a17.08074,17.55839 0 0 1 -5.36024,-12.05707l0,-7.67188z"
                                                        ></path>
                                                    </g>
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="sc-chrEaz BWnTh"><span>Notificaciones</span></div>
                                    </div>
                                    <div class="sc-emmUWz hneeFr"></div>
                                    <div class="sc-lHmqY hoHKdR cy-free-play-indicator-button">
                                        <div class="sc-bWshSB djtslg">
                                            <div class="sc-hoiAEI eGeazf">
                                                <svg
                                                    width="3.5rem"
                                                    height="3.5rem"
                                                    viewBox="0 0 30 30"
                                                    version="1.1"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    class="sc-bqOBqt PBviZ"
                                                    fill="unset"
                                                >
                                                    <path
                                                        d="M27.075 8.91966H21.575C21.9216 8.69109 22.2463 8.43098 22.545 8.14266C23.2181 7.46182 23.5956 6.54305 23.5956 5.58566C23.5956 4.62827 23.2181 3.70949 22.545 3.02866C21.8601 2.36872 20.9461 2 19.995 2C19.0439 2 18.1299 2.36872 17.445 3.02866C16.692 3.78566 14.692 6.86266 14.968 8.91966H14.843C15.117 6.86366 13.119 3.78466 12.366 3.02866C11.6811 2.36872 10.7671 2 9.816 2C8.86492 2 7.95087 2.36872 7.266 3.02866C6.59315 3.70962 6.21582 4.62835 6.21582 5.58566C6.21582 6.54297 6.59315 7.4617 7.266 8.14266C7.56583 8.43052 7.89117 8.69059 8.238 8.91966H2.738C2.27712 8.92045 1.83537 9.10395 1.50957 9.42994C1.18378 9.75592 1.00053 10.1978 1 10.6587V15.0017C1 15.2324 1.09166 15.4537 1.25482 15.6168C1.41797 15.78 1.63926 15.8717 1.87 15.8717H2.74V26.3017C2.74026 26.7627 2.9234 27.2048 3.24922 27.531C3.57504 27.8572 4.01695 28.0409 4.478 28.0417H25.338C25.799 28.0409 26.241 27.8572 26.5668 27.531C26.8926 27.2048 27.0757 26.7627 27.076 26.3017V15.8737H27.946C28.1767 15.8737 28.398 15.782 28.5612 15.6188C28.7243 15.4557 28.816 15.2344 28.816 15.0037V10.6587C28.8147 10.1975 28.6308 9.75565 28.3045 9.42975C27.9782 9.10386 27.5362 8.92045 27.075 8.91966ZM16.746 8.86266C16.346 8.44366 17.507 5.43366 18.679 4.25366C19.0329 3.91328 19.5049 3.72315 19.996 3.72315C20.4871 3.72315 20.9591 3.91328 21.313 4.25366C21.662 4.60896 21.8576 5.0871 21.8576 5.58516C21.8576 6.08322 21.662 6.56136 21.313 6.91666C20.113 7.96611 18.6432 8.65889 17.07 8.91666C16.9587 8.93028 16.8459 8.91043 16.746 8.85966M8.5 6.91766C8.15097 6.56236 7.9554 6.08422 7.9554 5.58616C7.9554 5.0881 8.15097 4.60996 8.5 4.25466C8.67215 4.08047 8.87716 3.94219 9.10315 3.8478C9.32913 3.75342 9.5716 3.70482 9.8165 3.70482C10.0614 3.70482 10.3039 3.75342 10.5299 3.8478C10.7558 3.94219 10.9608 4.08047 11.133 4.25466C12.305 5.43266 13.469 8.44466 13.064 8.86366C12.9645 8.91348 12.8526 8.93328 12.742 8.92066C11.1693 8.6622 9.70006 7.9695 8.5 6.92066M2.738 10.6587H14.038V14.1357H2.738V10.6587ZM4.476 15.8737H14.037V26.3017H4.477V15.8737M25.336 26.3017H15.776V15.8737H25.336V26.3017ZM27.074 14.1337H15.774V10.6587H27.074V14.1337Z"
                                                        fill="currentColor"
                                                    ></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="sc-chrEaz BWnTh"><span>Jugada gratis</span></div>
                                    </div>
                                </div>
                            </div>
                            <div class="sc-iYjPCr gWmbXn cy-side-menu">
                                <section class="sc-klCKcm sc-kZzZex eLAEaM jdUfX">
                                    <div class="sc-MKQME sc-jlirRl ekPQQx fJgckN">
                                        <ul class="cy-menu-links-group">
                                            <li class="sc-fkVSuP sc-bsyrka izPQbG kxFylD cy-menu-item">
                                                <a href="https://es.888casino.com/" class="sc-ciMfCw ja-dRuB"
                                                ><div class="sc-gPLYmt sc-cjShfW efmGEW bDGwEc">
                                                        <span class="sc-iDhmSy jagTrD"></span>
                                                        <div class="sc-dgWXKx sc-bsStmr dvyXko hWgsTC">
                                                            <svg
                                                                width="2rem"
                                                                height="2rem"
                                                                viewBox="0 0 22 22"
                                                                version="1.1"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                class="sc-bqOBqt PBviZ"
                                                                fill="none"
                                                            >
                                                                <rect
                                                                    width="22"
                                                                    height="22"
                                                                    rx="11"
                                                                    fill="#75E300"
                                                                    fill-opacity="0.2"
                                                                ></rect>
                                                                <path
                                                                    d="M18.5 9.02569C18.5 13.317 13.4686 16.1482 11.9376 16.9004C11.6752 17.0332 11.3251 17.0332 11.0627 16.9004C9.5314 16.1482 4.5 13.4054 4.5 9.02569C4.5 6.81377 6.11869 5 8.08744 5C9.66244 5 10.9751 6.10612 11.4562 7.65424C11.9376 6.10612 13.2939 5 14.8249 5C16.8813 5 18.5 6.81377 18.5 9.02569Z"
                                                                    fill="#B3F270"
                                                                    transform="translate(-0.5 0.7)"
                                                                ></path>
                                                                <path
                                                                    d="M18.4995 9.02569C18.4995 13.317 13.4681 16.1482 11.9371 16.9004C11.6747 17.0332 11.3247 17.0332 11.0183 16.9004C10.3181 16.5906 9.00584 15.8387 7.69324 14.7768H7.73692C11.8931 14.7768 15.2182 11.3704 15.2182 7.21192C15.2182 6.45979 15.0868 5.70765 14.8681 5C16.9245 5.04417 18.4992 6.81377 18.4992 9.02569H18.4995Z"
                                                                    fill="#75E400"
                                                                    transform="translate(-0.5 0.7)"
                                                                ></path>
                                                                <g opacity="0.2">
                                                                    <path
                                                                        d="M7.86907 8.36148C7.16893 8.53847 6.51278 8.27314 6.38143 7.78633C6.29406 7.25536 6.73149 6.7247 7.43133 6.54771C8.13116 6.37072 8.78761 6.63605 8.91897 7.12285C9.05032 7.65382 8.5689 8.18448 7.86907 8.36148Z"
                                                                        fill="white"
                                                                    ></path>
                                                                </g>
                                                            </svg>
                                                        </div>
                                                        <span class="sc-bMhjqq sc-kfiijn eeQnce gwhmuu">Inicio</span>
                                                    </div></a
                                                >
                                            </li>
                                            <div class="sc-cLVYFp sc-kiUgTw cSIQFP hPFZit"></div>
                                            <li class="sc-fkVSuP sc-bsyrka izPQbG kxFylD cy-menu-item">
                                                <a href="https://es.888casino.com/slots/" class="sc-ciMfCw ja-dRuB"
                                                ><div class="sc-gPLYmt sc-cjShfW efmGEW bDGwEc">
                                                        <span class="sc-iDhmSy jagTrD"></span>
                                                        <div class="sc-dgWXKx sc-bsStmr dvyXko hWgsTC">
                                                            <svg
                                                                width="2rem"
                                                                height="2rem"
                                                                viewBox="0 0 22 22"
                                                                version="1.1"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                class="sc-bqOBqt PBviZ"
                                                                fill="none"
                                                            >
                                                                <rect
                                                                    width="22"
                                                                    height="22"
                                                                    rx="11"
                                                                    fill="#EF3C4E"
                                                                    fill-opacity="0.2"
                                                                ></rect>
                                                                <path
                                                                    d="M9.12983 13.065C9.10639 13.065 9.08273 13.0615 9.05929 13.0539C8.94119 13.016 8.87695 12.8925 8.91594 12.7776C10.6478 7.68559 9.08566 6.18351 9.06988 6.16907C8.97905 6.08639 8.97477 5.94793 9.05996 5.86C9.14516 5.77184 9.28805 5.76769 9.37843 5.85037C9.45235 5.91774 11.165 7.56025 9.34417 12.9148C9.31262 13.0069 9.22449 13.065 9.12983 13.065Z"
                                                                    fill="#66CC66"
                                                                ></path>
                                                                <path
                                                                    d="M14.2825 13.4366C14.191 13.4366 14.1051 13.3824 14.0713 13.2943C12.1607 8.314 9.9547 8.04451 9.93261 8.04233C9.80978 8.03029 9.7185 7.92442 9.72954 7.80499C9.74059 7.68556 9.84809 7.59916 9.9707 7.60638C10.0717 7.61425 12.4666 7.85727 14.4937 13.1418C14.5372 13.2551 14.4779 13.3809 14.3611 13.4231C14.3352 13.4321 14.3086 13.4366 14.2825 13.4366Z"
                                                                    fill="#66CC66"
                                                                ></path>
                                                                <path
                                                                    d="M12.463 15.1498C12.1673 16.9008 10.4737 18.1622 8.6549 17.9829C6.65238 17.7851 5.2451 16.0105 5.53877 14.0976C5.76055 12.6516 6.89129 11.5546 8.28415 11.27C8.68691 11.1878 9.09575 11.3851 9.2702 11.7468C9.3324 11.8757 9.50978 11.9015 9.60804 11.7961L9.6112 11.7926C9.85844 11.5277 10.3358 11.431 10.6606 11.5996C11.9426 12.2661 12.7125 13.6715 12.463 15.1498Z"
                                                                    fill="#FD4F5A"
                                                                ></path>
                                                                <path
                                                                    d="M10.0287 17.8446C9.59375 17.978 9.12721 18.0283 8.65391 17.9824C6.65251 17.7855 5.24388 16.0094 5.53913 14.0976C5.76 12.6517 6.89142 11.5537 8.28428 11.2693C8.66743 11.1927 9.05734 11.3677 9.24215 11.6958C8.39021 12.2033 7.76365 13.0608 7.60363 14.0976C7.34669 15.7797 8.40373 17.359 10.0287 17.8446Z"
                                                                    fill="#EF3C4E"
                                                                ></path>
                                                                <path
                                                                    d="M13.0709 7.14819C12.3812 7.81753 11.2843 8.09183 9.94418 7.81228L9.94125 7.81162L9.9417 7.8079C9.36585 5.20644 11.0724 3.55015 13.754 4.10815L13.7558 4.1099C14.0455 5.41227 13.7617 6.47775 13.0709 7.14819Z"
                                                                    fill="#66CC66"
                                                                ></path>
                                                                <path
                                                                    d="M10.7775 7.91843C10.5138 7.90968 10.2366 7.87468 9.94582 7.81343H9.94132L9.94357 7.80906C9.36659 5.20825 11.0727 3.55021 13.7548 4.10799L13.757 4.11018C13.7999 4.30048 13.8292 4.48641 13.8472 4.66797C11.8345 4.58703 10.5701 5.90384 10.7775 7.91843Z"
                                                                    fill="#53BC53"
                                                                ></path>
                                                                <path
                                                                    d="M10.6095 14.606C11.0814 16.3201 12.8951 17.4136 14.6866 17.061C16.6594 16.6727 17.8794 14.7721 17.393 12.8966C17.0254 11.4789 15.7888 10.4953 14.374 10.3454C13.965 10.3021 13.5782 10.5377 13.4412 10.9144C13.3925 11.0485 13.2185 11.0911 13.1099 10.9958L13.1065 10.9927C12.8335 10.7527 12.3487 10.7022 12.0427 10.901C10.8346 11.6865 10.211 13.1589 10.6095 14.606Z"
                                                                    fill="#FD4F5A"
                                                                ></path>
                                                                <path
                                                                    d="M15.3952 10.6122C15.314 10.6975 15.2487 10.8003 15.2058 10.9162C15.1743 11.0015 15.0931 11.0475 15.012 11.0475C14.9624 11.0475 14.9151 11.0322 14.8745 10.9972L14.87 10.9928C14.5973 10.7544 14.1127 10.7041 13.8062 10.9031C12.5982 11.6884 11.9761 13.1605 12.3728 14.6064C12.7041 15.8138 13.7025 16.7128 14.8903 17.0147C14.8227 17.0344 14.7551 17.0497 14.6852 17.0628C12.8934 17.415 11.0813 16.3213 10.608 14.6064C10.2091 13.1605 10.8334 11.6884 12.0415 10.9031C12.348 10.7041 12.8326 10.7544 13.1053 10.9928L13.1098 10.9972C13.1503 11.0322 13.1977 11.0475 13.2473 11.0475C13.3284 11.0475 13.4095 11.0015 13.4411 10.9162C13.5763 10.5378 13.964 10.3038 14.3719 10.3475C14.728 10.3847 15.0729 10.4766 15.3952 10.6122Z"
                                                                    fill="#EF3C4E"
                                                                ></path>
                                                            </svg>
                                                        </div>
                                                        <span class="sc-bMhjqq sc-kfiijn eeQnce gwhmuu">Tragamonedas</span>
                                                    </div></a
                                                >
                                            </li>
                                            <div class="sc-cLVYFp sc-kiUgTw cSIQFP hPFZit"></div>
                                            <li class="sc-fkVSuP sc-bsyrka izPQbG kxFylD cy-menu-item">
                                                <a href="https://es.888casino.com/live-casino/" class="sc-ciMfCw ja-dRuB"
                                                ><div class="sc-gPLYmt sc-cjShfW efmGEW bDGwEc">
                                                        <span class="sc-iDhmSy jagTrD"></span>
                                                        <div class="sc-dgWXKx sc-bsStmr dvyXko hWgsTC">
                                                            <svg
                                                                width="2rem"
                                                                height="2rem"
                                                                viewBox="0 0 24 24"
                                                                version="1.1"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                class="sc-bqOBqt PBviZ"
                                                                fill="none"
                                                            >
                                                                <rect
                                                                    x="0.139893"
                                                                    width="24"
                                                                    height="24"
                                                                    rx="12"
                                                                    fill="#75E300"
                                                                    fill-opacity="0.2"
                                                                ></rect>
                                                                <path
                                                                    d="M18.9451 9.52158H18.9547C18.9547 9.34921 18.9354 9.16777 18.9162 8.9954C18.5014 8.89561 17.8359 8.65066 17.0354 8.07005C16.4278 7.61645 15.8781 7.17192 15.473 6.84532C14.9908 6.44615 14.7014 6.19214 14.6918 6.18306C14.5761 6.08327 14.4314 6.02884 14.2771 6.05605C14.1228 6.06513 13.9974 6.15585 13.9106 6.26471C13.9106 6.28286 13.8431 6.37358 13.6791 6.54595C13.6309 6.59131 13.5827 6.63667 13.5248 6.68203C13.0329 7.1447 12.0395 7.90675 10.3131 8.6053C8.89536 9.19498 7.66085 9.37642 6.74461 9.40364C6.43598 9.42179 6.16593 9.41271 5.93446 9.39457V9.43993C5.88623 9.52158 5.83801 9.60323 5.80908 9.69395C5.63547 10.1385 5.61618 10.6102 5.75121 11.0457C5.88623 11.5356 6.19486 11.9801 6.64816 12.2976C6.8507 12.9508 7.16897 13.5677 7.59334 14.103C7.67049 14.2118 7.74765 14.3116 7.83445 14.4023C7.90196 14.5021 7.98877 14.5929 8.09486 14.6836C8.14308 14.738 8.21059 14.8015 8.26846 14.8559C8.52887 15.11 8.81821 15.3277 9.12683 15.5273C9.25221 15.5999 9.37759 15.6724 9.50298 15.745C9.5512 15.7722 9.59942 15.7994 9.64765 15.8267C9.77303 15.8902 9.89841 15.9537 10.0238 15.999C10.1781 16.0716 10.3228 16.126 10.4867 16.1805C10.8243 16.2984 11.1811 16.3982 11.538 16.4526C11.837 16.5071 12.136 16.5343 12.4349 16.5524H12.4446C12.5796 16.5433 12.7243 16.5343 12.8593 16.5161C12.9461 16.5161 13.0329 16.498 13.1197 16.4889C13.5634 16.4163 13.9974 16.2984 14.4121 16.1623C14.5568 16.1079 14.6918 16.0444 14.8268 15.9899C14.9908 15.9174 15.1644 15.8448 15.3187 15.7541C15.4441 15.6815 15.5695 15.6089 15.6948 15.5363C16.0131 15.3368 16.3025 15.11 16.5725 14.8559C16.7365 14.7199 16.8908 14.5566 17.0354 14.3842C17.5755 13.7673 17.9613 13.0597 18.1928 12.2886C18.6557 11.962 18.974 11.4993 19.0994 10.9912C19.2151 10.5104 19.1766 9.98425 18.9451 9.52158ZM10.9304 12.8238C11.0943 12.6605 11.3644 12.6696 11.5284 12.8238C12.0009 13.2774 12.8304 13.2774 13.303 12.8238C13.4766 12.6696 13.7466 12.6696 13.9106 12.8238C14.0842 12.9871 14.0842 13.232 13.9106 13.3953C13.5248 13.7764 12.9558 13.9941 12.4157 13.9941C11.8756 13.9941 11.3258 13.7764 10.9304 13.3953C10.7568 13.232 10.7568 12.9871 10.9304 12.8238Z"
                                                                    fill="#FFE7C0"
                                                                ></path>
                                                                <path
                                                                    d="M15.4917 17.7751V20.5512C15.4917 20.905 15.0962 21.1045 14.7683 20.9412L13.5049 20.2427L12.4729 19.6712V18.646L13.5049 18.0836L14.7683 17.385C15.0962 17.2217 15.4917 17.4394 15.4917 17.7751Z"
                                                                    fill="#B3F270"
                                                                ></path>
                                                                <path
                                                                    d="M13.9108 12.8222C14.0844 12.9855 14.0844 13.2305 13.9108 13.3938C13.525 13.7748 12.956 13.9925 12.4159 13.9925C11.8758 13.9925 11.326 13.7748 10.9306 13.3938C10.757 13.2305 10.757 12.9855 10.9306 12.8222C11.0946 12.6589 11.3646 12.668 11.5286 12.8222C12.0012 13.2758 12.8306 13.2758 13.3032 12.8222C13.4768 12.668 13.7469 12.668 13.9108 12.8222Z"
                                                                    fill="#E87F5E"
                                                                ></path>
                                                                <path
                                                                    d="M17.9602 6.11852C17.3044 5.03894 16.3303 4.13174 15.1633 3.52391C14.6135 3.20639 14.0349 3.03402 13.4562 3.0068C13.4562 2.99773 13.4369 2.99773 13.4272 3.0068C12.9064 2.98866 12.3953 3.07938 11.9323 3.28804L11.8359 3.3334C11.7684 3.37876 11.6719 3.41505 11.5948 3.45133C11.4694 3.50577 11.3247 3.52391 11.18 3.50577C10.8328 3.46041 10.3024 3.43319 9.77192 3.5602L9.68512 3.58742C9.68512 3.58742 9.59832 3.61463 9.55009 3.63278C7.5633 4.30411 6.16482 6.03687 5.96228 8.11437C5.92371 8.54075 5.91406 8.97621 5.93335 9.39353C6.16482 9.41167 6.43487 9.42074 6.7435 9.4026C7.65974 9.37538 9.40484 9.58404 10.8226 8.99436C12.549 8.29581 13.0037 8.21445 13.4956 7.75178C13.5534 7.70642 13.6017 7.66106 13.6499 7.6157C13.8138 7.44333 13.8814 7.35261 13.8814 7.33446C13.9682 7.2256 14.0935 7.13488 14.2479 7.12581C14.4022 7.09859 14.5468 7.15302 14.6626 7.25281C14.6722 7.26189 14.9616 7.5159 15.4438 7.91507C15.8489 8.24167 16.4267 7.6154 17.0343 8.06901C17.8348 8.64962 18.5003 8.89456 18.915 8.99436C18.8186 7.97829 18.5003 6.9985 17.9602 6.11852Z"
                                                                    fill="#282828"
                                                                ></path>
                                                                <path
                                                                    d="M12.4736 18.646V19.6712L11.4513 20.2427L10.1878 20.9412C9.85991 21.1045 9.46448 20.905 9.46448 20.5512V17.7751C9.46448 17.4394 9.85991 17.2217 10.1878 17.385L11.4513 18.0836L12.4736 18.646Z"
                                                                    fill="#B3F270"
                                                                ></path>
                                                                <path
                                                                    d="M13.6144 7.67676C13.6144 7.67676 12.4059 9.05802 9.30034 10.8543C5.34603 13.1495 12.3288 17.0051 13.4475 16.4245C13.4475 16.4245 13.0039 16.5697 12.3191 16.5515C10.9399 16.5152 8.5577 16.0435 7.12065 13.5033C6.92775 13.1586 6.80237 12.7141 6.64806 12.2967C6.64806 12.2967 5.0374 11.3351 5.93436 9.39369C5.82026 8.72294 9.14461 10.5591 13.6047 7.67676H13.6144Z"
                                                                    fill="#EACEA7"
                                                                ></path>
                                                                <path
                                                                    d="M7.90907 4.52759C8.75886 6.22896 10.0678 7.65984 11.6747 8.65845C11.4304 8.75314 11.1486 8.86231 10.8222 8.99438C9.40448 9.58383 7.6592 9.37537 6.74306 9.40259C6.43467 9.42069 6.16482 9.41095 5.93349 9.39282C5.91423 8.97578 5.92328 8.5406 5.96181 8.1145C6.10235 6.67292 6.81985 5.39773 7.90907 4.52759Z"
                                                                    fill="#434A54"
                                                                ></path>
                                                            </svg>
                                                        </div>
                                                        <span class="sc-bMhjqq sc-kfiijn eeQnce gwhmuu">Casino en Vivo</span>
                                                    </div></a
                                                >
                                            </li>
                                            <div class="sc-cLVYFp sc-kiUgTw cSIQFP hPFZit"></div>
                                            <li class="sc-fkVSuP sc-bsyrka izPQbG kxFylD cy-menu-item">
                                                <a href="https://es.888casino.com/new-games/" class="sc-ciMfCw ja-dRuB"
                                                ><div class="sc-gPLYmt sc-cjShfW efmGEW bDGwEc">
                                                        <span class="sc-iDhmSy jagTrD"></span>
                                                        <div class="sc-dgWXKx sc-bsStmr dvyXko hWgsTC">
                                                            <svg
                                                                width="2rem"
                                                                height="2rem"
                                                                viewBox="0 0 22 22"
                                                                version="1.1"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                class="sc-bqOBqt PBviZ"
                                                                fill="none"
                                                            >
                                                                <rect
                                                                    width="22"
                                                                    height="22"
                                                                    rx="11"
                                                                    fill="#FFC850"
                                                                    fill-opacity="0.2"
                                                                ></rect>
                                                                <path
                                                                    fill-rule="evenodd"
                                                                    clip-rule="evenodd"
                                                                    d="M7.43303 4.19879C7.628 4.46961 8.17832 5.63264 8.49294 6.31044C8.54241 6.41699 8.40872 6.51325 8.32336 6.43252C7.7804 5.91915 6.852 5.0283 6.65703 4.75746C6.50275 4.54319 6.55139 4.24441 6.7657 4.09013C6.97997 3.93585 7.27875 3.98452 7.43303 4.19879ZM15.5706 4.19879C15.3756 4.46961 14.8253 5.63264 14.5107 6.31044C14.4612 6.41699 14.5949 6.51325 14.6803 6.43252C15.2232 5.91915 16.1516 5.02827 16.3466 4.75746C16.5009 4.54319 16.4522 4.24441 16.2379 4.09013C16.0237 3.93585 15.7249 3.98452 15.5706 4.19879ZM15.8599 12.0007C16.6012 12.0945 17.8765 12.2655 18.1937 12.3689C18.4448 12.4508 18.5819 12.7206 18.5 12.9717C18.4181 13.2227 18.1483 13.3599 17.8972 13.278C17.58 13.1745 16.4492 12.5607 15.7951 12.1994C15.6923 12.1426 15.7434 11.986 15.8599 12.0007ZM4.82997 12.3692C5.14722 12.2657 6.42249 12.0948 7.1638 12.001C7.28034 11.9862 7.33141 12.1428 7.22861 12.1996C6.57451 12.561 5.44371 13.1748 5.12646 13.2782C4.87543 13.3601 4.60557 13.223 4.52369 12.9719C4.44182 12.7209 4.57894 12.451 4.82997 12.3692ZM11.254 15.2034C11.1134 15.9373 10.8804 17.2027 10.8804 17.5364C10.8804 17.8004 11.0945 18.0145 11.3585 18.0145C11.6226 18.0145 11.8366 17.8004 11.8366 17.5364C11.8366 17.2027 11.6037 15.9373 11.463 15.2034C11.4409 15.0881 11.2762 15.0881 11.254 15.2034Z"
                                                                    fill="#FFF082"
                                                                    transform="translate(-0.5 0.5)"
                                                                ></path>
                                                                <path
                                                                    d="M16.2759 8.61259L13.0369 8.29757L11.7502 5.16453C11.6601 4.94516 11.3635 4.94516 11.2735 5.16453L9.98682 8.29754L6.74778 8.61259C6.52098 8.63464 6.42933 8.93046 6.60044 9.0881L9.0443 11.3394L8.3291 14.6672C8.27901 14.9002 8.51899 15.083 8.71483 14.9611L11.5118 13.2194L14.3089 14.9611C14.5047 15.083 14.7447 14.9002 14.6946 14.6672L13.9794 11.3394L16.4233 9.0881C16.5944 8.93046 16.5027 8.63464 16.2759 8.61259Z"
                                                                    fill="#FFDC64"
                                                                    transform="translate(-0.5 0.5)"
                                                                ></path>
                                                                <path
                                                                    d="M12.2181 6.30384L11.7502 5.16453C11.6601 4.94516 11.3635 4.94516 11.2734 5.16453L9.98679 8.29755L6.74778 8.61259C6.52098 8.63464 6.42933 8.93046 6.60044 9.0881L9.0443 11.3394L8.3291 14.6672C8.27901 14.9002 8.51899 15.083 8.71483 14.9611L9.08709 14.7293C9.69738 10.5865 11.4131 7.54544 12.2181 6.30384Z"
                                                                    fill="#FFC850"
                                                                    transform="translate(-0.5 0.5)"
                                                                ></path>
                                                            </svg>
                                                        </div>
                                                        <span class="sc-bMhjqq sc-kfiijn eeQnce gwhmuu">Juegos Nuevos</span>
                                                    </div></a
                                                >
                                            </li>
                                            <div class="sc-cLVYFp sc-kiUgTw cSIQFP hPFZit"></div>
                                            <li class="sc-fkVSuP sc-bsyrka izPQbG kxFylD cy-menu-item">
                                                <a href="https://es.888casino.com/casino-games/" class="sc-ciMfCw ja-dRuB"
                                                ><div class="sc-gPLYmt sc-cjShfW efmGEW bDGwEc">
                                                        <span class="sc-iDhmSy jagTrD"></span>
                                                        <div class="sc-dgWXKx sc-bsStmr dvyXko hWgsTC">
                                                            <svg
                                                                width="2rem"
                                                                height="2rem"
                                                                viewBox="0 0 24 24"
                                                                version="1.1"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                class="sc-bqOBqt PBviZ"
                                                                fill="none"
                                                            >
                                                                <rect
                                                                    x="0.139893"
                                                                    width="24"
                                                                    height="24"
                                                                    rx="12"
                                                                    fill="#EF3C4E"
                                                                    fill-opacity="0.2"
                                                                ></rect>
                                                                <path
                                                                    d="M13.9618 19.5H6.11241C5.47641 19.5 4.74852 18.6939 4.76581 18.0547V4.94669C4.82859 4.14919 5.42136 3.56915 6.2134 3.5H14.5592C15.3571 3.56233 15.9371 4.15465 16.0063 4.94669L16.0004 13.0349C15.7374 13.1787 15.4335 13.2729 15.1647 13.4253C14.6374 13.7242 13.9618 12.4003 13.9618 13.0495V19.5ZM6.86942 5.211C6.70064 5.24603 6.51184 5.43392 6.47772 5.60225C6.43996 5.78786 6.44451 6.58354 6.46907 6.78689C6.54004 7.36602 7.37212 7.39514 7.48403 6.84649C7.52179 6.66088 7.51724 5.8652 7.49267 5.66184C7.45583 5.35977 7.16785 5.14868 6.86942 5.211ZM10.8969 12.6241C12.6876 13.0736 13.9495 11.1374 12.7194 9.69619C12.1353 9.01197 11.3473 8.40145 10.7436 7.72223C10.4811 7.52707 10.2655 7.54208 10.0107 7.73816C9.60311 8.05252 8.16689 9.49511 7.88574 9.90273C6.90718 11.3212 8.25287 13.0827 9.87561 12.6237V13.7128H8.90524C8.88841 13.7128 8.66049 13.8566 8.63501 13.8852C8.38207 14.1736 8.53629 14.6013 8.88704 14.7177C9.80328 14.6786 10.8674 14.8237 11.7672 14.7355C12.1971 14.6932 12.421 14.2237 12.1389 13.8838C12.1075 13.8465 11.891 13.7123 11.8678 13.7123H10.8974V12.6232L10.8969 12.6241Z"
                                                                    fill="white"
                                                                ></path>
                                                                <path
                                                                    d="M10.8969 12.6241V13.7132H11.8672C11.8904 13.7132 12.1075 13.847 12.1384 13.8847C12.4204 14.2246 12.1966 14.6941 11.7667 14.7364C10.8668 14.8246 9.80276 14.68 8.88652 14.7186C8.53577 14.6017 8.382 14.1745 8.63449 13.8861C8.65951 13.8575 8.88789 13.7137 8.90472 13.7137H9.87509V12.6246C8.25235 13.0836 6.90666 11.3221 7.88522 9.90363C8.16682 9.49555 9.60304 8.05341 10.0102 7.73905C10.265 7.54252 10.4806 7.52797 10.7431 7.72313C11.3468 8.40235 12.1343 9.01241 12.7189 9.69709C13.9495 11.1383 12.687 13.0745 10.8964 12.625L10.8969 12.6241ZM10.3737 8.84773L8.70273 10.5155C8.29966 11.1506 8.96113 11.919 9.65036 11.5987C9.90785 11.4791 10.0207 11.1338 10.3687 11.1228C10.754 11.111 10.8723 11.5091 11.1703 11.6187C11.8299 11.8617 12.4113 11.2025 12.1079 10.5792L10.3737 8.84773Z"
                                                                    fill="black"
                                                                ></path>
                                                                <path
                                                                    d="M6.8693 5.21114C7.16774 5.14881 7.45571 5.3599 7.49256 5.66198C7.51758 5.86533 7.52167 6.66101 7.48391 6.84662C7.37246 7.39527 6.53993 7.36616 6.46896 6.78703C6.44394 6.58413 6.43984 5.78799 6.4776 5.60238C6.51172 5.43405 6.70052 5.24617 6.8693 5.21114Z"
                                                                    fill="black"
                                                                ></path>
                                                                <path
                                                                    d="M10.3737 8.84766L12.108 10.5791C12.4114 11.2019 11.83 11.8611 11.1703 11.6187C10.8728 11.509 10.7541 11.1109 10.3687 11.1228C10.0207 11.1337 9.9079 11.479 9.6504 11.5986C8.96118 11.9189 8.29971 11.1505 8.70278 10.5154L10.3737 8.84766Z"
                                                                    fill="black"
                                                                ></path>
                                                                <g clip-path="url(#clip0_5581_61613)">
                                                                    <path
                                                                        d="M17.841 13.5844C20.2308 13.5844 22.1681 11.6471 22.1681 9.25727C22.1681 6.86748 20.2308 4.93018 17.841 4.93018C15.4512 4.93018 13.5139 6.86748 13.5139 9.25727C13.5139 11.6471 15.4512 13.5844 17.841 13.5844Z"
                                                                        fill="#C9A000"
                                                                    ></path>
                                                                    <path
                                                                        d="M18.0092 6.05424V4.93018C19.0111 4.93018 20.0151 5.36008 20.7412 6.04073L19.971 6.83848C19.408 6.39806 18.7398 6.07025 18.0097 6.05424H18.0092Z"
                                                                        fill="#FBC700"
                                                                    ></path>
                                                                    <path
                                                                        d="M14.638 9.42554C14.6535 10.1562 14.9818 10.8244 15.4222 11.3869L14.6245 12.1571C13.9503 11.4259 13.5114 10.429 13.5139 9.42554H14.638Z"
                                                                        fill="#FBC700"
                                                                    ></path>
                                                                    <path
                                                                        d="M17.6348 13.5838C16.6244 13.5332 15.6375 13.1304 14.9008 12.4412L15.7055 11.6375C16.0934 11.9813 16.5733 12.24 17.0793 12.3596C17.2665 12.4042 17.4852 12.3987 17.6348 12.4787V13.5838Z"
                                                                        fill="#FBC700"
                                                                    ></path>
                                                                    <path
                                                                        d="M22.1676 9.05098H21.0625L21.012 8.98892C20.9784 8.30227 20.6756 7.62864 20.2202 7.12166L21.025 6.31689C21.7141 7.05359 22.117 8.04052 22.1676 9.05098Z"
                                                                        fill="#FBC700"
                                                                    ></path>
                                                                    <path
                                                                        d="M18.0092 13.5839V12.4599C18.7348 12.3963 19.3779 12.1301 19.9385 11.6716L20.7432 12.4409C20.0271 13.1535 19.0141 13.5294 18.0092 13.5834V13.5839Z"
                                                                        fill="#FBC700"
                                                                    ></path>
                                                                    <path
                                                                        d="M22.1677 9.42554C22.1166 10.435 21.7333 11.4354 21.0251 12.1596L20.2559 11.3549C20.7138 10.7943 20.9805 10.1512 21.0441 9.42554H22.1682H22.1677Z"
                                                                        fill="#FBC700"
                                                                    ></path>
                                                                    <path
                                                                        d="M17.6349 4.93018V6.05424C16.9467 6.09228 16.243 6.36954 15.7381 6.83848L14.9403 6.06825C15.5924 5.34457 16.6664 4.94919 17.6349 4.93018Z"
                                                                        fill="#FBC700"
                                                                    ></path>
                                                                    <path
                                                                        d="M14.638 9.05099H13.5139C13.5329 8.08258 13.9283 7.00856 14.6515 6.35645L15.4217 7.1542C14.9528 7.65968 14.6755 8.36334 14.6375 9.05099H14.638Z"
                                                                        fill="#FBC700"
                                                                    ></path>
                                                                    <path
                                                                        d="M17.841 12.0861C19.4032 12.0861 20.6697 10.8196 20.6697 9.25739C20.6697 7.69515 19.4032 6.42871 17.841 6.42871C16.2788 6.42871 15.0123 7.69515 15.0123 9.25739C15.0123 10.8196 16.2788 12.0861 17.841 12.0861Z"
                                                                        fill="#FBC700"
                                                                    ></path>
                                                                </g>
                                                                <path
                                                                    d="M7.77571 11.8572C7.35677 11.1523 7.45493 9.95644 8.58703 9.104C7.78746 10.6082 9.20026 12.4129 9.8979 12.6164C9.17119 12.878 8.19466 12.5621 7.77571 11.8572Z"
                                                                    fill="#434A54"
                                                                ></path>
                                                                <path
                                                                    d="M12.9886 12.5082C13.1054 12.4898 13.2345 12.5082 13.3513 12.5082L18.7562 13.4613C19.2174 13.5597 19.488 13.9778 19.408 14.439L18.4549 19.8439C18.3566 20.305 17.9384 20.5756 17.4711 20.4956L12.0662 19.5426C11.605 19.4442 11.3345 19.026 11.4144 18.5587L12.3675 13.1538C12.4167 12.871 12.6934 12.5574 12.9824 12.5082H12.9886ZM15.2022 14.9432C15.2022 14.5681 14.8947 14.2606 14.5196 14.2606C14.1446 14.2606 13.8371 14.5681 13.8371 14.9432C13.8371 15.3183 14.1446 15.6257 14.5196 15.6257C14.8947 15.6257 15.2022 15.3183 15.2022 14.9432ZM17.465 15.3428C17.465 14.9678 17.1575 14.6603 16.7824 14.6603C16.4073 14.6603 16.0999 14.9678 16.0999 15.3428C16.0999 15.7179 16.4073 16.0254 16.7824 16.0254C17.1575 16.0254 17.465 15.7179 17.465 15.3428ZM14.7225 17.661C14.7225 17.2859 14.4151 16.9785 14.04 16.9785C13.6649 16.9785 13.3575 17.2859 13.3575 17.661C13.3575 18.0361 13.6649 18.3435 14.04 18.3435C14.4151 18.3435 14.7225 18.0361 14.7225 17.661ZM16.9853 18.0607C16.9853 17.6856 16.6779 17.3781 16.3028 17.3781C15.9277 17.3781 15.6203 17.6856 15.6203 18.0607C15.6203 18.4358 15.9277 18.7432 16.3028 18.7432C16.6779 18.7432 16.9853 18.4358 16.9853 18.0607Z"
                                                                    fill="#ED5564"
                                                                ></path>
                                                                <path
                                                                    d="M16.3028 18.7432C16.6797 18.7432 16.9853 18.4377 16.9853 18.0607C16.9853 17.6838 16.6797 17.3782 16.3028 17.3782C15.9258 17.3782 15.6202 17.6838 15.6202 18.0607C15.6202 18.4377 15.9258 18.7432 16.3028 18.7432Z"
                                                                    fill="white"
                                                                ></path>
                                                                <path
                                                                    d="M14.5196 15.6256C14.8965 15.6256 15.2021 15.32 15.2021 14.943C15.2021 14.5661 14.8965 14.2605 14.5196 14.2605C14.1426 14.2605 13.837 14.5661 13.837 14.943C13.837 15.32 14.1426 15.6256 14.5196 15.6256Z"
                                                                    fill="white"
                                                                ></path>
                                                                <path
                                                                    d="M16.7825 16.0252C17.1595 16.0252 17.465 15.7196 17.465 15.3427C17.465 14.9657 17.1595 14.6602 16.7825 14.6602C16.4056 14.6602 16.1 14.9657 16.1 15.3427C16.1 15.7196 16.4056 16.0252 16.7825 16.0252Z"
                                                                    fill="white"
                                                                ></path>
                                                                <path
                                                                    d="M14.04 18.3433C14.4169 18.3433 14.7225 18.0378 14.7225 17.6608C14.7225 17.2839 14.4169 16.9783 14.04 16.9783C13.663 16.9783 13.3574 17.2839 13.3574 17.6608C13.3574 18.0378 13.663 18.3433 14.04 18.3433Z"
                                                                    fill="white"
                                                                ></path>
                                                                <path
                                                                    fill-rule="evenodd"
                                                                    clip-rule="evenodd"
                                                                    d="M18.7566 13.4614C19.2175 13.56 19.4879 13.9779 19.408 14.439L18.4548 19.8433C18.3565 20.3043 17.9386 20.5754 17.4714 20.4956L12.0662 19.5425C12.0328 19.5354 12.0008 19.5255 11.9695 19.5151C14.0285 19.2155 15.7319 17.8249 16.4763 15.9478C16.5689 15.995 16.6716 16.0248 16.782 16.0249C17.1571 16.0249 17.4646 15.7174 17.4646 15.3423C17.4644 14.9797 17.1772 14.6829 16.8191 14.6636C16.8585 14.3918 16.8806 14.1142 16.8806 13.8315C16.8806 13.5914 16.8633 13.355 16.8347 13.1226L18.7566 13.4614ZM16.3025 17.3784C15.9277 17.3786 15.6201 17.6853 15.6199 18.0601C15.6199 18.435 15.9276 18.7425 16.3025 18.7427C16.6776 18.7427 16.9851 18.4351 16.9851 18.0601C16.9848 17.6852 16.6774 17.3784 16.3025 17.3784Z"
                                                                    fill="#EF3C4E"
                                                                ></path>
                                                                <defs>
                                                                    <clipPath id="clip0_5581_61613">
                                                                        <rect
                                                                            width="8.65369"
                                                                            height="8.65369"
                                                                            fill="white"
                                                                            transform="translate(13.5139 4.93018)"
                                                                        ></rect>
                                                                    </clipPath>
                                                                </defs>
                                                            </svg>
                                                        </div>
                                                        <span class="sc-bMhjqq sc-kfiijn eeQnce gwhmuu">Juegos de Casino</span>
                                                    </div></a
                                                >
                                            </li>
                                            <div class="sc-cLVYFp sc-kiUgTw cSIQFP hPFZit"></div>
                                            <li class="sc-fkVSuP sc-bsyrka izPQbG kxFylD cy-menu-item">
                                                <a href="https://es.888casino.com/jackpots/" class="sc-ciMfCw ja-dRuB"
                                                ><div class="sc-gPLYmt sc-cjShfW efmGEW bDGwEc">
                                                        <span class="sc-iDhmSy jagTrD"></span>
                                                        <div class="sc-dgWXKx sc-bsStmr dvyXko hWgsTC">
                                                            <svg
                                                                width="2rem"
                                                                height="2rem"
                                                                viewBox="0 0 22 22"
                                                                version="1.1"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                class="sc-bqOBqt PBviZ"
                                                                fill="none"
                                                            >
                                                                <rect
                                                                    width="22"
                                                                    height="22"
                                                                    rx="11"
                                                                    fill="#FFD500"
                                                                    fill-opacity="0.2"
                                                                ></rect>
                                                                <path
                                                                    d="M17.2778 5.87652H15.5378V6.74642H17.2778C17.4538 6.74642 17.597 6.88432 17.597 7.05393V8.34203C17.597 8.62262 17.515 8.89694 17.3597 9.13505C16.9169 9.8147 16.0024 10.8225 14.6239 11.3463C14.2308 11.842 13.7277 12.2527 13.1501 12.5449C14.3001 12.4675 15.4158 12.0995 16.3458 11.4477C17.2178 10.8366 17.7945 10.1043 18.1246 9.59722C18.3702 9.22031 18.5 8.78595 18.5 8.34173V7.05364C18.5 6.4045 17.9516 5.87622 17.2778 5.87622V5.87652Z"
                                                                    fill="#FFEB7E"
                                                                    transform="translate(-0.5 0.5)"
                                                                ></path>
                                                                <path
                                                                    d="M16.1223 6.539V6.08431C16.1223 5.96974 16.2188 5.87671 16.3378 5.87671H15.5385V6.74661H16.3378C16.2188 6.74661 16.1223 6.65358 16.1223 6.539Z"
                                                                    fill="#FFE559"
                                                                    transform="translate(-0.5 0.5)"
                                                                ></path>
                                                                <path
                                                                    d="M14.8975 11.6966C15.1102 11.4809 15.3559 11.2967 15.6319 11.1632C16.7753 10.6113 17.5479 9.74203 17.9435 9.13478C18.0988 8.89637 18.1808 8.62205 18.1808 8.34176V7.05337C18.1808 6.88375 18.0379 6.74585 17.8616 6.74585H17.2778C17.4538 6.74585 17.597 6.88375 17.597 7.05337V8.34146C17.597 8.62206 17.515 8.89637 17.3597 9.13448C16.9169 9.81413 16.0024 10.8219 14.6239 11.3457C14.2308 11.8414 13.7277 12.2521 13.1501 12.5444C13.4066 12.527 13.6613 12.4947 13.9125 12.4484C14.2768 12.2428 14.6084 11.9892 14.8972 11.696L14.8975 11.6966Z"
                                                                    fill="#FFE559"
                                                                    transform="translate(-0.5 0.5)"
                                                                ></path>
                                                                <path
                                                                    d="M8.37639 11.3465C6.99793 10.8227 6.08341 9.81489 5.64059 9.13524C5.48532 8.89683 5.40334 8.62251 5.40334 8.34222V7.05412C5.40334 6.88451 5.5465 6.74661 5.72257 6.74661H7.46249V5.87671H5.72257C5.0484 5.87641 4.5 6.40469 4.5 7.05382V8.34192C4.5 8.78644 4.6298 9.2205 4.87544 9.59771C5.20553 10.1045 5.78219 10.837 6.65417 11.4482C7.58422 12.1 8.69997 12.468 9.84988 12.5454C9.27228 12.2529 8.76953 11.8425 8.37608 11.3468L8.37639 11.3465Z"
                                                                    fill="#FFEB7E"
                                                                    transform="translate(-0.5 0.5)"
                                                                ></path>
                                                                <path
                                                                    d="M7.23798 11.4482C6.366 10.837 5.78934 10.1048 5.45924 9.59771C5.21361 9.22079 5.0838 8.78644 5.0838 8.34222V7.05412C5.0838 6.40499 5.63221 5.87671 6.30606 5.87671H5.72226C5.0484 5.87671 4.5 6.40469 4.5 7.05382V8.34192C4.5 8.78614 4.6298 9.22049 4.87544 9.59741C5.20553 10.1042 5.78219 10.8367 6.65417 11.4479C7.58422 12.0997 8.69997 12.4677 9.84988 12.5451C9.78932 12.5146 9.73001 12.4823 9.67132 12.4491C8.79561 12.2885 7.96059 11.9543 7.23798 11.4479V11.4482Z"
                                                                    fill="#FFE559"
                                                                    transform="translate(-0.5 0.5)"
                                                                ></path>
                                                                <path
                                                                    d="M12.1871 14.364V12.8438C11.7337 12.9413 11.2664 12.9413 10.813 12.8438V14.364H12.1871Z"
                                                                    fill="#FBC700"
                                                                    transform="translate(-0.5 0.5)"
                                                                ></path>
                                                                <path
                                                                    d="M11.5232 12.9164C11.2853 12.9182 11.0474 12.894 10.813 12.8438V14.364H11.5232V12.9164Z"
                                                                    fill="#EAB900"
                                                                    transform="translate(-0.5 0.5)"
                                                                ></path>
                                                                <path
                                                                    d="M15.2524 16.9957V16.1822C15.2524 15.1572 14.3817 14.3184 13.3176 14.3184H9.68344C8.6194 14.3184 7.74866 15.1572 7.74866 16.1822V16.9957H15.2524Z"
                                                                    fill="#FFEB7E"
                                                                    transform="translate(-0.5 0.5)"
                                                                ></path>
                                                                <path
                                                                    d="M11.3547 14.3086H9.37586C8.52577 14.3086 7.6853 15.1431 7.6853 16.3949L7.6853 17.0003H9.56267V16.3949C9.56267 15.4364 10.5046 14.3086 11.3547 14.3086Z"
                                                                    fill="#FFE559"
                                                                    transform="translate(-0.5 0.5)"
                                                                ></path>
                                                                <path
                                                                    d="M15.5645 5.78432H7.43596C7.42322 5.78432 7.41049 5.78372 7.39807 5.78223V8.74102C7.39807 10.6032 8.62778 12.1883 10.3475 12.7845C11.0934 13.0429 11.9067 13.0429 12.6526 12.7845C14.3723 12.1883 15.6021 10.6032 15.6021 8.74102V5.78253C15.5896 5.78372 15.5769 5.78462 15.5642 5.78462L15.5645 5.78432Z"
                                                                    fill="#FFD500"
                                                                    transform="translate(-0.5 0.5)"
                                                                ></path>
                                                                <path
                                                                    d="M12.2579 12.7848C10.5382 12.1886 9.30818 10.6035 9.30818 8.74132V5.78432H7.43535C7.42261 5.78432 7.40988 5.78372 7.39746 5.78223V8.74132C7.39746 10.6035 8.62717 12.1886 10.3472 12.7848C11.0279 13.0208 11.7645 13.0406 12.4551 12.8458C12.389 12.8273 12.3231 12.8072 12.2579 12.7848Z"
                                                                    fill="#FBC700"
                                                                    transform="translate(-0.5 0.5)"
                                                                ></path>
                                                                <path
                                                                    d="M15.5641 5H7.43561C7.24215 5 7.08533 5.15107 7.08533 5.33743V5.53935C7.08533 5.72571 7.24215 5.87678 7.43561 5.87678H15.5641C15.7576 5.87678 15.9144 5.72571 15.9144 5.53935V5.33743C15.9144 5.15107 15.7576 5 15.5641 5Z"
                                                                    fill="#FFEB7E"
                                                                    transform="translate(-0.5 0.5)"
                                                                ></path>
                                                                <path
                                                                    d="M8.90878 5.53935V5.33743C8.90878 5.15107 9.0656 5 9.25906 5H7.43561C7.24215 5 7.08533 5.15107 7.08533 5.33743V5.53935C7.08533 5.72571 7.24215 5.87678 7.43561 5.87678H9.25906C9.0656 5.87678 8.90878 5.72571 8.90878 5.53935Z"
                                                                    fill="#FFE559"
                                                                    transform="translate(-0.5 0.5)"
                                                                ></path>
                                                            </svg>
                                                        </div>
                                                        <span class="sc-bMhjqq sc-kfiijn eeQnce gwhmuu">Pozos</span>
                                                    </div></a
                                                >
                                            </li>
                                            <div class="sc-cLVYFp sc-kiUgTw cSIQFP hPFZit"></div>
                                            <li class="sc-fkVSuP sc-bsyrka izPQbG kxFylD cy-menu-item">
                                                <a href="https://es.888casino.com/888-exclusive-games/" class="sc-ciMfCw ja-dRuB"
                                                ><div class="sc-gPLYmt sc-cjShfW evmujP dtqOUd">
                                                        <span class="sc-iDhmSy jagTrD"></span>
                                                        <div class="sc-dgWXKx sc-bsStmr dvyXko hWgsTC">
                                                            <svg
                                                                width="2rem"
                                                                height="2rem"
                                                                viewBox="0 0 22 22"
                                                                version="1.1"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                class="sc-bqOBqt PBviZ"
                                                                fill="none"
                                                            >
                                                                <rect
                                                                    width="22"
                                                                    height="22"
                                                                    rx="11"
                                                                    fill="#75E300"
                                                                    fill-opacity="0.2"
                                                                ></rect>
                                                                <path
                                                                    d="M17.5 11C17.5 14.3137 14.8137 17 11.5 17C8.18629 17 5.5 14.3137 5.5 11C5.5 7.68629 8.18629 5 11.5 5C14.8137 5 17.5 7.68629 17.5 11Z"
                                                                    fill="#282828"
                                                                    transform="translate(-0.5 0)"
                                                                ></path>
                                                                <path
                                                                    d="M14.4101 9.90802C14.5946 9.91643 14.6701 10.149 14.5257 10.2642L13.0514 11.4402C12.9888 11.4902 12.962 11.5726 12.9834 11.6499L13.485 13.4636C13.5343 13.642 13.3358 13.7859 13.1816 13.6836L11.6105 12.6412C11.5435 12.5968 11.4563 12.5968 11.3893 12.6412L9.81817 13.6836C9.66399 13.7859 9.46553 13.642 9.51484 13.4636L10.0163 11.6502C10.0377 11.5728 10.0108 11.4901 9.94795 11.4402L8.46736 10.2644C8.32256 10.1494 8.39795 9.91641 8.58266 9.90802L10.474 9.8221C10.554 9.81847 10.6241 9.76748 10.6522 9.6925L11.3126 7.93038C11.3775 7.7573 11.6223 7.7573 11.6872 7.93038L12.3476 9.69252C12.3757 9.76749 12.4458 9.81848 12.5258 9.82212L14.4101 9.90802Z"
                                                                    fill="#7FF800"
                                                                    transform="translate(-0.5 0)"
                                                                ></path>
                                                                <path
                                                                    d="M17.7417 8.63837C18.1725 8.91666 18.3229 9.47568 18.0899 9.93255L17.775 10.5502C17.6295 10.8356 17.6295 11.1733 17.775 11.4587L18.0899 12.0764C18.3229 12.5333 18.1725 13.0923 17.7417 13.3706L17.1598 13.7465C16.8898 13.9209 16.7202 14.2144 16.7038 14.5354L16.6687 15.2221C16.6425 15.7343 16.2331 16.1437 15.7209 16.1698L15.0326 16.2049C14.7118 16.2213 14.4184 16.3908 14.2439 16.6605L13.8691 17.24C13.59 17.6714 13.0293 17.8211 12.5723 17.5862L11.9571 17.27C11.6702 17.1226 11.3298 17.1226 11.0429 17.27L10.4277 17.5862C9.97069 17.8211 9.41004 17.6714 9.13095 17.24L8.75619 16.6606C8.58168 16.3908 8.28818 16.2214 7.9673 16.205L7.27436 16.1698C6.76039 16.1437 6.35017 15.7318 6.32619 15.2177L6.29409 14.5294C6.27905 14.2068 6.10911 13.9113 5.83783 13.736L5.25977 13.3626C4.8284 13.0839 4.67826 12.5238 4.91242 12.0667L5.22356 11.4593C5.3699 11.1737 5.37023 10.8351 5.22444 10.5492L4.91006 9.93255C4.67713 9.47568 4.82755 8.91666 5.25829 8.63837L5.83783 8.26396C6.10911 8.0887 6.27905 7.79321 6.29409 7.47059L6.32619 6.78229C6.35017 6.26822 6.76039 5.85628 7.27436 5.83016L7.9673 5.79495C8.28818 5.77865 8.58168 5.60915 8.75619 5.33938L9.13095 4.76005C9.41004 4.3286 9.97069 4.1789 10.4277 4.41379L11.0429 4.72996C11.3298 4.87742 11.6702 4.87742 11.9571 4.72996L12.5723 4.41379C13.0293 4.1789 13.59 4.3286 13.8691 4.76005L14.2439 5.3395C14.4184 5.60921 14.7118 5.77868 15.0326 5.79505L15.7207 5.83017C16.233 5.85632 16.6424 6.2658 16.6685 6.77806L16.7039 7.47337C16.7202 7.79443 16.8899 8.08806 17.1599 8.26251L17.7417 8.63837ZM16.7478 10.5935L16.926 10.2453C17.1599 9.78851 17.01 9.22885 16.5792 8.95005L16.2471 8.73516C16.0065 8.57861 15.8528 8.3159 15.8359 8.02936L15.8168 7.63448C15.7921 7.12273 15.3846 6.71245 14.873 6.68425L14.477 6.66241C14.191 6.6512 13.927 6.50016 13.7708 6.26037L13.5553 5.92788C13.2765 5.49757 12.7174 5.34787 12.2608 5.5813L11.9112 5.76005C11.6523 5.88942 11.3477 5.88942 11.0888 5.76005L10.7392 5.5813C10.2826 5.34787 9.72351 5.49757 9.44468 5.92788L9.22925 6.26037C9.073 6.50016 8.80897 6.6512 8.52299 6.66241L8.12697 6.68425C7.6154 6.71245 7.20791 7.12274 7.18319 7.63448L7.16411 8.02936C7.14725 8.3159 6.99345 8.57861 6.75287 8.73516L6.42081 8.95005C5.98999 9.22885 5.84012 9.78851 6.07398 10.2453L6.25224 10.5935L6.2558 10.6006C6.38284 10.8545 6.38151 11.1537 6.25224 11.4065L6.07018 11.7649C5.83829 12.2213 5.98861 12.7792 6.41843 13.0573L6.75287 13.2738C6.99408 13.4251 7.14738 13.6864 7.16411 13.9706L7.18317 14.3679C7.20785 14.8824 7.61933 15.294 8.13383 15.3188L8.52299 15.3376C8.80973 15.3544 9.07244 15.5079 9.22925 15.7486L9.44165 16.0764C9.72175 16.5087 10.2844 16.6575 10.7416 16.4202L11.0888 16.2399C11.3477 16.1106 11.6523 16.1106 11.9112 16.2399L12.2584 16.4202C12.7156 16.6575 13.2782 16.5087 13.5583 16.0764L13.7708 15.7486C13.9276 15.5079 14.1903 15.3544 14.477 15.3376L14.8662 15.3188C15.3807 15.294 15.7921 14.8824 15.8168 14.3679L15.8359 13.9706C15.8526 13.6864 16.0059 13.4251 16.2471 13.2738L16.5816 13.0573C17.0114 12.7792 17.1617 12.2213 16.9298 11.7649L16.7478 11.4065C16.6135 11.1549 16.6121 10.8533 16.7441 10.6005L16.7478 10.5935Z"
                                                                    fill="#7FF800"
                                                                    transform="translate(-0.5 0)"
                                                                ></path>
                                                                <path
                                                                    d="M9.50006 13.5C10.9483 9.3277 11.5266 9.72677 12.1524 9.16391L11.6877 7.92985C11.6226 7.7569 11.3778 7.75724 11.3132 7.93037L10.6058 9.82505L8.59425 9.90969C8.40919 9.91748 8.33323 10.1509 8.47828 10.2661L10.0604 11.5226L9.50006 13.5Z"
                                                                    fill="#C8FF88"
                                                                    transform="translate(-0.5 0)"
                                                                ></path>
                                                            </svg>
                                                        </div>
                                                        <span class="sc-bMhjqq sc-kfiijn eeQnce gwhmuu">Exclusivo de 888</span>
                                                    </div></a
                                                >
                                            </li>
                                        </ul>
                                    </div>
                                </section>
                            </div>
                        </div>
                        <div class="sc-jvEdwp jkgLtN">
                            <div class="sc-codVKW bPGlzn">
                                <div class="sc-etyUPJ gNGgmX">
                                    <span
                                    ><svg
                                        width="2.4rem"
                                        height="2.4rem"
                                        viewBox="0 0 24 24"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="sc-bqOBqt kKmHiP"
                                        fill="unset"
                                    >
                                            <path
                                                transform="translate(16 2.5) scale(-1, 1)"
                                                fill="currentColor"
                                                d="M11.193,8.327h0L3.46.594A2.027,2.027,0,1,0,.593,3.459l6.3,6.3-6.3,6.3A2.027,2.027,0,0,0,3.46,18.928l7.732-7.733h0a2.027,2.027,0,0,0,0-2.867"
                                            ></path></svg></span
                                    ><span class="sc-jnXGeI hYtkWY">Atrás</span>
                                </div>
                                <p class="sc-eHfLMq cjoShc">Configuración</p>
                                <div class="sc-gzIglc kcwQjd cy-close-mobile-menu-from-client-settings-icon">
                                    <svg
                                        width="2.4rem"
                                        height="2.4rem"
                                        viewBox="0 0 24 24"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="sc-bqOBqt PBviZ"
                                        fill="unset"
                                    >
                                        <g>
                                            <path
                                                fill="currentColor"
                                                d="M19.92,17l-5.09-5.1,4.8-4.8A2,2,0,1,0,16.8,4.22L12,9,7.2,4.22A2,2,0,0,0,4.37,7.05l4.8,4.8L4.08,17A2,2,0,1,0,6.9,19.78l5.1-5.1,5.1,5.1A2,2,0,1,0,19.92,17Z"
                                            ></path>
                                        </g>
                                    </svg>
                                </div>
                            </div>
                            <div class="sc-csLrWn jUQuvj">
                                <div class="sc-eJrUIs iqpUQh cy-client-settings-language-switcher-section">
                                    <input type="checkbox" class="sc-fBMaJD ixzNYK" /><span class="sc-izDmXf cPlpsq"
                                    ><svg
                                        width="2.4rem"
                                        height="2.4rem"
                                        viewBox="0 0 20 20"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="sc-bqOBqt PBviZ"
                                        fill="unset"
                                    >
                                            <g fill="currentColor">
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M9.55798 16.6484C6.23278 16.5389 3.56798 13.7644 3.34668 10.4418L3.34268 10.3791H3.33398V10.2444V9.62044H3.34328L3.34728 9.55774C3.56728 6.23704 6.23238 3.45554 9.55858 3.34644C9.77948 3.33924 10.2217 3.33974 10.4426 3.34714C13.7707 3.45874 16.4332 6.23784 16.6492 9.55844L16.6532 9.62114H16.662L16.6672 9.75584V10.3798H16.6532L16.6492 10.4425C16.4332 13.7644 13.7705 16.5426 10.4426 16.6492C10.2216 16.6563 9.77898 16.6557 9.55798 16.6484ZM10.3793 15.8652L10.464 15.8425C11.3907 15.5979 12.21 14.6219 12.7113 13.1652L12.7421 13.0758H10.3794L10.3793 15.8652ZM7.28858 13.1652C7.78998 14.6218 8.60928 15.5978 9.53598 15.8424L9.62068 15.8651V13.0758H7.25798L7.28858 13.1652ZM5.02458 13.1798C5.61988 14.1104 6.46058 14.8524 7.45528 15.3258L7.70658 15.4458L7.53728 15.2244C7.10458 14.6584 6.75128 13.9518 6.48598 13.1238L6.47128 13.0772H4.95798L5.02398 13.1805L5.02458 13.1798ZM13.514 13.1232C13.2533 13.9352 12.9 14.6425 12.4626 15.2244L12.2979 15.4432L12.5452 15.3258C13.5392 14.8532 14.38 14.1112 14.976 13.1798L15.0426 13.0764H13.5292L13.5146 13.1231L13.514 13.1232ZM15.4332 12.3125L15.4506 12.2712C15.692 11.6899 15.838 11.0779 15.886 10.4525L15.8913 10.3798H13.97L13.9673 10.4445C13.9401 11.0752 13.8653 11.6758 13.7453 12.2312L13.728 12.3125H15.4346H15.4332ZM12.9566 12.3125L12.9686 12.2598C13.0986 11.6838 13.1772 11.0751 13.2026 10.4498L13.2052 10.3798H10.38V12.3125H12.9566ZM9.62128 12.3125V10.3798H6.79598L6.79868 10.4498C6.82398 11.0751 6.90268 11.6838 7.03268 12.2598L7.04468 12.3125H9.62128ZM6.27328 12.3125L6.25598 12.2312C6.13598 11.6752 6.06128 11.0739 6.03468 10.4445L6.03198 10.3798H4.10998L4.11528 10.4525C4.16258 11.0778 4.30928 11.6898 4.55058 12.2712L4.56788 12.3125H6.27388H6.27328ZM15.8906 9.62114L15.8852 9.54844C15.8379 8.92374 15.6919 8.31174 15.4506 7.72974L15.4332 7.68844H13.7266L13.7446 7.76974C13.8646 8.32504 13.9392 8.92574 13.9666 9.55644L13.9692 9.62114H15.8906ZM13.2053 9.62114L13.202 9.55044C13.1713 8.89844 13.0926 8.28914 12.968 7.74114L12.956 7.68844H10.3793V9.62114H13.2053ZM9.62058 9.62114V7.68854H7.04398L7.03198 7.74124C6.90268 8.31454 6.82398 8.92394 6.79798 9.55124L6.79528 9.62124L9.62058 9.62114ZM6.03128 9.62114L6.03398 9.55644C6.06128 8.92714 6.13528 8.32574 6.25598 7.76974L6.27328 7.68844H4.56658L4.54928 7.72984C4.30798 8.31114 4.16198 8.92314 4.11398 9.54854L4.10868 9.62124H6.03068L6.03128 9.62114ZM15.042 6.92454L14.9753 6.82124C14.3793 5.89054 13.5393 5.14854 12.5447 4.67524L12.2927 4.55524L12.462 4.77654C12.894 5.34124 13.248 6.04784 13.5133 6.87724L13.528 6.92394H15.0413L15.042 6.92454ZM12.742 6.92454L12.7112 6.83524C12.2092 5.37854 11.3906 4.40254 10.4639 4.15794L10.3792 4.13594V6.92524H12.7419V6.92454H12.742ZM9.62058 6.92454V4.13514L9.53598 4.15784C8.60928 4.40314 7.78998 5.37914 7.28868 6.83514L7.25798 6.92444L9.62058 6.92454ZM6.47598 6.92454L6.49068 6.87724C6.74398 6.07254 7.10598 5.34594 7.53738 4.77654L7.70408 4.55654L7.45478 4.67524C6.45998 5.14784 5.61928 5.88984 5.02398 6.82114L4.95798 6.92444L6.47598 6.92454Z"
                                                ></path>
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M10 1.0667C12.386 1.0667 14.6294 1.996 16.3166 3.6834C18.004 5.3707 18.9334 7.614 18.9334 10C18.9334 12.386 18.004 14.6294 16.3166 16.3166C14.6294 18.004 12.386 18.9334 10 18.9334C8.446 18.9334 6.916 18.5286 5.5753 17.7626L5.218 17.5586L4.816 17.6474L1.9233 18.2854L2.6993 15.8874L2.8586 15.3954L2.5706 14.9654C1.5859 13.4954 1.0653 11.7787 1.0653 10.0007C1.0653 7.6147 1.9946 5.3714 3.682 3.684C5.3694 1.9966 7.6127 1.0673 9.9987 1.0673M9.9987 0.0007C4.4773 0 0 4.4773 0 10C0 12.0567 0.6213 13.9686 1.686 15.558L0.3367 19.7274L5.0467 18.6886C6.5067 19.5226 8.198 20 10 20C15.5226 20 20 15.5226 20 10C20 4.4773 15.5226 0 10 0L9.9987 0.0007Z"
                                                ></path>
                                            </g></svg
                                        ></span>
                                    <div class="sc-kTCtvK hARPGr">
                                        Idioma<img
                                            src="https://cgp-cdn.safe-iplay.com/cgp-assets/full/skins/888casino/defaults/images/letter-info-bubble.svg"
                                            class="sc-fpspVy iFptHN"
                                        />
                                    </div>
                                    <div class="sc-kJzAQR bqZHnL">
                                        <span class="sc-iBPvTh fxLOLP">Español</span
                                        ><span class="sc-jpsufY sc-gyulLJ bVHZqX bBaePO"
                                        ><svg
                                            width="2.4rem"
                                            height="2.4rem"
                                            viewBox="0 0 24 24"
                                            version="1.1"
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="sc-bqOBqt kKmHiP"
                                            fill="unset"
                                        >
                                                <path
                                                    transform="translate(16 2.5) scale(-1, 1)"
                                                    fill="currentColor"
                                                    d="M11.193,8.327h0L3.46.594A2.027,2.027,0,1,0,.593,3.459l6.3,6.3-6.3,6.3A2.027,2.027,0,0,0,3.46,18.928l7.732-7.733h0a2.027,2.027,0,0,0,0-2.867"
                                                ></path></svg
                                            ></span>
                                    </div>
                                    <div class="sc-kuIWOs bhoSpR">
                                        <div class="sc-jwXyar fRqmus cy-language-switcher-item">
                                            <div class="sc-cYLKhR jiFmhD">Elige tu idioma:</div>
                                            <div class="sc-jigTXS nNApC">
                                                <div class="sc-lkmNBg vTZir">
                                                    <div class="sc-itoFgR jygtin">
                                                        <svg
                                                            width="2.4rem"
                                                            height="2.4rem"
                                                            viewBox="0 0 24 24"
                                                            version="1.1"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            class="sc-bqOBqt PBviZ"
                                                            fill="unset"
                                                        >
                                                            <path
                                                                fill="currentColor"
                                                                d="M10.064 22L0 11.936L5.032 6.904L10.208 12.08L21.112 1.176L26 6.064L10.064 22Z"
                                                            ></path>
                                                        </svg>
                                                    </div>
                                                    Español
                                                </div>
                                                <div class="sc-lkmNBg jZkmnB">
                                                    <div class="sc-itoFgR iyRIIZ"></div>
                                                    Deutsch
                                                </div>
                                                <div class="sc-lkmNBg jZkmnB">
                                                    <div class="sc-itoFgR iyRIIZ"></div>
                                                    Français
                                                </div>
                                                <div class="sc-lkmNBg jZkmnB">
                                                    <div class="sc-itoFgR iyRIIZ"></div>
                                                    English
                                                </div>
                                                <div class="sc-lkmNBg jZkmnB">
                                                    <div class="sc-itoFgR iyRIIZ"></div>
                                                    Suomi
                                                </div>
                                            </div>
                                        </div>
                                        <div class="sc-jwXyar fRqmus cy-language-switcher-item">
                                            <div class="sc-cYLKhR jiFmhD">O elige tu país:</div>
                                            <div class="sc-jigTXS nNApC">
                                                <div class="sc-lkmNBg jZkmnB">
                                                    <div class="sc-itoFgR iyRIIZ"></div>
                                                    Canada
                                                </div>
                                                <div class="sc-lkmNBg jZkmnB">
                                                    <div class="sc-itoFgR iyRIIZ"></div>
                                                    Danmark
                                                </div>
                                                <div class="sc-lkmNBg jZkmnB">
                                                    <div class="sc-itoFgR iyRIIZ"></div>
                                                    România
                                                </div>
                                                <div class="sc-lkmNBg jZkmnB">
                                                    <div class="sc-itoFgR iyRIIZ"></div>
                                                    Italia
                                                </div>
                                                <div class="sc-lkmNBg jZkmnB">
                                                    <div class="sc-itoFgR iyRIIZ"></div>
                                                    Sverige
                                                </div>
                                                <div class="sc-lkmNBg jZkmnB">
                                                    <div class="sc-itoFgR iyRIIZ"></div>
                                                    United States
                                                </div>
                                                <div class="sc-lkmNBg jZkmnB">
                                                    <div class="sc-itoFgR iyRIIZ"></div>
                                                    Portugal
                                                </div>
                                                <div class="sc-lkmNBg jZkmnB">
                                                    <div class="sc-itoFgR iyRIIZ"></div>
                                                    Deutschland
                                                </div>
                                                <div class="sc-lkmNBg jZkmnB">
                                                    <div class="sc-itoFgR iyRIIZ"></div>
                                                    España
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;