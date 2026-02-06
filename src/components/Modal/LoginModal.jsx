import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";

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

        const body = {
            username,
            password,
            site_label: "main",
        };

        callApi(contextData, "POST", "/login/", callbackSubmitLogin, JSON.stringify(body));
    };

    const callbackSubmitLogin = (result) => {
        setIsLoading(false);

        if (result.status === "success") {
            localStorage.setItem("session", JSON.stringify(result));
            updateSession(result);

            onLoginSuccess?.(result.user.balance);

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
        <div className="rllogin-overlay" id="rlLoginOverlay">
            <div className="rllogin-main-wrapper">
                <div id="rlLoginFormWrapper" className="rllogin-form-wrapper">
                    <div className="rllogin-top-section">
                        <div className="rllogin-header">
                            <div className="rllogin-back" />
                            <div className="rllogin-logo" />
                            <a id="rlLoginCloseButton" className="rllogin-strip-close-btn" onClick={onClose}>
                                <div className="rllogin-close-button" />
                            </a>
                        </div>

                        <div className="rllogin-form-container" id="rllogin-form-container">
                            <form onSubmit={handleSubmit}>
                                <div className="rllogin-group-input">
                                    <div className="rllogin-rlLoginUsername">
                                        <span className="rllogin-rlLoginUsername-user" />
                                        <input
                                            id="rlLoginUsername"
                                            className="gray-placeholder-text"
                                            type="text"
                                            placeholder="Nombre de usuario"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>

                                    <div className="rllogin-rlLoginPassword">
                                        <span className="rllogin-rlLoginUsername-pass" />
                                        <input
                                            id="rlLoginPassword"
                                            className="gray-placeholder-text"
                                            type="password"
                                            placeholder="Contraseña"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>

                                    {errorMsg && (
                                        <p id="rlLoginFormErrorMessage" className="rllogin-login-from-error-msg rllogin-error">
                                            {errorMsg}
                                        </p>
                                    )}
                                </div>

                                <div className="rllogin-login-container">
                                    <button
                                        id="rlLoginSubmit"
                                        type="submit"
                                        className="rllogin-btn rllogin-btn-primary"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Cargando..." : "Iniciar sesión"}
                                    </button>

                                    <div className="rllogin-preloader-btn">
                                        <div className="rllogin-preloader-btn-inner">
                                            <label>•</label>
                                            <label>•</label>
                                            <label>•</label>
                                            <label>•</label>
                                            <label>•</label>
                                            <label>•</label>
                                        </div>
                                    </div>

                                    <div className="rlLogin-container-remember" id="rlLogin-container-remember">
                                        <input type="checkbox" value="1" id="rlLoginRememberme" name="remember" />
                                        <label htmlFor="rlLoginRememberme">
                                            <span>
                                                <span />
                                            </span>
                                            Recordarme
                                        </label>
                                    </div>

                                    <div className="rlLogin-container-remember" id="rlLogin-container-fitToPlay">
                                        <input type="checkbox" value="1" id="rlLoginFitToPlay" name="fitToPlay" />
                                        <label htmlFor="rlLoginFitToPlay">
                                            <span>
                                                <span />
                                            </span>
                                            [[**ELIGIBLE_CONSENT**]]
                                        </label>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;