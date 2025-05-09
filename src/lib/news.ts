import { NewsItem } from '@/types';

// Mock data function to simulate fetching news from an API
export async function getLatestNews(): Promise<NewsItem[]> {
    // This would normally be a fetch call to a real API
    // For demonstration purposes, we're using mock data

    // In a real implementation, you would use:
    // const response = await fetch('https://api.example.com/news');
    // const data = await response.json();
    // return data.articles;

    // Simulated delay to mimic API call
    await new Promise(resolve => setTimeout(resolve, 100));

    return [
        {
            id: '1',
            title: 'OpenAI Unveils Next-Generation GPT-5 with Advanced Reasoning Capabilities',
            description: 'The latest model demonstrates unprecedented problem-solving abilities and shows significant improvements in understanding context and generating more accurate responses.',
            url: 'https://example.com/openai-gpt5',
            imageUrl: 'https://source.unsplash.com/random/800x600?ai',
            publishedAt: '2025-05-01T09:00:00Z',
            source: 'Tech Insider',
            category: 'AI'
        },
        {
            id: '2',
            title: 'Ethereum Completes Major Upgrade to Reduce Energy Consumption by 99%',
            description: 'The blockchain platform has successfully implemented its most significant technical update, transitioning to a proof-of-stake consensus mechanism.',
            url: 'https://example.com/ethereum-upgrade',
            imageUrl: 'https://source.unsplash.com/random/800x600?blockchain',
            publishedAt: '2025-04-28T14:30:00Z',
            source: 'Crypto News',
            category: 'Blockchain'
        },
        {
            id: '3',
            title: 'Quantum Computing Breakthrough Achieves Error Correction Milestone',
            description: 'Researchers have demonstrated a scalable error correction method that could bring practical quantum computing closer to reality.',
            url: 'https://example.com/quantum-computing',
            imageUrl: 'https://source.unsplash.com/random/800x600?quantum',
            publishedAt: '2025-04-25T11:15:00Z',
            source: 'Science Today',
            category: 'Quantum Computing'
        },
        {
            id: '4',
            title: 'New AI Model Translates Brain Activity into Text with 95% Accuracy',
            description: 'Neuroscientists and AI researchers have developed a system that can decode human thoughts and convert them into written text.',
            url: 'https://example.com/brain-ai-interface',
            imageUrl: 'https://source.unsplash.com/random/800x600?brain',
            publishedAt: '2025-04-22T08:45:00Z',
            source: 'Neural Tech Review',
            category: 'AI'
        },
        {
            id: '5',
            title: 'Sustainable Blockchain Initiative Reduces Carbon Footprint by 80%',
            description: 'A coalition of blockchain companies has launched a new initiative to make cryptocurrency mining more environmentally friendly.',
            url: 'https://example.com/green-blockchain',
            imageUrl: 'https://source.unsplash.com/random/800x600?sustainable',
            publishedAt: '2025-04-20T16:00:00Z',
            source: 'Green Tech Journal',
            category: 'Blockchain'
        },
        {
            id: '6',
            title: 'Machine Learning Algorithm Predicts Protein Structures with Unprecedented Accuracy',
            description: 'A breakthrough in computational biology could accelerate drug discovery and our understanding of diseases.',
            url: 'https://example.com/protein-ml',
            imageUrl: 'https://source.unsplash.com/random/800x600?protein',
            publishedAt: '2025-04-18T10:30:00Z',
            source: 'BioTech Insights',
            category: 'AI'
        },
        {
            id: '7',
            title: 'Decentralized Finance Platforms See 300% Growth in First Quarter',
            description: 'DeFi applications continue to reshape the financial landscape with innovative lending and trading solutions.',
            url: 'https://example.com/defi-growth',
            imageUrl: 'https://source.unsplash.com/random/800x600?finance',
            publishedAt: '2025-04-15T13:20:00Z',
            source: 'DeFi Daily',
            category: 'Blockchain'
        },
        {
            id: '8',
            title: 'Augmented Reality Glasses for Everyday Use Hit the Market',
            description: 'New lightweight AR glasses blend seamlessly with regular eyewear while providing immersive digital experiences.',
            url: 'https://example.com/ar-glasses',
            imageUrl: 'https://source.unsplash.com/random/800x600?augmented-reality',
            publishedAt: '2025-04-12T15:45:00Z',
            source: 'Gadget Review',
            category: 'AR/VR'
        },
        {
            id: '9',
            title: 'Self-Healing Materials Could Revolutionize Electronic Device Longevity',
            description: 'Researchers have developed polymers that can automatically repair microscopic damage, potentially extending the lifespan of smartphones and other devices.',
            url: 'https://example.com/self-healing-tech',
            imageUrl: 'https://source.unsplash.com/random/800x600?material',
            publishedAt: '2025-04-10T09:10:00Z',
            source: 'Materials Science Today',
            category: 'Materials'
        }
    ];
}

// Function to get news by category
export async function getNewsByCategory(category: string): Promise<NewsItem[]> {
    const allNews = await getLatestNews();
    return allNews.filter(item =>
        item.category.toLowerCase() === category.toLowerCase()
    );
}

// Function to search news
export async function searchNews(query: string): Promise<NewsItem[]> {
    const allNews = await getLatestNews();
    const searchTerms = query.toLowerCase().split(' ');

    return allNews.filter(item => {
        const contentToSearch = `${item.title} ${item.description} ${item.category}`.toLowerCase();
        return searchTerms.some(term => contentToSearch.includes(term));
    });
}