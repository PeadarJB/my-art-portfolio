import React, { useEffect, useRef } from "react";
import Gallery from "../components/Gallery";
import paintingsData from "../data/paintingsData";
import './Year.scss';


const Year2019 = () => {

    const scrollRef = useRef(null);

    useEffect(() => {
        const handleWheel = (event) => {
            event.preventDefault();
            if (scrollRef.current) {
                scrollRef.current.scrollLeft += event.deltaY;
            }
        };

        const scrollContainer = scrollRef.current;
        scrollContainer.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            scrollContainer.removeEventListener('wheel', handleWheel);
        };
    }, []);

    return(
        <div className="year-container" ref={scrollRef}>
            <div>
            <Gallery year="2019" paintingsData={paintingsData["2019"]} />
            </div>
        </div>
    );
};

export default Year2019;