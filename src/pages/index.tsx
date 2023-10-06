import { useEffect } from 'react';
// form
// next
import Head from 'next/head';
// @mui
import { Box, Button, Container, Divider, Link, Typography } from '@mui/material';
// redux
import { useDispatch } from '@/redux/store';
import { getProducts } from '@/redux/slices/product';
// routes
// @types
// layouts
// components
import { useSettingsContext } from '@/components/settings';
// sections
import { ShopProductList } from '@/sections/@dashboard/e-commerce/shop';

import NextLink from 'next/link';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { CategoryHomeProps } from '@/@types/category';
import MainLayout from '@/layouts/main/MainLayout';

// ----------------------------------------------------------------------

ShopPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>;

// ----------------------------------------------------------------------

export const getStaticProps: GetStaticProps<CategoryHomeProps> = async (
  context: GetStaticPropsContext
) => {
  const reponse = await fetch('http://localhost:3000/api/v1/products/home');
  const dataJson = await reponse.json();
  const categories = dataJson;

  return { props: { categories } };
};

export default function ShopPage(props: CategoryHomeProps) {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();
  const { categories } = props;
  const isDefault = false;

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <>
      <Head>
        <title> Ludmila - Hàng Nga chính hãng</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        {categories.map((category) => (
          <>
            <div key={category.id}>
              <Typography
                // textTransform="uppercase"
                sx={{ py: { xs: 3, lg: 4 } }}
                color="primary"
                variant="h5"
              >
                {category.name}
              </Typography>
              <ShopProductList
                products={category.products}
                loading={!category.products.length && isDefault}
              />

              <Box
                component="div"
                sx={{ py: { xs: 3, lg: 4 }, display: 'flex', justifyContent: 'center' }}
              >
                <Link
                  href={`/categories/${category.slug}-${category.id}`}
                  color="inherit"
                  variant="subtitle2"
                  component={NextLink}
                >
                  <Button color="primary" variant="contained">
                    Xem thêm
                  </Button>
                </Link>
              </Box>
            </div>
            <Divider />
          </>
        ))}
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------
