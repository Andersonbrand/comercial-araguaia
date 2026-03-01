import { Link } from "react-router-dom";

export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-content">
                <div>
                    <span>HÁ MAIS DE 30 ANOS</span>
                    <h1>Comercial Araguaia</h1>
                    <p>Confiança se constrói com qualidade, compromisso e tradição.</p>

                    <div className="buttons-group">
                        <Link to="/orcamento" className="btn-primary">
                            ENTRE EM CONTATO
                        </Link>
                        <a href="#busca" className="btn-secondyary">
                            SOBRE NÓS
                        </a>
                    </div>
                </div>
            </div>
        </section >
    );
}
