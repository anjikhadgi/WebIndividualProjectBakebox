import React from "react";
import '../../../styles/Consult.css';
import consultImage from '../../../assets/images/consultation.jpg';
import { Link } from 'react-router-dom';

function Consultation(){
    return(
        <div className="consult">
        <p>Happy Customer, Delicious Products</p>
        <div className="consultation">
            <div 
                className="consult-img" 
                style={{ backgroundImage: `url(${consultImage})` }}
                ></div>
            <div className="consult-text">
            <p>"Where Every Bite Feels Like Home"</p>
            
            <Link to="/OrderConsultation">
            <button>SCHEDULE A CONSULTATION</button>
            </Link>
            </div>
        </div>
        </div>
    );
}
export default Consultation;
