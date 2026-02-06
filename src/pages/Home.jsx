import { useContext, useState, useEffect, useRef } from "react";
import { useOutletContext, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import { NavigationContext } from "../components/Layout/NavigationContext";
import { callApi } from "../utils/Utils";
import Footer from "../components/Layout/Footer";
import Slideshow from "../components/Home/Slideshow";
import HotGameSlideshow from "../components/Home/HotGameSlideshow";
import GameModal from "../components/Modal/GameModal";
import LoginModal from "../components/Modal/LoginModal";

let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let selectedGameName = null;
let selectedGameImg = null;
let pageCurrent = 0;

const Home = () => {
  const { contextData } = useContext(AppContext);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const { setShowFullDivLoading } = useContext(NavigationContext);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [games, setGames] = useState([]);
  const [topGames, setTopGames] = useState([]);
  const [topArcade, setTopArcade] = useState([]);
  const [topCasino, setTopCasino] = useState([]);
  const [topLiveCasino, setTopLiveCasino] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState({});
  const [categoryType, setCategoryType] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [pageData, setPageData] = useState({});
  const [gameUrl, setGameUrl] = useState("");
  const [isSingleCategoryView, setIsSingleCategoryView] = useState(false);
  const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [mobileShowMore, setMobileShowMore] = useState(false);
  const refGameModal = useRef();
  const pendingPageRef = useRef(new Set());
  const pendingCategoryFetchesRef = useRef(0);
  const lastProcessedPageRef = useRef({ page: null, ts: 0 });
  const { isSlotsOnly, isLogin, isMobile } = useOutletContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const currentPath = window.location.pathname;
        if (currentPath === '/' || currentPath === '') {
          setShowFullDivLoading(true);
          pendingPageRef.current.clear();
          lastProcessedPageRef.current = { page: null, ts: 0 };

          getPage("home");
          getStatus();

          selectedGameId = null;
          selectedGameType = null;
          selectedGameLauncher = null;
          setShouldShowGameModal(false);
          setGameUrl("");
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!location.hash || tags.length === 0) return;
    const hashCode = location.hash.replace('#', '');
    const tagIndex = tags.findIndex(t => t.code === hashCode);

    if (tagIndex !== -1 && selectedCategoryIndex !== tagIndex) {
      setSelectedCategoryIndex(tagIndex);
      setIsSingleCategoryView(false);
      getPage(hashCode);
    }
  }, [location.hash, tags]);

  useEffect(() => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    selectedGameName = null;
    selectedGameImg = null;
    setGameUrl("");
    setShouldShowGameModal(false);
    setActiveCategory({});
    setIsSingleCategoryView(false);

    getPage("home");
    getStatus();

    window.scrollTo(0, 0);
  }, [location.pathname]);

  const getStatus = () => {
    callApi(contextData, "GET", "/get-status", callbackGetStatus, null);
  };

  const callbackGetStatus = (result) => {
    if (result.status === 500 || result.status === 422) {
      // Handle error
    } else {
      setTopGames(result.top_hot);
      setTopArcade(result.top_arcade);
      setTopCasino(result.top_slot);
      setTopLiveCasino(result.top_livecasino);
      contextData.slots_only = result && result.slots_only;
    }
  };

  const getPage = (page) => {
    if (pendingPageRef.current.has(page)) return;
    pendingPageRef.current.add(page);

    setIsLoadingGames(true);
    setShowFullDivLoading(true);
    setCategories([]);
    setGames([]);
    setIsSingleCategoryView(false);

    callApi(contextData, "GET", "/get-page?page=" + page, (result) => callbackGetPage(result, page), null);
  };

  const callbackGetPage = (result, page) => {
    pendingPageRef.current.delete(page);

    if (result.status === 500 || result.status === 422) {
      setIsLoadingGames(false);
      setShowFullDivLoading(false);
      return;
    }

    const now = Date.now();
    if (lastProcessedPageRef.current.page === page && now - lastProcessedPageRef.current.ts < 3000) {
      setShowFullDivLoading(false);
      setIsLoadingGames(false);
      return;
    }
    lastProcessedPageRef.current = { page, ts: now };

    setCategoryType(result.data?.page_group_type);
    setSelectedProvider(null);
    setPageData(result.data);

    const hashCode = location.hash.replace('#', '');
    const tagIndex = tags.findIndex(t => t.code === hashCode);
    setSelectedCategoryIndex(tagIndex !== -1 ? tagIndex : 0);

    if (result.data && result.data.page_group_type === "categories" && result.data.categories && result.data.categories.length > 0) {
      setCategories(result.data.categories);
      if (page === "home") {
        setMainCategories(result.data.categories);
      }
      const firstCategory = result.data.categories[0];
      setActiveCategory(firstCategory);

      const firstFiveCategories = result.data.categories.slice(0, 5);
      if (firstFiveCategories.length > 0) {
        pendingCategoryFetchesRef.current = firstFiveCategories.length;
        setIsLoadingGames(true);
        setShowFullDivLoading(true);
        firstFiveCategories.forEach((item, index) => {
          fetchContentForCategory(item, item.id, item.table_name, index, true, result.data.page_group_code);
        });
      }
      // If the requested page is a tag (e.g. 'arcade') and the server returned categories,
      // find the matching category and open it directly in single-category view.
      if (page && (page === "arcade" || (tags[tagIndex] && tags[tagIndex].code === "arcade"))) {
        const matchIndex = result.data.categories.findIndex((c) => c.table_name === "arcade" || (c.name && c.name.toLowerCase().includes("arcade")) || (c.name && c.name.toLowerCase().includes("crash")));
        const categoryToShow = matchIndex !== -1 ? result.data.categories[matchIndex] : result.data.categories[0];
        if (categoryToShow) {
          setIsSingleCategoryView(true);
          setActiveCategory(categoryToShow);
          setSelectedCategoryIndex(tagIndex !== -1 ? tagIndex : 0);
          fetchContent(categoryToShow, categoryToShow.id, categoryToShow.table_name, 0, true, result.data.page_group_code);
        }
      }

    } else if (result.data && result.data.page_group_type === "games") {
      setIsSingleCategoryView(true);
      setCategories(mainCategories.length > 0 ? mainCategories : []);
      configureImageSrc(result);
      setGames(result.data.content || result.data.categories || []);
      setActiveCategory(tags[tagIndex] || { name: page });
      pageCurrent = 1;
      setShowFullDivLoading(false);
    }

    setIsLoadingGames(false);
    setShowFullDivLoading(false);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLoginConfirm = () => {
    setShowLoginModal(false);
  };

  const fetchContentForCategory = (category, categoryId, tableName, categoryIndex, resetCurrentPage, pageGroupCode = null) => {
    const pageSize = 12;
    const groupCode = pageGroupCode || pageData.page_group_code;

    const apiUrl =
      "/get-content?page_group_type=categories&page_group_code=" +
      groupCode +
      "&table_name=" +
      tableName +
      "&apigames_category_id=" +
      categoryId +
      "&page=0&length=" +
      pageSize +
      (selectedProvider && selectedProvider.id ? "&provider=" + selectedProvider.id : "");

    callApi(contextData, "GET", apiUrl, (result) => callbackFetchContentForCategory(result, category, categoryIndex), null);
  };

  const callbackFetchContentForCategory = (result, category, categoryIndex) => {
    if (result.status === 500 || result.status === 422) {

    } else {
      const content = result.content || [];
      configureImageSrc(result);

      const gamesWithImages = content.map((game) => ({
        ...game,
        imageDataSrc: game.image_local !== null ? contextData.cdnUrl + game.image_local : game.image_url,
      }));
    }

    pendingCategoryFetchesRef.current = Math.max(0, pendingCategoryFetchesRef.current - 1);
    if (pendingCategoryFetchesRef.current === 0) {
      setIsLoadingGames(false);
      setShowFullDivLoading(false);
    }
  };

  const fetchContent = (category, categoryId, tableName, categoryIndex, resetCurrentPage, pageGroupCode) => {
    let pageSize = 30;
    setIsLoadingGames(true);

    if (resetCurrentPage) {
      pageCurrent = 0;
      setGames([]);
    }

    setActiveCategory(category);
    setSelectedCategoryIndex(categoryIndex);

    const groupCode = categoryType === "categories" ? pageGroupCode || pageData.page_group_code : "default_pages_home"

    let apiUrl =
      "/get-content?page_group_type=categories&page_group_code=" +
      groupCode +
      "&table_name=" +
      tableName +
      "&apigames_category_id=" +
      categoryId +
      "&page=" +
      pageCurrent +
      "&length=" +
      pageSize;

    if (selectedProvider && selectedProvider.id) {
      apiUrl += "&provider=" + selectedProvider.id;
    }

    callApi(contextData, "GET", apiUrl, callbackFetchContent, null);
  };

  const callbackFetchContent = (result) => {
    if (result.status === 500 || result.status === 422) {
      setShowFullDivLoading(false);
    } else {
      if (pageCurrent == 0) {
        configureImageSrc(result);
        setGames(result.content);
      } else {
        configureImageSrc(result);
        setGames([...games, ...result.content]);
      }
      pageCurrent += 1;
    }
    setShowFullDivLoading(false);
    setIsLoadingGames(false);
  };

  const configureImageSrc = (result) => {
    (result.content || []).forEach((element) => {
      let imageDataSrc = element.image_url;
      if (element.image_local !== null) {
        imageDataSrc = contextData.cdnUrl + element.image_local;
      }
      element.imageDataSrc = imageDataSrc;
    });
  };

  const launchGame = (game, type, launcher) => {
    // Only show modal when explicitly using modal launcher
    if (launcher === "modal") {
      setShouldShowGameModal(true);
    } else {
      setShouldShowGameModal(false);
    }
    setShowFullDivLoading(true);
    selectedGameId = game?.id != null ? game.id : selectedGameId;
    selectedGameType = type != null ? type : selectedGameType;
    selectedGameLauncher = launcher != null ? launcher : selectedGameLauncher;
    selectedGameName = game?.name || selectedGameName;
    selectedGameImg = game?.image_local != null ? contextData.cdnUrl + game.image_local : selectedGameImg;
    callApi(contextData, "GET", "/get-game-url?game_id=" + selectedGameId, callbackLaunchGame, null);
  };

  const callbackLaunchGame = (result) => {
    setShowFullDivLoading(false);
    if (result.status == "0") {
      if (isMobile) {
        try {
          window.location.href = result.url;
        } catch (err) {
          try { window.open(result.url, "_blank", "noopener,noreferrer"); } catch (err) { }
        }
        // Reset game active state for mobile
        setIsGameActive(false);
        selectedGameId = null;
        selectedGameType = null;
        selectedGameLauncher = null;
        selectedGameName = null;
        selectedGameImg = null;
        setGameUrl("");
        setShouldShowGameModal(false);
        return;
      }

      if (selectedGameLauncher === "tab") {
        try {
          window.open(result.url, "_blank", "noopener,noreferrer");
        } catch (err) {
          window.location.href = result.url;
        }
        // Don't reset game active state for tab - modal should stay open
        // But close modal since we're opening in new tab
        setShouldShowGameModal(false);
        setIsGameActive(false);
        selectedGameId = null;
        selectedGameType = null;
        selectedGameLauncher = null;
        selectedGameName = null;
        selectedGameImg = null;
        setGameUrl("");
      } else {
        setGameUrl(result.url);
        setShouldShowGameModal(true);
        setIsGameActive(true);
      }
    }
  };

  const closeGameModal = () => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    selectedGameName = null;
    selectedGameImg = null;
    setGameUrl("");
    setShouldShowGameModal(false);

    // Reset game active state
    if (setIsGameActive) {
      setIsGameActive(false);
    }

    try {
      const el = document.getElementsByClassName("game-view-container")[0];
      if (el) {
        el.classList.add("d-none");
        el.classList.remove("fullscreen");
        el.classList.remove("with-background");
      }
      const iframeWrapper = document.getElementById("game-window-iframe");
      if (iframeWrapper) iframeWrapper.classList.add("d-none");
    } catch (err) {
      // ignore DOM errors
    }
    try { getPage('casino'); } catch (e) { }
  };

  return (
    <div className="main-page">
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onConfirm={handleLoginConfirm}
        />
      )}
      {shouldShowGameModal && selectedGameId !== null ? (
        <GameModal
          gameUrl={gameUrl}
          gameName={selectedGameName}
          gameImg={selectedGameImg}
          reload={(gameData) => {
            if (gameData && gameData.id) {
              const game = {
                id: gameData.id,
                name: selectedGameName,
                image_local: selectedGameImg?.replace(contextData.cdnUrl, '')
              };
              launchGame(game, selectedGameType, selectedGameLauncher);
            } else if (selectedGameId) {
              const game = {
                id: selectedGameId,
                name: selectedGameName,
                image_local: selectedGameImg?.replace(contextData.cdnUrl, '')
              };
              launchGame(game, selectedGameType, selectedGameLauncher);
            }
          }}
          launchInNewTab={() => {
            if (selectedGameId) {
              const game = {
                id: selectedGameId,
                name: selectedGameName,
                image_local: selectedGameImg?.replace(contextData.cdnUrl, '')
              };
              launchGame(game, selectedGameType, "tab");
            }
          }}
          ref={refGameModal}
          onClose={closeGameModal}
          isMobile={isMobile}
          gameId={selectedGameId}
          gameType={selectedGameType}
          gameLauncher={selectedGameLauncher}
        />
      ) : (
        <>
          {!selectedProvider &&
            <>
              <Slideshow />
              <div className="sc-gKIhPs la-dtQg cy-layout-wrapper-homepage">
                {topGames.length > 0 && (
                  <HotGameSlideshow
                    games={topGames}
                    name="games"
                    title="Juegos Populares"
                    onGameClick={(game) => {
                      if (isLogin) {
                        launchGame(game, "slot", "modal");
                      } else {
                        handleLoginClick();
                      }
                    }}
                  />
                )}
                {topCasino.length > 0 && isSlotsOnly === "false" && (
                  <HotGameSlideshow
                    games={topCasino}
                    name="casino"
                    title="Casino"
                    onGameClick={(game) => {
                      if (isLogin) {
                        launchGame(game, "slot", "modal");
                      } else {
                        handleLoginClick();
                      }
                    }}
                  />
                )}
                {topLiveCasino.length > 0 && isSlotsOnly === "false" && (
                  <HotGameSlideshow
                    games={topLiveCasino}
                    name="liveCasino"
                    title="Casino en Vivo"
                    onGameClick={(game) => {
                      if (isLogin) {
                        launchGame(game, "slot", "modal");
                      } else {
                        handleLoginClick();
                      }
                    }}
                  />
                )}
                {topArcade.length > 0 && isSlotsOnly === "false" && (
                  <HotGameSlideshow
                    games={topArcade}
                    name="arcade"
                    title="Crash Games"
                    onGameClick={(game) => {
                      if (isLogin) {
                        launchGame(game, "slot", "modal");
                      } else {
                        handleLoginClick();
                      }
                    }}
                  />
                )}
              </div>
            </>
          }
          <Footer isSlotsOnly={isSlotsOnly} />
        </>
      )}
    </div>
  );
};

export default Home;