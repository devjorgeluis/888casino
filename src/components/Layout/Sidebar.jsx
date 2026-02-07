import { useState, useEffect, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import ImgLogo from "/src/assets/svg/logo.svg";
import ImgHome from "/src/assets/svg/home.svg";
import ImgCasino from "/src/assets/svg/casino.svg";
import ImgLiveCasino from "/src/assets/svg/live-casino.svg";
import ImgHot from "/src/assets/svg/hot.svg";
import ImgJoker from "/src/assets/svg/joker.svg";
import ImgCrash from "/src/assets/svg/crash.svg";
import ImgMegaway from "/src/assets/svg/megaway.svg";
import ImgRuleta from "/src/assets/svg/ruleta.svg";
import ImgDeactiveProfile from "/src/assets/svg/pre-login-reg.svg";
import ImgProfile from "/src/assets/svg/post-login-reg.svg";
import ImgPhone from "/src/assets/svg/phone.svg";

const Sidebar = ({ isSlotsOnly, isLogin, isMobile, supportParent, openSupportModal, handleLoginClick, isUserMenuOpen, setIsUserMenuOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { contextData } = useContext(AppContext);
    const [expandedMenus, setExpandedMenus] = useState([]);
    const iconRefs = useRef({});
    const isLoggedIn = !!contextData?.session;
    const isMenuExpanded = (menuId) => expandedMenus.includes(menuId);
    const [currentTime, setCurrentTime] = useState("");

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

    useEffect(() => {
        const updateTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        setCurrentTime(`${hours}:${minutes}`);
        };

        updateTime();
        
        const intervalId = setInterval(updateTime, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const isSlotsOnlyMode = isSlotsOnly === true || isSlotsOnly === "true";

    const menuItems = [
        {
            id: "home",
            name: "Inicio",
            image: ImgHome,
            href: "/",
            subItems: [],
        },
        {
            id: "casino",
            name: "Tragamonedas",
            image: ImgCasino,
            href: "/casino",
            subItems: [],
        },
        ...(isSlotsOnlyMode
            ? []
            : [
                {
                    id: "live-casino",
                    name: "Casino en Vivo",
                    image: ImgLiveCasino,
                    href: "/live-casino",
                    subItems: [],
                },
            ]),
        {
            id: "hot",
            name: "Juegos Nuevos",
            image: ImgHot,
            href: "/casino#hot",
            subItems: [],
        },
        {
            id: "joker",
            name: "Jokers",
            image: ImgJoker,
            href: "/casino#joker",
            subItems: [],
        },
        {
            id: "crash",
            name: "Juegos de Crash",
            image: ImgCrash,
            href: "/casino#arcade",
            subItems: [],
        },
        {
            id: "megaway",
            name: "Megaways",
            image: ImgMegaway,
            href: "/casino#megaways",
            subItems: [],
        },
        {
            id: "ruleta",
            name: "Ruletas",
            image: ImgRuleta,
            href: "/casino#roulette",
            subItems: [],
        },
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
    ];

    const isMenuActive = (item) => {
        const currentPath = location.pathname;
        const currentHash = location.hash;

        if (item.href.includes("#")) {
            return location.pathname + location.hash === item.href;
        }

        if (item.id === "profile" && currentPath.startsWith("/profile")) {
            return true;
        }

        if (item.href === currentPath && !currentHash) {
            return true;
        }

        return false;
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    const closeUserMenu = () => {
        setIsUserMenuOpen(false);
    };

    const handleMenuClick = (href, item) => {
        closeUserMenu();
        console.log(item);
        
        if (item && item.action) {
            item.action();
        } else {
            navigate(href);
        }
    };

    const handleProfileClick = () => {
        if (isLogin) {
            toggleUserMenu();
        } else {
            handleLoginClick();
        }
    };

    return (
        <>
            {/* Main Navigation */}
            <div className="sc-gvsNSq jxqyxT cy-main-nav">
                <div className="sc-daLoug sc-dXijah hUcPdj bDBgJW">
                    <div className="sc-hhFrFd bCsUbK">
                        <div className="sc-yWEwC sc-bvtzcD cOhCUT bwJqBY cy-logo-container">
                            <a onClick={() => handleMenuClick("/")} className="sc-ciMfCw ja-dRuB" style={{ cursor: 'pointer' }}>
                                <img
                                    src={ImgLogo}
                                    alt="888 Online Casino"
                                    width="39"
                                    height="30"
                                    className="sc-gHXKQl eKXwKk logo cy-logo"
                                />
                            </a>
                        </div>
                        <div className="sc-gSONCE sc-dxYMJA fxKZYg gpHIWH">
                            <div className="sc-htyjTb sc-dBaIIm ciAYHW dSZHWt cy-profile-box">
                                <div className="sc-cnXNfM eSsHcy">
                                    <a className="sc-ciMfCw ja-dRuB cy-profile-picture" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
                                        <img
                                            src={isLogin ? ImgProfile : ImgDeactiveProfile}
                                            alt="casino888 player"
                                            className="sc-ilDdSB bTEstA"
                                        />
                                    </a>
                                    <span className="sc-dcihie ckzqLt">{contextData?.session?.user?.username || '-'}</span>
                                </div>
                                <div className="sc-cXPgEM dztcgo cy-profile-box-buttons">
                                    {isLogin ? (
                                        <div className="sc-gqFbaJ sc-cyhzPU iWTVed kBwInc cy-cashier-button">
                                            <span className="sc-lhKHOd ldvMqJ cy-balance-box-amount">
                                                $ {Number.isFinite(Number(contextData?.session?.user?.balance)) ? Number(contextData?.session?.user?.balance).toFixed(2) : "0.00"}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="cy-profile-box-login-button">
                                            <button width="15" height="4" className="sc-ksJhlw dmlVbK" onClick={handleLoginClick}>
                                                <span className="sc-fIysua sc-cRAjZL eZsMbN dcVKxz">
                                                    <span className="sc-bFbHAG fxFSPh">INICIAR</span>
                                                </span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="sc-iYjPCr gWmbXn cy-side-menu">
                                <section className="sc-klCKcm sc-kZzZex eLAEaM jdUfX">
                                    <div className="sc-MKQME sc-jlirRl ekPQQx fJgckN">
                                        <ul className="cy-menu-links-group">
                                            {menuItems.map((item, index) => {
                                                const itemRef = (el) => (iconRefs.current[item.id] = el);
                                                const isActive = isMenuActive(item);
                                                const isLast = index === menuItems.length - 1;

                                                return (
                                                    <div ref={itemRef} key={item.id}>
                                                        <li className="sc-fkVSuP sc-bsyrka izPQbG kxFylD cy-menu-item">
                                                            <a onClick={() => handleMenuClick(item.href, item)}  className="sc-ciMfCw ja-dRuB" style={{ cursor: 'pointer' }}>
                                                                <div className={`sc-gPLYmt sc-cjShfW efmGEW bDGwEc ${isActive ? "dtqOUd" : ""}`}>
                                                                    <span className="sc-iDhmSy jagTrD"></span>
                                                                    <div className={`sc-dgWXKx sc-bsStmr dvyXko hWgsTC ${isLast ? "phone" : ""}`}>
                                                                        <img src={item.image} className="sc-bqOBqt PBviZ" alt={item.name} />
                                                                    </div>
                                                                    <span className="sc-bMhjqq sc-kfiijn eeQnce gwhmuu">{item.name}</span>
                                                                </div>
                                                            </a>
                                                        </li>
                                                        <div className="sc-cLVYFp sc-kiUgTw cSIQFP hPFZit"></div>
                                                    </div>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </section>
                            </div>
                        </div>
                        <div className="sc-jngljW sc-gwicPH qpKDx jJMsHK cy-navbar-clock-last-login">
                            <div className="sc-OPwof dBHGWN cy-clock-component">
                                <div className="cy-clock">{currentTime}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;