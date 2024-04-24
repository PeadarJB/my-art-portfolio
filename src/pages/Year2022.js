import React from "react";
import Gallery from "../components/Gallery";
import paintingsData from "../data/paintingsData";

const Year2022 = () => {
    return(
        <div className="horizontal-gallery">
            <picture>
                <img></img>
            </picture>
            <h1>Artworks from 2022</h1>
            <Gallery year="2022" paintingsData={paintingsData["2022"]} />
        </div>
    );
};

export default Year2022;