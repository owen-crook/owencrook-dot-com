'use client';

import { useEffect, useState } from 'react';
import { IconCamera } from '@tabler/icons-react';
import { Box, Grid, Group, UnstyledButton } from '@mantine/core';
import { PhotoViewerModal } from '@/components/PhotoViewerModal/PhotoViewerModal';
import STLViewer from '../../components/STLViewer/STLViewer';
import {
  DefaultThreeDimensionalModel,
  ThreeDimensionalModel,
  ThreeDimensionalModelPicker,
} from '../../components/ThreeDimensionalModelPicker/ThreeDimensionalModelPicker';
import classes from '../../components/FloatingColorPicker/FloatingColorPicker.module.css';

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
    <>
      <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box
          pl={{ base: 8, sm: 16, md: 24 }}
          pb={{ base: 8, sm: 16, md: 24 }}
          style={{ flex: '0 0 auto' }}
        >
          <h1>3D Modeling</h1>
          <p>
            I've always liked building stuff and figuring out how things work, so getting into CAD
            and 3D printing was kind of a natural fit. I took some CAD classes back in high school,
            but things really clicked in college when I started building racing drones and needed
            custom parts. That’s when I got into 3D printing and started messing around with designs
            of my own.
          </p>
          <p>
            These days, I use my Ender 3 S1 along with OnShape for design and Cura for slicing. Most
            of what I make is just random stuff to solve small everyday problems—organizers, mounts,
            quick fixes, that kind of thing. It’s not something I do for work, but it’s a fun way to
            scratch the engineering itch and build things that are actually useful.
          </p>
          <p>
            Below you will find a selection of my 3d models that I have made. Some of them are more
            polished than others, but they all serve a purpose. I hope you find them useful or at
            least interesting!
          </p>
          <ThreeDimensionalModelPicker
            initialColor={selectedMaterialColor}
            onSelectModel={(model: ThreeDimensionalModel) => {
              setSelectedModel(model);
            }}
            onSelectMaterial={(materialColor: string) => {
              setSelectedMaterialColor(materialColor);
            }}
          />
        </Box>

        {/* Row 2: 12 wide, viewer + sidebar */}
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
              <STLViewer modelFileName={selectedModel.file} materialColor={selectedMaterialColor} />
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
              {selectedModel.numberOfPhotos || 0 > 0 ? (
                <>
                  <UnstyledButton
                    className={classes.control}
                    variant="light"
                    size="xs"
                    onClick={() => {
                      setPhotosModalOpened(true);
                    }}
                  >
                    <Group gap={'xs'}>
                      <span className={classes.label}>Explore Photos</span>
                    </Group>
                    <IconCamera size={16} className={classes.label} stroke={1.5} />
                  </UnstyledButton>
                </>
              ) : (
                <></>
              )}
            </Grid.Col>
          </Grid>
        </Box>
      </Box>
      <PhotoViewerModal
        imageUrls={photoFilePaths}
        opened={photosModalOpened}
        onClose={() => {
          setPhotosModalOpened(false);
        }}
      />
    </>
  );
}
