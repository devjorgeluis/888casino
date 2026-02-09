import { useContext, useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { LayoutContext } from "./LayoutContext";
import { NavigationContext } from "./NavigationContext";
import { callApi } from "../../utils/Utils";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MobileFooter from "./MobileFooter";
import LoginModal from "../Modal/LoginModal";
import SupportModal from "../Modal/SupportModal";
import MyProfileModal from "../Modal/MyProfileModal";
import HistoryModal from "../Modal/HistoryModal";
import FullDivLoading from "../Loading/FullDivLoading";
import GameModal from "../Modal/GameModal";
import IconClose from "/src/assets/svg/circle-close.svg";
import IconArrowRight from "/src/assets/svg/arrow-right.svg";
import IconHistory from "/src/assets/svg/history.svg";
import IconPoker from "/src/assets/svg/poker.svg";
import IconArrowUpdown from "/src/assets/svg/arrow-updown.svg";

const Layout = () => {
    const { contextData } = useContext(AppContext);
    const [selectedPage, setSelectedPage] = useState("lobby");
    const [isLogin, setIsLogin] = useState(contextData.session !== null);
    const [isMobile, setIsMobile] = useState(false);
    const [userBalance, setUserBalance] = useState("");
    const [supportWhatsApp, setSupportWhatsApp] = useState("");
    const [supportTelegram, setSupportTelegram] = useState("");
    const [supportEmail, setSupportEmail] = useState("");
    const [supportParent, setSupportParent] = useState("");
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [supportParentOnly, setSupportParentOnly] = useState(false);
    const [showMyProfileModal, setShowMyProfileModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [topGames, setTopGames] = useState([]);
    const [topArcade, setTopArcade] = useState([]);
    const [topCasino, setTopCasino] = useState([]);
    const [topLiveCasino, setTopLiveCasino] = useState([]);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isSlotsOnly, setIsSlotsOnly] = useState("");
    const [showFullDivLoading, setShowFullDivLoading] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
    const closeTimeoutRef = useRef(null);

    const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
    const [gameModalData, setGameModalData] = useState({
        gameUrl: "",
        gameName: null,
        gameImg: null,
        gameId: null,
        gameType: null,
        gameLauncher: null
    });
    const refGameModal = useRef();
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    useEffect(() => {
        if (contextData.session != null) {
            setIsLogin(true);
            if (contextData.session.user && contextData.session.user.balance) {
                setUserBalance(contextData.session.user.balance);
                setSupportWhatsApp(contextData.session.support_whatsapp || "");
                setSupportTelegram(contextData.session.support_telegram || "");
                setSupportEmail(contextData.session.support_email || "");
                setSupportParent(contextData.session.support_parent || "");
            }
            refreshBalance();
        }
        getStatus();
    }, [contextData.session]);

    useEffect(() => {
        const checkIsMobile = () => {
            return window.innerWidth <= 767;
        };

        const checkShouldCollapseSidebar = () => {
            return window.innerWidth < 1024;
        };

        const checkIsSmallScreen = () => {
            return window.innerWidth < 1024;
        };

        setIsMobile(checkIsMobile());
        setIsSmallScreen(checkIsSmallScreen());

        if (checkShouldCollapseSidebar()) {
            setIsSidebarExpanded(false);
        }

        const handleResize = () => {
            setIsMobile(checkIsMobile());
            setIsSmallScreen(checkIsSmallScreen());

            if (checkShouldCollapseSidebar()) {
                setIsSidebarExpanded(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (isUserMenuOpen) {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
        }

        return () => {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
        };
    }, [isUserMenuOpen]);

    useEffect(() => {
        const mobileClasses = ["cgp-mobile", "cgp-portrait", "cgp-low-height", "cgp-real-mobile", "cgp-iphone-ver-6", "cgp-ios", "cgp-gib", "promotions-lobby"];
        const desktopClasses = ["cgp-pc", "cgp-landscape", "cgp-low-height", "cgp-not-mobile-os", "cgp-windows", "cgp-gib", "promotions-lobby"];

        const htmlElement = document.documentElement;
        htmlElement.classList.remove(...mobileClasses, ...desktopClasses);

        if (isMobile) {
            htmlElement.classList.add(...mobileClasses);
        } else {
            htmlElement.classList.add(...desktopClasses);
        }
    }, [isMobile]);

    const refreshBalance = () => {
        setUserBalance("");
        callApi(contextData, "GET", "/get-user-balance", callbackRefreshBalance, null);
    };

    const callbackRefreshBalance = (result) => {
        setUserBalance(result && result.balance);
    };

    const getStatus = () => {
        callApi(contextData, "GET", "/get-status", callbackGetStatus, null);
    };

    const getPage = (page) => {
        setSelectedPage(page);
        setShowFullDivLoading(true);
        callApi(contextData, "GET", "/get-page?page=" + page, callbackGetPage, null);
        navigate("/" + (page === "home" ? "" : page));
    };

    const callbackGetPage = () => {
        setShowFullDivLoading(false);
    };

    const callbackGetStatus = (result) => {
        if ((result && result.slots_only == null) || (result && result.slots_only == false)) {
            setIsSlotsOnly("false");
        } else {
            setIsSlotsOnly("true");
        }

        setSupportWhatsApp(result && result.support_whatsapp ? result.support_whatsapp : "");
        setSupportTelegram(result && result.support_telegram ? result.support_telegram : "");
        setSupportEmail(result && result.support_email ? result.support_email : "");
        setSupportParent(result && result.support_parent ? result.support_parent : "");
        setTopGames(result.top_hot);
        setTopArcade(result.top_arcade);
        setTopCasino(result.top_slot);
        setTopLiveCasino(result.top_livecasino);

        if (result && result.user === null) {
            localStorage.removeItem("session");
        }
    };

    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleLoginSuccess = (balance) => {
        setUserBalance(balance);
    };

    const handleLogoutClick = () => {
        callApi(contextData, "POST", "/logout", (result) => {
            if (result.status === "success") {
                setTimeout(() => {
                    localStorage.removeItem("session");
                    window.location.href = "/";
                }, 200);
            }
        }, null);
    };

    const openSupportModal = (parentOnly = false) => {
        setSupportParentOnly(Boolean(parentOnly));
        setShowSupportModal(true);
    };

    const closeSupportModal = () => {
        setShowSupportModal(false);
        setSupportParentOnly(false);
    };

    const handleMyProfileClick = () => {
        setShowMyProfileModal(true);
    };

    const handleHistoryClick = () => {
        setShowHistoryModal(true);
    };

    const launchGameFromSearch = (game, type, launcher) => {
        setShowMobileSearch(false);
        setShouldShowGameModal(true);
        setShowFullDivLoading(true);

        const gameId = game?.id;
        const gameName = game?.name;
        const gameImg = game?.image_local != null ? contextData.cdnUrl + game?.image_local : null;

        setGameModalData({
            gameId: gameId,
            gameType: type,
            gameLauncher: launcher,
            gameName: gameName,
            gameImg: gameImg,
            gameUrl: ""
        });

        // Fetch game URL
        callApi(contextData, "GET", "/get-game-url?game_id=" + gameId, (result) => {
            setShowFullDivLoading(false);
            if (result.status === "0") {
                setGameModalData(prev => ({
                    ...prev,
                    gameUrl: result.url
                }));
            }
        }, null);
    };

    const closeGameModal = () => {
        setShouldShowGameModal(false);
        setGameModalData({
            gameUrl: "",
            gameName: null,
            gameImg: null,
            gameId: null,
            gameType: null,
            gameLauncher: null
        });
    };

    const reloadGame = (game, type, launcher) => {
        const gameToUse = game || { id: gameModalData.gameId, name: gameModalData.gameName };
        launchGameFromSearch(gameToUse, type || gameModalData.gameType, launcher || gameModalData.gameLauncher);
    };

    const closeUserMenu = () => {
        setIsUserMenuOpen(false);
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
        }
    };

    const toggleHistoryMenu = () => {
        setIsHistoryExpanded(!isHistoryExpanded);
    };

    const formatBalance = (value) => {
        const num = parseFloat(value);
        if (isNaN(num)) return "0.00";
        return num.toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };    

    const UserMenuContent = () => (
        <div className="sc-fbrkoh hmuUFI">
            <div className="sc-biTJds juaoAi">
                <div className="sc-cXWvkA sc-gYmQl dOIkyn hXdhYp cy-user-menu-header-box">
                    <div className="sc-hVVKKh fFlnSE cy-welcome-user-menu-title">
                        <p className="sc-kvGAGD hvVMZr">Mi Cuenta</p>
                    </div>
                    <div className="sc-hIFQNf cgiDgU">
                        <div className="sc-gzIglc kcwQjd cy-user-menu-close-btn" onClick={closeUserMenu} style={{ cursor: 'pointer' }}>
                            <img src={IconClose} className="sc-bqOBqt PBviZ" style={{ width: "1.4rem", height: "1.4rem", margin: "auto" }} />
                        </div>
                    </div>
                </div>
                <div className="sc-lfyySb gQxOdg">
                    <div direction="column" className="sc-dIEovb fJgfbR">
                        <div className="sc-fEyyHY inSENM">
                            <div className="sc-kXzPdr oVDqI cy-user-menu-user-details">
                                <div className="sc-dIEovb irhjgz">
                                    <div className="sc-bjEuFB bvvZly"></div>
                                    <div className="sc-fEyyHY inSENM">
                                        <div className="sc-hTJBOf gklrIC"><span className="cy-user-name">{contextData?.session?.user?.username || '-'}</span></div>
                                        <div className="sc-fJoDJo eeRhen">
                                            <span className="sc-kKHKiu dlzQYQ">N.º de asistencia</span>
                                            <span className="user-cid cy-user-cid">{contextData?.session?.user?.phone || '-'}</span>
                                        </div>
                                    </div>
                                    <div className="sc-fnOeCC fDelro">
                                        <img
                                            src={IconArrowRight}
                                            className="sc-bqOBqt PBviZ"
                                            style={{ width: "1.2rem", height: "1.2rem" }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="sc-kXzPdr oVDqI cy-balance-box">
                                <div className="sc-dIEovb cwoLEt">
                                    <div className="sc-exOYqz lcbWRF">Saldo actual</div>
                                    <span className="sc-bsFqxl dOKwdH cy-balance-box-amount">${formatBalance(contextData?.session?.user?.balance)}</span>
                                </div>
                            </div>
                            <div className="sc-kXzPdr oVDqI cy-useful-links-section">
                                <ul className="sc-jPFrcG czuYV cy-useful-links-list">
                                    <li className="cy-useful-links-li-item">
                                        <div
                                            className={`sc-fXCGkZ  ${!isHistoryExpanded ? 'fNITAL' : 'bJFzKi'} historyMenuItem cy-useful-links-item-expandable cy-useful-links-item`}
                                            onClick={toggleHistoryMenu}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="sc-dgWXKx sc-bsStmr dvyXko kHIHiW">
                                                <img src={IconHistory} className="sc-bqOBqt PBviZ" />
                                            </div>
                                            <div className="sc-fEyyHY inSENM">Historial</div>
                                            <div className="sc-fnOeCC fDelro">
                                                <img
                                                    src={IconArrowRight}
                                                    className="sc-bqOBqt PBviZ"
                                                    style={{ width: "1.2rem", height: "1.2rem", transition: "transform 0.12s ease-out", transform: isHistoryExpanded ? "rotate(-90deg)" : "rotate(90deg)" }}
                                                />
                                            </div>
                                        </div>
                                        <ul
                                            className="sc-jPFrcG czuYV cy-useful-links-sub-items-list"
                                            style={{ display: isHistoryExpanded ? 'block' : 'none' }}
                                        >
                                            <li className="cy-useful-links-li-item">
                                                <div className="sc-fXCGkZ fNITAL cy-useful-links-subitem gamingHistoryMenuItem cy-useful-links-item">
                                                    <div className="sc-dgWXKx sc-bsStmr dvyXko kHIHiW">
                                                        <img src={IconPoker} className="sc-bqOBqt PBviZ" />
                                                    </div>
                                                    <div className="sc-fEyyHY inSENM">Historial de juego</div>
                                                    <div className="sc-fnOeCC fDelro">
                                                        <img
                                                            src={IconArrowRight}
                                                            className="sc-bqOBqt PBviZ"
                                                            style={{ width: "1.2rem", height: "1.2rem", transition: "transform 0.12s ease-out" }}
                                                        />
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="cy-useful-links-li-item">
                                                <div className="sc-fXCGkZ fNITAL cy-useful-links-subitem transactionHistoryMenuItem cy-useful-links-item">
                                                    <div className="sc-dgWXKx sc-bsStmr dvyXko kHIHiW">
                                                        <img src={IconArrowUpdown} className="sc-bqOBqt PBviZ" />
                                                    </div>
                                                    <div className="sc-fEyyHY inSENM">Historial de transacciones</div>
                                                    <div className="sc-fnOeCC fDelro">
                                                        <img
                                                            src={IconArrowRight}
                                                            className="sc-bqOBqt PBviZ"
                                                            style={{ width: "1.2rem", height: "1.2rem", transition: "transform 0.12s ease-out" }}
                                                        />
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="sc-fnOeCC fDelro">
                            <div className="sc-kXzPdr oVDqI cy-useful-links-section">
                                <a className="sc-iCtmhp pLuTW cy-logout-link cy-useful-links-item cy-useful-links-li-item">Cerrar sesión</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const layoutContextValue = {
        isLogin,
        userBalance,
        supportWhatsApp,
        supportTelegram,
        supportEmail,
        handleLoginClick,
        handleLogoutClick,
        refreshBalance,
        isSidebarExpanded,
        toggleSidebar,
        showMobileSearch,
        setShowMobileSearch,
        openSupportModal,
        launchGameFromSearch,
        setIsUserMenuOpen
    };

    return (
        <LayoutContext.Provider value={layoutContextValue}>
            <NavigationContext.Provider
                value={{ selectedPage, setSelectedPage, getPage, showFullDivLoading, setShowFullDivLoading }}
            >
                <FullDivLoading show={showFullDivLoading} />
                {showLoginModal && (
                    <LoginModal
                        isMobile={isMobile}
                        isOpen={showLoginModal}
                        onClose={() => setShowLoginModal(false)}
                        onLoginSuccess={handleLoginSuccess}
                    />
                )}
                {showMyProfileModal && (
                    <MyProfileModal
                        isOpen={showMyProfileModal}
                        onClose={() => setShowMyProfileModal(false)}
                    />
                )}
                {showHistoryModal && (
                    <HistoryModal
                        isOpen={showHistoryModal}
                        onClose={() => setShowHistoryModal(false)}
                    />
                )}
                <div id="orbit-container">
                    <div className={`sc-kYrjYd ${isUserMenuOpen ? 'WziHW' : 'hbEPYD'} cy-overlay`}></div>

                    {!isMobile && !shouldShowGameModal &&
                        <Sidebar
                            isSlotsOnly={isSlotsOnly}
                            isMobile={isMobile}
                            isLogin={isLogin}
                            supportParent={supportParent}
                            openSupportModal={openSupportModal}
                            handleLoginClick={handleLoginClick}
                            handleLogoutClick={handleLogoutClick}
                            isUserMenuOpen={isUserMenuOpen}
                            setIsUserMenuOpen={setIsUserMenuOpen}
                        />
                    }

                    <div className="sc-cAgqEL friIZi cy-main-wrapper">
                        {isUserMenuOpen && (
                            <div className="sc-eZUyqC cZWmCN cy-user-menu user-menu-open">
                                <UserMenuContent />
                            </div>
                        )}

                        <Header
                            isLogin={isLogin}
                            isMobile={isMobile}
                            userBalance={userBalance}
                            isSlotsOnly={isSlotsOnly}
                            handleLoginClick={handleLoginClick}
                            handleLogoutClick={handleLogoutClick}
                            handleMyProfileClick={handleMyProfileClick}
                            handleHistoryClick={handleHistoryClick}
                            supportParent={supportParent}
                            openSupportModal={openSupportModal}
                        />
                        <Outlet context={{ isSlotsOnly, isLogin, isMobile, topGames, topArcade, topCasino, topLiveCasino }} />
                    </div>
                </div>

                {!shouldShowGameModal && (
                    <div className={isLogin ? "account-background" : ""}>

                    </div>
                )}

                {shouldShowGameModal && gameModalData.gameUrl && (
                    <GameModal
                        gameUrl={gameModalData.gameUrl}
                        gameName={gameModalData.gameName}
                        gameImg={gameModalData.gameImg}
                        reload={reloadGame}
                        launchInNewTab={() => {
                            if (gameModalData.gameUrl) {
                                window.open(gameModalData.gameUrl, '_blank');
                            }
                        }}
                        ref={refGameModal}
                        onClose={closeGameModal}
                        isMobile={isMobile}
                    />
                )}
                <SupportModal
                    isOpen={showSupportModal}
                    onClose={closeSupportModal}
                    supportWhatsApp={supportWhatsApp}
                    supportTelegram={supportTelegram}
                    supportEmail={supportEmail}
                    supportParentOnly={supportParentOnly}
                    supportParent={supportParent}
                />
                {isMobile &&
                <MobileFooter
                    isSlotsOnly={isSlotsOnly} 
                    isMobile={isMobile} 
                    isLogin={isLogin}
                    supportParent={supportParent} 
                    openSupportModal={openSupportModal}
                />}
            </NavigationContext.Provider>
        </LayoutContext.Provider>
    );
};

export default Layout;