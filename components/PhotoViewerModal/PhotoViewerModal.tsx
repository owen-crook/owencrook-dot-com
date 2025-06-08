'use client'
import { Modal, Image } from '@mantine/core';
import { Carousel } from '@mantine/carousel'

type PhotoViewerModalProps = {
  imageUrls: string[];
  opened: boolean
  onClose: () => void;
}

export function PhotoViewerModal({ imageUrls, opened, onClose }: PhotoViewerModalProps) {
  return (
    <div>
      <Modal opened={opened} onClose={onClose} size="auto" title="Modal size auto">
        <Carousel
          slideSize="100%"
          height={500}
          withIndicators
        >
          {imageUrls.map((url) => (
            <Carousel.Slide key={url}>
              <Image src={url} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </Modal>
    </div>
  );
}