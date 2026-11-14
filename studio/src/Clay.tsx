import type { ReactNode } from 'react';

/**
 * Modelling clay, made with SVG lighting. Anything drawn with `filter="url(#ac-clay)"` gets a soft rounded surface,
 * a little grain and a fingertip smudge, lit from the top left like a model on a table by a window.
 * `ac-clay-sm` is the same recipe at the scale of a 64-unit icon. Mount <ClayDefs/> once per page.
 */
function ClayFilter({ id, erode, dome, surface, grain, smudge, shadow }: { id: string; erode: number; dome: number; surface: number; grain: number; smudge: number; shadow: [number, number, number] }) {
  const [dx, dy, blur] = shadow;
  return <filter id={id} x="-20%" y="-20%" width="140%" height="150%" colorInterpolationFilters="sRGB">
    <feMorphology in="SourceAlpha" operator="erode" radius={erode} result="edge"/>
    <feGaussianBlur in="edge" stdDeviation={dome} result="dome"/>
    <feTurbulence type="fractalNoise" baseFrequency={grain} numOctaves="2" seed="7" result="grain"/>
    <feTurbulence type="fractalNoise" baseFrequency={smudge} numOctaves="2" seed="11" result="smudge"/>
    <feComposite in="dome" in2="smudge" operator="arithmetic" k2="1" k3=".16" result="shaped"/>
    <feComposite in="shaped" in2="grain" operator="arithmetic" k2="1" k3=".05" result="bump"/>
    <feDiffuseLighting in="bump" surfaceScale={surface} diffuseConstant="1" lightingColor="#fff" result="diffuse">
      <feDistantLight azimuth="235" elevation="55"/>
    </feDiffuseLighting>
    <feComponentTransfer in="diffuse" result="soft">
      <feFuncR type="linear" slope=".58" intercept=".46"/>
      <feFuncG type="linear" slope=".58" intercept=".46"/>
      <feFuncB type="linear" slope=".58" intercept=".46"/>
    </feComponentTransfer>
    <feSpecularLighting in="bump" surfaceScale={surface} specularConstant=".2" specularExponent="9" lightingColor="#fff" result="shine">
      <feDistantLight azimuth="235" elevation="62"/>
    </feSpecularLighting>
    <feBlend in="SourceGraphic" in2="soft" mode="multiply" result="lit"/>
    <feComposite in="shine" in2="SourceAlpha" operator="in" result="shineIn"/>
    <feComposite in="lit" in2="shineIn" operator="arithmetic" k2="1" k3=".6" result="glossy"/>
    <feComposite in="glossy" in2="SourceAlpha" operator="in" result="body"/>
    <feGaussianBlur in="SourceAlpha" stdDeviation={blur} result="shadowBlur"/>
    <feOffset in="shadowBlur" dx={dx} dy={dy} result="shadowOffset"/>
    <feFlood floodColor="#0c2b29" floodOpacity=".38"/>
    <feComposite in2="shadowOffset" operator="in" result="shadow"/>
    <feMerge><feMergeNode in="shadow"/><feMergeNode in="body"/></feMerge>
  </filter>;
}

export function ClayDefs() {
  return <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
    <defs>
      <ClayFilter id="ac-clay" erode={1.5} dome={9} surface={5} grain={0.9} smudge={0.02} shadow={[3, 7, 5]}/>
      <ClayFilter id="ac-clay-flat" erode={1} dome={5} surface={3} grain={0.9} smudge={0.03} shadow={[0, 0, 0.01]}/>
      <ClayFilter id="ac-clay-sm" erode={0.6} dome={3.2} surface={3} grain={1.6} smudge={0.06} shadow={[1, 2.5, 1.6]}/>
    </defs>
  </svg>;
}

/** A small disc of clay with a number or icon pressed into it. Used for step numbers on the working pages. */
export function ClayDisc({ children, colour = '#f3b443', size = 40, className = '' }: { children: ReactNode; colour?: string; size?: number; className?: string }) {
  return <span className={`ac-disc ${className}`} style={{ width: size, height: size }}>
    <svg viewBox={`0 0 ${size} ${size}`} aria-hidden="true" focusable="false"><circle cx={size / 2} cy={size / 2} r={size / 2 - 1.5} fill={colour} filter="url(#ac-clay-sm)"/></svg>
    <span>{children}</span>
  </span>;
}

/** A thick ring of clay pressed round a photo, for the people behind each group. */
export function ClayRing({ children, size, pad, colour = '#ef7a5a' }: { children: ReactNode; size: number; pad: number; colour?: string }) {
  const outer = size + pad * 2;
  return <span className="ac-ring" style={{ width: outer, height: outer }}>
    <svg viewBox={`0 0 ${outer} ${outer}`} aria-hidden="true" focusable="false"><circle cx={outer / 2} cy={outer / 2} r={outer / 2 - 1} fill={colour} filter="url(#ac-clay)"/></svg>
    {children}
  </span>;
}
