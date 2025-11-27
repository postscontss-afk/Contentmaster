import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import CheckIcon from '@mui/icons-material/CheckCircleOutline';
import TelegramIcon from '@mui/icons-material/Telegram';
import { useSiteConfig } from '../context/SiteConfigContext';
import { StripeService } from '../services/StripeService';

interface PromoOfferBannerProps {
  telegramLink?: string; // full URL override
  telegramUsername?: string; // e.g., mychannel or myuser
  prefilledMessage?: string; // custom interest message
}

const getRandomInt = (min: number, max: number) => {
  const lower = Math.ceil(min);
  const upper = Math.floor(max);
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

const PromoOfferBanner = ({ telegramLink, telegramUsername, prefilledMessage }: PromoOfferBannerProps) => {
  const [isStripeLoading, setIsStripeLoading] = useState(false);
  const { stripePublishableKey } = useSiteConfig();

  const interestMessage = prefilledMessage || "Hi! I'm interested in the $100 offer including all content. Could you guide me on how to pay?";
  const computedTelegramHref = (() => {
    try {
      if (telegramLink) return telegramLink;
      if (telegramUsername) {
        // Open chat with username and try to pass text
        return `https://t.me/${telegramUsername}?text=${encodeURIComponent(interestMessage)}`;
      }
      // Fallback: share with prefilled text (user selects chat)
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `https://t.me/share/url?url=${encodeURIComponent(origin)}&text=${encodeURIComponent(interestMessage)}`;
    } catch {
      return 'https://t.me/';
    }
  })();

  // Handle Stripe payment for $135 offer
  const handleStripePayment = async () => {
    if (!stripePublishableKey) {
      alert('Stripe configuration is missing. Please contact support.');
      return;
    }
    
    try {
      setIsStripeLoading(true);
      
      // Initialize Stripe
      await StripeService.initStripe(stripePublishableKey);
      
      // Generate a random product name for privacy
      const productNames = [
        "Premium Content Package",
        "Digital Media Collection",
        "Exclusive Content Bundle",
        "Premium Access Package"
      ];
      const randomProductName = productNames[Math.floor(Math.random() * productNames.length)];
      
      // Build success and cancel URLs
      const successUrl = `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&payment_method=stripe&offer_type=all_content&price=85`;
      const cancelUrl = `${window.location.origin}/?payment_canceled=true`;
      
      // Create checkout session
      const sessionId = await StripeService.createCheckoutSession(
        100, // $100 price
        'usd',
        randomProductName,
        successUrl,
        cancelUrl
      );
      
      // Redirect to checkout
      await StripeService.redirectToCheckout(sessionId);
      
    } catch (error) {
      console.error('Error processing Stripe payment:', error);
      alert('Failed to initialize payment. Please try again.');
    } finally {
      setIsStripeLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', mb: 3, px: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          position: 'relative',
          maxWidth: 1000,
          mx: 'auto',
          borderRadius: 3,
          p: { xs: 3, sm: 4 },
          color: theme => theme.palette.text.primary,
          backgroundColor: theme => theme.palette.background.paper,
          border: theme => `1px solid ${theme.palette.divider}`,
          boxShadow: theme => theme.palette.mode === 'dark' 
            ? '0 6px 20px rgba(0,0,0,0.4)'
            : '0 6px 18px rgba(0,0,0,0.06)'
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 1,
                fontSize: { xs: '1.5rem', sm: '1.9rem', md: '2.1rem' }
              }}
            >
              Special Offer
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
                color: theme => theme.palette.text.secondary
              }}
            >
              All content for only $100
            </Typography>

            <Typography sx={{ mb: 2.5, fontSize: '0.95rem', color: theme => theme.palette.text.secondary }}>
              Access our complete premium collection with a single payment.
            </Typography>

            <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Button
                href={computedTelegramHref}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<TelegramIcon />}
                variant="outlined"
                color="inherit"
                sx={{
                  fontWeight: 700,
                  px: 2.5,
                  py: 1,
                  borderRadius: 2,
                }}
              >
                Contact on Telegram
              </Button>
              
              <Button
                variant="contained"
                onClick={handleStripePayment}
                disabled={isStripeLoading || !stripePublishableKey}
                color="primary"
                sx={{
                  fontWeight: 800,
                  px: 2.5,
                  py: 1,
                  borderRadius: 2,
                }}
              >
                {isStripeLoading ? 'Processing...' : 'Pay $100'}
              </Button>
            </Box>

            <Typography sx={{ mt: 2, fontSize: '0.85rem', color: theme => theme.palette.text.secondary }}>
              Instant access delivered automatically after payment.
            </Typography>
          </Grid>

          <Grid item xs={12} md={5}>
            <Box sx={{
              border: theme => `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              p: 2.5,
              backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
                Included
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: 1.25 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckIcon fontSize="small" color="primary" />
                  <Typography variant="body2">Full site content access</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckIcon fontSize="small" color="primary" />
                  <Typography variant="body2">Automatic delivery after payment</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckIcon fontSize="small" color="primary" />
                  <Typography variant="body2">Secure payment processing</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckIcon fontSize="small" color="primary" />
                  <Typography variant="body2">Private support via Telegram</Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">One-time payment</Typography>
                <Typography variant="body2" color="text.secondary">No recurring fees</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PromoOfferBanner;


