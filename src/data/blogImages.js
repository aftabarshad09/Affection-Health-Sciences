import liverHealth1 from "../assets/Blogs/liverHealth1.png";
import liverHealth2 from "../assets/Blogs/liverHealth2.png";
import liverHealth3 from "../assets/Blogs/liverHealth3.png";
import liverHealth4 from "../assets/Blogs/liverHealth4.png";
import liverHealth5 from "../assets/Blogs/liverHealth5.png";

import mctKids1 from "../assets/Blogs/mctKids1.png";
import mctKids2 from "../assets/Blogs/mctKids2.png";
import mctKids3 from "../assets/Blogs/mctKids3.png";
import mctKids4 from "../assets/Blogs/mctKids4.png";
import mctKids5 from "../assets/Blogs/mctKids5.png";

import folicAcid1 from "../assets/Blogs/folicAcid1.png";
import folicAcid2 from "../assets/Blogs/folicAcid2.png";
import folicAcid3 from "../assets/Blogs/folicAcid3.png";

import adultNutrition1 from "../assets/Blogs/adultNutrition1.png";
import adultNutrition2 from "../assets/Blogs/adultNutrition2.png";

import nafld1 from "../assets/Blogs/nafld1.png";
import nafld2 from "../assets/Blogs/nafld2.png";
import nafld3 from "../assets/Blogs/nafld3.png";

import maternalNutrition1 from "../assets/Blogs/maternalNutrition1.png";
import maternalNutrition2 from "../assets/Blogs/maternalNutrition2.png";
import maternalNutrition3 from "../assets/Blogs/maternalNutrition3.png";

import pediatricHealth1 from "../assets/Blogs/pediatricHealth1.png";
import pediatricHealth2 from "../assets/Blogs/pediatricHealth2.png";
import pediatricHealth3 from "../assets/Blogs/pediatricHealth3.png";

import immuneSupport1 from "../assets/Blogs/immuneSupport1.png";
import immuneSupport2 from "../assets/Blogs/immuneSupport2.png";
import immuneSupport3 from "../assets/Blogs/immuneSupport3.png";

// Card/cover thumbnails only — used on the blog listing cards (Blogs.jsx grid + featured card).
import card001 from "../assets/Blogs/001.png";
import card002 from "../assets/Blogs/002.png";
import card003 from "../assets/Blogs/003.png";
import card004 from "../assets/Blogs/004.png";
import card005 from "../assets/Blogs/005.png";
import card006 from "../assets/Blogs/006.png";
import card007 from "../assets/Blogs/007.png";
import card008 from "../assets/Blogs/008.png";

// `hero`    = original banner image (file ending in "1") — used on the individual blog post page.
// `card`    = new 001-008 thumbnail — used only for the blog listing cards (grid + featured).
// `gallery` = the 1:1 inline images, in order, matched to each section's `index` (1-based).
export const blogImages = {
  "bcaas-liver-health-cirrhosis-management": {
    hero: liverHealth1,
    card: card001,
    gallery: [liverHealth2, liverHealth3, liverHealth4, liverHealth5],
  },
  "mct-oil-kids-weight-gain-nutritional-support": {
    hero: mctKids1,
    card: card002,
    gallery: [mctKids2, mctKids3, mctKids4, mctKids5],
  },
  "folic-acid-vs-l-methylfolate-pregnancy": {
    hero: folicAcid1,
    card: card003,
    gallery: [folicAcid2, folicAcid3],
  },
  "complete-adult-nutrition-energid-plus": {
    hero: adultNutrition1,
    card: card004,
    gallery: [adultNutrition2],
  },
  "nafld-children-maternal-nutrition-early-intervention": {
    hero: nafld1,
    card: card005,
    gallery: [nafld2, nafld3],
  },
  "maternal-nutrition-prenatal-postnatal-care": {
    hero: maternalNutrition1,
    card: card006,
    gallery: [maternalNutrition2, maternalNutrition3],
  },
  "pediatric-health-growth-milestones-infant-nutrition": {
    hero: pediatricHealth1,
    card: card007,
    gallery: [pediatricHealth2, pediatricHealth3],
  },
  "immune-support-vitamins-minerals-immune-response": {
    hero: immuneSupport1,
    card: card008,
    gallery: [immuneSupport2, immuneSupport3],
  },
};