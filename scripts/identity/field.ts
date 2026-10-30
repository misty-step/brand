// The Ground fog field: the Locked motion option's lazy background (its option module and the _r2-mist
// engine). generate.mjs bundles it into identity/field.js, which runtime.js imports after first paint.
import motion from 'brand:motion';

export const load = () => motion.background!.load();
