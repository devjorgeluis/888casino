import { useContext, useState, useEffect, useRef } from "react";
import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import { LayoutContext } from "../components/Layout/LayoutContext";
import { NavigationContext } from "../components/Layout/NavigationContext";
import { callApi } from "../utils/Utils";
import GameCard from "/src/components/GameCard";
import CategoryContainer from "../components/CategoryContainer";
import GameModal from "../components/Modal/GameModal";
import Hero from "../components/Casino/Hero";
import PopularGames from "../components/Layout/PopularGames";
import ProviderContainer from "../components/ProviderContainer";
import Promotions from "../components/Home/Promotions";
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

const Casino = () => {
  const pageTitle = "Casino";
  const { contextData } = useContext(AppContext);
  const { isLogin } = useContext(LayoutContext);
  const { setShowFullDivLoading } = useContext(NavigationContext);
  const navigate = useNavigate();
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [tags, setTags] = useState([]);
  const [games, setGames] = useState([]);
  const [isLobbySelected, setIsLobbySelected] = useState(true);
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState({});
  const [categoryType, setCategoryType] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [pageData, setPageData] = useState({});
  const [gameUrl, setGameUrl] = useState("");
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [txtSearch, setTxtSearch] = useState("");
  const [searchDelayTimer, setSearchDelayTimer] = useState();
  const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
  const refGameModal = useRef();
  const location = useLocation();
  const searchRef = useRef(null);
  const { isSlotsOnly, isMobile, topCasino, topArcade } = useOutletContext();

  const isLoadingMainCategoriesRef = useRef(false);

  useEffect(() => {
    const hashCode = location.hash.replace('#', '') || 'home';
    const tagIndex = tags.findIndex(t => t.code === hashCode);

    const finalIndex = tagIndex !== -1 ? tagIndex : 0;
    const finalCode = tagIndex !== -1 ? hashCode : 'casino';

    setSelectedCategoryIndex(finalIndex);
    setIsLobbySelected(finalCode === "home");

    getPage(finalCode);
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash, tags]);

  useEffect(() => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    selectedGameName = null;
    selectedGameImg = null;
    setGameUrl("");
    setShouldShowGameModal(false);
    setActiveCategory({});
    getPage("casino");
    window.scrollTo(0, 0);

    setIsLobbySelected(!location.hash || location.hash === "#home" || location.hash === "");
  }, [location.pathname]);

  useEffect(() => {
    const isSlotsOnlyFalse = isSlotsOnly === false || isSlotsOnly === "false";
    let tmpTags = isSlotsOnlyFalse
      ? [
        { name: "Lobby", code: "home" },
        { name: "Hot", code: "hot" },
        { name: "Jokers", code: "joker" },
        { name: "Juegos de crash", code: "arcade" },
        { name: "Megaways", code: "megaways" },
        { name: "Ruletas", code: "roulette" },
      ]
      : [
        { name: "Lobby", code: "home" },
        { name: "Hot", code: "hot" },
        { name: "Jokers", code: "joker" },
        { name: "Megaways", code: "megaways" },
      ];

    setTags(tmpTags);
  }, [isSlotsOnly]);

  useEffect(() => {
    if (mainCategories.length === 0 && !isLoadingMainCategoriesRef.current) {
      isLoadingMainCategoriesRef.current = true;
      setTimeout(() => {
        callApi(contextData, "GET", "/get-page?page=home", (result) => {
          isLoadingMainCategoriesRef.current = false;
          if (result.status !== 500 && result.status !== 422) {
            if (result.data && result.data.categories && result.data.categories.length > 0) {
              setMainCategories(result.data.categories);
              setCategories(result.data.categories);
            }
          }
        }, null);
      }, 2000);
    }
  }, []);  

  const getPage = (page) => {
    setIsLoadingGames(true);
    setGames([]);
    callApi(contextData, "GET", "/get-page?page=" + page, (result) => callbackGetPage(result, page), null);
  };

  const callbackGetPage = (result, page) => {
    if (result.status === 500 || result.status === 422) {

    } else {
      setCategoryType(result.data.page_group_type);
      setSelectedProvider(null);
      setPageData(result.data);

      const hashCode = location.hash.replace('#', '');
      const tagIndex = tags.findIndex(t => t.code === hashCode);
      setSelectedCategoryIndex(tagIndex !== -1 ? tagIndex : 0);

      if (result.data && result.data.page_group_type === "categories" && result.data.categories && result.data.categories.length > 0) {
        setCategories(result.data.categories);
        if (page === "casino") {
          setMainCategories(result.data.categories);
        }
        const firstCategory = result.data.categories[0];
        setActiveCategory(firstCategory);
      } else if (result.data && result.data.page_group_type === "games") {
        setCategories(mainCategories.length > 0 ? mainCategories : []);
        configureImageSrc(result);
        setGames(result.data.categories || []);
        setActiveCategory(tags[tagIndex] || { name: page });
        pageCurrent = 1;
      }

      setIsLoadingGames(false);
    }
  };

  const loadMoreGames = () => {
    if (!activeCategory) return;
    fetchContent(activeCategory, activeCategory.id, activeCategory.table_name, selectedCategoryIndex, false);
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
      element.imageDataSrc = element.image_local !== null ? contextData.cdnUrl + element.image_local : element.image_url;
    });
  };

  const launchGame = (game, type, launcher) => {
    setShouldShowGameModal(true);
    setShowFullDivLoading(true);
    selectedGameId = game.id != null ? game.id : selectedGameId;
    selectedGameType = type != null ? type : selectedGameType;
    selectedGameLauncher = launcher != null ? launcher : selectedGameLauncher;
    selectedGameName = game?.name;
    selectedGameImg = game?.image_local != null ? contextData.cdnUrl + game?.image_local : game.image_url;
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

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setSelectedProvider(null);
    setTxtSearch("");
  };

  const handleProviderSelect = (provider, index = 0) => {
    setSelectedProvider(provider);
    setTxtSearch("");
    window.scrollTo(0, 0);

    if (categories.length > 0 && provider) {
      setActiveCategory(provider);
      fetchContent(provider, provider.id, provider.table_name, index, true);
    } else if (!provider && categories.length > 0) {
      const firstCategory = categories[0];
      setActiveCategory(firstCategory);
      fetchContent(firstCategory, firstCategory.id, firstCategory.table_name, 0, true);
    }
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

    } else {
      configureImageSrc(result);
      setGames(result.content);
      pageCurrent = 0;
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

      {/* Only show Casino content when game modal is NOT shown */}
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
                        <CategoryContainer
                          categories={tags}
                          selectedCategoryIndex={selectedCategoryIndex}
                          onCategoryClick={(tag, _id, _table, index) => {
                            if (window.location.hash !== `#${tag.code}`) {
                              window.location.hash = `#${tag.code}`;
                            } else {
                              setSelectedCategoryIndex(index);
                              getPage(tag.code);
                              setIsLobbySelected(tag.code === "home");
                            }
                          }}
                          onCategorySelect={handleCategorySelect}
                          isMobile={isMobile}
                          pageType="casino"
                        />
                        {isLobbySelected && (
                          <>
                            <PopularGames
                              games={topCasino}
                              title="Juegos Populares"
                              onGameClick={(game) => {
                                if (isLogin) {
                                  launchGame(game, "slot", "tab");
                                } else {
                                  setShowLoginModal(true);
                                }
                              }}
                            />
                            <PopularGames
                              games={topArcade}
                              title="Juegos Crash"
                              onGameClick={(game) => {
                                if (isLogin) {
                                  launchGame(game, "slot", "tab");
                                } else {
                                  setShowLoginModal(true);
                                }
                              }}
                            />
                          </>
                        )}
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
                                    key={"live-popular" + game.id}
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
                        {isLobbySelected && <Promotions />}

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
                                  key={"live-top-crash-" + game.id}
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

export default Casino;