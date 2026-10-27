/**
 * pages/api/admin/products/[id].js
 * Thin wrapper — all logic lives in lib/adminCrud.js.
 */
import { createItemHandler } from '../../../../lib/adminCrud.js';
import { productConfig } from '../../../../lib/adminConfigs.js';

export default createItemHandler(productConfig);
