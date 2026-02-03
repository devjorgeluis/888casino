import { useContext, useState, useEffect, useRef } from "react";
import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import { LayoutContext } from "../components/Layout/LayoutContext";
import { NavigationContext } from "../components/Layout/NavigationContext";
import { callApi } from "../utils/Utils";
import GameCard from "/src/components/GameCard";

import GameModal from "../components/Modal/GameModal";
import Hero from "../components/LiveCasino/Hero";
import GameContainer from "../components/LiveCasino/GameContainer";
import ProviderContainer from "../components/ProviderContainer";
import Footer from "../components/Layout/Footer";
import LoadGames from "../components/Loading/LoadGames";
import SearchInput from "../components/SearchInput";
import SearchSelect from "../components/SearchSelect";
import LoginModal from "../components/Modal/LoginModal";
import "animate.css";

let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let selectedGameName = null;
let selectedGameImg = null;
let pageCurrent = 0;

const LiveCasino = () => {
  const pageTitle = "Casino en Vivo";
  const { contextData } = useContext(AppContext);
  const { isLogin } = useContext(LayoutContext);
  const { setShowFullDivLoading } = useContext(NavigationContext);
  const navigate = useNavigate();
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [games, setGames] = useState([]);
  const [firstFiveCategoriesGames, setFirstFiveCategoriesGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const originalCategoriesRef = useRef([]);
  const [activeCategory, setActiveCategory] = useState({});
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [pageData, setPageData] = useState({});
  const [gameUrl, setGameUrl] = useState("");
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [txtSearch, setTxtSearch] = useState("");
  const [searchDelayTimer, setSearchDelayTimer] = useState();
  const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
  const [isSingleCategoryView, setIsSingleCategoryView] = useState(false);
  const refGameModal = useRef();
  const location = useLocation();
  const searchRef = useRef(null);
  const { isMobile } = useOutletContext();
  const hasFetchedContentRef = useRef(false);
  const prevHashRef = useRef("");
  const pendingCategoryFetchesRef = useRef(0);
  const lastLoadedCategoryRef = useRef(null);

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
    hasFetchedContentRef.current = false;
    lastLoadedCategoryRef.current = null;
    getPage("livecasino");
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const getPage = (page) => {
    setIsLoadingGames(true);
    setCategories([]);
    setGames([]);
    setFirstFiveCategoriesGames([]);
    callApi(contextData, "GET", "/get-page?page=" + page, callbackGetPage, null);
  };

  const callbackGetPage = (result) => {
    if (result.status === 500 || result.status === 422) {
      setIsLoadingGames(false);
    } else {
      const homeCategory = {
        name: "Lobby",
        code: "home",
        id: 0,
        table_name: "apigames_categories"
      };
      const updatedCategories = [homeCategory, ...(result.data.categories || [])];
      setCategories(updatedCategories);
      if (!originalCategoriesRef.current || originalCategoriesRef.current.length === 0) {
        originalCategoriesRef.current = updatedCategories;
      }
      setSelectedProvider(null);
      setPageData(result.data);
      const firstFiveCategories = updatedCategories.slice(1, 6);
      if (firstFiveCategories.length > 0) {
        setFirstFiveCategoriesGames([]);
        pendingCategoryFetchesRef.current = firstFiveCategories.length;
        setIsLoadingGames(true);
        firstFiveCategories.forEach((item, index) => {
          fetchContentForCategory(item, item.id, item.table_name, index, true, result.data.page_group_code);
        });
      } else {
        setIsLoadingGames(false);
      }
      setActiveCategory(homeCategory);
      setSelectedCategoryIndex(0);
    }
  };

  const fetchContentForCategory = (category, categoryId, tableName, categoryIndex, resetCurrentPage, pageGroupCode = null) => {
    if (!categoryId || !tableName) {
      pendingCategoryFetchesRef.current = Math.max(0, pendingCategoryFetchesRef.current - 1);
      if (pendingCategoryFetchesRef.current === 0) {
        setIsLoadingGames(false);
      }
      return;
    }
    const pageSize = 100;
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
      pendingCategoryFetchesRef.current = Math.max(0, pendingCategoryFetchesRef.current - 1);
      if (pendingCategoryFetchesRef.current === 0) {
        setIsLoadingGames(false);
      }
    } else {
      const content = result.content || [];
      configureImageSrc(result);

      const gamesWithImages = content.map((game) => ({
        ...game,
        imageDataSrc: game.image_local != null ? contextData.cdnUrl + game.image_local : game.image_url,
      }));

      const categoryGames = {
        category: category,
        games: gamesWithImages,
      };

      setFirstFiveCategoriesGames((prev) => {
        const updated = [...prev];
        updated[categoryIndex] = categoryGames;
        return updated;
      });

      pendingCategoryFetchesRef.current = Math.max(0, pendingCategoryFetchesRef.current - 1);
      if (pendingCategoryFetchesRef.current === 0) {
        setIsLoadingGames(false);
      }
    }
  };

  useEffect(() => {
    if (categories.length === 0) return;

    const hash = location.hash;

    const handleHashNavigation = () => {
      setSelectedProvider(null);
      setTxtSearch("");

      if (!hash || hash === "#home") {
        setActiveCategory(categories[0]);
        setSelectedCategoryIndex(0);
        setIsSingleCategoryView(false);
        setGames([]);

        setFirstFiveCategoriesGames([]);
        const firstFiveCategories = categories.slice(1, 6);
        if (firstFiveCategories.length > 0) {
          pendingCategoryFetchesRef.current = firstFiveCategories.length;
          setIsLoadingGames(true);
          firstFiveCategories.forEach((item, index) => {
            fetchContentForCategory(item, item.id, item.table_name, index, true, pageData.page_group_code);
          });
        } else {
          setIsLoadingGames(false);
        }

        lastLoadedCategoryRef.current = null;
        return;
      }

      const categoryCode = hash.substring(1);
      const category = categories.find(cat => cat.code === categoryCode);

      if (category) {
        const categoryIndex = categories.indexOf(category);
        setActiveCategory(category);
        setSelectedCategoryIndex(categoryIndex);
        setIsSingleCategoryView(true);
        setSelectedProvider(category)

        setGames([]);
        setFirstFiveCategoriesGames([]);

        fetchContent(category, category.id, category.table_name, categoryIndex, true);
        lastLoadedCategoryRef.current = category.code;
      }
    };

    // Only execute if hash has changed
    if (prevHashRef.current !== hash || !hasFetchedContentRef.current) {
      handleHashNavigation();
      prevHashRef.current = hash;
      hasFetchedContentRef.current = true;
    }
  }, [categories, location.hash, location.search]);

  const fetchContent = (category, categoryId, tableName, categoryIndex, resetCurrentPage) => {
    if (!categoryId || !tableName) {
      if (category.code === "home") {
        const pageSize = 30;
        setIsLoadingGames(true);
        if (resetCurrentPage) {
          pageCurrent = 0;
          setGames([]);
        }
        const apiUrl =
          "/get-content?page_group_type=categories&page_group_code=" +
          pageData.page_group_code +
          "&page=" +
          pageCurrent +
          "&length=" +
          pageSize;
        callApi(contextData, "GET", apiUrl, callbackFetchContent, null);
        return;
      }
      setIsLoadingGames(false);
      return;
    }
    let pageSize = 30;
    setIsLoadingGames(true);

    if (resetCurrentPage) {
      pageCurrent = 0;
      setGames([]);
    }

    setActiveCategory(category);
    setSelectedCategoryIndex(categoryIndex);

    let apiUrl =
      "/get-content?page_group_type=categories&page_group_code=" +
      pageData.page_group_code +
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

  const loadMoreGames = () => {
    if (!activeCategory) return;
    fetchContent(activeCategory, activeCategory.id, activeCategory.table_name, selectedCategoryIndex, false);
  };

  const callbackFetchContent = (result) => {
    if (result.status === 500 || result.status === 422) {
      setIsLoadingGames(false);
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
    setIsLoadingGames(false);
  };

  const configureImageSrc = (result) => {
    (result.content || []).forEach((element) => {
      let imageDataSrc = element.image_url;
      if (element.image_local != null) {
        imageDataSrc = contextData.cdnUrl + element.image_local;
      }
      element.imageDataSrc = imageDataSrc;
    });
  };

  const launchGame = (game, type, launcher) => {
    setShouldShowGameModal(true);
    setShowFullDivLoading(true);
    selectedGameId = game.id != null ? game.id : selectedGameId;
    selectedGameType = type != null ? type : selectedGameType;
    selectedGameLauncher = launcher != null ? launcher : selectedGameLauncher;
    selectedGameName = game?.name;
    selectedGameImg = game?.image_local != null ? contextData.cdnUrl + game?.image_local : null;
    callApi(contextData, "GET", "/get-game-url?game_id=" + selectedGameId, callbackLaunchGame, null);
  };

  const callbackLaunchGame = (result) => {
    setShowFullDivLoading(false);
    if (result.status == "0") {
      switch (selectedGameLauncher) {
        case "modal":
        case "tab":
          setGameUrl(result.url);
          break;
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
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLoginConfirm = () => {
    setShowLoginModal(false);
  };

  const handleProviderSelect = (provider, index = 0) => {
    setTxtSearch("");
    if (categories.length > 0 && provider) {
      if (provider.code === "home") {
        setSelectedProvider(null);
        setIsSingleCategoryView(false);
        setActiveCategory(provider);
        setSelectedCategoryIndex(0);
        setGames([]);
        setFirstFiveCategoriesGames([]);
        const firstFiveCategories = categories.slice(1, 6);
        if (firstFiveCategories.length > 0) {
          pendingCategoryFetchesRef.current = firstFiveCategories.length;
          setIsLoadingGames(true);
          firstFiveCategories.forEach((item, index) => {
            fetchContentForCategory(item, item.id, item.table_name, index, true, pageData.page_group_code);
          });
        } else {
          setIsLoadingGames(false);
        }
        navigate("/live-casino#home");
        lastLoadedCategoryRef.current = null;
      } else {
        setSelectedProvider(provider);
        setIsSingleCategoryView(true);
        const providerIndex = categories.findIndex(cat => cat.id === provider.id);
        setActiveCategory(provider);
        setSelectedCategoryIndex(providerIndex !== -1 ? providerIndex : index);
        fetchContent(provider, provider.id, provider.table_name, providerIndex !== -1 ? providerIndex : index, true);
        lastLoadedCategoryRef.current = provider.code;
      }
    } else if (!provider && categories.length > 0) {
      const firstCategory = categories[0];
      setSelectedProvider(null);
      setIsSingleCategoryView(false);
      setActiveCategory(firstCategory);
      setSelectedCategoryIndex(0);
      setGames([]);
      setFirstFiveCategoriesGames([]);
      const firstFiveCategories = categories.slice(1, 6);
      if (firstFiveCategories.length > 0) {
        pendingCategoryFetchesRef.current = firstFiveCategories.length;
        setIsLoadingGames(true);
        firstFiveCategories.forEach((item, index) => {
          fetchContentForCategory(item, item.id, item.table_name, index, true, pageData.page_group_code);
        });
      } else {
        setIsLoadingGames(false);
      }
      navigate("/live-casino#home");
      lastLoadedCategoryRef.current = null;
    }
  };

  const search = (e) => {
    let keyword = e.target.value;
    setTxtSearch(keyword);
    setIsSingleCategoryView(true);
    lastLoadedCategoryRef.current = null; // Reset on search

    if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
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

    if (keyword === "") {
      return;
    }

    setGames([]);
    setIsLoadingGames(true);

    let pageSize = 20;

    let searchDelayTimerTmp = setTimeout(function () {
      callApi(
        contextData,
        "GET",
        "/search-content?keyword=" + txtSearch + "&page_group_code=" + pageData.page_group_code + "&length=" + pageSize,
        callbackSearch,
        null
      );
    }, 1000);

    setSearchDelayTimer(searchDelayTimerTmp);
  };

  const callbackSearch = (result) => {
    if (result.status === 500 || result.status === 422) {
      setIsLoadingGames(false);
    } else {
      configureImageSrc(result);
      setGames(result.content);
      pageCurrent = 0;
      lastLoadedCategoryRef.current = null; // Reset on search
    }
    setIsLoadingGames(false);
  };

  return (
    <>
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onConfirm={handleLoginConfirm}
          isMobile={isMobile}
        />
      )}

      {shouldShowGameModal && selectedGameId !== null && (
        <GameModal
          gameUrl={gameUrl}
          gameName={selectedGameName}
          gameImg={selectedGameImg}
          reload={launchGame}
          launchInNewTab={() => launchGame(null, null, "tab")}
          ref={refGameModal}
          onClose={closeGameModal}
          isMobile={isMobile}
          provider={selectedProvider?.name || "Casino"}
        />
      )}

      {/* Only show LiveCasino content when game modal is NOT shown */}
      {!shouldShowGameModal && (
        <div className="overflow-x-hidden [grid-area:main] pt-4">
          <div className="grid grid-rows-[max-content] [grid-template-areas:_'left-column'_'main-column'_'right-column'] lg:grid-cols-[auto_1fr_auto] lg:[grid-template-areas:_'left-column_main-column_right-column']">
            <div className="max-w-[100vw] [grid-area:main-column]">
              <div className="flex flex-col gap-4">
                <div className="gap-4 container md:grid md:grid-cols-1">
                  <div className="flex flex-col">
                    {
                      !selectedProvider && <>
                        <Hero />
                      </>
                    }

                    {
                      selectedProvider && selectedProvider.name ? <div className="grid grid-cols-1 [grid-template-areas:'heading'_'filters'_'content']">
                        <div className="grid grid-cols-1 [grid-template-areas:'heading'_'filters'_'content']">
                          <div className="[grid-area:content]">
                            <div className="flex flex-col gap-4">
                              <div className="contents">
                                <img
                                  src={selectedProvider.image_local != null && selectedProvider.image_local !== "" ? contextData.cdnUrl + selectedProvider.image_local : selectedProvider.image_url}
                                  alt="EspressoGames"
                                  className="w-32 object-contain"
                                  loading="eager"
                                />
                              </div>
                              <h1 className="mb-8 text-lg font-extrabold leading-normal lg:text-2xl">
                                {selectedProvider.name}
                              </h1>
                            </div>

                            <div className="mb-6 grid grid-cols-12 gap-4 sm:mb-10 sm:gap-2.5 lg:gap-6">
                              {games.map((game) => (
                                <div className="col-span-6 sm:col-span-3">
                                  <GameCard
                                    key={"popular" + game.id}
                                    id={game.id}
                                    provider={activeCategory?.name || 'Casino'}
                                    title={game.name}
                                    imageSrc={game.image_local !== null ? contextData.cdnUrl + game.image_local : game.image_url}
                                    onClick={() => (isLogin ? launchGame(game, "slot", "tab") : handleLoginClick())}
                                  />
                                </div>
                              ))}
                            </div>

                            {/* Load More Button */}
                            <div className="relative flex min-h-[2.75rem] items-center justify-center sm:justify-normal">
                              <button
                                onClick={loadMoreGames}
                                type="button"
                                className="inline-flex w-full sm:max-w-[15.875rem] sm:absolute sm:left-1/2 sm:-translate-x-1/2 items-center justify-center rounded-lg bg-transparent px-4 py-3 font-bold text-base text-theme-secondary-500 ring-1 ring-inset ring-current hover:bg-theme-secondary-500/10"
                              >
                                Cargar más
                              </button>
                            </div>
                          </div>
                        </div>
                      </div> : <>
                        <ProviderContainer
                          categories={categories}
                          selectedProvider={selectedProvider}
                          setSelectedProvider={setSelectedProvider}
                          onProviderSelect={handleProviderSelect}
                        />

                        <>
                          {firstFiveCategoriesGames && firstFiveCategoriesGames.map((entry, catIndex) => {
                            if (!entry || !entry.games) return null;
                            const categoryKey = entry.category?.id || `cat-${catIndex}`;

                            return (
                              <GameContainer
                                title={entry?.category?.name}
                                games={entry?.games}
                                key={"category-" + categoryKey}
                                isLogin={isLogin}
                                onGameClick={(game) => {
                                  if (isLogin) {
                                    launchGame(game, "slot", "tab");
                                  } else {
                                    setShowLoginModal(true);
                                  }
                                }}
                              />
                            );
                          })}
                        </>

                        <div className="grid grid-cols-1 [grid-template-areas:'heading'_'filters'_'content'] pb-6 pt-10 sm:pb-12 sm:pt-16">
                          <h1 className="mb-6 flex flex-col gap-4 text-4xl font-bold -tracking-[0.6px] text-white [grid-area:heading] sm:mb-12 sm:flex-row sm:items-center sm:gap-6 sm:-tracking-[0.72px]">
                            <a
                              onClick={() => navigate("/")}
                              className="cursor-pointer aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 disabled:cursor-not-allowed max-w-full flex-shrink-0 text-ellipsis ring-0 focus-visible:outline-0 font-bold text-base gap-2.5 text-theme-secondary-500 bg-theme-secondary-500/10 disabled:bg-theme-secondary-500/10 disabled:text-theme-secondary-500 disabled:opacity-30 focus-visible:ring-theme-secondary-500 focus-visible:ring-2 focus-visible:ring-inset focus:outline-theme-secondary-500/10 focus:bg-theme-secondary-500/20 focus:outline focus:outline-4 hover:bg-theme-secondary-500/20 inline-flex items-center justify-center w-fit rounded-lg p-2 sm:p-2.5 lg:p-3"
                              aria-label="Volver al inicio"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M5 12h14M5 12l6 6m-6-6l6-6" />
                              </svg>
                            </a>
                            Todos los juegos de casino
                          </h1>

                          <div className="mb-6 grid w-full grid-cols-12 gap-2 [grid-area:filters] sm:mb-12 lg:flex lg:flex-row lg:justify-between lg:gap-4">
                            <SearchInput
                              txtSearch={txtSearch}
                              setTxtSearch={setTxtSearch}
                              searchRef={searchRef}
                              search={search}
                              isMobile={isMobile}
                            />
                            <SearchSelect
                              categories={categories}
                              selectedProvider={selectedProvider}
                              setSelectedProvider={setSelectedProvider}
                              onProviderSelect={handleProviderSelect}
                            />
                          </div>

                          <div className="[grid-area:content]">
                            <div
                              className="mb-6 grid gap-x-2 gap-y-8 sm:mb-12 lg:gap-x-4"
                              style={{
                                '--games-list-grid-cols': 6,
                                gridTemplateColumns: 'repeat(var(--games-list-grid-cols, 5), minmax(0, 1fr))'
                              }}
                            >
                              {games.map((game) => (
                                <GameCard
                                  key={"top-crash-" + game.id}
                                  id={game.id}
                                  provider={activeCategory?.name || 'Casino'}
                                  title={game.name}
                                  imageSrc={game.image_local !== null ? contextData.cdnUrl + game.image_local : game.image_url}
                                  onClick={() => (isLogin ? launchGame(game, "slot", "tab") : handleLoginClick())}
                                />
                              ))}
                              {isLoadingGames && <LoadGames />}
                            </div>

                            {
                              txtSearch !== "" &&
                              <div className="relative flex min-h-12 items-center justify-center sm:justify-normal">
                                <button
                                  onClick={loadMoreGames}
                                  type="button"
                                  className="inline-flex items-center justify-center rounded-lg bg-theme-secondary-500/10 px-4 py-3 font-bold text-base text-theme-secondary-500 hover:bg-theme-secondary-500/20 sm:absolute sm:left-1/2 sm:-translate-x-1/2"
                                >
                                  Cargar más
                                </button>
                              </div>
                            }
                          </div>
                        </div>
                      </>
                    }

                    <Footer />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveCasino;