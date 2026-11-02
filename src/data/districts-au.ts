import { District } from '../types';

export const AUSTRALIAN_STATES: (District & { slogan: string; color: string; bg: string })[] = [
  { code: 'NSW', name: 'New South Wales', state: 'NSW', stateCode: 'nsw', fullName: 'State of New South Wales (Transport for NSW)', slogan: 'NEW SOUTH WALES', color: 'black', bg: 'yellow' },
  { code: 'VIC', name: 'Victoria', state: 'VIC', stateCode: 'vic', fullName: 'State of Victoria (VicRoads)', slogan: 'VICTORIA - THE EDUCATION STATE', color: 'blue', bg: 'white' },
  { code: 'QLD', name: 'Queensland', state: 'QLD', stateCode: 'qld', fullName: 'State of Queensland (Department of Transport and Main Roads)', slogan: 'QUEENSLAND - SUNSHINE STATE', color: 'red', bg: 'white' },
  { code: 'WA', name: 'Western Australia', state: 'WA', stateCode: 'wa', fullName: 'State of Western Australia (Department of Transport)', slogan: 'WESTERN AUSTRALIA', color: 'blue', bg: 'white' },
  { code: 'SA', name: 'South Australia', state: 'SA', stateCode: 'sa', fullName: 'State of South Australia (Service SA)', slogan: 'SOUTH AUSTRALIA', color: 'blue', bg: 'white' },
  { code: 'TAS', name: 'Tasmania', state: 'TAS', stateCode: 'tas', fullName: 'State of Tasmania (Transport Services)', slogan: 'TASMANIA - EXPLORE POSSIBILITIES', color: 'blue', bg: 'white' },
  { code: 'ACT', name: 'Australian Capital Territory', state: 'ACT', stateCode: 'act', fullName: 'Australian Capital Territory (Access Canberra)', slogan: 'CANBERRA - THE NATION\'S CAPITAL', color: 'blue', bg: 'white' },
  { code: 'NT', name: 'Northern Territory', state: 'NT', stateCode: 'nt', fullName: 'Northern Territory (Motor Vehicle Registry)', slogan: 'NT - OUTBACK AUSTRALIA', color: 'red', bg: 'white' },
];
