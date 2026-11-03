import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, HelpCircle, CheckCircle, XCircle, RotateCcw, ArrowRight, Award } from 'lucide-react';
import { CountryCode, QuizQuestion } from '../../types';
import { SUPPORTED_COUNTRIES } from '../../core/country-registry';

export const QUIZ_QUESTIONS_BY_COUNTRY: Record<CountryCode, QuizQuestion[]> = {
  DE: [
    {
      id: 'de_q1',
      type: 'code_to_city',
      question: 'What district does the German license plate code "DAH" stand for?',
      options: [
        { label: 'Dachau (Bayern)', value: 'Dachau' },
        { label: 'Darmstadt (Hessen)', value: 'Darmstadt' },
        { label: 'Dahme-Spreewald (Brandenburg)', value: 'Dahme-Spreewald' },
        { label: 'Dahn (Rheinland-Pfalz)', value: 'Dahn' },
      ],
      correctAnswer: 'Dachau',
      explanation: '"DAH" is the official Unterscheidungszeichen for Landkreis Dachau in Upper Bavaria (Oberbayern). Darmstadt uses "DA".',
    },
    {
      id: 'de_q2',
      type: 'special_type',
      question: 'What does a German plate starting with "0 17-1" identify?',
      options: [
        { label: 'Official vehicle of the United States Ambassador', value: 'US_Ambassador' },
        { label: 'Federal Chancellor escort vehicle', value: 'Chancellor' },
        { label: 'NATO Supreme Allied Commander', value: 'NATO' },
        { label: 'Federal Constitutional Court President', value: 'Court' },
      ],
      correctAnswer: 'US_Ambassador',
      explanation: 'Plates starting with "0" are reserved for diplomatic missions. Country code "17" is assigned to the United States of America, and serial "1" indicates the Head of Mission (the Ambassador).',
    },
    {
      id: 'de_q3',
      type: 'special_type',
      question: 'Why was the distinctive "FE-Schrift" font specifically invented for German plates in 1995?',
      options: [
        { label: 'To make forgery virtually impossible (e.g. turning P into R or O into Q)', value: 'anti_forgery' },
        { label: 'To comply with French typography standards', value: 'french' },
        { label: 'To reduce stamping metal fatigue', value: 'metal' },
        { label: 'To save black paint during printing', value: 'paint' },
      ],
      correctAnswer: 'anti_forgery',
      explanation: 'FE stands for "Fälschungserschwerende Schrift" (forgery-hindering typeface). Its curves and gaps prevent altering letters with simple tape or black ink.',
    },
    {
      id: 'de_q4',
      type: 'special_type',
      question: 'Which military organization in Germany uses plates starting with the letter "Y"?',
      options: [
        { label: 'Bundeswehr (German Armed Forces)', value: 'Bundeswehr' },
        { label: 'Bavarian Border Police', value: 'Bavaria' },
        { label: 'Technisches Hilfswerk', value: 'THW' },
        { label: 'Federal Maritime Agency', value: 'Maritime' },
      ],
      correctAnswer: 'Bundeswehr',
      explanation: 'Bundeswehr military service vehicles uniquely use "Y-XXXXXX" plates and display the German national flag (Schwarz-Rot-Gold) rather than the EU blue strip.',
    },
    {
      id: 'de_q5',
      type: 'special_type',
      question: 'What does a yellow date block on the right edge of a German plate indicate?',
      options: [
        { label: 'Kurzzeitkennzeichen (5-day short-term transfer plate)', value: 'kurzzeit' },
        { label: 'Ausfuhrkennzeichen (export customs plate)', value: 'export' },
        { label: 'Electric vehicle charging priority', value: 'ev' },
        { label: 'Cabriolet seasonal registration', value: 'cabrio' },
      ],
      correctAnswer: 'kurzzeit',
      explanation: 'A yellow date band denotes a Kurzzeitkennzeichen, valid for max. 5 days for vehicle transfers and test drives. (Export plates use a red date band).',
    },
    {
      id: 'de_q6',
      type: 'special_type',
      question: 'What special privilege does an "H" suffix (Oldtimer) grant vehicles in Germany?',
      options: [
        { label: 'Permanent exemption from Low Emission Zones (Umweltzone) without green badge', value: 'umweltzone' },
        { label: 'Free motorway tolls across all Europe', value: 'toll' },
        { label: 'Unlimited speed on all municipal roads', value: 'speed' },
        { label: 'Free fuel tax refund', value: 'tax_free' },
      ],
      correctAnswer: 'umweltzone',
      explanation: 'Under § 23 StVZO, certified historic vehicles (H-Kennzeichen) can drive into all environmental low-emission zones without requiring a green emissions sticker.',
    },
    {
      id: 'de_q7',
      type: 'code_to_city',
      question: 'What does the historical district abbreviation "WAN" stand for?',
      options: [
        { label: 'Wanne-Eickel (Nordrhein-Westfalen)', value: 'Wanne-Eickel' },
        { label: 'Wangen im Allgäu (Baden-Württemberg)', value: 'Wangen' },
        { label: 'Wannsee (Berlin)', value: 'Wannsee' },
        { label: 'Wandlitz (Brandenburg)', value: 'Wandlitz' },
      ],
      correctAnswer: 'Wanne-Eickel',
      explanation: '"WAN" belonged to the former independent city of Wanne-Eickel and was enthusiastically re-introduced in 2012 following license plate liberalization!',
    },
    {
      id: 'de_q8',
      type: 'special_type',
      question: 'What is the maximum number of characters permitted on a standard German license plate?',
      options: [
        { label: '8 characters', value: '8' },
        { label: '7 characters', value: '7' },
        { label: '9 characters', value: '9' },
        { label: '10 characters', value: '10' },
      ],
      correctAnswer: '8',
      explanation: 'Under § 8 FZV, German plates are strictly limited to a maximum of 8 characters (including district, letters, digits, and suffix) to fit within standard 520mm dies.',
    },
    {
      id: 'de_q9',
      type: 'special_type',
      question: 'What do green numbers and letters on a German license plate indicate?',
      options: [
        { label: 'Exemption from German motor vehicle tax (KraftStG)', value: 'tax_exempt' },
        { label: 'Pure electric vehicle (zero emissions)', value: 'electric' },
        { label: 'Young driver under 21', value: 'young' },
        { label: 'Vehicle registered to the forestry department only', value: 'forestry' },
      ],
      correctAnswer: 'tax_exempt',
      explanation: 'Green plates (Grüne Kennzeichen) indicate tax-exempt status (§ 3 KraftStG), commonly granted to agricultural tractors, charities, and sports/boat trailers.',
    },
    {
      id: 'de_q10',
      type: 'special_type',
      question: 'Which of the following letter combinations is banned nationwide in Germany under § 8 Abs. 1 FZV?',
      options: [
        { label: 'HJ, KZ, NS, SA, and SS', value: 'nazi_symbols' },
        { label: 'BMW, AUDI, and VW', value: 'brands' },
        { label: 'USA, UK, and EU', value: 'countries' },
        { label: 'FBI, CIA, and BND', value: 'agencies' },
      ],
      correctAnswer: 'nazi_symbols',
      explanation: '§ 8 Abs. 1 FZV prohibits combinations violating public order or morality, strictly barring abbreviations of National Socialist organizations.',
    },
  ],

  US: [
    {
      id: 'us_q1',
      type: 'special_type',
      question: 'What does a blue license plate starting with the letter "D" indicate in the United States?',
      options: [
        { label: 'Diplomatic officer accredited by the U.S. Department of State (OFM)', value: 'diplomat' },
        { label: 'Department of Defense commercial contractor', value: 'dod' },
        { label: 'Disabled driver commercial vehicle', value: 'disabled' },
        { label: 'State driver license examiner', value: 'examiner' },
      ],
      correctAnswer: 'diplomat',
      explanation: 'In the U.S., diplomatic license plates are issued at the federal level by the Department of State Office of Foreign Missions (OFM). The "D" prefix identifies an accredited diplomat or ambassador.',
    },
    {
      id: 'us_q2',
      type: 'code_to_city',
      question: 'Which U.S. state features the official slogan "The Lone Star State" on its license plates?',
      options: [
        { label: 'Texas (TX)', value: 'TX' },
        { label: 'California (CA)', value: 'CA' },
        { label: 'Arizona (AZ)', value: 'AZ' },
        { label: 'New Mexico (NM)', value: 'NM' },
      ],
      correctAnswer: 'TX',
      explanation: 'Texas is officially known as "The Lone Star State", commemorating its historical struggle for independence and lone star flag.',
    },
    {
      id: 'us_q3',
      type: 'special_type',
      question: 'What does a license plate starting with "G" followed by 2 digits (e.g. "G12-3456") signify in the USA?',
      options: [
        { label: 'U.S. Federal Government civilian fleet vehicle (managed by GSA)', value: 'gsa' },
        { label: 'Municipal garbage collection utility truck', value: 'garbage' },
        { label: 'Georgia State Highway Patrol', value: 'georgia' },
        { label: 'Golf cart recreational vehicle', value: 'golf' },
      ],
      correctAnswer: 'gsa',
      explanation: '"G"-prefix plates are issued by the federal General Services Administration (GSA Fleet) for civilian U.S. government agency vehicles nationwide.',
    },
    {
      id: 'us_q4',
      type: 'special_type',
      question: 'What standard physical dimensions do North American motor vehicle license plates adhere to?',
      options: [
        { label: '12 inches by 6 inches (approx. 305 mm × 152 mm)', value: '12x6' },
        { label: '520 mm by 110 mm (European standard)', value: '520x110' },
        { label: '330 mm by 165 mm (Japanese standard)', value: '330x165' },
        { label: '14 inches by 7 inches', value: '14x7' },
      ],
      correctAnswer: '12x6',
      explanation: 'In 1956, the Automobile Manufacturers Association standardized North American license plates to 12 inches wide by 6 inches high (2:1 aspect ratio).',
    },
    {
      id: 'us_q5',
      type: 'code_to_city',
      question: 'Which state plate famously bears the slogan "The Golden State"?',
      options: [
        { label: 'California (CA)', value: 'CA' },
        { label: 'Nevada (NV)', value: 'NV' },
        { label: 'Florida (FL)', value: 'FL' },
        { label: 'Colorado (CO)', value: 'CO' },
      ],
      correctAnswer: 'CA',
      explanation: 'California has featured "The Golden State" or red cursive "California" atop its standard issue white reflective plates for decades.',
    },
    {
      id: 'us_q6',
      type: 'special_type',
      question: 'What is the primary function of the color-coded decals placed on the corners of U.S. plates?',
      options: [
        { label: 'Registration validation indicating the month and year of expiration', value: 'validation' },
        { label: 'Toll road electronic payment pass', value: 'toll' },
        { label: 'Fuel economy and carbon emissions tier', value: 'emissions' },
        { label: 'Vehicle insurance policy provider code', value: 'insurance' },
      ],
      correctAnswer: 'validation',
      explanation: 'Most U.S. states require vehicle owners to affix annual validation stickers in plate corners so law enforcement can visually confirm registration currency at a glance.',
    },
  ],

  JP: [
    {
      id: 'jp_q1',
      type: 'special_type',
      question: 'What does a yellow license plate with black lettering indicate in Japan?',
      options: [
        { label: 'Kei car (Keijidōsha) light mini-vehicle (engine ≤ 660cc)', value: 'kei' },
        { label: 'Commercial passenger taxi', value: 'taxi' },
        { label: 'Foreign diplomatic corps vehicle', value: 'diplomat' },
        { label: 'Zero-emission electric vehicle', value: 'ev' },
      ],
      correctAnswer: 'kei',
      explanation: 'Kei cars (light vehicles under 660cc engine displacement) carry distinctive yellow plates with black text for private owners in Japan.',
    },
    {
      id: 'jp_q2',
      type: 'special_type',
      question: 'What is the stamped circular aluminum cap affixed over the top-left bolt of rear Japanese plates?',
      options: [
        { label: 'Fuin (封印) — official government tamper-evident prefecture seal', value: 'fuin' },
        { label: 'Automated ETC toll road transponder', value: 'etc' },
        { label: 'Anti-theft GPS tracking beacon', value: 'gps' },
        { label: 'Rearview backup camera mount', value: 'camera' },
      ],
      correctAnswer: 'fuin',
      explanation: 'The Fuin (封印) is an official prefecture-embossed aluminum seal clamped over the left bolt of rear plates by transport ministry inspectors to legally prevent unauthorized plate removal.',
    },
    {
      id: 'jp_q3',
      type: 'code_to_city',
      question: 'In the Japanese plate "品川 300 さ 12-34", what does "品川" (Shinagawa) identify?',
      options: [
        { label: 'The Land Transport Branch Office where the car is registered (Tokyo)', value: 'office' },
        { label: 'The vehicle manufacturer headquarters', value: 'maker' },
        { label: 'The color of the vehicle', value: 'color' },
        { label: 'The owner\'s registered surname', value: 'surname' },
      ],
      correctAnswer: 'office',
      explanation: 'The Kanji in the top row identifies the Land Transport Branch Office (un\'yu-shikyoku). Shinagawa is one of Tokyo\'s most prestigious registration districts.',
    },
    {
      id: 'jp_q4',
      type: 'special_type',
      question: 'What does a blue Japanese plate with white characters and the Kanji "外" (Gai) represent?',
      options: [
        { label: 'Foreign Diplomatic Mission (Gaikō)', value: 'diplomat' },
        { label: 'Foreign tourist rental vehicle', value: 'rental' },
        { label: 'Temporary customs export transit', value: 'export' },
        { label: 'Emergency rescue medical response', value: 'rescue' },
      ],
      correctAnswer: 'diplomat',
      explanation: '"外" (abbreviation for 外交 Gaikō) denotes foreign embassies and diplomatic missions accredited to Japan.',
    },
    {
      id: 'jp_q5',
      type: 'special_type',
      question: 'What vehicle category is designated by 3-digit class codes starting with "3" (e.g. 300, 330)?',
      options: [
        { label: 'Standard passenger cars over 2,000cc or exceeding compact size limits', value: 'large_car' },
        { label: 'Kei mini-vehicles under 660cc', value: 'kei' },
        { label: 'Commercial freight trucks over 5 tons', value: 'truck' },
        { label: 'Two-wheeled motorized scooters', value: 'bike' },
      ],
      correctAnswer: 'large_car',
      explanation: 'In Japan, class numbers starting with 3 designate regular passenger cars larger than 2.0L displacement or exceeding compact dimensions (length > 4.7m, width > 1.7m). 5-series denotes compact cars.',
    },
    {
      id: 'jp_q6',
      type: 'special_type',
      question: 'What do green Japanese plates with white lettering designate?',
      options: [
        { label: 'Commercial transport vehicles (taxis, public buses, freight trucks)', value: 'commercial' },
        { label: 'Eco-friendly hybrid and electric cars', value: 'eco' },
        { label: 'Agricultural tractors and forest harvesters', value: 'tractor' },
        { label: 'Imperial household agency fleet', value: 'imperial' },
      ],
      correctAnswer: 'commercial',
      explanation: 'Green background with white lettering signifies commercial transport operations (Jidōsha Unsō Jigyō) such as taxis, highway buses, and commercial haulage.',
    },
  ],

  TH: [
    {
      id: 'th_q1',
      type: 'special_type',
      question: 'What does a bright red license plate with black lettering (ป้ายแดง - Pai Daeng) indicate in Thailand?',
      options: [
        { label: 'Temporary registration tag for new cars pending permanent plates', value: 'temp' },
        { label: 'Emergency hospital ambulance vehicle', value: 'ambulance' },
        { label: 'Royal court official convoy', value: 'royal' },
        { label: 'Heavy construction bulldozer', value: 'bulldozer' },
      ],
      correctAnswer: 'temp',
      explanation: 'Red plates ("ป้ายแดง") are temporary dealer plates issued under DLT rules for brand new vehicles while permanent white plates are being processed.',
    },
    {
      id: 'th_q2',
      type: 'special_type',
      question: 'On Thai license plates, what does green lettering on a white plate designate?',
      options: [
        { label: 'Private pickup trucks and utility haulers (2-door / cab)', value: 'pickup' },
        { label: 'Zero-emission electric vehicles', value: 'ev' },
        { label: 'Diplomatic embassy staff', value: 'diplomat' },
        { label: 'Agricultural harvesting tractors', value: 'tractor' },
      ],
      correctAnswer: 'pickup',
      explanation: 'In Thailand, white plates with green lettering are reserved specifically for private light commercial pickups and utility trucks.',
    },
    {
      id: 'th_q3',
      type: 'special_type',
      question: 'Where is the province name displayed on a standard Thai license plate?',
      options: [
        { label: 'In full Thai script centered across the bottom line', value: 'bottom' },
        { label: 'In 3-letter English acronyms on the left', value: 'left' },
        { label: 'In the top right corner', value: 'corner' },
        { label: 'Thai plates do not show the province', value: 'none' },
      ],
      correctAnswer: 'bottom',
      explanation: 'Standard Thai plates display the full Thai name of the issuing province (e.g. กรุงเทพมหานคร for Bangkok, เชียงใหม่ for Chiang Mai) across the bottom row.',
    },
    {
      id: 'th_q4',
      type: 'special_type',
      question: 'Which government department oversees vehicle registrations and license plates in Thailand?',
      options: [
        { label: 'Department of Land Transport (DLT - กรมการขนส่งทางบก)', value: 'dlt' },
        { label: 'Royal Thai Police Highway Division', value: 'police' },
        { label: 'Tourism Authority of Thailand', value: 'tat' },
        { label: 'Ministry of Digital Economy', value: 'mde' },
      ],
      correctAnswer: 'dlt',
      explanation: 'The Department of Land Transport (DLT) under the Ministry of Transport regulates, produces, and issues all Thai motor vehicle license plates.',
    },
    {
      id: 'th_q5',
      type: 'special_type',
      question: 'What plate color scheme is designated for public metered passenger taxis in Thailand?',
      options: [
        { label: 'Yellow background with black lettering', value: 'taxi_yellow' },
        { label: 'Blue background with white lettering', value: 'blue' },
        { label: 'Pink background with green lettering', value: 'pink' },
        { label: 'White background with red lettering', value: 'white_red' },
      ],
      correctAnswer: 'taxi_yellow',
      explanation: 'Under Thai DLT regulations, commercial public passenger vehicles including Bangkok\'s famous metered taxis carry yellow plates with black lettering.',
    },
  ],

  VN: [
    {
      id: 'vn_q1',
      type: 'special_type',
      question: 'What does a blue license plate with white lettering (e.g. "80A-001.01") indicate in Vietnam?',
      options: [
        { label: 'Central government ministries, state administration, and police agencies', value: 'gov' },
        { label: 'Commercial intercity bus', value: 'bus' },
        { label: 'Foreign tourist temporary vehicle', value: 'tourist' },
        { label: 'Pure electric motorcycle', value: 'moto' },
      ],
      correctAnswer: 'gov',
      explanation: 'Under MPS Circular 24/2023, blue plates with white text designate state administrative agencies, central government ministries, and the police force. "80" is the central government code.',
    },
    {
      id: 'vn_q2',
      type: 'code_to_city',
      question: 'Which series of 2-digit codes identifies vehicle registrations in Hà Nội?',
      options: [
        { label: '29, 30, 31, 32, 33, and 40', value: 'hanoi' },
        { label: '50, 51, 52, 53, 54, and 59', value: 'hcmc' },
        { label: '43', value: 'danang' },
        { label: '15 and 16', value: 'haiphong' },
      ],
      correctAnswer: 'hanoi',
      explanation: 'Hà Nội is allocated province registration codes 29 through 33, plus 40. (Codes 50-59 belong to Ho Chi Minh City).',
    },
    {
      id: 'vn_q3',
      type: 'special_type',
      question: 'What does a crimson red plate with white characters (e.g. "QA-12-34") represent in Vietnam?',
      options: [
        { label: 'Vietnam People’s Army (Quân đội Nhân dân Việt Nam)', value: 'army' },
        { label: 'Fire rescue service', value: 'fire' },
        { label: 'Border customs inspection', value: 'customs' },
        { label: 'Hospital intensive care ambulance', value: 'ambulance' },
      ],
      correctAnswer: 'army',
      explanation: 'Red background license plates with two prefix letters (like QA, TC, TH) are exclusively designated for the Vietnam People\'s Army military vehicles.',
    },
    {
      id: 'vn_q4',
      type: 'special_type',
      question: 'What color license plate must be used by commercial transport businesses (taxis, Grab, trucks) in Vietnam?',
      options: [
        { label: 'Yellow background with black lettering', value: 'commercial_yellow' },
        { label: 'White background with green lettering', value: 'green' },
        { label: 'Black background with gold lettering', value: 'gold' },
        { label: 'Orange background with black lettering', value: 'orange' },
      ],
      correctAnswer: 'commercial_yellow',
      explanation: 'Mandated by Circular 58/2020, all commercial transport, logistics, and ride-hailing vehicles in Vietnam must mount yellow plates with black characters.',
    },
    {
      id: 'vn_q5',
      type: 'special_type',
      question: 'Under Circular 24/2023, what is the revolutionary "Biển số định danh" reform in Vietnam?',
      options: [
        { label: 'License plate numbers are permanently linked to the citizen’s National ID rather than the car', value: 'id_linked' },
        { label: 'License plates expire every 6 months', value: 'expire' },
        { label: 'Every plate must display the driver\'s blood type', value: 'blood' },
        { label: 'Plates are printed on biodegradable wood', value: 'wood' },
      ],
      correctAnswer: 'id_linked',
      explanation: 'Circular 24 introduced "Biển số định danh", meaning license plates are registered to and retained by the individual owner\'s personal identity code for life.',
    },
  ],

  AU: [
    {
      id: 'au_q1',
      type: 'code_to_city',
      question: 'What is the official state text embossed on standard New South Wales (NSW) yellow plates?',
      options: [
        { label: 'NEW SOUTH WALES', value: 'nsw' },
        { label: 'THE EDUCATION STATE', value: 'vic' },
        { label: 'SUNSHINE STATE', value: 'qld' },
        { label: 'FESTIVAL STATE', value: 'sa' },
      ],
      correctAnswer: 'nsw',
      explanation: 'Standard NSW passenger plates feature black lettering on yellow reflective metal with "NEW SOUTH WALES" along the bottom.',
    },
    {
      id: 'au_q2',
      type: 'code_to_city',
      question: 'Which Australian state license plate features the slogan "THE EDUCATION STATE" with dark blue lettering?',
      options: [
        { label: 'Victoria (VIC)', value: 'VIC' },
        { label: 'New South Wales (NSW)', value: 'NSW' },
        { label: 'Queensland (QLD)', value: 'QLD' },
        { label: 'Tasmania (TAS)', value: 'TAS' },
      ],
      correctAnswer: 'VIC',
      explanation: 'Victoria plates proudly carry "VIC - THE EDUCATION STATE" (succeeding the famous "Garden State" and "On the Move" slogans).',
    },
    {
      id: 'au_q3',
      type: 'code_to_city',
      question: 'Which Australian state issues plates with distinctive maroon lettering and "SUNSHINE STATE"?',
      options: [
        { label: 'Queensland (QLD)', value: 'QLD' },
        { label: 'Western Australia (WA)', value: 'WA' },
        { label: 'South Australia (SA)', value: 'SA' },
        { label: 'Northern Territory (NT)', value: 'NT' },
      ],
      correctAnswer: 'QLD',
      explanation: 'Queensland plates are recognizable nationwide by their state color maroon text and the official "QUEENSLAND - SUNSHINE STATE" motto.',
    },
    {
      id: 'au_q4',
      type: 'special_type',
      question: 'Are Australian motor vehicle registrations managed federally or by individual states/territories?',
      options: [
        { label: 'Independently by each state/territory road authority (e.g. Transport for NSW, VicRoads, TMR)', value: 'state' },
        { label: 'By a central federal agency located in Canberra', value: 'federal' },
        { label: 'By the Australian Federal Police (AFP)', value: 'afp' },
        { label: 'By individual local municipal city councils', value: 'council' },
      ],
      correctAnswer: 'state',
      explanation: 'Vehicle licensing and plate issuance in Australia are strictly governed by state and territory transport authorities.',
    },
    {
      id: 'au_q5',
      type: 'code_to_city',
      question: 'What slogan is featured on standard Western Australia (WA) license plates?',
      options: [
        { label: 'THE WILDFLOWER STATE', value: 'wildflower' },
        { label: 'FIRST STATE', value: 'first' },
        { label: 'FESTIVAL STATE', value: 'festival' },
        { label: 'HEART OF THE NATION', value: 'heart' },
      ],
      correctAnswer: 'wildflower',
      explanation: 'Western Australia vehicle plates often carry the iconic state slogan "WA - THE WILDFLOWER STATE".',
    },
  ],

  NZ: [
    {
      id: 'nz_q1',
      type: 'special_type',
      question: 'What is the current standard private passenger vehicle format in New Zealand?',
      options: [
        { label: '3 letters followed by 3 numbers (e.g. ABC 123)', value: '3x3' },
        { label: '2 letters followed by 4 numbers (e.g. AA 1234)', value: '2x4' },
        { label: '1 number followed by 3 letters', value: '1x3' },
        { label: '6 sequential numbers', value: '6num' },
      ],
      correctAnswer: '3x3',
      explanation: 'In 2001, New Zealand transitioned to the 3-letter + 3-digit series (ABC 123) after exhausting combinations of the previous 2-letter format.',
    },
    {
      id: 'nz_q2',
      type: 'special_type',
      question: 'What makes custom "KiwiPlates" in New Zealand unique compared to most other countries?',
      options: [
        { label: 'They are legally recognized private property assets that can be traded or inherited independently of any car', value: 'asset' },
        { label: 'They expire after exactly 12 months', value: 'expire' },
        { label: 'They can only contain numbers, never letters', value: 'only_num' },
        { label: 'They must be surrendered upon moving to a different city', value: 'surrender' },
      ],
      correctAnswer: 'asset',
      explanation: 'In New Zealand, personalised plate combinations (KiwiPlates) carry exclusive property rights and can be held, sold, or gifted as investments.',
    },
    {
      id: 'nz_q3',
      type: 'special_type',
      question: 'What was New Zealand’s legacy vehicle registration format used between 1964 and 2001?',
      options: [
        { label: '2 letters followed by 4 digits (e.g. AA 1234)', value: 'legacy_2x4' },
        { label: '5 numbers followed by 1 letter', value: '5x1' },
        { label: '3 letters followed by 2 numbers', value: '3x2' },
        { label: '4 letters followed by 2 numbers', value: '4x2' },
      ],
      correctAnswer: 'legacy_2x4',
      explanation: 'For nearly four decades from 1964 until 2001, NZ standard plates consisted of two letters followed by up to four numbers (AA 1000 - ZZ 9999).',
    },
    {
      id: 'nz_q4',
      type: 'special_type',
      question: 'Which government crown entity regulates land transport and vehicle licensing in New Zealand?',
      options: [
        { label: 'Waka Kotahi (NZ Transport Agency)', value: 'waka_kotahi' },
        { label: 'New Zealand Police Department', value: 'police' },
        { label: 'Ministry for Primary Industries', value: 'mpi' },
        { label: 'Department of Internal Affairs', value: 'dia' },
      ],
      correctAnswer: 'waka_kotahi',
      explanation: 'Waka Kotahi (the New Zealand Transport Agency) manages vehicle registration, road safety, and licensing nationwide.',
    },
    {
      id: 'nz_q5',
      type: 'special_type',
      question: 'What color scheme is standard for private vehicle license plates in New Zealand?',
      options: [
        { label: 'White reflective background with black embossed characters', value: 'white_black' },
        { label: 'Yellow background with green characters', value: 'yellow_green' },
        { label: 'Black background with silver characters only', value: 'black_silver' },
        { label: 'Blue background with white characters', value: 'blue_white' },
      ],
      correctAnswer: 'white_black',
      explanation: 'Standard New Zealand plates use black embossed alphanumeric characters on a white reflective aluminum background.',
    },
  ],

  AT: [
    {
      id: 'at_q1',
      type: 'code_to_city',
      question: 'What does the single-letter district code "W" stand for on an Austrian license plate?',
      options: [
        { label: 'Wien (Vienna)', value: 'Wien' },
        { label: 'Wels', value: 'Wels' },
        { label: 'Wiener Neustadt', value: 'WN' },
        { label: 'Wolfsberg', value: 'Wolfsberg' },
      ],
      correctAnswer: 'Wien',
      explanation: '"W" is the official district code for the Austrian federal capital of Wien (Vienna). Wels uses "WE" and Wiener Neustadt uses "WN".',
    },
    {
      id: 'at_q2',
      type: 'special_type',
      question: 'What distinctive feature do Austrian electric vehicle (EV) plates have?',
      options: [
        { label: 'Green lettering instead of black font (granting IG-L speed limit exemptions)', value: 'green_font' },
        { label: 'A blue electrical plug symbol on the right', value: 'plug' },
        { label: 'Yellow reflective background', value: 'yellow' },
        { label: 'Red borders surrounding the plate', value: 'red_border' },
      ],
      correctAnswer: 'green_font',
      explanation: 'In Austria, electric vehicles receive license plates printed in green lettering, exempting them from IG-L environmental speed restrictions on motorways.',
    },
    {
      id: 'at_q3',
      type: 'special_type',
      question: 'What is positioned centrally on Austrian plates between the district code and serial characters?',
      options: [
        { label: 'The official coat of arms of the respective Austrian Federal State (Bundesland)', value: 'coat_of_arms' },
        { label: 'The circular European Union stars only', value: 'eu' },
        { label: 'The national Austrian flag', value: 'flag' },
        { label: 'The municipal mayor’s seal', value: 'seal' },
      ],
      correctAnswer: 'coat_of_arms',
      explanation: 'Austrian plates feature the colorful coat of arms (Landeswappen) of the vehicle’s registered federal state centered between the district code and serial numbers.',
    },
    {
      id: 'at_q4',
      type: 'special_type',
      question: 'What does the prefix "BP" indicate on an Austrian license plate?',
      options: [
        { label: 'Bundespolizei (Federal Police)', value: 'police' },
        { label: 'Bregenz Post Office', value: 'bregenz' },
        { label: 'Federal President vehicle', value: 'president' },
        { label: 'Public bus transit', value: 'bus' },
      ],
      correctAnswer: 'police',
      explanation: '"BP" stands for Bundespolizei (Austrian Federal Police) operational fleet vehicles nationwide.',
    },
    {
      id: 'at_q5',
      type: 'special_type',
      question: 'What does the prefix "BH" indicate on an Austrian license plate?',
      options: [
        { label: 'Bundesheer (Austrian Armed Forces)', value: 'military' },
        { label: 'Baden District Administration', value: 'baden' },
        { label: 'Federal Chancellery', value: 'chancellery' },
        { label: 'Mountain rescue service', value: 'rescue' },
      ],
      correctAnswer: 'military',
      explanation: '"BH" stands for Österreichisches Bundesheer (Austrian Federal Armed Forces).',
    },
  ],

  CH: [
    {
      id: 'ch_q1',
      type: 'special_type',
      question: 'Which two official emblems are displayed on every Swiss rear license plate?',
      options: [
        { label: 'The Swiss Confederation cross shield on the left, and the cantonal coat of arms on the right', value: 'swiss_canton' },
        { label: 'Two European Union star circles', value: 'eu' },
        { label: 'The canton crest on both the left and right', value: 'canton_both' },
        { label: 'The Swiss flag on both ends', value: 'flag_both' },
      ],
      correctAnswer: 'swiss_canton',
      explanation: 'Swiss rear plates display the Swiss national cross on the left and the specific Canton\'s coat of arms on the right.',
    },
    {
      id: 'ch_q2',
      type: 'special_type',
      question: 'What does the Swiss "Wechselschild" system allow registered owners to do?',
      options: [
        { label: 'Use one single set of license plates interchangeably between two vehicles of the same owner', value: 'wechselschild' },
        { label: 'Switch plate colors according to the driving season', value: 'color' },
        { label: 'Change registration numbers every calendar year', value: 'annual' },
        { label: 'Drive without vehicle insurance during holidays', value: 'no_insurance' },
      ],
      correctAnswer: 'wechselschild',
      explanation: 'Switzerland\'s Wechselschild allows a registered owner to share one pair of plates between two vehicles (e.g. a summer convertible and a winter SUV).',
    },
    {
      id: 'ch_q3',
      type: 'special_type',
      question: 'What letter prefix is used for Swiss Armed Forces military vehicles?',
      options: [
        { label: 'M (Militär)', value: 'M' },
        { label: 'CH', value: 'CH' },
        { label: 'A', value: 'A' },
        { label: 'S', value: 'S' },
      ],
      correctAnswer: 'M',
      explanation: 'Swiss military vehicles are registered with the prefix "M" (Militär) accompanied by the Swiss national cross shield.',
    },
    {
      id: 'ch_q4',
      type: 'code_to_city',
      question: 'What are the cantonal 2-letter codes for Zürich and Geneva?',
      options: [
        { label: 'ZH (Zürich) and GE (Geneva)', value: 'zh_ge' },
        { label: 'ZU and GN', value: 'zu_gn' },
        { label: 'ZR and GV', value: 'zr_gv' },
        { label: 'ZC and GE', value: 'zc_ge' },
      ],
      correctAnswer: 'zh_ge',
      explanation: '"ZH" is the canton code for Zürich and "GE" is the canton code for Geneva (Genève).',
    },
    {
      id: 'ch_q5',
      type: 'special_type',
      question: 'In Switzerland, are standard vehicle license plates assigned to the vehicle or to the owner?',
      options: [
        { label: 'To the registered owner (the plates stay with the person when selling the car)', value: 'owner' },
        { label: 'To the vehicle chassis permanently', value: 'vehicle' },
        { label: 'To the insurance company', value: 'insurance' },
        { label: 'To the dealership', value: 'dealer' },
      ],
      correctAnswer: 'owner',
      explanation: 'In Switzerland, license plates belong to the registered owner, not the car. When changing cars, the owner moves their existing plates to the new vehicle.',
    },
  ],
};

interface PlateQuizProps {
  country?: CountryCode;
  onCountryChange?: (country: CountryCode) => void;
}

export const PlateQuiz: React.FC<PlateQuizProps> = ({ country = 'DE', onCountryChange }) => {
  const activeCountryInfo = SUPPORTED_COUNTRIES.find((c) => c.id === country) || SUPPORTED_COUNTRIES[0];
  const questions = QUIZ_QUESTIONS_BY_COUNTRY[country] || QUIZ_QUESTIONS_BY_COUNTRY.DE;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Reset quiz when country changes
  useEffect(() => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizCompleted(false);
  }, [country]);

  const currentQ = questions[currentIdx] || questions[0];

  const handleSelectOption = (value: string) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(value);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    if (selectedAnswer === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizCompleted(true);
      if (score >= Math.ceil(questions.length * 0.7)) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Quiz Card Header & Country Switcher */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 md:p-8 backdrop-blur shadow-xl">
        {/* Country Selector Pills */}
        {onCountryChange && (
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-slate-700/60 scrollbar-thin">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Quiz Country:
            </span>
            {SUPPORTED_COUNTRIES.map((c) => (
              <button
                key={c.id}
                onClick={() => onCountryChange(c.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                  country === c.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        )}

        {!quizCompleted ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-bold text-blue-400 tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                {activeCountryInfo.flag} {activeCountryInfo.name} — Question {currentIdx + 1} of {questions.length}
              </span>
              <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-700">
                Score: <strong className="text-white">{score}</strong> / {questions.length}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6 leading-snug">
              {currentQ.question}
            </h3>

            {/* Options list */}
            <div className="space-y-3 mb-6">
              {currentQ.options.map((opt) => {
                const isSelected = selectedAnswer === opt.value;
                const isCorrect = opt.value === currentQ.correctAnswer;
                let btnStyle = 'border-slate-700 bg-slate-900/50 hover:bg-slate-700/40 text-slate-200';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-950/60 text-emerald-200 shadow-md shadow-emerald-900/20';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'border-rose-500 bg-rose-950/60 text-rose-200';
                  } else {
                    btnStyle = 'border-slate-800 bg-slate-900/30 text-slate-500 opacity-60';
                  }
                } else if (isSelected) {
                  btnStyle = 'border-blue-500 bg-blue-950/60 text-blue-100 shadow-md shadow-blue-900/20';
                }

                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelectOption(opt.value)}
                    disabled={isAnswerSubmitted}
                    className={`w-full text-left p-4 rounded-xl border-2 font-medium transition flex items-center justify-between text-sm md:text-base ${btnStyle}`}
                  >
                    <span>{opt.label}</span>
                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box on submit */}
            {isAnswerSubmitted && (
              <div
                className={`p-4 rounded-xl border mb-6 text-xs md:text-sm leading-relaxed ${
                  selectedAnswer === currentQ.correctAnswer
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                }`}
              >
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  {selectedAnswer === currentQ.correctAnswer ? 'Correct!' : 'Incorrect'}
                </div>
                <p>{currentQ.explanation}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-2">
              {!isAnswerSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition ${
                    selectedAnswer
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Confirm Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition flex items-center gap-2 shadow-lg"
                >
                  {currentIdx + 1 < questions.length ? 'Next Question' : 'View Results'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Results Screen */
          <div className="text-center py-6 space-y-6">
            <div className="w-20 h-20 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <Trophy className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-3xl font-extrabold text-white mb-2">Quiz Completed!</h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                {score >= Math.ceil(questions.length * 0.8)
                  ? `Outstanding! You have expert-level mastery of ${activeCountryInfo.name} license plates and regulations.`
                  : score >= Math.ceil(questions.length * 0.5)
                  ? `Great job! You know your way around ${activeCountryInfo.name} registration rules.`
                  : `Good effort! Review the PlateRadar Knowledge Hub to level up your ${activeCountryInfo.name} plate mastery.`}
              </p>
            </div>

            <div className="inline-block bg-slate-900 border border-slate-700 px-8 py-5 rounded-2xl">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1">Final Score</span>
              <div className="text-4xl md:text-5xl font-black text-blue-400 font-mono">
                {score} <span className="text-2xl text-slate-500">/ {questions.length}</span>
              </div>
            </div>

            <div>
              <button
                onClick={handleRestart}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition inline-flex items-center gap-2 shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                Try Quiz Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
