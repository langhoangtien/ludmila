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
import CountryForm from '@/sections/@dashboard/country/CountryForm';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { useSnackbar } from '@/components/snackbar';
import { useLocales } from '@/locales';
import { IProductCountry } from '@/@types/product';

// ----------------------------------------------------------------------

CountryEditPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function CountryEditPage() {
  const { themeStretch } = useSettingsContext();
  const { translate } = useLocales();
  const {
    query: { id },
  } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  // const { Country } = useSelector((state) => state.Country);
  const [country, setCountry] = useState(null);
  const onSubmit = useCallback(
    async (data: IProductCountry) => {
      try {
        const response = await axios.patch(`/api/v1/countries/${id}`, data);
        setCountry(response.data);
        enqueueSnackbar(translate('notification.success'));
      } catch (error) {
        enqueueSnackbar(translate('notification.error'), { variant: 'error' });
        console.error(error);
      }
    },
    [id]
  );

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(`/api/v1/countries/${id}`);
        setCountry(response.data);
      } catch (error) {
        enqueueSnackbar(translate('notification.error'), { variant: 'error' });
        console.log('error', error);
      }
    }
    getData();
  }, [id]);

  return (
    <>
      <Head>
        <title> Sửa danh mục sản phẩm</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Country"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Country',
              href: PATH_DASHBOARD.country.list,
            },
            { name: 'Edit Country' },
          ]}
        />
        <CountryForm submitForm={onSubmit} currentCountry={country} isEdit />
      </Container>
    </>
  );
}
