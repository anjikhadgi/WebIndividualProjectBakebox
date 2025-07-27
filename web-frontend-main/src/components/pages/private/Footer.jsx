import React from "react";
import '../../../styles/Footer.css';
import { FaWhatsapp, FaEnvelope, FaClock, FaLocationArrow, FaFacebook, FaInstagram, FaPinterest, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer>
            <div className="footer1">
                <Link to="#" onClick={() => window.scrollTo({ top: document.querySelector('.navbar').offsetTop, behavior: 'smooth' })}>
                    Back to top
                </Link>
            </div>

            <div className="footer2">

                <ul>
                    <p id="contactUs">Contact Us</p>
                    <a href="tel:+977981111111"><FaWhatsapp /> +977-981111111</a>
                    <a href="mailto:interiorhomedesign@gmail.com"><FaEnvelope /> interiorhomedesign@gmail.com</a>
                    <a href="#"><FaClock /> Sun-Fri / 9:00AM - 6:00PM</a>
                    <a href="#"><FaLocationArrow /> Location: Kathmandu, Nepal</a>
                </ul>

                <ul>
                    <p>Follow Us</p>
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /> Facebook</a>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /> Instagram</a>
                    <a href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer"><FaPinterest /> Pinterest</a>
                    <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /> YouTube</a>
                </ul>
            </div>

            <div className="footer3">
                InteriorHomeDesign © 2025
            </div>
        </footer>
    );
}

export default Footer;
