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
import { IProductBrand } from '@/@types/product';
import BrandForm from '@/sections/@dashboard/brand/BrandForm';

// ----------------------------------------------------------------------

BrandCreatePage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function BrandCreatePage() {
  const { themeStretch } = useSettingsContext();
  const { translate } = useLocales();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  async function submitForm(data: IProductBrand) {
    try {
      await axios.post(`/api/v1/brands`, data);
      enqueueSnackbar(translate('notification.success'));
      router.push(PATH_DASHBOARD.brand.list);
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
          heading="New Brand"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Brand',
              href: PATH_DASHBOARD.brand.root,
            },
            { name: 'New Brand' },
          ]}
        />
        <BrandForm submitForm={submitForm} currentBrand={null} />
      </Container>
    </>
  );
}
