import AdminLayout from '../../components/admin/AdminLayout.js';
import ResourceManager from '../../components/admin/ResourceManager.js';
import { FAQS } from '../../components/admin/resources.js';
import { requireAdminPage } from '../../lib/adminPage.js';
import s from '../../styles/Admin.module.css';

export default function AdminFaqs() {
  return (
    <AdminLayout title="FAQs">
      <h1 className={s.pageTitle}>FAQs</h1>
      <ResourceManager config={FAQS} />
    </AdminLayout>
  );
}

export async function getServerSideProps(ctx) {
  return requireAdminPage(ctx);
}
