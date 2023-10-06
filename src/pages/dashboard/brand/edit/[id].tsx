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
import BrandForm from '@/sections/@dashboard/brand/BrandForm';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { useSnackbar } from '@/components/snackbar';
import { useLocales } from '@/locales';
import { IProductBrand } from '@/@types/product';

// ----------------------------------------------------------------------

BrandEditPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function BrandEditPage() {
  const { themeStretch } = useSettingsContext();
  const { translate } = useLocales();
  const {
    query: { id },
  } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  // const { Brand } = useSelector((state) => state.Brand);
  const [brand, setBrand] = useState(null);
  const onSubmit = useCallback(async (data: IProductBrand) => {
    try {
      const response = await axios.patch(`/api/v1/brands/${id}`, data);
      setBrand(response.data);
      enqueueSnackbar(translate('notification.success'));
    } catch (error) {
      enqueueSnackbar(translate('notification.error'), { variant: 'error' });
      console.error(error);
    }
  }, []);

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(`/api/v1/brands/${id}`);
        setBrand(response.data);
      } catch (error) {
        enqueueSnackbar(translate('notification.error'), { variant: 'error' });
        console.log('error', error);
      }
    }
    getData();
  }, []);

  return (
    <>
      <Head>
        <title> Sửa danh mục sản phẩm</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Brand"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Brand',
              href: PATH_DASHBOARD.brand.list,
            },
            { name: 'Edit Brand' },
          ]}
        />
        <BrandForm submitForm={onSubmit} currentBrand={brand} isEdit />
      </Container>
    </>
  );
}
