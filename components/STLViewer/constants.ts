import {ThreeDimensionalModel} from './types';

export const DefaultThreeDimensionalModel: ThreeDimensionalModel = {
  label: 'Benchy',
  file: 'benchy',
  urls: [{url: 'https://www.3dbenchy.com/about/', label: 'www.3dbenchy.com'}],
  rotation: {x: -90, y: 0, z: 0},  // Default rotation values
};

export const modelData: ThreeDimensionalModel[] = [
  DefaultThreeDimensionalModel, {
    label: 'TAG Graded Card Stand',
    file: 'tag-graded-card-holder',
    numberOfPhotos: 2,
    urls: [
      {
        url:
            'https://cad.onshape.com/documents/a40a6674b4066734936b17d0/w/122311ecbcadd44915ea1830/e/7a5ea9d34e1a60f42379e970?renderMode=0&uiState=68451d1a2185da1fe3f3daf6',
        label: 'OnShape CAD Model',
      },
      {
        url: 'https://my.taggrading.com/card/Q7032613',
        label: 'Mint 10 Snorlax',
      },
    ],
    rotation: {x: -90, y: 0, z: 0},  // Default rotation values
  },
  {
    label: 'MacBook Pro Cable Holder',
    file: 'macbook-cable-holder',
    numberOfPhotos: 4,
    urls: [
      {
        url:
            'https://cad.onshape.com/documents/db9752962b3e6c6fcb5759e8/w/0df4c88664c67aac8d8fa61f/e/3b6d5131e7c2100055bd242a',
        label: 'OnShape CAD Model',
      },
      {
        url:
            'https://en.wikipedia.org/wiki/MacBook_Pro_(Apple_silicon)#Technical_specifications_2',
        label: 'Technical Specs',
      },
    ],
  },
  // TODO: add more of my models
];