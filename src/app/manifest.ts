import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Shred Tracker',
        short_name: 'Shred',
        description: 'Private machine-only workout tracker.',
        start_url: '/',
        display: 'standalone',
        background_color: '#030712',
        theme_color: '#030712',
        icons: [
            {
                src: '/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/android-chrome-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
