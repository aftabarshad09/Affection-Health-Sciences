import React, { useState, useEffect } from 'react';
import '../style/ProductsPage.css';
import { FaTimes, FaCheckCircle, FaFlask, FaShieldAlt, FaLeaf, FaAtom } from 'react-icons/fa';

import heroBg from '../assets/videos/002.mp4';
import P1 from '../assets/Products/P1.png';
import P2 from '../assets/Products/P2.png';
import P3 from '../assets/Products/P3.png';
import P4 from '../assets/Products/P4.png';
import P5 from '../assets/Products/P5.png';
import P6 from '../assets/Products/P6.png';
import P7 from '../assets/Products/P7.png';
import P8 from '../assets/Products/P8.png';
import P9  from '../assets/Products/P9.png';
import P10 from '../assets/Products/P10.png';
import P11 from '../assets/Products/P11.png';
import P12 from '../assets/Products/P12.png';
import P13 from '../assets/Products/P13.png';
import P14 from '../assets/Products/P14.png';
import P15 from '../assets/Products/P15.png';
import P16 from '../assets/Products/P16.png';
import P17 from '../assets/Products/P17.png';
import P18 from '../assets/Products/P18.png';
import P19 from '../assets/Products/P18.png';
import P20 from '../assets/Products/P20.png';
import P21 from '../assets/Products/P21.png';
import P22A from '../assets/Products/P22.1.png';
import P22B from '../assets/Products/P22.2.png';
import P23A from '../assets/Products/P23.1.png';
import P23B from '../assets/Products/P23.2.png';
import P24A from '../assets/Products/P24.1.png';
import P24B from '../assets/Products/P24.2.png';
import P25A from '../assets/Products/P25.1.png';
import P25B from '../assets/Products/P25.2.png';
import P26A from '../assets/Products/P26.1.png';
import P26B from '../assets/Products/P26.2.png';
import P27A from '../assets/Products/P27.1.png';
import P27B from '../assets/Products/P27.2.png';

const products = [
  {
    id: 1,
    name: 'Gynogid',
    tagline: '3G Pregnancy Nutrition — Go, Grow & Glow',
    cardLine: 'Complete pregnancy supplement with DHA, folic acid & iron',
    category: "Women's Health",
    image: P1,
    badge: 'Clinician Recommended',
    description: 'Gynogid is a complete pregnancy nutrition supplement built around the 3G principle — Go, Grow and Glow. Each serving substitutes for calories and micronutrients that are difficult to get from diet alone during pregnancy, supporting maternal energy and fetal development together.',
    benefits: ['18.6mg DHA per serving for fetal brain development', '384mg folic acid per serving', '355mg calcium and 12mg iron per serving', '213 kcal and 10g protein per serving'],
    ingredients: [
      { name: 'DHA', amount: '18.6 mg/serving' },
      { name: 'Folic Acid', amount: '384 mg/serving' },
      { name: 'Calcium', amount: '355 mg/serving' },
      { name: 'Iron', amount: '12 mg/serving' },
      { name: 'Protein', amount: '10 g/serving' },
      { name: 'Energy', amount: '213 kcal/serving' },
    ],
    dosage: '5 scoops daily, mixed as directed',
    form: 'Powder — per-serving sachet',
  },
  {
    id: 2,
    name: 'MCT Lipdrop',
    tagline: 'Medium-Chain Triglyceride Emulsion Drops',
    cardLine: 'Rapid-energy MCT drops for keto and cognitive clarity',
    category: 'Metabolic Support',
    image: P2,
    badge: null,
    description: 'MCT Lipdrop delivers pure medium-chain triglycerides in a highly bioavailable emulsion format — ideal for rapid energy delivery, ketogenic support, and cognitive clarity.',
    benefits: ['Rapid, sustained energy without sugar spikes', 'Supports ketogenic and low-carb lifestyles', 'Enhances cognitive clarity and focus', 'Easy-to-absorb emulsion format'],
    ingredients: [
      { name: 'Medium Chain Triglycerides (MCT)', amount: 'Per serving' },
    ],
    dosage: '10–15 drops twice daily in water or food',
    form: 'Oral drops — 30ml',
  },
  {
    id: 3,
    name: 'Glumin SR',
    tagline: 'Sustained-Release Diabetic & Cardiac Nutrition',
    cardLine: 'Low-GI nutrition formula for diabetic and cardiac patients',
    category: 'Amino Acids',
    image: P3,
    badge: 'New',
    description: 'Glumin SR is a slow, sustained-energy-release nutritional supplement for diabetic and ischemic patients. Its monounsaturated fatty acid profile supports lipid management, making it suitable for cardiac patients as well, with a low glycemic index and glycemic load.',
    benefits: ['Glycemic index 35, glycemic load 6.2', 'Monounsaturated fats for cardiac-friendly lipid management', '5g whey protein per serving', '5-scoop serving in 190ml water provides 225 kcal'],
    ingredients: [
      { name: 'Whey Protein', amount: '5 g/serving' },
      { name: 'Energy per scoop', amount: '46 kcal' },
      { name: 'Protein per scoop', amount: '1.6 g' },
      { name: 'Glycemic Index', amount: '35' },
      { name: 'Glycemic Load', amount: '6.2' },
      { name: 'Monounsaturated Fatty Acids', amount: 'Present' },
    ],
    dosage: '5 scoops in 190ml water; vanilla, strawberry, mango & chocolate',
    form: 'Powder — 46 kcal / 1.6g protein per scoop',
  },
  {
    id: 4,
    name: 'MCT Lip',
    tagline: 'Pure MCT Oil for Daily Use',
    cardLine: 'Cold-pressed non-GMO MCT oil, odourless & tasteless',
    category: 'Metabolic Support',
    image: P4,
    badge: null,
    description: 'MCT Lip is our premium unflavoured MCT oil, cold-processed from non-GMO coconut. Ideal for daily coffee, smoothies, or cooking at low heat.',
    benefits: ['Cold-pressed from coconut — non-GMO', 'Odourless and tasteless in food or drink', 'Supports fat metabolism and weight management', 'Dual C8 and C10 chain profile'],
    ingredients: [
      { name: 'Medium Chain Triglycerides (C8 + C10)', amount: 'Per tbsp' },
    ],
    dosage: '1–2 tablespoons daily in food or beverages',
    form: 'Liquid Oil — 250ml',
  },
  {
    id: 5,
    name: 'Energid Plus',
    tagline: 'Complete & Balanced Nutrition',
    cardLine: 'High-calorie complete nutrition for COPD, surgery & malnourishment',
    category: 'Energy & Performance',
    image: P5,
    badge: 'Bestseller',
    description: 'Energid Plus is a high-quality nutritional supplement that, mixed with water, delivers complete and balanced nutrition or serves as a full meal replacement. Indicated for COPD/NG feeding, pre- and post-surgical high-calorie requirements, malnourishment, and loss of appetite.',
    benefits: ['230 kcal per 230ml serving', '46 kcal and 1.6g protein per scoop', 'Suitable for NG tube feeding', 'Available in vanilla, strawberry, mango & chocolate'],
    ingredients: [
      { name: 'Energy per serving', amount: '230 kcal / 230 ml' },
      { name: 'Energy per scoop', amount: '46 kcal' },
      { name: 'Protein per scoop', amount: '1.6 g/kg b.wt' },
    ],
    dosage: 'Mix per serving guide; available in 400g packs',
    form: 'Powder — 400g',
  },
  {
    id: 6,
    name: 'Best Protein',
    tagline: 'The Strength of Whey',
    cardLine: '100% pure whey protein with 8g protein per scoop, no fillers',
    category: 'Sports Nutrition',
    image: P6,
    badge: null,
    description: 'Best Protein is a 100% high-quality whey protein with no fillers, sweeteners, or artificial flavourings. It mixes instantly into a wide variety of foods and beverages and can even be administered through a feeding tube as a flush.',
    benefits: ['8g protein and 32 kcal per scoop', 'No fillers, sweeteners or artificial flavourings', 'Mixes into cocoa, tea, cottage cheese, applesauce, egg salad or yogurt', 'Safe for tube-feeding flush administration'],
    ingredients: [
      { name: 'Whey Protein per scoop', amount: '8 g' },
      { name: 'Energy per scoop', amount: '32 kcal' },
    ],
    dosage: '1 scoop mixed into food or beverage of choice',
    form: 'Powder — 900g',
  },
  {
    id: 7,
    name: 'Lactilus',
    tagline: 'Probiotic & Zinc for Gut Recovery',
    cardLine: 'Dual-action probiotic + zinc for diarrhea recovery in children',
    category: 'Gut Health',
    image: P7,
    badge: null,
    description: 'Lactilus combines Lactobacillus Acidophilus with zinc sulphate in a dual-action formula that follows WHO/UNICEF-based dosage guidance for acute diarrhea, restoring healthy gut flora while supporting immunity and intestinal healing.',
    benefits: ['Restores healthy gut flora', 'Reduces duration and severity of diarrhea', 'Supports immunity and intestinal healing', 'WHO/UNICEF-based dosage — safe and effective for children'],
    ingredients: [
      { name: 'Lactobacillus Acidophilus', amount: '5 Billion CFU' },
      { name: 'Zinc Sulphate', amount: '5 mg' },
    ],
    dosage: '1 sachet daily, or as directed by a healthcare provider',
    form: 'Sachets — 10 count',
  },
  {
    id: 8,
    name: 'Hepatovital',
    tagline: 'Promotes Liver Function',
    cardLine: 'BCAA-enriched formula for liver regeneration and cirrhosis support',
    category: 'Liver Health',
    image: P8,
    badge: 'Popular',
    description: 'Hepatovital is a BCAA-enriched nutritional formula for liver and liver disease support. Its high leucine content stimulates growth factors and favours the regeneration process, suited to the higher protein needs of hypermetabolic cirrhosis patients.',
    benefits: ['BCAAs escape liver metabolism and enter general circulation', 'Supports hepatic regeneration via leucine signalling', 'Higher-protein formula suited to hypermetabolic patients', '5-scoop serving provides 217 kcal'],
    ingredients: [
      { name: 'BCAAs (Leucine-enriched)', amount: 'Per serving' },
      { name: 'Energy per scoop', amount: '45 kcal' },
      { name: 'Protein per scoop', amount: '1.5 g' },
      { name: 'Energy per 5-scoop serving', amount: '217 kcal' },
    ],
    dosage: '5 scoops daily, mixed as directed',
    form: 'Powder — 45 kcal / 1.5g protein per scoop',
  },
  {
    id: 9,
    name: 'MultiSoft',
    tagline: 'Calcium-Enriched Multivitamin',
    cardLine: 'Antioxidant multivitamin for bones, joints, muscles and heart',
    category: 'Bone Health',
    image: P9,
    badge: null,
    description: 'MultiSoft is a calcium-enriched multivitamin with antioxidant support, formulated to support bones, joints, muscles, and heart health in one daily formula.',
    benefits: ['Calcium-enriched antioxidant multivitamin', 'Supports bone, joint and muscle health', 'Includes Vitamin A, D2, D3, E, C, B1 and B6', 'Supports cardiovascular health'],
    ingredients: [
      { name: 'Calcium', amount: 'Present' },
      { name: 'Vitamin A', amount: 'Present' },
      { name: 'Vitamin E', amount: 'Present' },
      { name: 'Vitamin D3', amount: 'Present' },
      { name: 'Vitamin C', amount: 'Present' },
      { name: 'Vitamin B1', amount: 'Present' },
      { name: 'Vitamin D2', amount: 'Present' },
      { name: 'Vitamin B6', amount: 'Present' },
    ],
    dosage: '1 tablet daily with food',
    form: 'Tablets — 60 count',
  },
  {
    id: 10,
    name: 'Cabot-D3',
    tagline: 'Calcium & Vitamin D3 Complex',
    cardLine: 'Calcium carbonate + D3 for bone density and pregnancy health',
    category: 'Bone Health',
    image: P10,
    badge: null,
    description: 'Cabot-D3 prevents calcium and vitamin D deficiency for optimal bone health. A strong choice for pregnant women, helping reduce the risk of complications, miscarriage, and hypertension, while increasing peak bone mass and minimising age-related bone loss.',
    benefits: ['Prevents calcium and vitamin D deficiency', 'Reduces risk of pregnancy complications and hypertension', 'Increases peak bone mass', 'Minimises age-related bone loss'],
    ingredients: [
      { name: 'Calcium (as Carbonate)', amount: '300 mg' },
      { name: 'Vitamin D3', amount: '200 IU' },
    ],
    dosage: '1 tablet daily with food',
    form: 'Tablets — 60 count',
  },
  {
    id: 11,
    name: 'Lipolite',
    tagline: 'Fat Metabolism & Weight Management',
    cardLine: 'Green tea + L-carnitine formula for fat burning and lean mass',
    category: 'Metabolic Support',
    image: P11,
    badge: null,
    description: 'Lipolite is formulated to reduce fat storage and increase lean muscle mass. Green tea catechins enhance fat oxidation while L-carnitine helps reduce fat during exercise and supports physical activity and calorie expenditure.',
    benefits: ['Green tea catechins enhance fat oxidation', 'L-carnitine reduces fat burned during exercise', 'Supports lean muscle mass retention', 'Aids overall body composition and weight loss'],
    ingredients: [
      { name: 'Green Tea Extract (Catechins)', amount: 'Per capsule' },
      { name: 'L-Carnitine', amount: 'Per capsule' },
    ],
    dosage: '1 capsule twice daily before meals',
    form: 'Capsules — 60 count',
  },
  {
    // P12 image = Lactilus Probiotic box (10 sachets)
    id: 12,
    name: 'Lactilus',
    tagline: 'Probiotic & Zinc — 10 Sachet Pack',
    cardLine: 'Lactobacillus Acidophilus & Zinc for digestive and immune support',
    category: 'Gut Health',
    image: P12,
    badge: null,
    description: 'Lactilus Probiotic is a dual-action sachet formula combining Lactobacillus Acidophilus with Zinc to support the digestive and immune systems. It restores healthy gut flora, reduces bio-degradation in the gut, and helps maintain live bacteria levels in the intestinal tract.',
    benefits: ['Supports digestive and immune system health', 'Restores healthy gut flora', 'Reduces bio-degradation in the gut', 'Supports live bacteria levels in the gut'],
    ingredients: [
      { name: 'Lactobacillus Acidophilus', amount: 'Per sachet' },
      { name: 'Zinc', amount: 'Per sachet' },
    ],
    dosage: '1 sachet daily, or as directed by a healthcare provider',
    form: 'Sachets — 10 count',
  },
  {
    id: 13,
    name: 'PicWhite L-Glutathione',
    tagline: 'Antioxidant Skin Whitening Complex',
    cardLine: 'L-Glutathione + Vitamin C for skin brightening and anti-aging',
    category: 'Skin & Antioxidant Care',
    image: P13,
    badge: null,
    description: 'PicWhite combines L-Glutathione with vitamin C, vitamin E and milk thistle extract as a powerful antioxidant and detoxifier that supports glowing, brighter skin while protecting against premature wrinkles and oxidative stress.',
    benefits: ['Powerful antioxidant and detoxifier', 'Supports skin whitening and glowing skin', 'Prevents premature wrinkles, dark spots and oxidative stress', 'Increases skin elasticity and reduces inflammation'],
    ingredients: [
      { name: 'L-Glutathione', amount: '247 mg' },
      { name: 'Vitamin C', amount: '50 mg' },
      { name: 'D-α-Tocopheryl Acetate (Vit E)', amount: '33.5 mg' },
      { name: 'Milk Thistle Extract', amount: '40 mg' },
    ],
    dosage: '1 capsule daily, or as directed',
    form: 'Capsules — 30 count',
  },
  {
    id: 14,
    name: 'Hurma',
    tagline: 'Hair, Skin & Nail Multivitamin',
    cardLine: 'Multivitamin for collagen production and healthy hair, skin and nails',
    category: 'Skin & Antioxidant Care',
    image: P14,
    badge: null,
    description: 'Hurma is a targeted multivitamin that supports healthy hair, skin and nails. It promotes hydration and collagen production while helping fight nutritional deficiencies linked to acne, dryness, hyperpigmentation, and premature aging.',
    benefits: ['Supports collagen production and hydration', 'Helps prevent acne, dryness and hyperpigmentation', 'Reduces signs of premature aging', 'Aids in stress reduction'],
    ingredients: [
      { name: 'Vitamin A', amount: '1666.7 IU' },
      { name: 'Vitamin C', amount: '20 mg' },
      { name: 'Vitamin D3', amount: '333.33 IU' },
      { name: 'Vitamin E', amount: '5 IU' },
      { name: 'Vitamin B1', amount: '1.67 mg' },
      { name: 'Vitamin B6', amount: '1.67 mg' },
      { name: 'Vitamin B12', amount: '2.67 mcg' },
      { name: 'Folic Acid', amount: '66.67 mcg' },
      { name: 'Niacin', amount: '8.33 mg' },
      { name: 'Zinc', amount: '2.50 mg' },
      { name: 'Magnesium', amount: '16.67 mg' },
    ],
    dosage: '1 capsule daily with a meal',
    form: 'Capsules — 30 count',
  },
  {
    id: 15,
    name: 'MagnaCalm',
    tagline: 'Magnesium Glycinate Complex',
    cardLine: 'Highly bioavailable magnesium glycinate for sleep and muscle relaxation',
    category: 'Stress & Sleep',
    image: P15,
    badge: null,
    description: 'MagnaCalm uses the highly bioavailable glycinate form of magnesium to support deep sleep, nervous system regulation, and muscle relaxation — without the laxative effect of cheaper forms.',
    benefits: ['Promotes deep, restful sleep', 'Reduces muscle cramps and tension', 'Calms nervous system overactivity', 'Zero laxative effect vs. oxide forms'],
    ingredients: [
      { name: 'Magnesium (as Glycinate)', amount: 'Per 2 capsules' },
    ],
    dosage: '2 capsules 30 minutes before bed',
    form: 'Capsules — 60 count',
  },
  {
    id: 16,
    name: 'Vitamin-C Chewable',
    tagline: '500mg Chewable Tablets',
    cardLine: '500mg chewable Vitamin C for immunity, collagen and iron absorption',
    category: 'Immune Support',
    image: P16,
    badge: null,
    description: 'A 500mg chewable Vitamin C tablet that boosts collagen synthesis, supports healthy skin function, and enhances iron absorption alongside immune and nervous system support.',
    benefits: ['Boosts collagen synthesis and anti-aging support', 'Enhances iron absorption', 'Strengthens immune system', 'Promotes energy release and nervous system support'],
    ingredients: [
      { name: 'Vitamin C (Ascorbic Acid)', amount: '500 mg' },
    ],
    dosage: '1 chewable tablet daily',
    form: 'Chewable Tablets — 30 count',
  },
  {
    // P17 image = MPC Health Vitamin-C 500mg Chewable Tablet bottle (30 tablets)
    id: 17,
    name: 'Vitamin-C 500',
    tagline: 'MPC Health Immune Support — 500mg',
    cardLine: '500mg Vitamin C chewable tablet for immune health — 30 tablets',
    category: 'Immune Support',
    image: P17,
    badge: null,
    description: 'MPC Health Vitamin-C 500mg Chewable Tablet delivers a potent dose of ascorbic acid to strengthen the immune system, boost collagen synthesis for healthy skin, and enhance iron absorption. Each tablet is chewable for convenient, on-the-go use.',
    benefits: ['500mg Vitamin C per tablet for immune defence', 'Boosts collagen synthesis and skin health', 'Enhances dietary iron absorption', 'Convenient chewable format — no water needed'],
    ingredients: [
      { name: 'Vitamin C (Ascorbic Acid)', amount: '500 mg' },
    ],
    dosage: '1 chewable tablet daily',
    form: 'Chewable Tablets — 30 count',
  },
  {
    id: 18,
    name: 'Mecsil-SL',
    tagline: 'Liver Support — Methylcobalamin + B6',
    cardLine: '2000mcg Mecobalamin + Vitamin B6 for liver and nerve support',
    category: 'Liver Health',
    image: P18,
    badge: null,
    description: 'Mecsil-SL is commonly used to support liver health and help manage conditions related to liver dysfunction, combining methylcobalamin (active B12) with Vitamin B6 in a single daily formula.',
    benefits: ['Supports liver health and dysfunction management', 'Supports healthy nerve function', 'Active B12 (Mecobalamin) — superior absorption', 'Daily once-a-day convenience'],
    ingredients: [
      { name: 'Mecobalamin (Methylcobalamin / B12)', amount: '2000 mcg' },
      { name: 'Vitamin B6', amount: '2 mg' },
    ],
    dosage: '1 tablet daily, or as directed',
    form: 'Tablets — 30 count',
  },
  {
    id: 19,
    name: 'ThyroBalance',
    tagline: 'Thyroid Nourishment Complex',
    cardLine: 'Iodine, selenium, zinc and L-tyrosine for T3/T4 thyroid support',
    category: 'Hormonal Health',
    image: P19,
    badge: null,
    description: 'ThyroBalance provides the exact micronutrient profile the thyroid demands — iodine from kelp, selenium, zinc, and L-tyrosine — formulated to support T3/T4 synthesis and conversion.',
    benefits: ['Kelp iodine for T3/T4 synthesis', 'Selenium for thyroid hormone conversion', 'L-tyrosine as thyroid hormone precursor', 'Supports energy, weight, and mood'],
    ingredients: [
      { name: 'Iodine (from Kelp)', amount: 'Per capsule' },
      { name: 'Selenium', amount: 'Per capsule' },
      { name: 'Zinc', amount: 'Per capsule' },
      { name: 'L-Tyrosine', amount: 'Per capsule' },
    ],
    dosage: '1 capsule daily with breakfast',
    form: 'Capsules — 30 count',
  },
  {
    id: 20,
    name: 'Infantin AR',
    tagline: 'Anti-Reflux Infant Formula',
    cardLine: 'Scientifically developed formula for infant regurgitation and reflux',
    category: 'Baby Nutrition',
    image: P20,
    badge: null,
    description: 'Infantin AR is a scientifically developed infant formula for babies suffering from regurgitation and reflux issues, delivering complete and balanced nutrition alongside essential proteins, vitamins, and minerals for healthy growth, brain development, and strong immunity. Available as part of the complete Infantin range (Infantin 1, 2, 3, LF, AR, Pre-Mature).',
    benefits: ['Specifically formulated for regurgitation and reflux', 'Supports healthy growth and brain development', 'Builds strong infant immunity', 'Complete and balanced nutrition profile'],
    ingredients: [
      { name: 'Essential Proteins', amount: 'Per serving' },
      { name: 'Vitamins & Minerals (complete)', amount: 'Per serving' },
    ],
    dosage: 'Prepare per pack guidelines for age and weight',
    form: 'Soft Pack — 200g / 400g / Tin',
  },
  {
    // P21 image = Infantin Pre — Premature Infant Formula (400g tin)
    id: 21,
    name: 'Infantin Pre',
    tagline: 'Premature Infant Formula',
    cardLine: 'Complete nutrition formula for premature and low-birthweight infants',
    category: 'Baby Nutrition',
    image: P21,
    badge: 'Premature',
    description: 'Infantin Pre is a scientifically developed formula specifically designed for premature and low-birthweight infants. It provides complete and balanced nutrition to support the accelerated growth, brain development, and immune system requirements of babies born early or with lower birth weight.',
    benefits: ['Formulated for premature and low-birthweight infants', 'Supports accelerated growth catch-up', 'Essential nutrients for brain and neurological development', 'Builds immune defences in vulnerable newborns'],
    ingredients: [
      { name: 'Essential Proteins', amount: 'Per serving' },
      { name: 'DHA & ARA', amount: 'Per serving' },
      { name: 'Vitamins & Minerals (complete)', amount: 'Per serving' },
    ],
    dosage: 'Prepare per pack guidelines for gestational age and weight',
    form: 'Tin — 400g',
  },
  {
    // P22.1 image = Infantin 3 — Growing Up Formula, 1 year to 3 years (400g tin)
    id: 22,
    name: 'Infantin 3',
    tagline: 'Growing Up Formula — 1 to 3 Years',
    cardLine: 'Complete growing-up milk formula for toddlers aged 1 to 3 years',
    category: 'Baby Nutrition',
    isDualPack: true,
    imageA: P22A,
    imageB: P22B,
    badge: 'Toddler',
    description: 'Infantin 3 is a scientifically formulated growing-up milk designed for toddlers from 1 year to 3 years of age. It provides complete and balanced nutrition to support the rapid growth, cognitive development, and immune system needs of active toddlers during this critical developmental stage.',
    benefits: ['Formulated for toddlers aged 1 to 3 years', 'Supports healthy growth and physical development', 'Promotes cognitive and brain development', 'Strengthens immune system in growing toddlers'],
    ingredients: [
      { name: 'Essential Proteins', amount: 'Per serving' },
      { name: 'DHA & ARA', amount: 'Per serving' },
      { name: 'Vitamins & Minerals (complete)', amount: 'Per serving' },
      { name: 'Iron & Calcium', amount: 'Per serving' },
    ],
    dosage: 'Prepare per pack guidelines for age and weight',
    form: 'Tin — 400g',
  },
  {
    // P23.1 image = Infantin 1 — Premium Infant Formula, Birth to 6 months (400g tin)
    id: 23,
    name: 'Infantin 1',
    tagline: 'Premium Infant Formula — Birth to 6 Months',
    cardLine: 'Complete premium infant formula from birth to 6 months',
    category: 'Baby Nutrition',
    isDualPack: true,
    imageA: P23A,
    imageB: P23B,
    badge: 'Newborn',
    description: 'Infantin 1 is a premium infant formula developed for babies from birth to 6 months of age. It closely mirrors the nutritional composition of breast milk, providing essential proteins, DHA, vitamins, and minerals to support healthy growth, brain development, and a strong immune system during the most critical early months of life.',
    benefits: ['Designed for newborns from birth to 6 months', 'Nutritional profile close to breast milk', 'DHA for brain and visual development', 'Complete vitamins and minerals for healthy immunity'],
    ingredients: [
      { name: 'Whey-dominant Protein', amount: 'Per serving' },
      { name: 'DHA & ARA', amount: 'Per serving' },
      { name: 'Vitamins & Minerals (complete)', amount: 'Per serving' },
      { name: 'Prebiotics (GOS/FOS)', amount: 'Per serving' },
    ],
    dosage: 'Prepare per pack guidelines for age and weight',
    form: 'Tin — 400g',
  },
  {
    id: 24,
    name: 'CollagenElite',
    tagline: 'Marine Collagen Peptides',
    cardLine: 'Wild-caught marine collagen Types I & III with Vitamin C and biotin',
    category: 'Bone Health',
    isDualPack: true,
    imageA: P24A,
    imageB: P24B,
    badge: 'New',
    description: 'Wild-caught marine collagen peptides (types I & III) with added vitamin C and biotin. Supports skin elasticity, joint cartilage, hair, and nail strength.',
    benefits: ['Wild-caught marine source — sustainable', 'Types I & III for skin and joint support', 'Vitamin C co-factor for collagen synthesis', 'Biotin for nail and hair structural strength'],
    ingredients: [
      { name: 'Marine Collagen Peptides (Types I & III)', amount: '10 g/serving' },
      { name: 'Vitamin C', amount: 'Per serving' },
      { name: 'Biotin', amount: 'Per serving' },
    ],
    dosage: '10g in warm water or coffee daily',
    form: 'Powder',
  },
  {
    // P25.1 image = Infantin 2 — Follow Up Formula, 6 months to 1 year (400g tin)
    id: 25,
    name: 'Infantin 2',
    tagline: 'Follow Up Formula — 6 Months to 1 Year',
    cardLine: 'Complete follow-up formula for infants aged 6 months to 1 year',
    category: 'Baby Nutrition',
    isDualPack: true,
    cardVariant: 'emerald',
    imageA: P25A,
    imageB: P25B,
    badge: 'Follow-Up',
    description: 'Infantin 2 is a complete follow-up formula designed for infants from 6 months to 1 year of age. It supports the transition from exclusive milk feeding by providing the additional iron, calcium, DHA, and balanced nutrition needed for healthy growth, continued brain development, and strong immunity during this active exploratory stage.',
    benefits: ['Formulated for infants aged 6 months to 1 year', 'Higher iron content to support rapid growth phase', 'DHA for continued brain and visual development', 'Complete nutrition to complement weaning foods'],
    ingredients: [
      { name: 'Essential Proteins', amount: 'Per serving' },
      { name: 'DHA & ARA', amount: 'Per serving' },
      { name: 'Iron & Calcium', amount: 'Per serving' },
      { name: 'Vitamins & Minerals (complete)', amount: 'Per serving' },
    ],
    dosage: 'Prepare per pack guidelines for age and weight',
    form: 'Tin — 400g',
  },
  {
    // P26.1 image = MPC Health Mega-3 (1000mg Omega3 Fish Oil, 30 Softgel Capsules)
    id: 26,
    name: 'Mega-3',
    tagline: 'Omega-3 Fish Oil — 1000mg Softgels',
    cardLine: '1000mg fish oil with EPA 18% & DHA 12% — 30 softgel capsules',
    category: 'Brain Health',
    isDualPack: true,
    cardVariant: 'amber',
    imageA: P26A,
    imageB: P26B,
    badge: null,
    description: 'MPC Health Mega-3 delivers 1000mg of concentrated fish oil per softgel, rich in EPA and DHA omega-3 fatty acids. It supports heart health, brain function, memory and learning, healthy cholesterol and triglyceride levels, and helps treat hair loss by boosting blood circulation around follicles.',
    benefits: ['1000mg fish oil with EPA 18% & DHA 12% per softgel', 'Supports heart health and healthy cholesterol levels', 'Boosts brain function, memory and learning', 'Helps treat hair loss and boosts follicle circulation'],
    ingredients: [
      { name: 'Fish Oil (total Omega-3)', amount: '1000 mg' },
      { name: 'Eicosapentaenoic Acid (EPA)', amount: '18%' },
      { name: 'Docosahexaenoic Acid (DHA)', amount: '12%' },
    ],
    dosage: '1 softgel capsule daily with a meal',
    form: 'Softgel Capsules — 30 count',
  },
  {
    // P27.1 image = Babyline Baby Cereal (Nutritech, Wheat, Iron/Zinc/Calcium/Iodine/Vit A, 6+ months, 175g)
    id: 27,
    name: 'Babyline Cereal',
    tagline: 'Vitamins & Minerals Enriched Baby Cereal',
    cardLine: 'Wheat-based baby cereal enriched with iron, zinc, calcium & iodine — 6 months+',
    category: 'Baby Nutrition',
    isDualPack: true,
    cardVariant: 'teal',
    imageA: P27A,
    imageB: P27B,
    badge: null,
    description: 'Babyline Baby Cereal by Nutritech is a wheat-based weaning cereal enriched with essential vitamins and minerals — including iron, zinc, calcium, iodine, and Vitamin A. Suitable from 6 months up to 24 months, it provides a nutritious first solid food to complement breast or formula feeding during the critical weaning stage.',
    benefits: ['Enriched with iron, zinc, calcium, iodine and Vitamin A', 'Wheat-based — easy to digest for early weaning', 'Suitable from 6 months to 24 months', 'Supports healthy growth and immune development'],
    ingredients: [
      { name: 'Wheat Flour', amount: 'Per serving' },
      { name: 'Iron', amount: 'Per serving' },
      { name: 'Zinc', amount: 'Per serving' },
      { name: 'Calcium', amount: 'Per serving' },
      { name: 'Iodine', amount: 'Per serving' },
      { name: 'Vitamin A', amount: 'Per serving' },
    ],
    dosage: 'Mix as directed per age-appropriate serving guide on pack',
    form: 'Box — 175g',
  },
];

const categoryColors = {
  "Women's Health": '#db2777',
  'Metabolic Support': '#059669',
  'Amino Acids': '#7c3aed',
  'Energy & Performance': '#d97706',
  'Sports Nutrition': '#0284c7',
  'Gut Health': '#16a34a',
  'Liver Health': '#b45309',
  'Bone Health': '#0891b2',
  'Baby Nutrition': '#c026d3',
  'Stress & Sleep': '#6366f1',
  'Immune Support': '#0d9488',
  'Brain Health': '#8b5cf6',
  'Hormonal Health': '#ec4899',
  'Skin & Antioxidant Care': '#e11d48',
};

const DualPackCardImage = ({ product }) => {
  const [showA, setShowA] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => setShowA(prev => !prev), 2400);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="prod-card__dual-wrap">
      <img src={product.imageA} alt={product.name} className={`prod-card__dual-img${showA ? ' visible' : ''}`} />
      <img src={product.imageB} alt={product.name} className={`prod-card__dual-img${!showA ? ' visible' : ''}`} />
      <div className="prod-card__dual-dots">
        <span className={`prod-card__dual-dot${showA ? ' active' : ''}`} />
        <span className={`prod-card__dual-dot${!showA ? ' active' : ''}`} />
      </div>
    </div>
  );
};

const DualPackPanelImage = ({ product }) => {
  const [showA, setShowA] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => setShowA(prev => !prev), 2400);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="prod-panel__dual-wrap">
      <div className="prod-panel__dual-img-area">
        <img src={product.imageA} alt={product.name} className={`prod-panel__dual-img${showA ? ' visible' : ''}`} />
        <img src={product.imageB} alt={product.name} className={`prod-panel__dual-img${!showA ? ' visible' : ''}`} />
      </div>
      <div className="prod-panel__dual-toggle">
        <button className={`dual-dot-btn${showA ? ' active' : ''}`} onClick={() => setShowA(true)} aria-label="Show variant 1" />
        <button className={`dual-dot-btn${!showA ? ' active' : ''}`} onClick={() => setShowA(false)} aria-label="Show variant 2" />
      </div>
    </div>
  );
};

const ProductsPage = () => {
  const [active, setActive] = useState(null);
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState('All');

  const [search, setSearch] = useState('');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const filtered = products.filter(p => {
    const matchesCategory = filter === 'All' || p.category === filter;
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      p.name.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.cardLine && p.cardLine.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const openProduct = (product) => {
    setActive(product);
    setTimeout(() => setVisible(true), 10);
    document.body.style.overflow = 'hidden';
  };

  const closeProduct = () => {
    setVisible(false);
    setTimeout(() => {
      setActive(null);
      document.body.style.overflow = '';
    }, 320);
  };

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') closeProduct(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="prod-pg">
      <section className="prod-hero">
        <video
          className="prod-hero__video"
          autoPlay
          muted
          loop
          playsInline
          src={heroBg}
        />
        <div className="prod-hero__overlay" />
        <div className="prod-hero__content">
          <span className="prod-eyebrow">OUR RANGE</span>
          <h1 className="prod-hero__heading">
            Every Formula. <br /><em>Every Life Stage.</em>
          </h1>
          <p className="prod-hero__sub">
            27 clinically designed formulations — each developed to fill a real nutritional gap, not a market trend.
          </p>
        </div>
      </section>

      <div className="prod-filters">
        <div className="prod-filters__inner">
          <div className="prod-search-wrap">
            <svg className="prod-search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 3a6 6 0 100 12A6 6 0 009 3zM1 9a8 8 0 1114.32 4.906l3.387 3.387a1 1 0 01-1.414 1.414l-3.387-3.387A8 8 0 011 9z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              className="prod-search-input"
              placeholder="Search products…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="prod-search-clear" onClick={() => setSearch('')} aria-label="Clear search">✕</button>
            )}
          </div>
          <div className="prod-filters__chips">
            {categories.map(cat => (
              <button
                key={cat}
                className={`prod-filter-btn${filter === cat ? ' active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="prod-grid-wrap">
        {filtered.length === 0 ? (
          <div className="prod-empty">
            <span className="prod-empty__icon">🔍</span>
            <p className="prod-empty__text">No products match "<strong>{search}</strong>"</p>
            <button className="prod-empty__reset" onClick={() => { setSearch(''); setFilter('All'); }}>Clear search</button>
          </div>
        ) : (
        <div className="prod-grid">
          {filtered.map((product, i) => (
            <div
              className={`prod-card${product.cardVariant ? ` prod-card--${product.cardVariant}` : ''}`}
              key={product.id}
              onClick={() => openProduct(product)}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {product.badge && (
                <span className="prod-card__badge">{product.badge}</span>
              )}
              <div className="prod-card__img-wrap">
                {product.isDualPack ? (
                  <DualPackCardImage product={product} />
                ) : product.image ? (
                  <div className="prod-card__svg-wrap">
                    <img src={product.image} alt={product.name} className="prod-card__img--svg" />
                  </div>
                ) : null}
              </div>
              <div className="prod-card__body">
                <span
                  className="prod-card__cat"
                  style={{ color: categoryColors[product.category] || '#7c3aed' }}
                >
                  {product.category}
                </span>
                <h3 className="prod-card__name">{product.name}</h3>
                <p className="prod-card__one-line">{product.cardLine}</p>
                <div className="prod-card__footer">
                  <span className="prod-card__form"><FaLeaf /> {product.form}</span>
                  <span className="prod-card__cta">View →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </section>

      {active && (
        <div className={`prod-modal-backdrop${visible ? ' open' : ''}`} onClick={closeProduct}>
          <div className={`prod-modal${visible ? ' open' : ''}`} onClick={e => e.stopPropagation()}>

            <div className="prod-modal__left">
              {active.isDualPack ? (
                <DualPackPanelImage product={active} />
              ) : active.image ? (
                <div className="prod-panel__svg-wrap">
                  <img src={active.image} alt={active.name} className="prod-panel__img-svg" />
                </div>
              ) : null}
              <div className="prod-panel__left-text">
                <span className="prod-panel__cat">{active.category}</span>
                <h2 className="prod-panel__name">{active.name}</h2>
                <p className="prod-panel__tagline">{active.tagline}</p>
              </div>
            </div>

            <div className="prod-modal__right">
              <button className="prod-panel__close" onClick={closeProduct} aria-label="Close">
                <FaTimes />
              </button>
              <div className="prod-panel__scroll">
                {active.badge && <span className="prod-panel__badge">{active.badge}</span>}
                <p className="prod-panel__desc">{active.description}</p>

                <div className="prod-panel__section">
                  <h4 className="prod-panel__section-title"><FaCheckCircle /> Key Benefits</h4>
                  <ul className="prod-panel__benefits">
                    {active.benefits.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>

                {active.ingredients && active.ingredients.length > 0 && (
                  <div className="prod-panel__section">
                    <h4 className="prod-panel__section-title"><FaAtom /> Ingredients / Formulation</h4>
                    <table className="prod-panel__ing-table">
                      <thead>
                        <tr>
                          <th>Ingredient</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {active.ingredients.map((ing, i) => (
                          <tr key={i}>
                            <td>{ing.name}</td>
                            <td>{ing.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="prod-panel__meta-row">
                  <div className="prod-panel__meta-item">
                    <span className="prod-panel__meta-label"><FaFlask /> Dosage</span>
                    <span className="prod-panel__meta-val">{active.dosage}</span>
                  </div>
                  <div className="prod-panel__meta-item">
                    <span className="prod-panel__meta-label"><FaShieldAlt /> Format</span>
                    <span className="prod-panel__meta-val">{active.form}</span>
                  </div>
                </div>
                <div className="prod-panel__trust">
                  <span>✓ GMP Certified</span>
                  <span>✓ Third-Party Tested</span>
                  <span>✓ No Artificial Fillers</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ProductsPage;