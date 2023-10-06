import { useEffect } from 'react';
// next
import { useRouter } from 'next/router';
import NextLink from 'next/link';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Box, Stack, Button, Rating, Divider, Typography, IconButton, Link } from '@mui/material';

// utils
import { fShortenNumber, fCurrency } from '../../../../utils/formatNumber';
// @types
import { IProduct, ICheckoutCartItem } from '../../../../@types/product';
// _mock
import { _socials } from '../../../../_mock/arrays';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import { IncrementerButton } from '../../../../components/custom-input';
import FormProvider from '../../../../components/hook-form';
// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<ICheckoutCartItem, 'colors'> {
  colors: string;
}

type Props = {
  product: IProduct;
  cart: ICheckoutCartItem[];
  onAddCart: (cartItem: ICheckoutCartItem) => void;
  onGotoStep: (step: number) => void;
};

export default function ProductDetailsSummary({
  cart,
  product,
  onAddCart,
  onGotoStep,
  ...other
}: Props) {
  const { push } = useRouter();

  const {
    id,
    name,
    photo,
    price,
    cover,
    status,
    available,
    priceSale,
    brand,
    barCode,
    country,
    introduction,
    totalRating,
    totalReview,
    inventoryType,
  } = product;

  const alreadyProduct = cart.map((item) => item.id).includes(id);

  const isMaxQuantity =
    cart.filter((item) => item.id === id).map((item) => item.quantity)[0] >= available;
  const cl = ['red', 'blue'];
  const si = ['1', '2'];
  const defaultValues = {
    id,
    name,
    cover,
    available,
    price,
    photo,
    colors: cl[0],
    size: si[4],
    quantity: available < 1 ? 0 : 1,
  };

  const methods = useForm<FormValuesProps>({
    defaultValues,
  });

  const { reset, watch, control, setValue, handleSubmit } = methods;

  const values = watch();

  useEffect(() => {
    if (product) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const onSubmit = async (data: FormValuesProps) => {
    try {
      if (!alreadyProduct) {
        onAddCart({
          ...data,
          colors: [values.colors],
          subtotal: data.price * data.quantity,
        });
      }
      onGotoStep(0);
      push('/checkout');
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddCart = async () => {
    console.log('VALUE', values);

    try {
      onAddCart({
        ...values,
        colors: [values.colors],
        subtotal: values.price * values.quantity,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack
        spacing={3}
        sx={{
          p: (theme) => ({
            md: theme.spacing(5, 5, 0, 2),
          }),
        }}
        {...other}
      >
        <Stack spacing={2}>
          <Label variant="soft" color="success" sx={{ textTransform: 'uppercase', mr: 'auto' }}>
            CÒN HÀNG
          </Label>

          <Typography variant="h5">{name}</Typography>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Rating value={4.9} precision={0.1} readOnly />

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              ({`${fShortenNumber(145)} đánh giá`})
            </Typography>
          </Stack>
          <Stack justifyContent="space-between" direction="row">
            <Typography sx={{ fontWeight: 400, color: 'error.main', mr: 0.5 }} variant="h4">
              {fCurrency(priceSale)}
            </Typography>
            <Typography
              sx={{
                color: 'text.disabled',
                textDecoration: 'line-through',
                fontWeight: 400,
                mr: 0.5,
              }}
              variant="h4"
            >
              {fCurrency(price)}
            </Typography>
          </Stack>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />
        <Stack direction="row" alignItems="center" justifyContent="flex-start">
          <Typography variant="subtitle2">
            Mã vạch:{' '}
            <Box sx={{ color: 'error.main' }} component="span">
              {barCode}
            </Box>{' '}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="flex-start">
          <Typography variant="subtitle2">
            Thương hiệu:{' '}
            <Box sx={{ color: 'error.main' }} component="span">
              <Link href={`/brands/${brand?.slug}-${brand?.id}`} component={NextLink}>
                {brand?.name}
              </Link>
            </Box>{' '}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="flex-start">
          <Typography variant="subtitle2">
            Xuất xứ:{' '}
            <Box sx={{ color: 'error.main' }} component="span">
              <Link href={`/country/${country?.code}`} component={NextLink}>
                {country?.name}
              </Link>
            </Box>
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ lineHeight: '30px', flexGrow: 1 }}>
            {introduction}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="subtitle2" sx={{ lineHeight: '36px' }}>
            Số lượng
          </Typography>

          <Stack spacing={1}>
            <IncrementerButton
              name="quantity"
              quantity={values.quantity}
              disabledDecrease={values.quantity <= 1}
              disabledIncrease={values.quantity >= available}
              onIncrease={() => setValue('quantity', values.quantity + 1)}
              onDecrease={() => setValue('quantity', values.quantity - 1)}
            />

            <Typography
              variant="caption"
              component="div"
              sx={{ textAlign: 'right', color: 'text.secondary' }}
            >
              Available: {available}
            </Typography>
          </Stack>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" spacing={2}>
          <Button
            fullWidth
            disabled={isMaxQuantity}
            size="large"
            // color="warning"
            variant="outlined"
            startIcon={<Iconify icon="ic:round-add-shopping-cart" />}
            onClick={handleAddCart}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Thêm vào giỏ hàng
          </Button>
          <Link
            sx={{ with: '100%' }}
            component={NextLink}
            href="/checkout"
            color="inherit"
            variant="subtitle2"
            noWrap
          >
            <Button
              color="warning"
              fullWidth
              size="large"
              variant="contained"
              sx={{ whiteSpace: 'nowrap' }}
            >
              Mua hàng
            </Button>
          </Link>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="center">
          {_socials.map((social) => (
            <IconButton key={social.name}>
              <Iconify icon={social.icon} />
            </IconButton>
          ))}
        </Stack>
      </Stack>
    </FormProvider>
  );
}
