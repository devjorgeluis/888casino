import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { LayoutContext } from "./LayoutContext";
import SearchInput from "../SearchInput";
import { callApi } from "../../utils/Utils";
import ImgSports from "/src/assets/svg/sports.svg";
import ImgProtect from "/src/assets/svg/protect.svg";
import ImgSupport from "/src/assets/svg/support-black.svg";
import ImgHamburger from "/src/assets/svg/hamburger.svg";
import ImgMobileLogo from "/src/assets/svg/mobile-logo.svg";

const Header = ({
    isLogin,
    isMobile,
    userBalance,
    isSlotsOnly,
    supportParent,
    handleLoginClick,
    handleLogoutClick,
    handleMyProfileClick,
    handleHistoryClick,
    openSupportModal,
}) => {
    const { contextData } = useContext(AppContext);
    const { isSidebarExpanded, toggleSidebar, setIsUserMenuOpen } = useContext(LayoutContext);
    const [games, setGames] = useState([]);
    const [txtSearch, setTxtSearch] = useState("");
    const [isLoadingGames, setIsLoadingGames] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const [searchDelayTimer, setSearchDelayTimer] = useState();
    const [currentTime, setCurrentTime] = useState("");

    const isSlotsOnlyMode = isSlotsOnly === true || isSlotsOnly === "true";

    const configureImageSrc = (result) => {
        (result.content || []).forEach((element) => {
            element.imageDataSrc = element.image_local !== null ? contextData.cdnUrl + element.image_local : element.image_url;
        });
    };

    const formatBalance = (value) => {
        const num = parseFloat(value);
        if (isNaN(num)) return "0.00";
        return num.toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const search = (e) => {
        let keyword = e.target.value;
        setTxtSearch(keyword);

        if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
            let keyword = e.target.value;
            do_search(keyword);
        } else {
            if (
                (e.keyCode >= 48 && e.keyCode <= 57) ||
                (e.keyCode >= 65 && e.keyCode <= 90) ||
                e.keyCode == 8 ||
                e.keyCode == 46
            ) {
                do_search(keyword);
            }
        }

        if (e.key === "Enter" || e.keyCode === 13 || e.key === "Escape" || e.keyCode === 27) {
            searchRef.current?.blur();
        }
    };

    const do_search = (keyword) => {
        clearTimeout(searchDelayTimer);

        if (keyword == "") {
            setGames([]);
            setIsLoadingGames(false);
            return;
        }

        setGames([]);
        setIsLoadingGames(true);

        let pageSize = 12;

        let searchDelayTimerTmp = setTimeout(function () {
            callApi(
                contextData,
                "GET",
                "/search-content?keyword=" + txtSearch + "&page_group_code=" + "default_pages_home" + "&length=" + pageSize,
                callbackSearch,
                null
            );
        }, 1000);

        setSearchDelayTimer(searchDelayTimerTmp);
    };

    const callbackSearch = (result) => {
        if (result.status === 500 || result.status === 422) {

        } else {
            configureImageSrc(result);
            setGames(result.content);
        }
        setIsLoadingGames(false);
    };

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

    return (
        <>
            {
                isMobile ?
                    <>
                        <div className="sc-jmwmqE effxOv cy-header-regulation-data">
                            <div className="sc-jngljW sc-gwicPH qpKDx jJMsHK cy-navbar-clock-last-login">
                                <div className="sc-OPwof dBHGWN cy-clock-component">
                                    <div className="cy-clock">{currentTime}</div>
                                </div>
                            </div>
                        </div>
                        <div className="sc-eUyqdB sc-bcaOSM inBPOP fHpzyA cy-navbar-container">
                            <div className="sc-cMKpDi cwlnXY cy-navbar-left-container">
                                <div className="sc-kfLrBp fexPlV">
                                    <div className="sc-bHnQwI ilXINL" onClick={toggleSidebar}>
                                        <img src={ImgHamburger} className="sc-bqOBqt PBviZ cy-burger-button" style={{ width: "2.6rem", height: "1.8rem" }} />
                                    </div>
                                </div>
                                <div className="sc-jTqEgK cxgeDG cy-navbar-separator"></div>
                                <div className="sc-yWEwC sc-bvtzcD cOhCUT bwJqBY cy-logo-container">
                                    <a onClick={() => navigate("/")} className="sc-ciMfCw ja-dRuB">
                                        <img src={ImgMobileLogo} alt="888 Online Casino" width="39" height="30" className="sc-gHXKQl eKXwKk logo cy-logo" />
                                    </a>
                                </div>
                            </div>
                            <div className="sc-iKpGpX jPIDuM cy-navbar-right-container">
                                <div className="sc-hVQvBP jXAiUk cy-welcome-component">
                                    <div className="sc-eihFif hbkNIy">
                                        <button className="button-support" onClick={() => { openSupportModal(false); }}>
                                            <img src={ImgSupport} />
                                        </button>
                                        <div className="sc-jTqEgK cxgeDG"></div>
                                        {
                                            isLogin ? <div className="sc-iKpGpX jPIDuM cy-navbar-right-container">
                                                <div className="sc-hVQvBP jXAiUk cy-welcome-component">
                                                    <div className="sc-hlaTyg fEgjKI cy-header-bankroll-button-mobile" onClick={() => setIsUserMenuOpen(true)}>
                                                        <div className="sc-ihxOeh lmancD"></div>
                                                        <div className="sc-dZuQbC hhvXbW cy-mobile-header-bankroll">${formatBalance(userBalance)}</div>
                                                    </div>
                                                </div>
                                            </div> :
                                            <button className="sc-ksJhlw xBMZy cy-login-button-text" onClick={handleLoginClick}>
                                                <span className="sc-fIysua sc-cRAjZL eYOOkA dcVKxz">
                                                    <span className="sc-bFbHAG kSzfyr">INICIAR</span>
                                                </span>
                                            </button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </> : <div className="sc-eUyqdB sc-bcaOSM luyol fHpzyA cy-navbar-container">
                        <div className="sc-cMKpDi cwlnXY cy-navbar-left-container">
                            <SearchInput
                                txtSearch={txtSearch}
                                setTxtSearch={setTxtSearch}
                                searchRef={searchRef}
                                search={search}
                                isMobile={isMobile}
                                games={games}
                                isLoadingGames={isLoadingGames}
                            />
                        </div>
                        <div className="sc-iKpGpX jPIDuM cy-navbar-right-container">
                            <button className="button-support" onClick={() => { openSupportModal(false); }}>
                                <img src={ImgSupport} />
                            </button>
                            <div className="sc-jTqEgK cxgeDG"></div>
                            {
                                !isSlotsOnlyMode &&
                                <div className="sc-gJWpfJ elLuri cy-cross-brand-list">
                                    <div className="sc-fNzuzI jFWrzq cy-cross-brand-link sportCrossBrandMenuItem" onClick={() => navigate("/sports")}>
                                        <img src={ImgSports} style={{ width: "3rem", height: "3rem" }} />
                                        <div className="sc-fwWpaa MrUNO">Deportes</div>
                                    </div>
                                </div>
                            }
                            <div className="sc-jTqEgK cxgeDG"></div>
                            {
                                isLogin &&
                                <button className="sc-ksJhlw jOQfJh cy-header-client-settings-button">
                                    <span className="sc-hBpigv iTELlo" onClick={handleHistoryClick}>
                                        <img src={ImgProtect} style={{ width: "2.4em", height: "2.4em" }} />
                                    </span>
                                    <div className="sc-bjEuFB knfoyZ" style={{ height: "2.4em" }}></div>
                                </button>
                            }
                            <div className="sc-hVQvBP jXAiUk cy-welcome-component">
                                <div className="sc-eihFif hbkNIy">
                                    <span className="sc-IYxHW ksYfVp"></span>
                                    {
                                        isLogin ?
                                            <button className="sc-ksJhlw hfleRR cy-welcome-cashier-button" onClick={handleMyProfileClick}>
                                                <span className="sc-fIysua sc-cRAjZL eZsMbN dcVKxz">
                                                    <span className="sc-bFbHAG fxFSPh">Cajero</span>
                                                </span>
                                            </button> :
                                            <button className="sc-ksJhlw dZVxje cy-login-button-text" onClick={handleLoginClick}>
                                                <span className="sc-fIysua sc-cRAjZL eZsMbN dcVKxz">
                                                    <span className="sc-bFbHAG fxFSPh">INICIAR</span>
                                                </span>
                                            </button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </>
    );
};

export default Header;