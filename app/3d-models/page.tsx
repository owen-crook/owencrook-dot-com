"use client"
import { useEffect, useState } from 'react'
import { Grid, Box } from '@mantine/core'
import { ThreeDimensionalModelPicker, ThreeDimensionalModel, DefaultThreeDimensionalModel } from '../../components/ThreeDimensionalModelPicker/ThreeDimensionalModelPicker'
import STLViewer from '../../components/STLViewer/STLViewer'

export default function ThreeDimensionalModelsPage() {
  const [selectedModel, setSelectedModel] = useState<ThreeDimensionalModel>(DefaultThreeDimensionalModel)
  const [modelDescription, setModelDescription] = useState<string>('')
  const [selectedMaterialColor, setSelectedMaterialColor] = useState('#6aff00f0')

  // Handle state related to the model
  useEffect(() => {
    async function fetchModelDescription(file: string) {
      const res = await fetch(`/3d-models/descriptions/${file}.txt`);
      if (!res.ok) {
        setModelDescription('')
      } else {
        setModelDescription(await res.text())
      }
    }
    fetchModelDescription(selectedModel.file)
  }, [selectedModel])

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        pl={{ base: 8, sm: 16, md: 24 }}
        pb={{ base: 8, sm: 16, md: 24 }}
        style={{ flex: '0 0 auto' }}
      >
        <h1>CAD Models</h1>
        <p>
          I've always liked building stuff and figuring out how things work, so getting into CAD and 3D printing was kind of a natural fit. I took some CAD classes back in high school, but things really clicked in college when I started building racing drones and needed custom parts. That’s when I got into 3D printing and started messing around with designs of my own.
        </p>
        <p>
          These days, I use my Ender 3 S1 along with OnShape for design and Cura for slicing. Most of what I make is just random stuff to solve small everyday problems—organizers, mounts, quick fixes, that kind of thing. It’s not something I do for work, but it’s a fun way to scratch the engineering itch and build things that are actually useful.
        </p>
        <p>
          Below you will find a selection of my 3d models that I have made. Some of them are more polished than others, but they all serve a purpose. I hope you find them useful or at least interesting!
        </p>
        <ThreeDimensionalModelPicker
          initialColor={selectedMaterialColor}
          onSelectModel={(model: ThreeDimensionalModel) => {
            setSelectedModel(model)
          }}
          onSelectMaterial={(materialColor: string) => {
            setSelectedMaterialColor(materialColor)
          }}
        />
      </Box>

      {/* Row 2: 12 wide, viewer + sidebar */}
      <Box style={{ flex: '1' }}>
        <Grid style={{ display: 'flex', height: '100%' }}>
          <Grid.Col
            span={10}
            style={{
              display: 'flex', flexDirection: 'column', height: '100%'
            }}
          >
            <STLViewer
              modelFileName={selectedModel.file}
              materialColor={selectedMaterialColor}
            />
          </Grid.Col>
          <Grid.Col span={2} style={{ height: '100%', overflowY: 'auto' }} pr={{ base: 8, sm: 16, md: 24 }}>
            <h2>{selectedModel.label}</h2>
            <p>{modelDescription}</p>
            {/* Render URL content if it exists */}
            {
              selectedModel.urls ? (
                <>
                  <h3>Links</h3>
                  <ul>
                    {selectedModel.urls.map((url, index) => (<li key={index}><a href={url.url} target="_blank" rel="noopener noreferrer">{url.label || url.url}</a></li>))}
                  </ul>
                </>
              ) : <></>
            }
            {/* Render Photo content if it exists */}
            {selectedModel.hasPhotos ? (<>aaaaa</>) : <></>}
          </Grid.Col>
        </Grid>
      </Box >
    </Box >
  )
}