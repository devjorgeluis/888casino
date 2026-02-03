const LoadGames = () => {
    const GameSkeleton = () => (
        <div className="group relative h-full flex flex-col rounded-tl-lg rounded-tr-lg">
            <div
                className="group-hover:shadow-games-tile-hover relative aspect-[var(--image-aspect-ratio)] overflow-hidden rounded-lg"
                style={{ '--image-aspect-ratio': '3/2' }}
            >
                <picture className="contents">
                    <source media="(min-width: 2400px)" />
                </picture>

                <div className="ease-elastic-out absolute inset-0 flex flex-col justify-between p-[8%] opacity-0 transition-all duration-300 after:ease-elastic-out after:absolute after:-inset-[8%] after:opacity-0 after:transition-all after:duration-300 group-hover:after:bg-dark-grey-950/50 group-hover:opacity-100 group-hover:after:opacity-100" />
            </div>
        </div>
    );

    return (
        <>
            {Array.from({ length: 6 }, (_, index) => (
                <GameSkeleton key={index} />
            ))}
        </>
    );
};

export default LoadGames;