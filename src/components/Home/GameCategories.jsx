import ImgLogoTransparent from "/src/assets/svg/logo-transparent.svg";
import ImgGameCategoryBackground from "/src/assets/img/games-categories-background.png";

const GameCategories = (props) => {
    if (!props.categories || props.categories.length === 0) {
        return null;
    }

    const handleCategoryClick = (category, index) => {
        if (props.onCategoryClick) {
            props.onCategoryClick(category, category.id, category.table_name, index, true);
        }
        if (props.onCategorySelect) {
            props.onCategorySelect(category);
        }
    };

    return (
        <div className="lg:py-18 relative py-8 sm:py-12">
            <div className="absolute inset-0 bottom-0 h-full w-full opacity-50 [mask-image:radial-gradient(50%_50%_at_50%_50%,#000_0%,rgba(0,0,0,0)_100%)] sm:h-full lg:h-full">
                <img
                    src={ImgGameCategoryBackground}
                    alt="fortunajuegos background"
                    className="absolute inset-0 h-full w-full object-cover"
                />
            </div>

            <div className="relative mb-6 flex items-center justify-between gap-2 py-4">
                <img
                    src={ImgLogoTransparent}
                    alt="fortunajuegos"
                    className="absolute left-0 h-auto w-[4.25rem] opacity-50"
                />
                <h2 className="text-2xl font-bold text-white">Categorías populares</h2>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                {props.categories.map((category, index) => (
                    <div key={`category + ${index}`}>
                        <a
                            className="group relative flex flex-col gap-4 hover:shadow-games-tile-hover overflow-hidden rounded-3xl"
                            title={category.name}
                        >
                            <div className="relative flex items-end justify-end overflow-hidden rounded-3xl pb-2.5 pl-6 pr-2.5 pt-[3.25rem]">
                                <picture className="contents">
                                    <img
                                        className="absolute inset-0 h-full w-full object-cover"
                                        src={category.backgroundImage}
                                        alt={category.name}
                                        loading="lazy"
                                        fetchPriority="high"
                                    />
                                </picture>

                                <picture className="contents">
                                    <img
                                        className="!aspect-[1/1] w-full max-w-[60%] rounded-lg object-cover drop-shadow-lg transition-all group-hover:scale-125 group-hover:rounded-xl group-hover:opacity-100 group-hover:drop-shadow-none lg:opacity-60"
                                        src={category.image}
                                        alt={category.name}
                                        loading="lazy"
                                        fetchPriority="high"
                                    />
                                </picture>

                                <span onClick={() => handleCategoryClick(category, index)} className="cursor-pointer absolute bottom-6 left-6 inline-flex items-center gap-0.5 rounded-md bg-theme-secondary px-2 py-1 text-sm font-normal !leading-tight text-dark-grey-900">
                                    <span>Ver todo</span>
                                </span>
                            </div>

                            <h3 className="absolute left-6 top-6 z-[1] px-2 font-bold !leading-none tracking-tight text-white text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                                {category.name}
                            </h3>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GameCategories