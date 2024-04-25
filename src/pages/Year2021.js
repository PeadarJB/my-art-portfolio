import React from "react";
import Gallery from "../components/Gallery";
import paintingsData from "../data/paintingsData";
import './Year.scss';


const Year2021 = () => {
    return(
        <div className="year-container">
            <div>
            <Gallery year="2021" paintingsData={paintingsData["2021"]} />
            </div>
        </div>
    );
};

export default Year2021;