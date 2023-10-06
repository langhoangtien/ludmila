import { useSettingsContext } from '@/components/settings';
import MainLayout from '@/layouts/main/MainLayout';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Stack,
  Typography,
  styled,
} from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';
import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { IProductBrand } from '@/@types/product';
import Image from '@/components/image';
// utils
import { bgBlur } from '@/utils/cssStyles';
import Iconify from '@/components/iconify/Iconify';

BrandPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>;

export default function BrandPage() {
  const {
    query: { id },
  } = useRouter();
  const { themeStretch } = useSettingsContext();
  const [brand, setBrand] = useState<IProductBrand>();

  useEffect(() => {
    const getData = async () => {
      try {
        const brandId = typeof id === 'string' ? id?.split('-').pop() : null;
        if (!brandId) return null;
        const response = await axios.get(`/api/v1/brands/${brandId}`);
        setBrand(response.data);
      } catch (error) {
        console.log('error', error);
      }
    };
    getData();
  }, [id]);

  return (
    <>
      {' '}
      <Head>
        <title>Thực phẩm Nga | Minimal UI</title>
      </Head>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Thương hiệu"
          links={[{ name: 'Trang chủ', href: '/' }, { name: 'danh mục' }]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex' }}>
              {' '}
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  mr: 2,
                  background: 'black',
                  borderRadius: '2px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textTransform: 'uppercase',
                  fontFamily: 'Auto',
                  color: '#ffffff',
                  fontSize: '1em',
                }}
              >
                {brand?.name.charAt(0)}
              </Box>
              <span>PROFILE</span>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              }}
            >
              <Typography fontFamily="Auto" color="rgb(51, 51, 51)" variant="h2">
                {brand?.name}
              </Typography>
              <Typography>Menlo Park, California</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Iconify icon="solar:asteroid-bold-duotone" />
                <Typography sx={{ pl: 1 }}>{brand?.site}</Typography>
              </Box>
              {brand?.mail && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Iconify icon="solar:inbox-line-bold-duotone" />{' '}
                  <Typography sx={{ pl: 1 }}>{brand?.mail}</Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Iconify icon="solar:phone-bold-duotone" />{' '}
                <Typography sx={{ pl: 1 }}> {brand?.phone}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Iconify icon="solar:map-point-wave-bold-duotone" />{' '}
                <Typography sx={{ pl: 1 }}> {brand?.address}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                background: 'hsl(0, 0%, 90%)',
                height: 400,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textTransform: 'uppercase',
                color: '#bbbbbb',
                fontSize: '15rem',
                fontFamily: 'Auto',
              }}
            >
              {brand?.name.charAt(0)}
            </Box>
          </Grid>
          <Grid item md={8} xs={12} />
        </Grid>
      </Container>
    </>
  );
}
