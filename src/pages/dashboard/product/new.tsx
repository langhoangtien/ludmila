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
import axios from '@/utils/axios';
import { useSnackbar } from '@/components/snackbar';
import { useLocales } from '@/locales';
import { useRouter } from 'next/router';
import { IProduct } from '@/@types/product';
import ProductForm from '@/sections/@dashboard/product/ProductForm';

// ----------------------------------------------------------------------

ProductCreatePage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

// ----------------------------------------------------------------------

export default function ProductCreatePage() {
  const { themeStretch } = useSettingsContext();
  const { translate } = useLocales();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  async function submitForm(data: IProduct) {
    try {
      await axios.post(`/api/v1/products`, data);
      enqueueSnackbar(translate('notification.success'));
      router.push(PATH_DASHBOARD.product.list);
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
          heading="New Product"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Brand',
              href: PATH_DASHBOARD.product.root,
            },
            { name: 'New Product' },
          ]}
        />
        <ProductForm submitForm={submitForm} currentProduct={null} />
      </Container>
    </>
  );
}
