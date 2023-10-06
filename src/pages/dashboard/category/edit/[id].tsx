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
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { useSnackbar } from '@/components/snackbar';
import { ICategory } from '@/@types/category';
import { useLocales } from '@/locales';

// ----------------------------------------------------------------------

CategoryEditPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

// ----------------------------------------------------------------------

export default function CategoryEditPage() {
  const { themeStretch } = useSettingsContext();
  const { translate } = useLocales();
  const {
    query: { id },
  } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  // const { category } = useSelector((state) => state.category);
  const [category, setCategory] = useState(null);
  const onSubmit = useCallback(async (data: ICategory) => {
    try {
      const response = await axios.patch(`/api/v1/categories/${id}`, data);
      setCategory(response.data);
      enqueueSnackbar(translate('notification.success'));
    } catch (error) {
      enqueueSnackbar(translate('notification.error'), { variant: 'error' });
      console.error(error);
    }
  }, []);

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(`/api/v1/categories/${id}`);
        setCategory(response.data);
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
          heading="Edit Category"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Category',
              href: PATH_DASHBOARD.category.list,
            },
            { name: 'Edit Category' },
          ]}
        />
        <CategoryForm submitForm={onSubmit} currentCategory={category} isEdit />
      </Container>
    </>
  );
}
