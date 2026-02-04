import { useState, useEffect, useContext, useRef } from "react";
import { LayoutContext } from "./Layout/LayoutContext";
import { AppContext } from "../AppContext";
import { callApi } from "../utils/Utils";
import LoadApi from "./Loading/LoadApi";
import LoginModal from "./Modal/LoginModal";
import GameCard from "./GameCard";

const MobileSearch = ({ isLogin, isMobile, onClose }) => {
    const { contextData } = useContext(AppContext);
    const { setShowMobileSearch, launchGameFromSearch } = useContext(LayoutContext);
    const [games, setGames] = useState([]);
    const [txtSearch, setTxtSearch] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const searchRef = useRef(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [searchDelayTimer, setSearchDelayTimer] = useState();

    const handleCloseModal = () => {
        if (onClose) onClose();
        if (setShowMobileSearch) setShowMobileSearch(false);
    };

    const handleClearSearch = () => {
        setTxtSearch("");
        setGames([]);
        setIsSearch(false);
        setHasSearched(false);
        searchRef.current?.focus();
    };

    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleLoginConfirm = () => {
        setShowLoginModal(false);
    };

    const launchGame = (game, type, launcher) => {
        launchGameFromSearch(game, type, launcher);
    };

    const configureImageSrc = (result) => {
        (result.content || []).forEach((element) => {
            element.imageDataSrc =
                element.image_local !== null ? contextData.cdnUrl + element.image_local : element.image_url;
        });
    };

    const search = (e) => {
        const keyword = e.target.value;
        setTxtSearch(keyword);

        if (/Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent)) {
            do_search(keyword);
        } else if (
            (e.keyCode >= 48 && e.keyCode <= 57) ||
            (e.keyCode >= 65 && e.keyCode <= 90) ||
            e.keyCode === 8 ||
            e.keyCode === 46
        ) {
            do_search(keyword);
        }

        if (e.key === "Enter" || e.key === "Escape") {
            searchRef.current?.blur();
        }
    };

    const do_search = (keyword) => {
        setIsSearch(true);
        clearTimeout(searchDelayTimer);

        if (!keyword) {
            setIsSearch(false);
            setHasSearched(false);
            setGames([]);
            return;
        }

        setGames([]);
        setHasSearched(true);

        const timer = setTimeout(() => {
            callApi(
                contextData,
                "GET",
                `/search-content?keyword=${keyword}&page_group_code=default_pages_home&length=50`,
                callbackSearch,
                null
            );
        }, 1000);

        setSearchDelayTimer(timer);
    };

    const callbackSearch = (result) => {
        setIsSearch(false);
        if (result.status === 500 || result.status === 422) return;

        configureImageSrc(result);
        setGames(result.content || []);
    };

    const handleOverlayClick = (e) => {
        e.stopPropagation();
    };

    return (
        <>
            
        </>
    );
};

export default MobileSearch;