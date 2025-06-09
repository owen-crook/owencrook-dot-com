'use client';

import { Carousel } from '@mantine/carousel';
import { Image, Modal } from '@mantine/core';

import '@mantine/carousel/styles.css';

type PhotoViewerModalProps = {
  imageUrls: string[];
  opened: boolean;
  onClose: () => void;
};

export function PhotoViewerModal({ imageUrls, opened, onClose }: PhotoViewerModalProps) {
  return (
    <div>
      <Modal opened={opened} onClose={onClose} size="auto" centered title="Photos">
        <Carousel
          slideSize="100%"
          height="80vh"
          withIndicators
          emblaOptions={{
            loop: true,
          }}
        >
          {imageUrls.map(
            (
              url // TODO: validate a file exists at the url before attempting to add the slide
            ) => (
              <Carousel.Slide
                key={url}
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  src={url}
                  fit="contain"
                  height="100%"
                  style={{ maxHeight: '100%', width: 'auto', objectFit: 'contain' }}
                />
              </Carousel.Slide>
            )
          )}
        </Carousel>
      </Modal>
    </div>
  );
}
