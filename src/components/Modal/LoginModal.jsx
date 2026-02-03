import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";
import ImgLogin from "/src/assets/img/login.webp"; 
import ImgMobileLogin from "/src/assets/img/mobile-login.webp"; 

const LoginModal = ({ isOpen, onClose, onLoginSuccess, isMobile }) => {
    const { contextData, updateSession } = useContext(AppContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();

        setIsLoading(true);
        setErrorMsg("");

        let body = {
            username: username,
            password: password,
            site_label: "main",
        };

        callApi(
            contextData,
            "POST",
            "/login/",
            callbackSubmitLogin,
            JSON.stringify(body)
        );
    };

    const callbackSubmitLogin = (result) => {
        setIsLoading(false);
        if (result.status === "success") {
            localStorage.setItem("session", JSON.stringify(result));
            updateSession(result);

            if (onLoginSuccess) {
                onLoginSuccess(result.user.balance);
            }
            setTimeout(() => {
                onClose();
            }, 1000);
        } else if (result.status === "country") {
            setErrorMsg(result.message);
        } else {
            setErrorMsg("Nombre de usuario y contraseña no válidos");
        }
    };

    useEffect(() => {
        const passwordInput = document.getElementById("password");
        if (passwordInput) {
            passwordInput.setAttribute("type", showPassword ? "text" : "password");
        }
    }, [showPassword]);

    if (!isOpen) return null;

    return (
        <div className="flex h-full w-full items-center justify-center vfm vfm--fixed vfm--inset" role="dialog" aria-modal="true" style={{ zIndex: 1000 }}>
            <div className="vfm__overlay vfm--overlay vfm--absolute vfm--inset vfm--prevent-none !bg-black/80" aria-hidden="true" onClick={onClose}></div>
            <div className="vfm__content vfm--outline-none confirm-modal-content" tabIndex="0">
                <div className="relative flex h-[90svh] max-h-[57.375rem] w-screen max-w-[calc(100vw_-_2rem)] flex-col sm:min-w-[35rem] sm:max-w-[35rem] lg:min-w-[71.5rem] lg:max-w-[71.5rem] lg:gap-0 lg:py-0 overflow-hidden rounded-3xl dark:bg-gray-900 bg-primary-900">
                    <div className="flex justify-center px-4 sm:px-10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 disabled:cursor-not-allowed max-w-full flex-shrink-0 text-ellipsis ring-0 focus:outline-none focus-visible:outline-0 font-bold rounded-lg text-sm gap-2 disabled:text-theme-secondary-500 disabled:opacity-30 focus:text-theme-secondary-600 hover:text-theme-secondary-600 inline-flex items-center justify-center absolute right-4 top-4 z-[11] p-1.5 text-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" className="iconify iconify--tabler flex-shrink-0 flex-shrink-0 h-4 w-4">
                                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 6L6 18M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    <div className="flex h-full overflow-hidden text-white flex-col lg:flex-row">
                        <div className="relative lg:h-full lg:basis-1/2">
                            <picture className="contents">
                                <img
                                    className="h-full w-full object-cover lg:absolute lg:rounded-bl-3xl lg:rounded-tl-3xl"
                                    src={isMobile ? ImgMobileLogin : ImgLogin}
                                    alt="Login background"
                                    loading="lazy"
                                />
                            </picture>
                        </div>

                        <div className="login-modal-form flex flex-col overflow-hidden lg:basis-1/2 h-full md:mt-4 lg:overflow-auto lg:pt-8">
                            <div className="relative flex h-full flex-col space-y-0 overflow-hidden">
                                <div role="tablist" aria-orientation="horizontal" className="gap-4 sticky top-0 z-10 grid bg-transparent px-4 sm:px-10 rounded-lg inline-grid items-center" style={{ gridTemplateColumns: 'repeat(1, minmax(0px, 1fr))' }}>
                                    <button
                                        className="flex-shrink-0 ui-focus-visible:outline-0 ui-focus-visible:ring-2 ui-focus-visible:ring-primary-500 dark:ui-focus-visible:ring-primary-400 ui-not-focus-visible:outline-none relative w-full flex-shrink-0 !leading-tight transition-colors duration-200 ease-out after:absolute after:bottom-0 after:w-full focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-1 border-dark-grey-500 flex cursor-pointer items-center justify-center border-b-2 h-12 text-sm w-auto dark:text-white after:bg-theme-secondary after:h-0.5 text-theme-secondary-500"
                                        role="tab"
                                        aria-selected="true"
                                        tabIndex="0"
                                        type="button"
                                    >
                                        <span className="truncate">Iniciar sesión</span>
                                    </button>
                                </div>

                                <div className="[&>*]:flex-0 [&>*]:h-full [&>*]:w-full relative flex h-full w-full items-center overflow-hidden">
                                    <div role="tabpanel" tabIndex="0" className="focus:outline-none lg:pb-8">
                                        <div className="w-full !overflow-x-clip h-full flex h-full flex-col justify-center px-4 pt-6 sm:px-10 [&>div]:flex [&>div]:flex-col [&>div]:justify-center">
                                            <div>
                                                <div className="mb-4">
                                                    <div className="grid grid-cols-12 gap-x-4 formkit-form">
                                                        <div className="col-span-12 group flex-grow min-w-0 text-base mb-1.5 data-[disabled]:select-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none formkit-outer">
                                                            <div className="mb-2 flex flex-col items-start justify-start mb-1.5 formkit-wrapper">
                                                                <div className="text-base relative w-full h-12 rounded-lg bg-dark-grey-950/50 flex items-stretch border border-theme-secondary/10 focus-within:ring-2 [&_svg]:text-dark-grey-50/20 [&_svg]:focus-within:text-dark-grey-50/50 group-data-[disabled]:!cursor-not-allowed group-data-[invalid]:border-theme-status-error/20 group-data-[invalid]:bg-theme-status-error/5 [.bg-dark-grey-700_&]:bg-dark-grey-600 formkit-inner">
                                                                    <input
                                                                        placeholder="Nombre de usuario"
                                                                        autoComplete="username"
                                                                        className="peer appearance-none outline-none [color-scheme:light] placeholder:text-dark-grey-50/50 text-base text-dark-grey-50 font-medium min-h-5 bg-transparent grow w-full h-12 border-none p-3 py-4 focus:ring-0 focus:text-dark-grey-50 data-[placeholder]:max-w-full data-[placeholder]:text-ellipsis data-[placeholder]:overflow-hidden group-data-[invalid]:text-theme-status-error group-data-[empty]:text-dark-grey-50 group-data-[prefix-icon]:!pl-12 [&::selection]:bg-primary-800 formkit-input"
                                                                        type="text"
                                                                        name="username"
                                                                        id="username"
                                                                        aria-required="true"
                                                                        value={username}
                                                                        onChange={(e) => setUsername(e.target.value)}
                                                                        disabled={isLoading}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12 group flex-grow min-w-0 text-base mb-1.5 data-[disabled]:select-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none formkit-outer">
                                                            <div className="mb-2 flex flex-col items-start justify-start mb-1.5 formkit-wrapper">
                                                                <div className="text-base relative w-full h-12 rounded-lg bg-dark-grey-950/50 flex items-stretch border border-theme-secondary/10 focus-within:ring-2 [&_svg]:text-dark-grey-50/20 [&_svg]:focus-within:text-dark-grey-50/50 group-data-[disabled]:!cursor-not-allowed group-data-[invalid]:border-theme-status-error/20 group-data-[invalid]:bg-theme-status-error/5 [.bg-dark-grey-700_&]:bg-dark-grey-600 formkit-inner">
                                                                    <input
                                                                        placeholder="Contraseña"
                                                                        autoComplete="current-password"
                                                                        className="peer appearance-none outline-none [color-scheme:light] placeholder:text-dark-grey-50/50 text-base text-dark-grey-50 font-medium min-h-5 bg-transparent grow w-full h-12 border-none p-3 py-4 focus:ring-0 focus:text-dark-grey-50 data-[placeholder]:max-w-full data-[placeholder]:text-ellipsis data-[placeholder]:overflow-hidden group-data-[invalid]:text-theme-status-error group-data-[empty]:text-dark-grey-50 group-data-[prefix-icon]:!pl-12 [&::selection]:bg-primary-800 formkit-input"
                                                                        type={showPassword ? "text" : "password"}
                                                                        name="password"
                                                                        id="password"
                                                                        aria-required="true"
                                                                        value={password}
                                                                        onChange={(e) => setPassword(e.target.value)}
                                                                        disabled={isLoading}
                                                                    />
                                                                    <span
                                                                        className="password-suffix-icon flex cursor-pointer content-center items-center px-4 hover:text-primary"
                                                                        onClick={() => setShowPassword(!showPassword)}
                                                                    >
                                                                        {showPassword ? (
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye">
                                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                                                <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
                                                                                <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"></path>
                                                                            </svg>
                                                                        ) : (
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye-off">
                                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                                                <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828"></path>
                                                                                <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87"></path>
                                                                                <path d="M3 3l18 18"></path>
                                                                            </svg>
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {errorMsg && (
                                                            <div className="col-span-12 mb-2">
                                                                <div className="text-theme-status-error text-sm px-3 py-2 bg-theme-status-error/10 rounded-lg border border-theme-status-error/20">
                                                                    {errorMsg}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="col-span-12 formkit-actions">
                                                            <div className="col-span-12 group flex-grow data-[disabled]:select-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none formkit-outer">
                                                                <div className="formkit-wrapper">
                                                                    <button
                                                                        type="button"
                                                                        onClick={handleSubmit}
                                                                        disabled={isLoading || !username || !password}
                                                                        className="aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 disabled:cursor-not-allowed max-w-full flex-shrink-0 text-ellipsis ring-0 font-bold rounded-lg text-base gap-3 px-4 py-3 text-theme-primary-950 bg-theme-secondary-500 disabled:bg-theme-secondary-500 disabled:text-theme-primary-950 disabled:opacity-30 focus-visible:outline-theme-secondary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus:outline-theme-secondary-500/20 focus:outline focus:outline-4 hover:bg-theme-secondary-600 hover:text-theme-primary-950 flex w-full items-center justify-center"
                                                                    >
                                                                        {isLoading ? (
                                                                            <span className="flex items-center gap-2">
                                                                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                                </svg>
                                                                                Loading...
                                                                            </span>
                                                                        ) : (
                                                                            <span>Enviar</span>
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;