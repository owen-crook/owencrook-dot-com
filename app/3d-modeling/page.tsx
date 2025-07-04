'use client';

import { useEffect, useState } from 'react';
import { DefaultThreeDimensionalModel } from '@/components/STLViewer/constants';
import { STLViewerMenu } from '@/components/STLViewer/STLViewerMenu';
import { ThreeDimensionalModel } from '@/components/STLViewer/types';
import STLViewer from '../../components/STLViewer/STLViewer';

export default function ThreeDimensionalModelingPage() {
  const [selectedModel, setSelectedModel] = useState<ThreeDimensionalModel>(
    DefaultThreeDimensionalModel
  );
  const [modelDescription, setModelDescription] = useState<string>('');
  const [selectedMaterialColor, setSelectedMaterialColor] = useState('#6aff00f0');
  const [photoFilePaths, setPhotoFilePaths] = useState<string[]>([]);

  // Handle state related to the model
  useEffect(() => {
    async function fetchModelDescription(file: string) {
      // get the single description file for the model
      // note we assume that one single file exists for each model
      // and is named <model>.txt
      const res = await fetch(`/3d-models/descriptions/${file}.txt`);
      if (!res.ok) {
        setModelDescription('');
      } else {
        setModelDescription(await res.text());
      }
    }

    async function fetchModelPhotos(model: string, numberOfPhotos: number) {
      // get all the photos in the public folder for the model
      // note we assume that files are named <model>-<index>.<ext>
      // where index is between 0 and selectedModel.numberOfPhotos - 1
      // yes, this is lazy, but its easier than a server side implementation
      const paths = [];
      for (let i = 0; i < numberOfPhotos; i++) {
        paths.push(`/3d-models/photos/${model}/${model}-${i}.jpg`);
      }
      setPhotoFilePaths(paths);
    }

    fetchModelDescription(selectedModel.file);
    fetchModelPhotos(selectedModel.file, selectedModel.numberOfPhotos || 0);
  }, [selectedModel]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ zIndex: 1000, backgroundColor: 'rgba(255,0,0,0.1)' }}>
        <STLViewerMenu
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          selectedMaterialColor={selectedMaterialColor}
          setSelectedMaterialColor={setSelectedMaterialColor}
          selectedModelDescription={modelDescription}
          selectedModelPhotoUrls={photoFilePaths}
        />
      </div>

      <div style={{ width: '100%', height: '100%' }}>
        <STLViewer
          modelFileName={selectedModel.file}
          materialColor={selectedMaterialColor}
          modelRoation={selectedModel.rotation}
        />
      </div>
    </div>
  );
}
