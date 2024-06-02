export const InProgressIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" fill="url(#pattern0_12949_17112)" />
      <defs>
        <pattern
          id="pattern0_12949_17112"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use href="#image0_12949_17112" transform="scale(0.0104167)" />
        </pattern>
        <image
          id="image0_12949_17112"
          width="96"
          height="96"
          href="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
};
