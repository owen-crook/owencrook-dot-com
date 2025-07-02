'use client';
import { useEffect, useState } from 'react';
import { IconCamera } from '@tabler/icons-react';
import { Box, Grid, Group, UnstyledButton } from '@mantine/core';
import { PhotoViewerModal } from '@/components/PhotoViewerModal/PhotoViewerModal';
import STLViewer from '../../components/STLViewer/STLViewer';
import { STLViewerMenu } from '@/components/STLViewer/STLViewerMenu';
import { ThreeDimensionalModel } from '@/components/STLViewer/types';
import { DefaultThreeDimensionalModel } from '@/components/STLViewer/constants';


export default function ThreeDimensionalModelingPage() {
  const [selectedModel, setSelectedModel] = useState<ThreeDimensionalModel>(
    DefaultThreeDimensionalModel
  );
  const [modelDescription, setModelDescription] = useState<string>('');
  const [selectedMaterialColor, setSelectedMaterialColor] = useState('#6aff00f0');
  const [photosModalOpened, setPhotosModalOpened] = useState(false);
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
    <div style={{
      position: "relative",
      width: '100%',
      height: '100%',
      border: '2px solid blue'
    }}>

      <div style={{
        zIndex: 1000,
        backgroundColor: 'rgba(255,0,0,0.1)',
      }}
      >
        <STLViewerMenu
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          selectedMaterialColor={selectedMaterialColor}
          setSelectedMaterialColor={setSelectedMaterialColor}
        />
      </div>

      <div style={{
        border: '1px solid green',
        width: '100%',
        height: '100%'
      }}>
        <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box style={{ flex: '1' }}>
            <Grid style={{ display: 'flex', height: '100%' }}>
              <Grid.Col
                span={10}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <STLViewer
                  modelFileName={selectedModel.file}
                  materialColor={selectedMaterialColor}
                  modelRoation={selectedModel.rotation}
                />
              </Grid.Col>
              <Grid.Col
                span={2}
                style={{ height: '100%', overflowY: 'auto' }}
                pr={{ base: 8, sm: 16, md: 24 }}
              >
                <h2>{selectedModel.label}</h2>
                <p>{modelDescription}</p>
                {/* Render URL content if it exists */}
                {selectedModel.urls ? (
                  <>
                    <h3>Links</h3>
                    <ul>
                      {selectedModel.urls.map((url, index) => (
                        <li key={index}>
                          <a href={url.url} target="_blank" rel="noopener noreferrer">
                            {url.label || url.url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <></>
                )}
                {/* Render explore photos button if they exists */}
                {(selectedModel.numberOfPhotos || 0) > 0 ? (
                  <>
                    <UnstyledButton
                      variant="light"
                      size="xs"
                      onClick={() => {
                        setPhotosModalOpened(true);
                      }}
                    >
                      <Group gap="xs">
                        <span>Explore Photos</span>
                      </Group>
                      <IconCamera size={16} stroke={1.5} />
                    </UnstyledButton>
                  </>
                ) : (
                  <></>
                )}
              </Grid.Col>
            </Grid>
          </Box>
        </Box >
        <PhotoViewerModal
          imageUrls={photoFilePaths}
          opened={photosModalOpened}
          onClose={() => {
            setPhotosModalOpened(false);
          }}
        />
      </div>
    </div>
  );
}
