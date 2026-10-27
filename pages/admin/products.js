import AdminLayout from '../../components/admin/AdminLayout.js';
import ResourceManager from '../../components/admin/ResourceManager.js';
import { PRODUCTS } from '../../components/admin/resources.js';
import { requireAdminPage } from '../../lib/adminPage.js';
import s from '../../styles/Admin.module.css';

export default function AdminProducts() {
  return (
    <AdminLayout title="Products">
      <h1 className={s.pageTitle}>Products</h1>
      <ResourceManager config={PRODUCTS} />
    </AdminLayout>
  );
}

export async function getServerSideProps(ctx) {
  return requireAdminPage(ctx);
}
