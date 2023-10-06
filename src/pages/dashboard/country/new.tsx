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
import { IProductCountry } from '@/@types/product';
import CountryForm from '@/sections/@dashboard/country/CountryForm';

// ----------------------------------------------------------------------

CountryCreatePage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

// ----------------------------------------------------------------------

export default function CountryCreatePage() {
  const { themeStretch } = useSettingsContext();
  const { translate } = useLocales();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  async function submitForm(data: IProductCountry) {
    try {
      await axios.post(`/api/v1/countries`, data);
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
          heading="New Country"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Brand',
              href: PATH_DASHBOARD.country.root,
            },
            { name: 'New Country' },
          ]}
        />
        <CountryForm submitForm={submitForm} currentCountry={null} />
      </Container>
    </>
  );
}
