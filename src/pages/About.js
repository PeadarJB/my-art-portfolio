import React from 'react';
import { Link } from 'react-router-dom';
import './About.scss';

const About = () => {
  return (
    <div className='about'>
      <p>
      Born in Zimbabwe in 1991 to Irish parents who were both teachers and political activists during the apartheid struggles in 
      South Africa, the artist attended the Pro Arte Alphen Park Secondary School, South Africa, for two years, immersing in formal 
      art studies. The relocation to Ireland marked a pivotal turn in his artistic journey. He enrolled at the Institute of Art 
      Design and Technology Dun Laoghaire, studying Fine Art from 2012 to 2016. Following his degree show, the artist was shortlisted 
      for the Talbot Studio’s Most Promising Graduate Award and received the RHA Peer Residency Award in 2017. 
      This period catalyzed further exhibitions and contributions to the artist-run initiative Stream. 
      </p>
      <p>
      Driven by a deep interest in culture and identity, the artist completed a Masters in World Heritage Management and Conservation 
      at UCD between 2017 and 2018. His professional trajectory continued as a heritage consultant for the National Monuments Service,
       during which he co-authored the UNESCO World Heritage Tentative List Application for the Burren in 2021.
      </p>
      <p>
      In 2022, he received the Agility Award, the Fingal County Council Artist Support Scheme, and the Leitrim County Council 
      Individual Artist Bursary. These awards funded the project "<Link to='/2022'>Upland Folk</Link>", which was inspired by his heritage consultancy work. 
      This series was later exhibited as solo shows at Gimnasio de Arte y Cultura, Mexico City, in 2022, and at <a href="https://claremorrisgallery.ie/portfolio-item/peadar-jolliffe-byrne/" target="_blank" rel="noopener noreferrer">Claremorris Gallery</a>, 
      Co. Mayo, in 2023.
      </p>
      <p>
      The artist's practice merges painting and drawing with sculptural elements. The recent series, "Upland Folk," 
      incorporates handmade sculptural frames, bringing narrative depth to themes of identity, social constructs, religion, history, 
      magic, and mythology. Drawing from diverse life experiences in Ireland, South Africa, Zimbabwe, and Mexico, his art probes 
      deep into narratives of existence, continuity, and transformation amidst societal shifts. The artist seeks to articulate and draw 
      purpose from the intricate interplay between form, intent, and cultural narrative.
      </p>
      <p>
      With an academic background in Fine Art and World Heritage Management, the artist is profoundly influenced by cultural symbols 
      and his evolution. This insight enriches his use of personal symbolism to explore universal quests for belonging and 
      meaning in an era dominated by technological advancement and scientific rationality.
      </p>
      <p>
      The artist's work is not merely a visual endeavor; it is a quest to resonate with viewers' own searches for purpose and meaning, 
      challenging the constraints of conventional reasoning and exploring the tangled web of individual identity and collective memory.
      </p>

      
    </div>
  );
};

export default About;