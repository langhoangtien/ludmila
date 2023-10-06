// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Card, Grid, Container, Typography, Stack } from '@mui/material';
// redux
import { useDispatch, useSelector } from '@/redux/store';
import { getProduct, addToCart, gotoStep } from '@/redux/slices/product';
// routes
// @types
import { ICheckoutCartItem } from '@/@types/product';
// layouts
// components
import Iconify from '@/components/iconify';
import Markdown from '@/components/markdown';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';
import { useSettingsContext } from '@/components/settings';
import { SkeletonProductDetails } from '@/components/skeleton';
import { useEffect } from 'react';

// sections
import {
  ProductDetailsSummary,
  ProductDetailsCarousel,
} from '@/sections/@dashboard/e-commerce/details';
import MainLayout from '@/layouts/main/MainLayout';

const SUMMARY = [
  {
    title: '100% Chính hãng',
    description: 'Hàng chuẩn chính hãng từ Nga',
    icon: 'ic:round-verified',
  },
  {
    title: 'Ship toàn quốc',
    description: 'Vận chuyển khắp mọi miền tổ quốc',
    icon: 'eva:clock-fill',
  },
  {
    title: 'Bảo hành',
    description: 'Đổi trả sản phẩm khi có lỗi',
    icon: 'ic:round-verified-user',
  },
];

// ----------------------------------------------------------------------

ProductPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>;
export default function ProductPage() {
  // const x = useRouter();
  // console.log('X', x);
  const name = useRouter().asPath;
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { product, isLoading, checkout } = useSelector((state) => state.product);
  const nameArr = name.split('-');
  const id = nameArr[nameArr.length - 1];

  useEffect(() => {
    if (name) {
      dispatch(getProduct(id));
    }
  }, [dispatch, name]);

  const handleAddCart = (newProduct: ICheckoutCartItem) => {
    dispatch(addToCart(newProduct));
  };

  const handleGotoStep = (step: number) => {
    dispatch(gotoStep(step));
  };

  return (
    <>
      {' '}
      <Head>
        <title>{`Ecommerce: ${product?.name || ''} | Minimal UI`}</title>
      </Head>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Thông tin sản phẩm"
          links={[{ name: 'Trang chủ', href: '/' }, { name: product?.name }]}
        />
        {product && (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={7}>
                <ProductDetailsCarousel product={product} />
              </Grid>

              <Grid item xs={12} md={6} lg={5}>
                <ProductDetailsSummary
                  cart={checkout.cart}
                  product={product}
                  onAddCart={handleAddCart}
                  onGotoStep={handleGotoStep}
                />
              </Grid>
            </Grid>

            <Box
              gap={5}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(3, 1fr)',
              }}
              sx={{ my: 10 }}
            >
              {SUMMARY.map((item) => (
                <Box key={item.title} sx={{ textAlign: 'center' }}>
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      width: 64,
                      height: 64,
                      mx: 'auto',
                      borderRadius: '50%',
                      color: 'primary.main',
                      bgcolor: (theme) => `${alpha(theme.palette.primary.main, 0.08)}`,
                    }}
                  >
                    <Iconify icon={item.icon} width={36} />
                  </Stack>

                  <Typography variant="h6" sx={{ mb: 1, mt: 3 }}>
                    {item.title}
                  </Typography>

                  <Typography sx={{ color: 'text.secondary' }}>{item.description}</Typography>
                </Box>
              ))}
            </Box>

            <Card>
              <Markdown children={product?.description} />
            </Card>
          </>
        )}

        {isLoading && <SkeletonProductDetails />}
      </Container>
    </>
  );
}
