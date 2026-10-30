// Modules generate.mjs resolves to the configurator's Locked preset at bundle time.
declare module 'brand:mark' {
  const option: import('../../configurator/src/contract').MarkOption;
  export default option;
}
declare module 'brand:motion' {
  const option: import('../../configurator/src/contract').MotionOption;
  export default option;
}
declare module 'brand:locked' {
  export const MOTION_HOST: import('../../configurator/src/contract').HeroOption['motionHost'];
}
