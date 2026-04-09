import { useEffect } from 'react';

interface SEOProps {
    title: string;
    desc: string;
}

export const SEO: React.FC<SEOProps> = ({ title, desc }) => {
    useEffect(() => {
        document.title = title;
        
        // Description meta
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', desc);

        // Open Graph
        const updateMetaTag = (property: string, content: string) => {
            let tag = document.querySelector(`meta[property="${property}"]`);
            if (!tag) {
                tag = document.createElement('meta');
                tag.setAttribute('property', property);
                document.head.appendChild(tag);
            }
            tag.setAttribute('content', content);
        };

        updateMetaTag('og:title', title);
        updateMetaTag('og:description', desc);
        updateMetaTag('og:image', 'https://via.placeholder.com/1200x630/4F46E5/FFFFFF?text=Ads+Tracking+Sandbox');

        // Canonical
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', 'https://yourdomain.com' + window.location.pathname);
    }, [title, desc]);

    return null;
};
