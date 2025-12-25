import React from 'react';
import 'img-comparison-slider/dist/styles.css';
import 'img-comparison-slider';

type ImgComparisonSliderElementProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  children?: React.ReactNode;
};

interface ImageComparisonSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  ariaLabel?: string;
}

const ImageComparisonSlider: React.FC<ImageComparisonSliderProps> = ({
  beforeSrc,
  afterSrc,
  beforeLabel = 'Original',
  afterLabel = 'Result',
  ariaLabel
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      {React.createElement(
        'img-comparison-slider',
        {
          class: 'w-full h-full block rounded-lg overflow-hidden',
          'aria-label': ariaLabel || 'Image comparison slider'
        } as ImgComparisonSliderElementProps,
        <>
          <img
            slot="first"
            src={beforeSrc}
            alt={beforeLabel}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
          <img
            slot="second"
            src={afterSrc}
            alt={afterLabel}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </>
      )}
    </div>
  );
};

export default ImageComparisonSlider;
