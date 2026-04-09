import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    desc: string;
    canonical?: string;
}

export const SEO: React.FC<SEOProps> = ({ title, desc, canonical }) => {
    const baseUrl = 'https://carlosavargas7.github.io/ads-tests';
    const canonicalUrl = canonical || `${baseUrl}${window.location.pathname}`;

    return (
        <Helmet>
            {/* Title */}
            <title>{title}</title>

            {/* Description */}
            <meta name="description" content={desc} />

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={desc} />
            <meta property="og:image" content="https://via.placeholder.com/1200x630/4F46E5/FFFFFF?text=Ads+Tracking+Sandbox" />
            <meta property="og:type" content="website" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={desc} />
            <meta name="twitter:image" content="https://via.placeholder.com/1200x630/4F46E5/FFFFFF?text=Ads+Tracking+Sandbox" />

            {/* Canonical */}
            <link rel="canonical" href={canonicalUrl} />

            {/* Additional Meta */}
            <meta name="robots" content="index, follow" />
            <meta name="author" content="CarlosAVargas7" />
            <meta name="keywords" content="tracking, analytics, ecommerce, funnel, attribution, UTMs" />
        </Helmet>
    );
};
