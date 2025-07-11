import { ThreeDimensionalModel } from './types';

export const DefaultThreeDimensionalModel: ThreeDimensionalModel = {
  label: 'Benchy',
  file: 'benchy',
  urls: [
    {
      url: 'https://www.3dbenchy.com/about/',
      label: 'www.3dbenchy.com',
      description: 'The home page for benchy!',
    },
  ],
  rotation: { x: -90, y: 0, z: 0 }, // Default rotation values
};

export const modelData: ThreeDimensionalModel[] = [
  DefaultThreeDimensionalModel,
  {
    label: 'TAG Graded Card Stand',
    file: 'tag-graded-card-holder',
    numberOfPhotos: 2,
    urls: [
      {
        url: 'https://cad.onshape.com/documents/a40a6674b4066734936b17d0/w/122311ecbcadd44915ea1830/e/7a5ea9d34e1a60f42379e970?renderMode=0&uiState=68451d1a2185da1fe3f3daf6',
        label: 'OnShape',
        description: 'View the CAD file',
      },
      {
        url: 'https://my.taggrading.com/card/Q7032613',
        label: 'Mint 10 Snorlax',
        description: 'See the grade details!',
      },
    ],
    rotation: { x: -90, y: 0, z: 0 }, // Default rotation values
  },
  {
    label: 'MacBook Pro Cable Holder',
    file: 'macbook-cable-holder',
    numberOfPhotos: 4,
    urls: [
      {
        url: 'https://cad.onshape.com/documents/db9752962b3e6c6fcb5759e8/w/0df4c88664c67aac8d8fa61f/e/3b6d5131e7c2100055bd242a',
        label: 'OnShape',
        description: 'View the CAD file',
      },
      {
        url: 'https://en.wikipedia.org/wiki/MacBook_Pro_(Apple_silicon)#Technical_specifications_2',
        label: 'Macbook Pro Technical Specs',
      },
    ],
  },
  {
    label: 'Ceramics Stamp',
    file: 'ceramics-stamp',
    numberOfPhotos: 0,
    urls: [
      {
        url: 'https://cad.onshape.com/documents/3ea4a1be4b6595ed20435a03/w/e0bf52dc51a2830b8409992e/e/49a919ef0779289b7008eb7a?renderMode=0&uiState=687075e15838dc772d213d86',
        label: 'OnShape',
        description: 'View the CAD file',
      },
    ],
    rotation: { x: 0, y: -180, z: 0 },
  },
  {
    label: 'Honeycomb Lamp',
    file: 'honeycomb-lamp',
    numberOfPhotos: 3,
    urls: [
      {
        url: 'https://cad.onshape.com/documents/bc576d8ebb6250084e0312f4/w/782304c94efb53f468da8de4/e/ab351bd39de305335975b117?renderMode=0&uiState=68707c859293c94e944be1d5',
        label: 'OnShape',
        description: 'View the CAD assembly',
      },
      {
        url: 'https://www.thingiverse.com/thing:4807723',
        label: 'Original Lamp',
        description: 'By Bemko on Thingiverse',
      },
      {
        url: 'https://www.amazon.com/dp/B08DXL1DZ3?ref_=ppx_hzsearch_conn_dt_b_fed_asin_title_7&th=1',
        label: 'Hanging Lantern Cords',
        description: 'Found on Amazon',
      },
    ],
    rotation: { x: -90, y: 0, z: 0 },
  },
];
