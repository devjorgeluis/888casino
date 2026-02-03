const GameCard = (props) => {
  return (
    <div className="group relative h-full flex flex-col rounded-tl-lg rounded-tr-lg">
      <div
        className="group-hover:shadow-games-tile-hover relative aspect-[var(--image-aspect-ratio)] overflow-hidden rounded-lg"
        style={{ '--image-aspect-ratio': '3/2' }}
      >
        <picture className="contents">
          <source media="(min-width: 2400px)" srcSet={props.imageSrc} />
          <img
            className="h-full w-full rounded-lg object-cover transition-all duration-500 ease-out group-hover:opacity-50"
            src={props.imageSrc}
            alt={props.title}
            loading="lazy"
            fetchPriority="high"
          />
        </picture>

        <div className="ease-elastic-out absolute inset-0 flex flex-col justify-between p-[8%] opacity-0 transition-all duration-300 after:ease-elastic-out after:absolute after:-inset-[8%] after:opacity-0 after:transition-all after:duration-300 group-hover:after:bg-dark-grey-950/50 group-hover:opacity-100 group-hover:after:opacity-100" />
        <div className="ease-elastic-out pointer-events-none absolute inset-x-[8%] top-0 z-[2] mx-auto flex h-full max-w-max flex-col items-center justify-center gap-2 opacity-0 transition-all duration-500 group-hover:opacity-100">
          <button onClick={props.onClick} type="button" className="aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 disabled:cursor-not-allowed max-w-full text-ellipsis ring-0 font-bold rounded-lg text-sm gap-2 px-2 py-1.5 text-theme-primary-950 bg-theme-secondary-500 disabled:bg-theme-secondary-500 disabled:text-theme-primary-950 disabled:opacity-30 focus-visible:outline-theme-secondary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus:outline-theme-secondary-500/20 focus:outline focus:outline-4 hover:bg-theme-secondary-600 hover:text-theme-primary-950 inline-flex items-center justify-center pointer-events-auto min-h-10 w-full"><svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="iconify iconify--tabler flex-shrink-0 flex-shrink-0 h-4 w-4" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 4v16a1 1 0 0 0 1.524.852l13-8a1 1 0 0 0 0-1.704l-13-8A1 1 0 0 0 6 4"></path></svg><span className="">¡Jugar ahora!</span></button>
        </div>
      </div>

      <div className="flex flex-col gap-1 pb-1 pl-0.5 pt-4">
        <a
          className="text-dark-grey-50 cursor-pointer text-base font-bold !leading-normal hover:text-dark-grey-50 after:absolute after:inset-0 after:z-[1] block w-full" onClick={() => onGameClick && onGameClick(game)}>
          {props.title}
        </a>
        <span className="text-dark-grey-50/50 text-sm !leading-normal">
          {props.provider}
        </span>
      </div>
    </div>
  );
};

export default GameCard;
