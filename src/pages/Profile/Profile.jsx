import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../AppContext";
import Footer from "../../components/Layout/Footer";

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { contextData } = useContext(AppContext);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        if (!contextData?.session) {
            navigate("/");
        }
    }, [contextData?.session, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    const handleRefreshBalance = async () => {
        setIsRefreshing(true);
        setTimeout(() => {
        setIsRefreshing(false);
        }, 1000);
    };

    return (
        <>
            <div className="relative -mt-4 min-h-[100vh] overflow-x-hidden pb-12 pt-10 sm:pt-16 account-background">
                <div className="container">
                    <div className="ring-theme-primary/20 shadow-wallet to-theme-primary-950 relative z-[1] mx-auto mb-12 max-w-[39.65rem] rounded-3xl bg-[radial-gradient(95.8%_76.89%_at_50%_0%,_var(--tw-gradient-stops))] p-2 sm:rounded-[2rem] sm:p-12 from-primary-800">
                        <div className="absolute -top-[1.5rem] left-1/2 z-20 w-full max-w-screen-md -translate-x-1/2"></div>

                        <a
                            className="aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 disabled:cursor-not-allowed max-w-full flex-shrink-0 text-ellipsis ring-0 focus:outline-none focus-visible:outline-0 font-bold rounded-lg text-base gap-3 p-3 text-theme-secondary-500 disabled:text-theme-secondary-500 disabled:opacity-30 focus:text-theme-secondary-600 hover:text-theme-secondary-600 inline-flex items-center justify-center absolute right-4 top-auto z-10 md:top-4"
                            title="Account Settings"
                            href="/profile/detail"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="iconify iconify--tabler flex-shrink-0 flex-shrink-0 h-6 w-6" width="1em" height="1em" viewBox="0 0 24 24">
                                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                                    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37c1 .608 2.296.07 2.572-1.065"></path>
                                    <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0"></path>
                                </g>
                            </svg>
                        </a>

                        <div className="mb-6 flex flex-col items-center justify-center gap-3.5 py-4">
                            <div className="relative flex aspect-square min-h-24 min-w-24 items-center justify-center rounded-full bg-white">

                            </div>
                            <span className="text-theme-primary-50 text-center text-2xl font-bold !leading-tight tracking-tight">
                                {contextData?.session?.user?.username || '-'}
                            </span>
                        </div>

                        <div className="ring-theme-primary/10 rounded-2xl ring-1">
                            <div className="flex flex-col items-center justify-center gap-1.5 py-6">
                                <span className="text-theme-primary-50 text-center text-sm font-bold uppercase !leading-tight tracking-widest lg:text-xs">
                                    Saldo
                                </span>
                                <div className="relative flex flex-row items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        onClick={handleRefreshBalance}
                                        disabled={isRefreshing}
                                        className="aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 disabled:cursor-not-allowed max-w-full flex-shrink-0 text-ellipsis ring-0 focus:outline-none focus-visible:outline-0 font-bold rounded-lg text-base gap-3 text-theme-secondary-500 disabled:text-theme-secondary-500 disabled:opacity-30 focus:text-theme-secondary-600 hover:text-theme-secondary-600 absolute left-0 top-1/2 flex h-12 w-12 -translate-x-full -translate-y-1/2 items-center justify-center p-3"
                                        title="Refresh Balance"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            aria-hidden="true"
                                            role="img"
                                            className={`iconify iconify--tabler h-10 w-10 ${isRefreshing ? 'animate-spin' : ''}`}
                                            width="1em"
                                            height="1em"
                                            viewBox="0 0 24 24"
                                        >
                                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4m-4 4a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path>
                                        </svg>
                                    </button>
                                    <span className="text-theme-secondary text-center text-2xl font-medium leading-none">
                                        $ {Number.isFinite(Number(contextData?.session?.user?.balance)) ? Number(contextData?.session?.user?.balance).toFixed(2) : "0.00"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
};

export default Profile;