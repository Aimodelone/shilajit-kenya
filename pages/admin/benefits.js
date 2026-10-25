import AdminLayout from '../../components/admin/AdminLayout.js';
import ResourceManager from '../../components/admin/ResourceManager.js';
import { BENEFITS } from '../../components/admin/resources.js';
import { requireAdminPage } from '../../lib/adminPage.js';
import s from '../../styles/Admin.module.css';

export default function AdminBenefits() {
  return (
    <AdminLayout title="Benefits">
      <h1 className={s.pageTitle}>Benefits</h1>
      <ResourceManager config={BENEFITS} />
    </AdminLayout>
  );
}

export async function getServerSideProps(ctx) {
  return requireAdminPage(ctx);
}
