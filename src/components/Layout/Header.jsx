import { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutContext } from "./LayoutContext";
import { AppContext } from "../../AppContext";
import SearchInput from "../SearchInput";
import { callApi } from "../../utils/Utils";
import ImgSports from "/src/assets/svg/sports.svg";
import ImgProtect from "/src/assets/svg/protect.svg";
import ImgSupport from "/src/assets/svg/support-black.svg";

const Header = ({
    isLogin,
    isMobile,
    userBalance,
    isSlotsOnly,
    supportParent,
    handleLoginClick,
    handleLogoutClick,
    openSupportModal,
}) => {
    const { contextData } = useContext(AppContext);
    const [games, setGames] = useState([]);
    const [txtSearch, setTxtSearch] = useState("");
    const [isLoadingGames, setIsLoadingGames] = useState(false);
    const { isSidebarExpanded, toggleSidebar } = useContext(LayoutContext);
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const [searchDelayTimer, setSearchDelayTimer] = useState();

    const isSlotsOnlyMode = isSlotsOnly === true || isSlotsOnly === "true";

    const configureImageSrc = (result) => {
        (result.content || []).forEach((element) => {
            element.imageDataSrc = element.image_local !== null ? contextData.cdnUrl + element.image_local : element.image_url;
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
            return;
        }

        setGames([]);
        setIsLoadingGames(true);

        let pageSize = 50;

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

    return (
        <div className="sc-eUyqdB sc-bcaOSM luyol fHpzyA cy-navbar-container">
            <div className="sc-cMKpDi cwlnXY cy-navbar-left-container">
                <SearchInput
                    txtSearch={txtSearch}
                    setTxtSearch={setTxtSearch}
                    searchRef={searchRef}
                    search={search}
                    isMobile={true}
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
                            <div className="sc-fwWpaa MrUNO">sport</div>
                        </div>
                    </div>
                }
                <div className="sc-jTqEgK cxgeDG"></div>
                {
                    isLogin && 
                    <button className="sc-ksJhlw jOQfJh cy-header-client-settings-button">
                        <span className="sc-hBpigv iTELlo">
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
                            <button className="sc-ksJhlw hfleRR cy-welcome-cashier-button" onClick={handleLogoutClick}>
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
    );
};

export default Header;