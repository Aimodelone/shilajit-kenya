/**
 * pages/api/admin/products/index.js
 * Thin wrapper — all logic lives in lib/adminCrud.js.
 */
import { createCollectionHandler } from '../../../../lib/adminCrud.js';
import { productConfig } from '../../../../lib/adminConfigs.js';

export default createCollectionHandler(productConfig);
