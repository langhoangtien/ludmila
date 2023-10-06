// next
import Head from 'next/head';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// layouts
import DashboardLayout from '@/layouts/dashboard';
// components
import { useSettingsContext } from '@/components/settings';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';
// sections
import CategoryForm from '@/sections/@dashboard/category/CategoryForm';
import { ICategory } from '@/@types/category';
import axios from '@/utils/axios';
import { useSnackbar } from '@/components/snackbar';
import { useLocales } from '@/locales';
import { useRouter } from 'next/router';

// ----------------------------------------------------------------------

CategoryCreatePage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

// ----------------------------------------------------------------------

export default function CategoryCreatePage() {
  const { themeStretch } = useSettingsContext();
  const { translate } = useLocales();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  async function submitForm(data: ICategory) {
    try {
      await axios.post(`/api/v1/categories`, data);
      enqueueSnackbar(translate('notification.success'));
      router.push(PATH_DASHBOARD.category.list);
    } catch (error) {
      enqueueSnackbar(translate('notification.error'), { variant: 'error' });
      console.error(error);
    }
  }
  return (
    <>
      <Head>
        <title> Thêm danh mục sản phẩm mới</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Thêm mới danh mục"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Category',
              href: PATH_DASHBOARD.category.root,
            },
            { name: 'New Category' },
          ]}
        />
        <CategoryForm submitForm={submitForm} currentCategory={null} />
      </Container>
    </>
  );
}
