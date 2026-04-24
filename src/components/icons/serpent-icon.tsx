
import { SVGProps } from 'react';

export const SerpentIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M6 12s-1 2-4 2-3-4 0-5 6-2 6-2" />
    <path d="M12 12s2-1 2-4-4-3-5 0-2 6-2 6" />
    <path d="M18 12s1-2 4-2 3 4 0 5-6 2-6 2" />
  </svg>
);
