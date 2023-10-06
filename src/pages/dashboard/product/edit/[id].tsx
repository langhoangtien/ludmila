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
import ProductForm from '@/sections/@dashboard/product/ProductForm';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { useSnackbar } from '@/components/snackbar';
import { useLocales } from '@/locales';
import { IProduct } from '@/@types/product';

// ----------------------------------------------------------------------

ProductEditPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function ProductEditPage() {
  const { themeStretch } = useSettingsContext();
  const { translate } = useLocales();
  const {
    query: { id },
  } = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [product, setproduct] = useState(null);
  const onSubmit = useCallback(
    async (data: IProduct) => {
      try {
        const response = await axios.patch(`/api/v1/products/${id}`, data);
        setproduct(response.data);
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
        const response = await axios.get(`/api/v1/products/${id}`);
        setproduct(response.data);
      } catch (error) {
        enqueueSnackbar(translate('notification.error'), { variant: 'error' });
        console.log('error', error);
      }
    }
    if (id) getData();
  }, [id]);

  return (
    <>
      <Head>
        <title> Sửa danh mục sản phẩm</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit product"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'product',
              href: PATH_DASHBOARD.product.list,
            },
            { name: 'Edit product' },
          ]}
        />
        <ProductForm submitForm={onSubmit} currentProduct={product} isEdit />
      </Container>
    </>
  );
}
