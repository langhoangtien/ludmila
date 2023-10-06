// next
import NextLink from 'next/link';
// @mui
import { Box, Card, Link, Stack } from '@mui/material';
// routes

// utils
import { fCurrency } from '@/utils/formatNumber';

// @types
import { IProduct } from '@/@types/product';
// components
import Label from '@/components/label';
import Image from '@/components/image';
import TextMaxLine from '@/components/text-max-line';

// ----------------------------------------------------------------------

type Props = {
  product: IProduct;
};

export default function ShopProductCard({ product }: Props) {
  const { id, name, price, status, priceSale, photo, slug } = product;

  const linkTo = `/${slug}-${id}`;

  return (
    <Card
      sx={{
        '&:hover .add-cart-btn': {
          opacity: 1,
          m: 1,
        },
        mr: 1,
        mb: 2,
      }}
    >
      <Link underline="none" component={NextLink} href={linkTo} color="inherit">
        <Stack direction="column">
          <Box sx={{ position: 'relative' }}>
            {status && (
              <Label
                variant="filled"
                color={(status === 'sale' && 'error') || 'info'}
                sx={{
                  top: 16,
                  right: 16,
                  zIndex: 9,
                  position: 'absolute',
                  textTransform: 'uppercase',
                }}
              >
                {status}
              </Label>
            )}

            <Image alt={name} src={photo?.path} ratio="1/1" sx={{ borderRadius: '1.5 1.5 0 0' }} />
          </Box>

          <Stack spacing={2} sx={{ px: 2, py: 1 }}>
            <TextMaxLine> {name}</TextMaxLine>
            <Stack direction="column" alignItems="center" justifyContent="space-between">
              <Stack
                direction="row"
                spacing={2}
                width="100%"
                sx={{ typography: 'subtitle1', justifyContent: 'space-between' }}
              >
                {priceSale ? (
                  <Box sx={{ color: 'red', fontWeight: 400 }} component="span">
                    {fCurrency(priceSale)}
                  </Box>
                ) : null}

                <Box
                  sx={{
                    color: priceSale ? 'text.disabled' : 'red',
                    textDecoration: priceSale ? 'line-through' : null,
                  }}
                  component="span"
                >
                  {fCurrency(price)}
                </Box>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Link>
    </Card>
  );
}
