import { z } from "zod";

import { artworkCollectionSchema, type ArtworkCollection } from "@/lib/content-schema";

const collectionsRaw = [
  {
    "year": 2022,
    "works": [
      {
        "id": "2022-remnants-of-the-wild-hunt",
        "title": "Remnants of the Wild Hunt",
        "year": 2022,
        "medium": "Oil on board in artist made frame",
        "dimensions": "61cm x 41cm",
        "image": {
          "small": "/images/2022/WildHunt-small.webp",
          "medium": "/images/2022/WildHunt-medium.webp",
          "large": "/images/2022/WildHunt-large.webp",
          "alt": "Remnants of the Wild Hunt artwork",
          "width": 1000,
          "height": 1486
        }
      },
      {
        "id": "2022-dawn",
        "title": "Dawn",
        "year": 2022,
        "medium": "Oil on board in artist made frame",
        "dimensions": "55cm x 53.5cm",
        "image": {
          "small": "/images/2022/Dawn-small.webp",
          "medium": "/images/2022/Dawn-medium.webp",
          "large": "/images/2022/Dawn-large.webp",
          "alt": "Dawn artwork",
          "width": 1000,
          "height": 1036
        }
      },
      {
        "id": "2022-escape-from-the-cave",
        "title": "Escape from the Cave",
        "year": 2022,
        "medium": "Oil on board in artist made frame",
        "dimensions": "71.5cm x 40.5cm",
        "image": {
          "small": "/images/2022/EscapeFromTheCave-small.webp",
          "medium": "/images/2022/EscapeFromTheCave-medium.webp",
          "large": "/images/2022/EscapeFromTheCave-large.webp",
          "alt": "Escape from the Cave artwork",
          "width": 1000,
          "height": 1754
        }
      },
      {
        "id": "2022-morning-sun",
        "title": "Morning Sun",
        "year": 2022,
        "medium": "Oil on board in artist made frame",
        "dimensions": "59.5cm x 52.5cm",
        "image": {
          "small": "/images/2022/SummerDay-small.webp",
          "medium": "/images/2022/SummerDay-medium.webp",
          "large": "/images/2022/SummerDay-large.webp",
          "alt": "Morning Sun artwork",
          "width": 1000,
          "height": 1162
        }
      },
      {
        "id": "2022-cycle-of-the-goddess",
        "title": "Cycle of the Goddess",
        "year": 2022,
        "medium": "Oil on board in artist made frame",
        "dimensions": "59cm x 50cm",
        "image": {
          "small": "/images/2022/Goddess-small.webp",
          "medium": "/images/2022/Goddess-medium.webp",
          "large": "/images/2022/Goddess-large.webp",
          "alt": "Cycle of the Goddess artwork",
          "width": 1000,
          "height": 1181
        }
      },
      {
        "id": "2022-defiance-of-king-puck",
        "title": "Defiance of King Puck",
        "year": 2022,
        "medium": "Oil on board in artist made frame",
        "dimensions": "67cm x 52.5cm",
        "image": {
          "small": "/images/2022/KingPuck-small.webp",
          "medium": "/images/2022/KingPuck-medium.webp",
          "large": "/images/2022/KingPuck-large.webp",
          "alt": "Defiance of King Puck artwork",
          "width": 1000,
          "height": 1268
        }
      },
      {
        "id": "2022-shavasana-eternal",
        "title": "Shavasana Eternal",
        "year": 2022,
        "medium": "Oil on board in artist made frame",
        "dimensions": "56cm x 47.5cm",
        "image": {
          "small": "/images/2022/Shavasana-small.webp",
          "medium": "/images/2022/Shavasana-medium.webp",
          "large": "/images/2022/Shavasana-large.webp",
          "alt": "Shavasana Eternal artwork",
          "width": 1000,
          "height": 1134
        }
      },
      {
        "id": "2022-hawthorn-trespasser",
        "title": "Hawthorn Trespasser",
        "year": 2022,
        "medium": "Oil on board in artist made frame",
        "dimensions": "57cm x 52cm",
        "image": {
          "small": "/images/2022/HawthornTrespasser-small.webp",
          "medium": "/images/2022/HawthornTrespasser-medium.webp",
          "large": "/images/2022/HawthornTrespasser-large.webp",
          "alt": "Hawthorn Trespasser artwork",
          "width": 1000,
          "height": 1114
        }
      }
    ]
  },
  {
    "year": 2021,
    "works": [
      {
        "id": "2021-finn-and-i",
        "title": "Finn and I",
        "year": 2021,
        "medium": "Oil pastel on paper",
        "dimensions": "39.5cm x 26cm",
        "image": {
          "small": "/images/2021/FinnandI-small.webp",
          "medium": "/images/2021/FinnandI-medium.webp",
          "large": "/images/2021/FinnandI-large.webp",
          "alt": "Finn and I artwork",
          "width": 450,
          "height": 600
        }
      },
      {
        "id": "2021-gift-to-paddy-joe",
        "title": "Gift to Paddy Joe",
        "year": 2021,
        "medium": "Oil pastel on paper",
        "dimensions": "25cm x 18cm",
        "image": {
          "small": "/images/2021/GiftToPaddyJoe-small.webp",
          "medium": "/images/2021/GiftToPaddyJoe-medium.webp",
          "large": "/images/2021/GiftToPaddyJoe-large.webp",
          "alt": "Gift to Paddy Joe artwork",
          "width": 450,
          "height": 600
        }
      },
      {
        "id": "2021-warm-mud",
        "title": "Warm Mud",
        "year": 2021,
        "medium": "Oil pastel on paper",
        "dimensions": "39.5cm x 26cm",
        "image": {
          "small": "/images/2021/LluviaCollaboration2-small.webp",
          "medium": "/images/2021/LluviaCollaboration2-medium.webp",
          "large": "/images/2021/LluviaCollaboration2-large.webp",
          "alt": "Warm Mud artwork",
          "width": 450,
          "height": 600
        }
      },
      {
        "id": "2021-ufo-landing",
        "title": "UFO Landing",
        "year": 2021,
        "medium": "Oil pastel on paper",
        "dimensions": "39.5cm x 26cm",
        "image": {
          "small": "/images/2021/LluviaCollaboration-small.webp",
          "medium": "/images/2021/LluviaCollaboration-medium.webp",
          "large": "/images/2021/LluviaCollaboration-large.webp",
          "alt": "UFO Landing artwork",
          "width": 450,
          "height": 600
        }
      },
      {
        "id": "2021-lluvia-reading",
        "title": "Lluvia Reading",
        "year": 2021,
        "medium": "Oil pastel on paper",
        "dimensions": "22cm x 18cm",
        "image": {
          "small": "/images/2021/LluviaReading-small.webp",
          "medium": "/images/2021/LluviaReading-medium.webp",
          "large": "/images/2021/LluviaReading-large.webp",
          "alt": "Lluvia Reading artwork",
          "width": 450,
          "height": 600
        }
      },
      {
        "id": "2021-listening-frogs",
        "title": "Listening Frogs",
        "year": 2021,
        "medium": "Oil pastel on paper",
        "dimensions": "25cm x 20cm",
        "image": {
          "small": "/images/2021/Log-small.webp",
          "medium": "/images/2021/Log-medium.webp",
          "large": "/images/2021/Log-large.webp",
          "alt": "Listening Frogs artwork",
          "width": 800,
          "height": 600
        }
      },
      {
        "id": "2021-rip-milo",
        "title": "RIP Milo",
        "year": 2021,
        "medium": "Oil pastel on paper",
        "dimensions": "29.5cm x 22cm",
        "image": {
          "small": "/images/2021/MiloRIP-small.webp",
          "medium": "/images/2021/MiloRIP-medium.webp",
          "large": "/images/2021/MiloRIP-large.webp",
          "alt": "RIP Milo artwork",
          "width": 450,
          "height": 600
        }
      },
      {
        "id": "2021-red-figure",
        "title": "Red Figure",
        "year": 2021,
        "medium": "Oil pastel on paper",
        "dimensions": "32cm x 26cm",
        "image": {
          "small": "/images/2021/RedFigure-small.webp",
          "medium": "/images/2021/RedFigure-medium.webp",
          "large": "/images/2021/RedFigure-large.webp",
          "alt": "Red Figure artwork",
          "width": 450,
          "height": 600
        }
      },
      {
        "id": "2021-untitled",
        "title": "Untitled",
        "year": 2021,
        "medium": "Oil pastel on paper",
        "dimensions": "18cm x 16cm",
        "image": {
          "small": "/images/2021/Untitled4-small.webp",
          "medium": "/images/2021/Untitled4-medium.webp",
          "large": "/images/2021/Untitled4-large.webp",
          "alt": "Untitled artwork",
          "width": 800,
          "height": 600
        }
      },
      {
        "id": "2021-woodpile",
        "title": "Woodpile",
        "year": 2021,
        "medium": "Oil pastel on paper",
        "dimensions": "18cm x 24cm",
        "image": {
          "small": "/images/2021/Woodpile-small.webp",
          "medium": "/images/2021/Woodpile-medium.webp",
          "large": "/images/2021/Woodpile-large.webp",
          "alt": "Woodpile artwork",
          "width": 800,
          "height": 600
        }
      }
    ]
  },
  {
    "year": 2020,
    "works": [
      {
        "id": "2020-jungle-poolside",
        "title": "Jungle Poolside",
        "year": 2020,
        "medium": "Gouache, watercolour, colour pencil and ink on paper",
        "dimensions": "26cm x 39.5cm",
        "image": {
          "small": "/images/2020/JunglePoolSide-small.webp",
          "medium": "/images/2020/JunglePoolSide-medium.webp",
          "large": "/images/2020/JunglePoolSide-large.webp",
          "alt": "Jungle Poolside artwork",
          "width": 841,
          "height": 600
        }
      },
      {
        "id": "2020-fish-in-landscape",
        "title": "Fish in Landscape",
        "year": 2020,
        "medium": "Gouache on paper",
        "dimensions": "26cm x 39.5cm",
        "image": {
          "small": "/images/2020/FishInLandscape-small.webp",
          "medium": "/images/2020/FishInLandscape-medium.webp",
          "large": "/images/2020/FishInLandscape-large.webp",
          "alt": "Fish in Landscape artwork",
          "width": 1000,
          "height": 790
        }
      },
      {
        "id": "2020-headspace",
        "title": "Headspace",
        "year": 2020,
        "medium": "Gouache, watercolour, pencil and collage on paper",
        "dimensions": "25cm x 18cm",
        "image": {
          "small": "/images/2020/Headspace-small.webp",
          "medium": "/images/2020/Headspace-medium.webp",
          "large": "/images/2020/Headspace-large.webp",
          "alt": "Headspace artwork",
          "width": 1000,
          "height": 1248
        }
      },
      {
        "id": "2020-acceptance",
        "title": "Acceptance",
        "year": 2020,
        "medium": "Gouache, watercolour, pencil and collage on paper",
        "dimensions": "28cm x 22cm",
        "image": {
          "small": "/images/2020/Acceptance-small.webp",
          "medium": "/images/2020/Acceptance-medium.webp",
          "large": "/images/2020/Acceptance-large.webp",
          "alt": "Acceptance artwork",
          "width": 436,
          "height": 600
        }
      },
      {
        "id": "2020-untitled",
        "title": "Untitled",
        "year": 2020,
        "medium": "Graphite on paper",
        "dimensions": "39.5cm x 26cm",
        "image": {
          "small": "/images/2020/Untitled-small.webp",
          "medium": "/images/2020/Untitled-medium.webp",
          "large": "/images/2020/Untitled-large.webp",
          "alt": "Untitled artwork",
          "width": 434,
          "height": 600
        }
      },
      {
        "id": "2020-imagined-landscape",
        "title": "Imagined Landscape",
        "year": 2020,
        "medium": "Watercolour and gouache on paper",
        "dimensions": "26cm x 39.5cm",
        "image": {
          "small": "/images/2020/ImaginedLandscape-small.webp",
          "medium": "/images/2020/ImaginedLandscape-medium.webp",
          "large": "/images/2020/ImaginedLandscape-large.webp",
          "alt": "Imagined Landscape artwork",
          "width": 1000,
          "height": 663
        }
      },
      {
        "id": "2020-self-portrait",
        "title": "Self Portrait",
        "year": 2020,
        "medium": "Gouache on paper",
        "dimensions": "32cm x 26.5cm",
        "image": {
          "small": "/images/2020/SelfPortrait-small.webp",
          "medium": "/images/2020/SelfPortrait-medium.webp",
          "large": "/images/2020/SelfPortrait-large.webp",
          "alt": "Self Portrait artwork",
          "width": 1000,
          "height": 1270
        }
      },
      {
        "id": "2020-spirit-meeting",
        "title": "Spirit Meeting",
        "year": 2020,
        "medium": "Watercolour, gouache, pencil and collage on paper",
        "dimensions": "39.5cm x 26cm",
        "image": {
          "small": "/images/2020/SpiritMeeting-small.webp",
          "medium": "/images/2020/SpiritMeeting-medium.webp",
          "large": "/images/2020/SpiritMeeting-large.webp",
          "alt": "Spirit Meeting artwork",
          "width": 426,
          "height": 600
        }
      },
      {
        "id": "2020-imagined-landscape-2",
        "title": "Imagined Landscape 2",
        "year": 2020,
        "medium": "Watercolour and gouache and pencil on paper",
        "dimensions": "39.5cm x 26cm",
        "image": {
          "small": "/images/2020/ImaginedLandscape2-small.webp",
          "medium": "/images/2020/ImaginedLandscape2-medium.webp",
          "large": "/images/2020/ImaginedLandscape2-large.webp",
          "alt": "Imagined Landscape 2 artwork",
          "width": 1280,
          "height": 922
        }
      },
      {
        "id": "2020-exploring-alternatives",
        "title": "Exploring Alternatives",
        "year": 2020,
        "medium": "Oil pastel on paper",
        "dimensions": "26cm x 39.5cm",
        "image": {
          "small": "/images/2020/ExploringAlternatives-small.webp",
          "medium": "/images/2020/ExploringAlternatives-medium.webp",
          "large": "/images/2020/ExploringAlternatives-large.webp",
          "alt": "Exploring Alternatives artwork",
          "width": 1000,
          "height": 714
        }
      },
      {
        "id": "2020-female-portrait",
        "title": "Female Portrait",
        "year": 2020,
        "medium": "Graphite on paper",
        "dimensions": "39.5cm x 26cm",
        "image": {
          "small": "/images/2020/Female_portrait-small.webp",
          "medium": "/images/2020/Female_portrait-medium.webp",
          "large": "/images/2020/Female_portrait-large.webp",
          "alt": "Female Portrait artwork",
          "width": 1000,
          "height": 1517
        }
      },
      {
        "id": "2020-angel",
        "title": "Angel",
        "year": 2020,
        "medium": "Acrylic and oil pastel on paper",
        "dimensions": "39.5cm x 26cm",
        "image": {
          "small": "/images/2020/Angel-small.webp",
          "medium": "/images/2020/Angel-medium.webp",
          "large": "/images/2020/Angel-large.webp",
          "alt": "Angel artwork",
          "width": 450,
          "height": 600
        }
      },
      {
        "id": "2020-fish-swimming-up-my-spine",
        "title": "Fish Swimming up My Spine",
        "year": 2020,
        "medium": "Graphite on paper",
        "dimensions": "39.5cm x 26cm",
        "image": {
          "small": "/images/2020/FishSwimminUpMySpine-small.webp",
          "medium": "/images/2020/FishSwimminUpMySpine-medium.webp",
          "large": "/images/2020/FishSwimminUpMySpine-large.webp",
          "alt": "Fish Swimming up My Spine artwork",
          "width": 434,
          "height": 600
        }
      },
      {
        "id": "2020-donkey-fight",
        "title": "Donkey Fight",
        "year": 2020,
        "medium": "Oil pastel on paper",
        "dimensions": "39.5cm x 26cm",
        "image": {
          "small": "/images/2020/DonkeyFight-small.webp",
          "medium": "/images/2020/DonkeyFight-medium.webp",
          "large": "/images/2020/DonkeyFight-large.webp",
          "alt": "Donkey Fight artwork",
          "width": 1000,
          "height": 1398
        }
      },
      {
        "id": "2020-3-figures",
        "title": "3 Figures",
        "year": 2020,
        "medium": "Not recorded",
        "dimensions": "Not recorded",
        "image": {
          "small": "/images/2020/3Figures-small.webp",
          "medium": "/images/2020/3Figures-medium.webp",
          "large": "/images/2020/3Figures-large.webp",
          "alt": "3 Figures artwork",
          "width": 1000,
          "height": 1440
        }
      }
    ]
  },
  {
    "year": 2019,
    "works": [
      {
        "id": "2019-pocho-s-first-lesson",
        "title": "Pocho's First Lesson",
        "year": 2019,
        "medium": "Oil, acrylic, oil pastel, roofing mastic and charcoal on canvas",
        "dimensions": "120cm x 160cm",
        "image": {
          "small": "/images/2019/pochoFirstLesson-small.webp",
          "medium": "/images/2019/pochoFirstLesson-medium.webp",
          "large": "/images/2019/pochoFirstLesson-large.webp",
          "alt": "Pocho's First Lesson artwork",
          "width": 1000,
          "height": 813
        }
      },
      {
        "id": "2019-trip-with-pocho",
        "title": "Trip with Pocho",
        "year": 2019,
        "medium": "Oil, acrylic, oil pastel and charcoal on canvas",
        "dimensions": "120cm x 160cm",
        "image": {
          "small": "/images/2019/tripWithPocho-small.webp",
          "medium": "/images/2019/tripWithPocho-medium.webp",
          "large": "/images/2019/tripWithPocho-large.webp",
          "alt": "Trip with Pocho artwork",
          "width": 1000,
          "height": 808
        }
      },
      {
        "id": "2019-jungle-at-nighttime",
        "title": "Jungle at Nighttime",
        "year": 2019,
        "medium": "Oil, acrylic, oil pastel and charcoal on canvas",
        "dimensions": "170cm x 125cm",
        "image": {
          "small": "/images/2019/jungleAtNighttime-small.webp",
          "medium": "/images/2019/jungleAtNighttime-medium.webp",
          "large": "/images/2019/jungleAtNighttime-large.webp",
          "alt": "Jungle at Nighttime artwork",
          "width": 1000,
          "height": 1535
        }
      },
      {
        "id": "2019-dismal-day-on-the-beach",
        "title": "Dismal Day on the Beach",
        "year": 2019,
        "medium": "Oil, acrylic, oil pastel, roofing mastic and charcoal on canvas",
        "dimensions": "160cm x 240cm",
        "image": {
          "small": "/images/2019/dismalDayOnTheBeach-small.webp",
          "medium": "/images/2019/dismalDayOnTheBeach-medium.webp",
          "large": "/images/2019/dismalDayOnTheBeach-large.webp",
          "alt": "Dismal Day on the Beach artwork",
          "width": 1000,
          "height": 635
        }
      },
      {
        "id": "2019-sketch",
        "title": "Sketch",
        "year": 2019,
        "medium": "Oil on linen",
        "dimensions": "80cm x 60cm",
        "image": {
          "small": "/images/2019/sketch-small.webp",
          "medium": "/images/2019/sketch-medium.webp",
          "large": "/images/2019/sketch-large.webp",
          "alt": "Sketch artwork",
          "width": 1000,
          "height": 1533
        }
      },
      {
        "id": "2019-chillin-in-da-wood",
        "title": "Chillin' in da Wood",
        "year": 2019,
        "medium": "Oil on board",
        "dimensions": "24cm x 35cm",
        "image": {
          "small": "/images/2019/chillinInDaWood-small.webp",
          "medium": "/images/2019/chillinInDaWood-medium.webp",
          "large": "/images/2019/chillinInDaWood-large.webp",
          "alt": "Chillin' in da Wood artwork",
          "width": 1000,
          "height": 721
        }
      },
      {
        "id": "2019-godlike",
        "title": "Godlike",
        "year": 2019,
        "medium": "Oil and oil pastel on mounted canvas on board",
        "dimensions": "30cm x 45cm",
        "image": {
          "small": "/images/2019/godlike-small.webp",
          "medium": "/images/2019/godlike-medium.webp",
          "large": "/images/2019/godlike-large.webp",
          "alt": "Godlike artwork",
          "width": 1000,
          "height": 692
        }
      },
      {
        "id": "2019-indian-boy-breaking-rocks-for-the-rest-of-his-life",
        "title": "Indian Boy Breaking Rocks for the Rest of his Life",
        "year": 2019,
        "medium": "Oil and oil pastel on board",
        "dimensions": "22cm x 22cm",
        "image": {
          "small": "/images/2019/indianBoyBreakingRocksForTheRestOfHisLife-small.webp",
          "medium": "/images/2019/indianBoyBreakingRocksForTheRestOfHisLife-medium.webp",
          "large": "/images/2019/indianBoyBreakingRocksForTheRestOfHisLife-large.webp",
          "alt": "Indian Boy Breaking Rocks for the Rest of his Life artwork",
          "width": 1000,
          "height": 1055
        }
      },
      {
        "id": "2019-clouds",
        "title": "Clouds",
        "year": 2019,
        "medium": "Oil on board",
        "dimensions": "22cm x 18cm",
        "image": {
          "small": "/images/2019/clouds-small.webp",
          "medium": "/images/2019/clouds-medium.webp",
          "large": "/images/2019/clouds-large.webp",
          "alt": "Clouds artwork",
          "width": 1000,
          "height": 1149
        }
      },
      {
        "id": "2019-reggae-molecule",
        "title": "Reggae Molecule",
        "year": 2019,
        "medium": "Oil and oil pastel on board",
        "dimensions": "26cm x 26cm",
        "image": {
          "small": "/images/2019/regaemolecule2-small.webp",
          "medium": "/images/2019/regaemolecule2-medium.webp",
          "large": "/images/2019/regaemolecule2-large.webp",
          "alt": "Reggae Molecule artwork",
          "width": 1000,
          "height": 1142
        }
      },
      {
        "id": "2019-quadropus",
        "title": "Quadropus",
        "year": 2019,
        "medium": "Oil and oil pastel on board",
        "dimensions": "40cm x 55cm",
        "image": {
          "small": "/images/2019/quadropuss-small.webp",
          "medium": "/images/2019/quadropuss-medium.webp",
          "large": "/images/2019/quadropuss-large.webp",
          "alt": "Quadropus artwork",
          "width": 1000,
          "height": 838
        }
      },
      {
        "id": "2019-man-under-tree",
        "title": "Man Under Tree",
        "year": 2019,
        "medium": "Oil board",
        "dimensions": "22cm x 18cm",
        "image": {
          "small": "/images/2019/ManUnderTree-small.webp",
          "medium": "/images/2019/ManUnderTree-medium.webp",
          "large": "/images/2019/ManUnderTree-large.webp",
          "alt": "Man Under Tree artwork",
          "width": 1000,
          "height": 1269
        }
      },
      {
        "id": "2019-person-on-beach",
        "title": "Person on Beach",
        "year": 2019,
        "medium": "Oil and oil pastel on board",
        "dimensions": "28cm x 18cm",
        "image": {
          "small": "/images/2019/personOnBeach-small.webp",
          "medium": "/images/2019/personOnBeach-medium.webp",
          "large": "/images/2019/personOnBeach-large.webp",
          "alt": "Person on Beach artwork",
          "width": 1000,
          "height": 1521
        }
      },
      {
        "id": "2019-man-and-palm-trees-sketch",
        "title": "Man and Palm Trees Sketch",
        "year": 2019,
        "medium": "Oil and oil pastel on board",
        "dimensions": "25cm x 18cm",
        "image": {
          "small": "/images/2019/manAndPalmTreesSketch-small.webp",
          "medium": "/images/2019/manAndPalmTreesSketch-medium.webp",
          "large": "/images/2019/manAndPalmTreesSketch-large.webp",
          "alt": "Man and Palm Trees Sketch artwork",
          "width": 1000,
          "height": 1295
        }
      },
      {
        "id": "2019-palmdale-sunset",
        "title": "Palmdale Sunset",
        "year": 2019,
        "medium": "Oil on board",
        "dimensions": "25cm x 34cm",
        "image": {
          "small": "/images/2019/palmdaleSunset-small.webp",
          "medium": "/images/2019/palmdaleSunset-medium.webp",
          "large": "/images/2019/palmdaleSunset-large.webp",
          "alt": "Palmdale Sunset artwork",
          "width": 1000,
          "height": 722
        }
      },
      {
        "id": "2019-hanuman",
        "title": "Hanuman",
        "year": 2019,
        "medium": "Oil and oil pastel on board",
        "dimensions": "24cm x 18cm",
        "image": {
          "small": "/images/2019/Hanuman-small.webp",
          "medium": "/images/2019/Hanuman-medium.webp",
          "large": "/images/2019/Hanuman-large.webp",
          "alt": "Hanuman artwork",
          "width": 1000,
          "height": 1354
        }
      },
      {
        "id": "2019-blood",
        "title": "Blood",
        "year": 2019,
        "medium": "Oil on board",
        "dimensions": "16cm x 22cm",
        "image": {
          "small": "/images/2019/blood-small.webp",
          "medium": "/images/2019/blood-medium.webp",
          "large": "/images/2019/blood-large.webp",
          "alt": "Blood artwork",
          "width": 1000,
          "height": 769
        }
      },
      {
        "id": "2019-day-on-the-beach",
        "title": "Day on the Beach",
        "year": 2019,
        "medium": "Oil, colour pencil and oil pastel on board",
        "dimensions": "16cm x 22cm",
        "image": {
          "small": "/images/2019/dayOnTheBeach-small.webp",
          "medium": "/images/2019/dayOnTheBeach-medium.webp",
          "large": "/images/2019/dayOnTheBeach-large.webp",
          "alt": "Day on the Beach artwork",
          "width": 1000,
          "height": 749
        }
      },
      {
        "id": "2019-indian-boy",
        "title": "Indian Boy",
        "year": 2019,
        "medium": "Oil and oil pastel on board",
        "dimensions": "26cm x 18cm",
        "image": {
          "small": "/images/2019/indianBoy-small.webp",
          "medium": "/images/2019/indianBoy-medium.webp",
          "large": "/images/2019/indianBoy-large.webp",
          "alt": "Indian Boy artwork",
          "width": 1000,
          "height": 1654
        }
      },
      {
        "id": "2019-markings-3",
        "title": "Markings 3",
        "year": 2019,
        "medium": "Oil on board",
        "dimensions": "26cm x 24cm",
        "image": {
          "small": "/images/2019/markings3-small.webp",
          "medium": "/images/2019/markings3-medium.webp",
          "large": "/images/2019/markings3-large.webp",
          "alt": "Markings 3 artwork",
          "width": 1000,
          "height": 1051
        }
      },
      {
        "id": "2019-painkiller",
        "title": "Painkiller",
        "year": 2019,
        "medium": "Oil on board",
        "dimensions": "16cm x 12cm",
        "image": {
          "small": "/images/2019/painkiller-small.webp",
          "medium": "/images/2019/painkiller-medium.webp",
          "large": "/images/2019/painkiller-large.webp",
          "alt": "Painkiller artwork",
          "width": 1000,
          "height": 1177
        }
      },
      {
        "id": "2019-palm-tree-sketch",
        "title": "Palm Tree Sketch",
        "year": 2019,
        "medium": "Oil and oil pastel on board",
        "dimensions": "18cm x 14cm",
        "image": {
          "small": "/images/2019/palmTreeSketch-small.webp",
          "medium": "/images/2019/palmTreeSketch-medium.webp",
          "large": "/images/2019/palmTreeSketch-large.webp",
          "alt": "Palm Tree Sketch artwork",
          "width": 1000,
          "height": 1160
        }
      },
      {
        "id": "2019-pity",
        "title": "Pity",
        "year": 2019,
        "medium": "Oil, charcoal and oil pastel on board",
        "dimensions": "14cm x 18cm",
        "image": {
          "small": "/images/2019/pity-small.webp",
          "medium": "/images/2019/pity-medium.webp",
          "large": "/images/2019/pity-large.webp",
          "alt": "Pity artwork",
          "width": 1000,
          "height": 794
        }
      },
      {
        "id": "2019-pocho-eating-a-man",
        "title": "Pocho Eating a Man",
        "year": 2019,
        "medium": "Oil and oil pastel on board",
        "dimensions": "14cm x 18cm",
        "image": {
          "small": "/images/2019/pochoEatingMan-small.webp",
          "medium": "/images/2019/pochoEatingMan-medium.webp",
          "large": "/images/2019/pochoEatingMan-large.webp",
          "alt": "Pocho Eating a Man artwork",
          "width": 1000,
          "height": 659
        }
      }
    ]
  }
] as const;

export const artworksByYearDescending: ArtworkCollection[] = z
  .array(artworkCollectionSchema)
  .parse(collectionsRaw)
  .sort((a, b) => b.year - a.year);

const yearStory: Record<number, string> = {
  2022: "Upland Folk series and sculptural framing explorations.",
  2021: "Oil pastel studies with intimate narrative energy.",
  2020: "Mixed-media transitions across memory and landscape.",
  2019: "Early works shaped by travel, myth, and observation.",
};

export const yearlyCollectionSummaries = artworksByYearDescending.map((collection) => ({
  year: collection.year,
  count: collection.works.length,
  story: yearStory[collection.year] ?? "Selected works from the archive.",
}));
