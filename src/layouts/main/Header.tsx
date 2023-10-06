// @mui
import { useTheme, alpha } from '@mui/material/styles';
import {
  Box,
  AppBar,
  Toolbar,
  Container,
  Link,
  BoxProps,
  Stack,
  Typography,
  Badge,
} from '@mui/material';

import NextLink from 'next/link';
// hooks
import { useAuthContext } from '@/auth/useAuthContext';
import { IconButtonAnimate } from '@/components/animate';
import Iconify from '@/components/iconify';
import useOffSetTop from '../../hooks/useOffSetTop';
import useResponsive from '../../hooks/useResponsive';
// utils
import { bgBlur } from '../../utils/cssStyles';
// config
import { HEADER } from '../../config-global';
// routes
// components
import Logo from '../../components/logo';

//
import NavMobile from './nav/mobile';
import navConfig from './nav/config-navigation';
import NavDesktop from './nav/desktop';
import NotificationsPopover from '../dashboard/header/NotificationsPopover';
import AccountPopover from '../dashboard/header/AccountPopover';
import ContactsPopover from '../dashboard/header/ContactsPopover';

// ----------------------------------------------------------------------

export default function Header() {
  const theme = useTheme();

  const isDesktop = useResponsive('up', 'md');

  const isOffset = useOffSetTop(HEADER.H_MAIN_DESKTOP);

  const { isAuthenticated } = useAuthContext();
  return (
    <AppBar color="transparent" sx={{ boxShadow: 0 }}>
      <Toolbar
        disableGutters
        sx={{
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_MAIN_DESKTOP,
          },
          transition: theme.transitions.create(['height', 'background-color'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(isOffset && {
            ...bgBlur({ color: theme.palette.background.default }),
            height: {
              md: HEADER.H_MAIN_DESKTOP - 16,
            },
          }),
        }}
      >
        <Container sx={{ height: 1, display: 'flex', alignItems: 'center' }}>
          <Logo />

          <Box sx={{ flexGrow: 1 }} />

          {isDesktop && <NavDesktop isOffset={isOffset} data={navConfig} />}

          {isAuthenticated ? (
            <Stack
              flexGrow={1}
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              spacing={{ xs: 0.5, sm: 1.5 }}
            >
              <NotificationsPopover />
              <ContactsPopover />

              <AccountPopover />
              <Link href="/checkout" component={NextLink}>
                <IconButtonAnimate
                  color="default"
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: () => alpha(theme.palette.grey[900], 0),
                  }}
                >
                  <Badge
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    badgeContent={4}
                    color="error"
                  >
                    <Iconify icon="solar:cart-large-2-bold-duotone" />
                  </Badge>
                </IconButtonAnimate>
              </Link>
            </Stack>
          ) : (
            <>
              <Link
                sx={{ mx: 2, color: 'info.dark' }}
                underline="none"
                component={NextLink}
                href="/auth/login"
              >
                <Stack
                  spacing={{ xs: 0.5, sm: 0.5 }}
                  flexGrow={1}
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Iconify
                    icon="solar:lock-keyhole-unlocked-bold-duotone"
                    width={16}
                    sx={{ color: 'primary.main' }}
                  />
                  <Typography color="primary.main" variant="body2">
                    Đăng nhập
                  </Typography>
                </Stack>
              </Link>
              <Link
                sx={{ color: 'info.dark' }}
                underline="none"
                component={NextLink}
                href="/auth/register"
              >
                <Stack
                  spacing={{ xs: 0.5, sm: 0.5 }}
                  flexGrow={1}
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Iconify
                    icon="solar:user-rounded-bold-duotone"
                    width={16}
                    sx={{ color: 'primary.main' }}
                  />
                  <Typography color="primary.main" variant="body2">
                    Đăng ký
                  </Typography>
                </Stack>
              </Link>
              <Link href="/checkout" component={NextLink}>
                <IconButtonAnimate
                  color="default"
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: () => alpha(theme.palette.grey[900], 0),
                  }}
                >
                  <Badge
                    color="primary"
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    badgeContent={5}
                  >
                    <Iconify icon="solar:cart-large-2-bold-duotone" />
                  </Badge>
                </IconButtonAnimate>
              </Link>
            </>
          )}

          {!isDesktop && <NavMobile isOffset={isOffset} data={navConfig} />}
        </Container>
      </Toolbar>
      {isOffset && <Shadow />}
    </AppBar>
  );
}

// ----------------------------------------------------------------------

function Shadow({ sx, ...other }: BoxProps) {
  return (
    <Box
      sx={{
        left: 0,
        right: 0,
        bottom: 0,
        height: 24,
        zIndex: -1,
        m: 'auto',
        borderRadius: '50%',
        position: 'absolute',
        width: `calc(100% - 48px)`,
        boxShadow: (theme) => theme.customShadows.z8,
        ...sx,
      }}
      {...other}
    />
  );
}
