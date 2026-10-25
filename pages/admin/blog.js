import AdminLayout from '../../components/admin/AdminLayout.js';
import ResourceManager from '../../components/admin/ResourceManager.js';
import { BLOG } from '../../components/admin/resources.js';
import { requireAdminPage } from '../../lib/adminPage.js';
import s from '../../styles/Admin.module.css';

export default function AdminBlog() {
  return (
    <AdminLayout title="Blog">
      <h1 className={s.pageTitle}>Blog Posts</h1>
      <ResourceManager config={BLOG} />
    </AdminLayout>
  );
}

export async function getServerSideProps(ctx) {
  return requireAdminPage(ctx);
}
