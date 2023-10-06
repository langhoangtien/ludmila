import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// @types
import { ICheckoutBillingAddress } from '../../../../../@types/product';
// assets
import { countries } from '../../../../../assets/data';
import FormProvider, {
  RHFCheckbox,
  RHFSelect,
  RHFTextField,
  RHFRadioGroup,
} from '../../../../../components/hook-form';

// ----------------------------------------------------------------------

interface FormValuesProps extends ICheckoutBillingAddress {
  address: string;
  city: string;
  email: string;
  state: string;
  country: string;
  zipCode: string;
}

type Props = {
  onCreateBilling: (address: ICheckoutBillingAddress) => void;
};

export default function CheckoutBillingNewAddressForm({ onCreateBilling }: Props) {
  const NewAddressSchema = Yup.object().shape({
    receiver: Yup.string().required('Fullname is required'),
    email: Yup.string().required('Email is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    zipCode: Yup.string().required('Zip code is required'),
  });

  const defaultValues = {
    addressType: 'Home',
    receiver: '',
    phoneNumber: '',
    email: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    isDefault: true,
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      onCreateBilling({
        receiver: data.receiver,
        phoneNumber: data.phoneNumber,
        email: data.email,
        fullAddress: `${data.address}, ${data.city}, ${data.state}, ${data.country}, ${data.zipCode}`,
        addressType: data.addressType,
        isDefault: data.isDefault,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFRadioGroup
          row
          name="addressType"
          options={[
            { label: 'Home', value: 'Home' },
            { label: 'Office', value: 'Office' },
          ]}
        />

        <Box
          rowGap={4}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
        >
          <RHFTextField name="receiver" label="Họ và tên" />
          <RHFTextField name="email" label="Email" />
          <RHFTextField name="phoneNumber" label="Số điện thoại" />
        </Box>

        <RHFTextField name="address" label="Địa chỉ" />

        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(3, 1fr)',
          }}
        >
          <RHFTextField name="city" label="Town / City" />

          <RHFTextField name="state" label="State" />

          <RHFTextField name="zipCode" label="Zip/Code" />
        </Box>

        <RHFSelect native name="country" label="Country">
          <option value="" />
          {countries.map((country) => (
            <option key={country.code} value={country.label}>
              {country.label}
            </option>
          ))}
        </RHFSelect>

        <RHFCheckbox name="isDefault" label="Dùng làm địa chỉ mặc định" />
      </Stack>

      <LoadingButton sx={{ my: 3 }} type="submit" variant="contained" loading={isSubmitting}>
        Xác nhận
      </LoadingButton>
    </FormProvider>
  );
}
