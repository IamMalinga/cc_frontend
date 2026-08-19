import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
    GeoAltFill,
    TelephoneFill,
    EnvelopeFill,
    Facebook,
    Linkedin,
    Youtube,
    ArrowUpCircleFill
} from "react-bootstrap-icons";

import {
    useGetContactInfoQuery,
    useGetQuickLinksQuery,
} from "../../api/publicApi";

export default function SiteFooter() {

    const { data: contact } =
        useGetContactInfoQuery();

    const { data: quickLinks = [] } =
        useGetQuickLinksQuery();

    return (

        <footer className="modern-footer">

            <Container>

                <Row className="gy-5">

                    {/* Contact */}

                    <Col lg={4}>

                        <h4 className="footer-title">

                            Computing Centre

                        </h4>

                        <p className="footer-description">

                            Faculty of Engineering
                            <br />
                            University of Peradeniya

                        </p>

                        <div className="footer-contact">

                            <div>

                                <GeoAltFill />

                                <span>{contact?.address}</span>

                            </div>

                            <div>

                                <TelephoneFill />

                                <span>{contact?.phone}</span>

                            </div>

                            <div>

                                <EnvelopeFill />

                                <span>{contact?.email}</span>

                            </div>

                        </div>

                        <div className="footer-social">

                            <a href="#">
                                <Facebook />
                            </a>

                            <a href="#">
                                <Linkedin />
                            </a>

                            <a href="#">
                                <Youtube />
                            </a>

                        </div>

                    </Col>

                    {/* Quick Links */}

                    <Col lg={2}>

                        <h5>Quick Links</h5>

                        <ul>

                            {quickLinks.map(link => (

                                <li key={link.id}>

                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {link.title}
                                    </a>

                                </li>

                            ))}

                        </ul>

                    </Col>

                    {/* Navigation */}

                    <Col lg={2}>

                        <h5>Navigate</h5>

                        <ul>

                            <li><Link to="/">Home</Link></li>

                            <li><Link to="/about">About</Link></li>

                            <li><Link to="/staff">Staff</Link></li>

                            <li><Link to="/news">News</Link></li>

                            <li><Link to="/contact">Contact</Link></li>

                        </ul>

                    </Col>

                    {/* Map */}

                    <Col lg={4}>

                        <h5>Find Us</h5>

                        <div className="footer-map">

                            <iframe
                                title="Computing Centre"
                                loading="lazy"
                                allowFullScreen
                                src="https://www.google.com/maps?q=Faculty%20of%20Engineering%20University%20of%20Peradeniya&output=embed"
                            />

                        </div>

                    </Col>

                </Row>

            </Container>

            <div className="footer-bottom">

                <Container>

                    <div className="footer-bottom-content">

                        <p>

                            © {new Date().getFullYear()} Computing Centre,
                            Faculty of Engineering,
                            University of Peradeniya.
                            All Rights Reserved.

                        </p>

                        <button
                            className="back-top"
                            onClick={() =>
                                window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                })
                            }
                        >

                            <ArrowUpCircleFill />

                        </button>

                    </div>

                </Container>

            </div>

        </footer>

    );

}