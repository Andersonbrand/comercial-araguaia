import "./aboutAraguaia.css";
import ShowHome from "../../assets/aboutAraguaia/showhome.jpg"

export default function AboutAraguaia() {

    return (<section id="busca" className="about-section">
        <div className="about-container">

            {/* Texto */}
            <div className="about-text">
                <h2 className="about-title">Maiores <br /> em Guanambi</h2>

                <p className="about-description">
                    A Comercial Araguaia foi fundado em 1995, com a missão de oferecer soluções
                    para construção civil, do inicio ao fim da sua obra
                </p>

                <p className="about-description">
                    A Comercial Araguaia se destaca como um dos maiores distribuidores de materiais de construção da região. Com uma estrutura moderna e eficiente, estamos preparados para atender às demandas de nossos clientes, oferecendo uma ampla variedade de produtos de alta qualidade, desde os mais básicos até os mais especializados. Nossa localização privilegiada nos permite garantir agilidade na entrega e facilidade de acesso para nossos clientes, consolidando nossa posição como referência no setor de construção civil em Guanambi e região.
                </p>
            </div>

            {/* Imagem lateral */}
            <div className="about-image">
                <img src={ShowHome} alt="Araguaia" />
            </div>

        </div>
    </section>
    );
}