import "./suppliers.css";

import simec from "../../assets/suppliers/grupo-simec--600.png";
import csn from "../../assets/suppliers/csn-logo-0.png";
import liz from "../../assets/suppliers/cimentos-liz-logo.png";
import gerdau from "../../assets/suppliers/b26a90172516111.Y3JvcCw4MTAsNjMzLDAsMA.png";
import arcelormital from "../../assets/suppliers/Arcelor_Mittal.svg.png";
import avb from "../../assets/suppliers/7a89c841-52cb-48f3-8f9f-5bcf6bc83a40.webp";

export default function Suppliers() {
    const suppliers = [
        { name: "simec", logo: simec },
        { name: "csn", logo: csn },
        { name: "liz", logo: liz },
        { name: "gerdau", logo: gerdau },
        { name: "arcelormital", logo: arcelormital },
        { name: "avb", logo: avb },
    ];

    return (
        <section className="suppliers-section">
            <div className="suppliers-wrapper">
                <div className="suppliers-container">
                    <h2 className="suppliers-title">
                        Parcerias que Geram Confiança
                    </h2>

                    <p className="suppliers-subtitle">
                        Na Comercial Araguaia, qualidade e confiança são pilares que orientam cada decisão do nosso negócio. Atuamos com foco total em oferecer soluções que atendam aos mais altos padrões do mercado, sempre prezando pela segurança, durabilidade e desempenho dos produtos que disponibilizamos aos nossos clientes. Trabalhamos exclusivamente com marcas consolidadas e reconhecidas nacional e internacionalmente, referências em qualidade, inovação e tecnologia. Essa escolha criteriosa reflete o nosso compromisso com a excelência, garantindo que cada produto comercializado atenda às normas técnicas e às exigências dos mais diversos tipos de projetos.
                        Mais do que vender produtos, buscamos construir parcerias duradouras, oferecendo atendimento especializado, orientação técnica e suporte em todas as etapas do processo. Nosso compromisso vai além da entrega: queremos contribuir diretamente para o sucesso de cada projeto, seja ele de pequeno, médio ou grande porte. A Comercial Araguaia segue firme em seu propósito de evoluir continuamente, acompanhando as inovações do mercado e mantendo o mesmo padrão de qualidade e seriedade que nos tornou referência. Escolher a Comercial Araguaia é optar por confiança, credibilidade e excelência em cada detalhe.
                    </p>
                </div>

                <div className="suppliers-grid">
                    {suppliers.map((supplier, index) => (
                        <div className="supplier-card" key={index}>
                            <img
                                src={supplier.logo}
                                alt={supplier.name}
                                className="supplier-logo"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
