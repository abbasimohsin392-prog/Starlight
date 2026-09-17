import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payment options | Starlight AI',
  description: 'Request a Starlight AI invoice and choose a confirmed bank transfer, card payment link, or crypto payment route.',
  alternates: { canonical: '/payment' },
  openGraph: {
    title: 'Payment options | Starlight AI',
    description: 'Choose a confirmed payment route for your Starlight AI invoice.',
    url: 'https://starlightai.site/payment',
    type: 'website',
  },
}

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return children
}
