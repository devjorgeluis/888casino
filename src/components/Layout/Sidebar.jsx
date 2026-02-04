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

const Sidebar = ({ isSlotsOnly, isMobile, supportParent, openSupportModal, handleLoginClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { contextData } = useContext(AppContext);

    const [expandedMenus, setExpandedMenus] = useState([]);
    const iconRefs = useRef({});
    const isLoggedIn = !!contextData?.session;
    const isMenuExpanded = (menuId) => expandedMenus.includes(menuId);

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

    return (
        <>
            <div className="sc-gvsNSq jxqyxT cy-main-nav">
                <div className="sc-daLoug sc-dXijah hUcPdj bDBgJW">
                    <div className="sc-hhFrFd bCsUbK">
                        <div className="sc-yWEwC sc-bvtzcD cOhCUT bwJqBY cy-logo-container">
                            <a onClick={() => navigate("/")} className="sc-ciMfCw ja-dRuB">
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
                                    <a className="sc-ciMfCw ja-dRuB cy-profile-picture">
                                        <img
                                            src={ImgDeactiveProfile}
                                            alt="casino888 player"
                                            className="sc-ilDdSB bTEstA"
                                        />
                                    </a>
                                </div>
                                <div className="sc-cXPgEM dztcgo cy-profile-box-buttons">
                                    <div className="cy-profile-box-login-button">
                                        <button width="15" height="4" className="sc-ksJhlw dmlVbK" onClick={() => handleLoginClick()}>
                                            <span className="sc-fIysua sc-cRAjZL eZsMbN dcVKxz">
                                                <span className="sc-bFbHAG fxFSPh">INICIAR</span>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="sc-iYjPCr gWmbXn cy-side-menu">
                                <section className="sc-klCKcm sc-kZzZex eLAEaM jdUfX">
                                    <div className="sc-MKQME sc-jlirRl ekPQQx fJgckN">
                                        <ul className="cy-menu-links-group">
                                            {menuItems.map((item) => {
                                                const itemRef = (el) => (iconRefs.current[item.id] = el);
                                                const isActive = isMenuActive(item);

                                                return (
                                                    <div ref={itemRef} key={item.id}>
                                                        <li className="sc-fkVSuP sc-bsyrka izPQbG kxFylD cy-menu-item">
                                                            <a onClick={() => navigate(item.href)} className="sc-ciMfCw ja-dRuB">
                                                                <div className={`sc-gPLYmt sc-cjShfW efmGEW bDGwEc ${isActive && "dtqOUd"}`}>
                                                                    <span className="sc-iDhmSy jagTrD"></span>
                                                                    <div className="sc-dgWXKx sc-bsStmr dvyXko hWgsTC">
                                                                        <img src={item.image} className="sc-bqOBqt PBviZ" />
                                                                    </div>
                                                                    <span className="sc-bMhjqq sc-kfiijn eeQnce gwhmuu">{item.name}</span>
                                                                </div>
                                                            </a>
                                                        </li>
                                                        <div className="sc-cLVYFp sc-kiUgTw cSIQFP hPFZit"></div>
                                                    </div>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;