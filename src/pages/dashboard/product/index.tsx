// layouts
import DashboardLayout from '@/layouts/dashboard';

Categori.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function Categori() {
  return <p>list</p>;
}
