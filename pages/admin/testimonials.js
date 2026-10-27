import AdminLayout from '../../components/admin/AdminLayout.js';
import ResourceManager from '../../components/admin/ResourceManager.js';
import { TESTIMONIALS } from '../../components/admin/resources.js';
import { requireAdminPage } from '../../lib/adminPage.js';
import s from '../../styles/Admin.module.css';

export default function AdminTestimonials() {
  return (
    <AdminLayout title="Testimonials">
      <h1 className={s.pageTitle}>Testimonials</h1>
      <ResourceManager config={TESTIMONIALS} />
    </AdminLayout>
  );
}

export async function getServerSideProps(ctx) {
  return requireAdminPage(ctx);
}
