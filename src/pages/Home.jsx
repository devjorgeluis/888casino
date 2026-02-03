import { useContext, useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { AppContext } from "../AppContext";
import { LayoutContext } from "../components/Layout/LayoutContext";
import { NavigationContext } from "../components/Layout/NavigationContext";
import { callApi } from "../utils/Utils";
import DropWins from "../components/Home/DropWins";
import PopularGames from "../components/Layout/PopularGames";
import GameCategories from "../components/Home/GameCategories";
import ProviderContainer from "../components/ProviderContainer";
import Promotions from "../components/Home/Promotions";
import GameModal from "../components/Modal/GameModal";
import LoginModal from "../components/Modal/LoginModal";
import Footer from "../components/Layout/Footer";
import GameCard from "../components/GameCard";
import LoadGames from "../components/Loading/LoadGames";
import "animate.css";

import ImgCategoryBackground1 from "/src/assets/img/category-background1.webp";
import ImgCategoryBackground2 from "/src/assets/img/category-background2.webp";
import ImgCategoryBackground3 from "/src/assets/img/category-background3.webp";
import ImgCategoryBackground4 from "/src/assets/img/category-background4.webp";
import ImgCategory1 from "/src/assets/img/category1.webp";
import ImgCategory2 from "/src/assets/img/category2.webp";
import ImgCategory3 from "/src/assets/img/category3.webp";
import ImgCategory4 from "/src/assets/img/category4.webp";

let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let selectedGameName = null;
let selectedGameImg = null;
let pageCurrent = 0;

const Home = () => {
  const { contextData } = useContext(AppContext);
  const { isLogin } = useContext(LayoutContext);
  const { setShowFullDivLoading } = useContext(NavigationContext);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [tags, setTags] = useState([]);
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [pageData, setPageData] = useState({});
  const [gameUrl, setGameUrl] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
  const [isGameLoadingError, setIsGameLoadingError] = useState(false);
  const [isLoadingGames, setIsLoadingGames] = useState(false);

  const refGameModal = useRef();
  const { isSlotsOnly, isMobile, topGames } = useOutletContext();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const currentPath = window.location.pathname;
        if (currentPath === "/" || currentPath === "") {
          getPage("home");
          getStatus();
          resetGameSelection();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    resetGameSelection();
    getPage("home");
    getStatus();
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const resetGameSelection = () => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    selectedGameName = null;
    selectedGameImg = null;
    setGameUrl("");
    setShouldShowGameModal(false);
  };

  useEffect(() => {
    const isSlotsOnlyFalse = isSlotsOnly === false || isSlotsOnly === "false";
    setTags(
      isSlotsOnlyFalse
        ? [
          { name: "Populares", code: "hot", image: ImgCategory1, backgroundImage: ImgCategoryBackground1 },
          { name: "Jokers", code: "joker", image: ImgCategory2, backgroundImage: ImgCategoryBackground2 },
          { name: "Juegos de crash", code: "arcade", image: ImgCategory3, backgroundImage: ImgCategoryBackground3 },
          { name: "Ruletas", code: "roulette", image: ImgCategory4, backgroundImage: ImgCategoryBackground4 },
        ]
        : [
          { name: "Populares", code: "hot", image: ImgCategory1, backgroundImage: ImgCategoryBackground1 },
          { name: "Jokers", code: "joker", image: ImgCategory2, backgroundImage: ImgCategoryBackground2 },
          { name: "Megaways", code: "megaways", image: ImgCategory4, backgroundImage: ImgCategoryBackground4 },
        ]
    );
  }, [isSlotsOnly]);

  const getStatus = () => {
    callApi(contextData, "GET", "/get-status", (result) => {
      if (result.status !== 500 && result.status !== 422) {
        contextData.slots_only = result?.slots_only;
      }
    }, null);
  };

  const getPage = (page) => {
    setCategories([]);
    setGames([]);
    setIsLoadingGames(true);
    callApi(contextData, "GET", "/get-page?page=" + page, (result) => callbackGetPage(result, page), null);
  };

  const callbackGetPage = (result, page) => {
    if (result.status === 500 || result.status === 422) return;

    setCategories(result.data.categories || []);
    setPageData(result.data);
    setSelectedProvider(null);

    if (result.data.menu === "home") {
      setMainCategories(result.data.categories || []);
    }

    if (result.data.page_group_type === "games") {
      configureImageSrc(result);
      setGames(result.data.categories || result.content || []);
      pageCurrent = 1;
    }

    setIsLoadingGames(false);
  };

  const fetchContent = (category, categoryId, tableName, categoryIndex, reset = false) => {
    if (reset) {
      pageCurrent = 0;
      setGames([]);
    }

    setSelectedCategoryIndex(categoryIndex);
    setIsLoadingGames(true);

    const groupCode = pageData.page_group_code || "default_pages_home";

    let apiUrl = `/get-content?page_group_type=categories&page_group_code=${groupCode}&table_name=${tableName}&apigames_category_id=${categoryId}&page=${pageCurrent}&length=30`;

    if (selectedProvider?.id) {
      apiUrl += `&provider=${selectedProvider.id}`;
    }

    callApi(contextData, "GET", apiUrl, callbackFetchContent, null);
  };

  const callbackFetchContent = (result) => {
    if (result.status === 500 || result.status === 422) return;

    configureImageSrc(result);

    if (pageCurrent === 0) {
      setGames(result.content || []);
    } else {
      setGames((prev) => [...prev, ...(result.content || [])]);
    }

    pageCurrent += 1;
    setIsLoadingGames(false);
  };

  const configureImageSrc = (result) => {
    (result.content || []).forEach((el) => {
      el.imageDataSrc = el.image_local ? contextData.cdnUrl + el.image_local : el.image_url;
    });
  };

  const launchGame = (game, type = "slot", launcher = "tab") => {
    setShouldShowGameModal(true);
    setShowFullDivLoading(true);

    selectedGameId = game?.id ?? selectedGameId;
    selectedGameType = type;
    selectedGameLauncher = launcher;
    selectedGameName = game?.name;
    selectedGameImg = game?.image_local ? contextData.cdnUrl + game.image_local : null;

    callApi(contextData, "GET", `/get-game-url?game_id=${selectedGameId}`, callbackLaunchGame, null);
  };

  const callbackLaunchGame = (result) => {
    setShowFullDivLoading(false);
    if (result.status === "0") {
      setGameUrl(result.url);
    } else {
      setIsGameLoadingError(true);
    }
  };

  const closeGameModal = () => {
    resetGameSelection();
  };

  const handleProviderSelect = (provider, index = 0) => {
    setSelectedProvider(provider);
    setSelectedCategoryIndex(-1);
    window.scrollTo(0, 0);

    if (provider) {
      fetchContent(provider, provider.id, provider.table_name, index, true);
    } else {
      // Reset to default view
      setSelectedCategoryIndex(0);
      const firstCategory = categories[0];
      if (firstCategory) {
        fetchContent(firstCategory, firstCategory.id, firstCategory.table_name, 0, true);
      }
    }
  };

  const loadMoreGames = () => {
    if (selectedProvider) {
      fetchContent(selectedProvider, selectedProvider.id, selectedProvider.table_name, -1, false);
    }
  };

  return (
    <>
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          isMobile={isMobile}
        />
      )}

      {shouldShowGameModal && selectedGameId && (
        <GameModal
          gameUrl={gameUrl}
          gameName={selectedGameName}
          gameImg={selectedGameImg}
          reload={launchGame}
          launchInNewTab={() => launchGame(null, null, "tab")}
          ref={refGameModal}
          onClose={closeGameModal}
          provider={selectedProvider?.name || "Casino"}
        />
      )}

      {!shouldShowGameModal && (
        <div className="overflow-x-hidden [grid-area:main] pt-4">
          <div className="grid grid-rows-[max-content] [grid-template-areas:_'left-column'_'main-column'_'right-column'] lg:grid-cols-[auto_1fr_auto] lg:[grid-template-areas:_'left-column_main-column_right-column']">
            <div className="max-w-[100vw] [grid-area:main-column]">
              <div className="flex flex-col gap-4">
                <div className="gap-4 container md:grid md:grid-cols-1">
                  <div className="flex flex-col">
                    {selectedProvider ? (
                      <div className="flex flex-col gap-6 pb-10">
                        <div className="flex flex-col gap-4">
                          {selectedProvider.image_local || selectedProvider.image_url ? (
                            <img
                              src={
                                selectedProvider.image_local
                                  ? contextData.cdnUrl + selectedProvider.image_local
                                  : selectedProvider.image_url
                              }
                              alt={selectedProvider.name}
                              className="w-32 object-contain"
                              loading="eager"
                            />
                          ) : null}
                          <h1 className="text-3xl font-bold text-white">{selectedProvider.name}</h1>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                          {games.map((game) => (
                            <GameCard
                              key={game.id}
                              id={game.id}
                              provider={selectedProvider.name}
                              title={game.name}
                              imageSrc={game.imageDataSrc}
                              onClick={() => (isLogin ? launchGame(game) : setShowLoginModal(true))}
                            />
                          ))}
                          {isLoadingGames && <LoadGames />}
                        </div>

                        <div className="flex justify-center mt-8">
                          <button
                            onClick={loadMoreGames}
                            className="rounded-lg bg-theme-secondary-500/10 px-8 py-3 font-bold text-theme-secondary-500 hover:bg-theme-secondary-500/20"
                          >
                            Cargar más
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <DropWins />
                        <PopularGames
                          games={topGames}
                          title="Juegos Populares"
                          onGameClick={(game) => (isLogin ? launchGame(game) : setShowLoginModal(true))}
                        />
                        <GameCategories
                          categories={tags}
                          selectedCategoryIndex={selectedCategoryIndex}
                          onCategoryClick={(tag, _id, _table, index) => {
                            if (window.location.hash !== `#${tag.code}`) {
                              window.location.hash = `#${tag.code}`;
                            } else {
                              setSelectedCategoryIndex(index);
                              getPage(tag.code);
                            }
                          }}
                          onCategorySelect={() => setSelectedProvider(null)}
                          isMobile={isMobile}
                          pageType="home"
                        />
                        <ProviderContainer
                          categories={categories}
                          selectedProvider={selectedProvider}
                          setSelectedProvider={setSelectedProvider}
                          onProviderSelect={handleProviderSelect}
                        />
                        <Promotions />
                      </>
                    )}

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

export default Home;