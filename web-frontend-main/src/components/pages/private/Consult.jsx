import React from "react";
import '../../../styles/Consult.css';
import consultImage from '../../../assets/images/consultation.jpg';
import { Link } from 'react-router-dom';

function Consultation(){
    return(
        <div className="consult">
        <p>Happy Clients, Beautiful Designs</p>
        <div className="consultation">
            <div 
                className="consult-img" 
                style={{ backgroundImage: `url(${consultImage})` }}
                ></div>
            <div className="consult-text">
            <p>"Inspiration for Every Corner of Your Home"</p>
            
            <Link to="/BookConsultation">
            <button>SCHEDULE A CONSULTATION</button>
            </Link>
            </div>
        </div>
        </div>
    );
}
export default Consultation;
