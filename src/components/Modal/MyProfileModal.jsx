import { useContext } from "react";
import { AppContext } from "../../AppContext";

const MyProfileModal = ({ isOpen, onClose }) => {
    const { contextData } = useContext(AppContext);

    if (!isOpen) return null;

    return (
        <div
            id="historial_ingresos"
            data-bs-backdrop="true"
            className="modal fade show"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', display: 'block' }}
            aria-modal="true"
            role="dialog"
        >
            <div className="modal-dialog modal-fullscreen">
                <div
                    className="modal-content"
                    style={{ backgroundColor: 'rgb(4, 7, 19)', fontFamily: '"Exo 2", sans-serif' }}
                >
                    <div className="modal-body p-4">
                        <div className="form-large">
                            <form>
                                <h1 style={{ color: "#f2ce00" }}>MI CUENTA</h1>
                                <div className="pb-2 font-size-custom mb-3 my-3">
                                    <label style={{ color: "white" }}>Número de cuenta</label> <br />
                                    {
                                        contextData?.session?.user?.id !== "" ? (
                                            <>
                                                <br />
                                                <label style={{ color: "white" }}>{contextData?.session?.user?.id}</label>
                                            </>
                                        ) : <input
                                            id="userId"
                                            type="text"
                                            autoComplete="username"
                                            className="input-custom"
                                            required
                                        />
                                    }
                                </div>
                                <div className="pb-2 font-size-custom mb-3 my-3">
                                    <label style={{ color: "white" }}>Nombre</label> <br />
                                    {
                                        contextData?.session?.user?.username !== "" ? (
                                            <>
                                                <br />
                                                <label style={{ color: "white" }}>{contextData?.session?.user?.username}</label>
                                            </>
                                        ) : <input
                                            id="username"
                                            type="text"
                                            autoComplete="username"
                                            className="input-custom"
                                            required
                                        />
                                    }
                                </div>
                                <div className="pb-2 font-size-custom mb-3 my-3">
                                    <label style={{ color: "white" }}>Balance</label> <br />
                                    {
                                        contextData?.session?.user?.balance !== "" ? (
                                            <>
                                                <br />
                                                <label style={{ color: "white" }}>{parseFloat(contextData?.session?.user?.balance).toFixed(2) }</label>
                                            </>
                                        ) : <input
                                            id="balance"
                                            type="text"
                                            autoComplete="balance"
                                            className="input-custom"
                                        />
                                    }
                                </div>
                                <div className="pb-2 font-size-custom mb-3 my-3">
                                    <label style={{ color: "white" }}>Correo electronico</label> <br />
                                    {
                                        contextData?.session?.user?.email !== "" ? (
                                            <>
                                                <br />
                                                <label style={{ color: "white" }}>{contextData?.session?.user?.email}</label>
                                            </>
                                        ) : <input
                                            id="email"
                                            type="email"
                                            autoComplete="email"
                                            className="input-custom"
                                            required
                                        />
                                    }
                                </div>
                                <div className="pb-2 font-size-custom mb-3 my-3">
                                    <label style={{ color: "white" }}>Número de teléfono</label> <br />
                                    {
                                        contextData?.session?.user?.phone !== "" ? (
                                            <>
                                                <br />
                                                <label style={{ color: "white" }}>{contextData?.session?.user?.phone}</label>
                                            </>
                                        ) : <input
                                            id="phone"
                                            type="number"
                                            autoComplete="phone"
                                            className="input-custom"
                                            required
                                        />
                                    }
                                </div>
                                <div className="d-grid gap-2">
                                    <button
                                        id="submit_btn"
                                        type="submit"
                                        className="btn p-2 mx-2"
                                        style={{ color: 'black', fontSize: 'small', fontWeight: 'bold', backgroundColor: '#f2ce00' }}
                                        onClick={() => onClose()}
                                    >
                                        GUARDAR
                                    </button>
                                    <button
                                        id="close_btn"
                                        type="button"
                                        className="btn p-2 mx-2"
                                        style={{ color: 'black', fontSize: 'small', fontWeight: 'bold', backgroundColor: '#f2ce00' }}
                                        onClick={() => onClose()}
                                    >
                                        CERRAR
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfileModal;