import Image from "next/image";

import { EnquiryButton } from "@/components/enquiry-button";

export function UplandFolkIntro() {
  return (
    <article className="series-intro" aria-labelledby="upland-folk-heading">
      <div className="series-intro-title-wrap">
        <Image
          src="/images/2022/UplandFolk-black-large.svg"
          alt="Upland Folk title graphic"
          width={1921}
          height={727}
          className="series-title-logo series-title-logo-light"
          priority
        />
        <Image
          src="/images/2022/UplandFolk-white-large.svg"
          alt="Upland Folk title graphic"
          width={1001}
          height={379}
          className="series-title-logo series-title-logo-dark"
          priority
        />
      </div>
      <div className="series-intro-copy">
        <h3 id="upland-folk-heading">Series Context</h3>
        <p>
          Upland Folk is a series of eight paintings by Irish artist Peadar
          Jolliffe-Byrne. The exhibition was made in response to research carried out
          in 2021 during work on the UNESCO World Heritage Tentative List application
          for the cultural landscape of the Burren, Co. Clare, Ireland.
        </p>
        <p>
          The Burren offers globally significant ecology, archaeology, and landscape
          narratives, but one of its strongest qualities is the people who live there.
          This series reflects that relationship between place, memory, and
          contemporary identity.
        </p>
      </div>
      <div className="series-intro-actions">
        <EnquiryButton title="Upland Folk series" />
      </div>
    </article>
  );
}
