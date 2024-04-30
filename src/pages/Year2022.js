import React from "react";
import Gallery from "../components/Gallery";
import paintingsData from "../data/paintingsData";
import './Year.scss';


const Year2022 = () => {
    return(
        <div className="year-container">
            <div className="title-section">
            <picture>
                <img src=".\images\2022\UplandFolk-black-large.svg" alt="Upland Folk title text"/>
            </picture>
            </div>
            <div className="text-section">
            <p>‘Upland Folk’ is a series of eight paintings by Irish artist Peadar Jolliffe-Byrne. 
                The exhibition was made in response to the research Peadar carried out in 2021 during his work on the
                UNESCO World Heritage Tentative List application for the cultural landscape of the Burren, Co. Clare, Ireland.
            </p>
            <p>
                The Burren provides a plethora of inspirational starting points for any sort of artistic endeavour, ranging from its 
                globally significant karst environment, to its extraordinary collection of well preserved archaeological sites, to the 
                unique ecological mosaic of its flora and fauna. Yet perhaps, the most outstanding characteristic within this seemingly 
                inhospitable landscape are the people who live there.
                </p>
            </div>

            <div>
            <Gallery year="2022" paintingsData={paintingsData["2022"]} />
            </div>
        </div>
    );
};

export default Year2022;