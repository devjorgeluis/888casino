import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { LayoutContext } from "../../components/Layout/LayoutContext";

const ProfileBalance = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { contextData } = useContext(AppContext);
    const { userBalance } = useContext(LayoutContext);

    useEffect(() => {
        if (!contextData?.session) {
            navigate("/");
        }
    }, [contextData?.session, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className="container account-page-container pn-account pn-balances">
            <div className="row">
                <div className="account-page-menu-col">
                    <nav aria-label="account page navigation" className="account-page-menu-container">
                        <ul className="nav-menu">
                            <li className="nav-item">
                                <a className="nav-link" href="/profile"><i className="material-icons">account_circle</i>Perfil</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link active" href="/profile/balance"><i className="material-icons">account_balance_wallet</i>Saldos de la cuenta</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/profile/history"><i className="material-icons">format_list_bulleted</i>Transacciones</a>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="account-page-content-col">
                    <div className="account-content-container">
                        <div className="content-padding">
                            <h4 className="section">Saldos de la cuenta</h4>
                            <div className="balances-container">
                                <table className="table table-striped balances-table">
                                    <thead>
                                        <tr>
                                            <th>Moneda</th>
                                            <th className="hide-in-context"></th>
                                            <th className="balance">Saldo total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="hide-in-context">
                                                <div className="currency-icon-container">
                                                    <i className="balance-page-currency-icon currency-icon currency-icon-usdc"></i>
                                                </div>
                                            </td>
                                            <td></td>
                                            <td className="balance"><span>{userBalance ? "$ " + parseFloat(userBalance).toFixed(2) : "$0.00"}</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileBalance;