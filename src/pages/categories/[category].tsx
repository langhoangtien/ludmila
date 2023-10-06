import { useSettingsContext } from '@/components/settings';
import MainLayout from '@/layouts/main/MainLayout';
import {
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  Link,
  MenuItem,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ShopProductCard } from '@/sections/@dashboard/e-commerce/shop';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';
import { SkeletonProductItem } from '@/components/skeleton';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { IProduct } from '@/@types/product';
import { ICategory } from '@/@types/category';
import Iconify from '@/components/iconify';
import MenuPopover from '@/components/menu-popover';
import { CustomTextField } from '@/components/custom-input';

const OPTIONS = [
  // { value: 'featured', label: 'Mặc định', order: 'ASC' },
  { value: 'createdAtAsc', label: 'Mới nhất', order: 'ASC', orderBy: 'createdAt' },
  { value: 'priceDesc', label: 'Giá: Cao - Thấp', order: 'DESC', orderBy: 'price' },
  { value: 'priceAsc', label: 'Giá: Thấp - Cao', order: 'ASC', orderBy: 'price' },
];

CategoryPage.getLayout = (page: React.ReactElement) => <MainLayout>{page}</MainLayout>;

export default function CategoryPage() {
  const {
    query: { category },
  } = useRouter();
  const { themeStretch } = useSettingsContext();

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const [filterName, setFilterName] = useState<string>('');
  const [field, setField] = useState({
    value: 'createdAtAsc',
    label: 'Mới nhất',
    order: 'ASC',
    orderBy: 'createdAt',
  });

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };
  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    option: { value: string; label: string; order: string; orderBy: string }
  ) => {
    setField(option);
    handleClosePopover();
  };

  const getData = async () => {
    try {
      const categoryId = typeof category === 'string' ? category?.split('-').pop() : null;
      if (!categoryId) return null;
      const response = await axios.get(
        `/api/v1/products/a?category=${categoryId}&perPage=10&page=${page}&order=${field.order}&orderBy=${field.orderBy}&search=${filterName}`
      );
      setProducts(response.data[0]);
      setTotalPage(Math.ceil(response.data[1] / 10));
    } catch (error) {
      console.log('error', error);
    }
  };
  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
  };
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getData();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [filterName]);

  useEffect(() => {
    getData();
  }, [category, page, field]);

  useEffect(() => {
    async function getCategories() {
      try {
        const response = await axios.get(`/api/v1/categories/home`);
        setCategories(response.data);
      } catch (error) {
        console.log('error', error);
      }
    }
    getCategories();
  }, []);
  return (
    <>
      {' '}
      <Head>
        <title>Thực phẩm Nga | Minimal UI</title>
      </Head>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Danh mục sản phẩm"
          links={[{ name: 'Trang chủ', href: '/' }, { name: 'danh mục' }]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Typography sx={{ py: { xs: 2, lg: 3 } }} color="primary" variant="h6">
              {' '}
              DANH MỤC SẢN PHẨM
            </Typography>
            {categories.map((i) => (
              <Link
                underline="none"
                href={`/categories/${i.slug}-${i.id}`}
                color="inherit"
                variant="subtitle1"
                component={NextLink}
              >
                <Typography
                  sx={[
                    {
                      '&:hover': {
                        opacity: 0.68,
                        backgroundColor: 'transparent',
                      },
                      pt: { xs: 1, lg: 1 },
                    },
                  ]}
                  color="error"
                  variant="subtitle1"
                >
                  {i.name}
                </Typography>
              </Link>
            ))}
          </Grid>
          <Grid xs={12} md={9}>
            <Stack
              spacing={2}
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ sm: 'center' }}
              justifyContent="space-between"
              sx={{ mb: 2, mt: 4 }}
            >
              <CustomTextField
                value={filterName}
                onChange={handleFilterName}
                placeholder="Search..."
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify
                        icon="solar:magnifer-line-duotone"
                        sx={{ color: 'text.disabled', width: 20 }}
                      />
                    </InputAdornment>
                  ),
                }}
              />

              <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
                <Button
                  disableRipple
                  color="inherit"
                  endIcon={<Iconify icon="ic:round-filter-list" />}
                  // onClick={onOpen}
                >
                  Filters
                </Button>
                <Button
                  disableRipple
                  color="inherit"
                  onClick={handleOpenPopover}
                  endIcon={
                    <Iconify icon={openPopover ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />
                  }
                  sx={{ fontWeight: 'fontWeightMedium' }}
                >
                  Sắp xếp:
                  <Box component="span" sx={{ color: 'text.secondary', ml: 0.5 }}>
                    {field.label}
                  </Box>
                </Button>
                <MenuPopover open={openPopover} onClose={handleClosePopover}>
                  {OPTIONS.map((option) => (
                    <MenuItem
                      key={option.value}
                      selected={option.value === field.value}
                      onClick={(event) => handleMenuItemClick(event, option)}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </MenuPopover>
              </Stack>
            </Stack>

            <Box
              sx={{ pb: { xs: 8, lg: 10 } }}
              gap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              }}
            >
              {(loading ? [...Array(12)] : products).map((product, index) =>
                product ? (
                  <ShopProductCard key={product.id} product={product} />
                ) : (
                  <SkeletonProductItem key={index} />
                )
              )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 1, lg: 2 } }}>
              {' '}
              <Pagination
                variant="outlined"
                color="standard"
                onChange={handleChange}
                page={page}
                count={totalPage}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
