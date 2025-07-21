import React from 'react';

export default function Explore() {
    const data = {
        newsBlogs: [
            { imgName: 'MONEYCONTROL.png', imgURL: 'https://www.moneycontrol.com/' },
            { imgName: 'Bloomberg.png', imgURL: 'https://www.bloomberg.com/asia' },
            { imgName: 'financial_express.png', imgURL: 'https://www.financialexpress.com/' },
            { imgName: '1FINANCE.png', imgURL: 'https://1finance.co.in/blog/' },
        ],
        stockMarket: [
            { imgName: 'bse.png', imgURL: 'https://www.bseindia.com/' },
            { imgName: 'NSE_reverse@4x-100.jpg', imgURL: 'https://www.nseindia.com/' },
        ],
        cryptocurrencies: [
            { imgName: 'coinmarketcap.png', imgURL: 'https://coinmarketcap.com/' },
            { imgName: 'crypto.png', imgURL: 'https://crypto.com/price' },
        ],
        tools: [
            { imgName: '1FINANCE.png', imgURL: 'https://1finance.co.in/calculator' },
        ],
        other: [
            { imgName: 'Tradingview.png', imgURL: 'https://in.tradingview.com/' },
        ],
    };

    const renderCards = (items) => {
        return items.map((item, index) => (
            <div key={index} className="card flex-shrink-0 w-36 h-36 p-2">
                <a href={item.imgURL} target="_blank" rel="noopener noreferrer">
                    <img src={`/images/${item.imgName}`} alt={item.imgName} className="w-full h-full object-contain" />
                </a>
            </div>
        ));
    };

    return (
        <div className="flex flex-col p-6 bg-white drop-shadow rounded-xl">
            <span className="text-2xl font-bold">News & Blogs</span>
            <div className="border-2 border-b-2 rounded-sm"></div>
            <div className="scrollView  overflow-y-auto flex gap-4">
                {renderCards(data.newsBlogs)}
            </div>
            
            <span className="text-2xl font-bold">Stock Market</span>
            <div className="border-2 border-b-2 rounded-sm "></div>
            <div className="scrollView overflow-y-auto flex gap-4">
                {renderCards(data.stockMarket)}
            </div>

            <span className="text-2xl font-bold">Cryptocurrencies</span>
            <div className="border-2 border-b-2 rounded-sm"></div>
            <div className="scrollView overflow-y-auto flex gap-4">
                {renderCards(data.cryptocurrencies)}
            </div>

            <span className="text-2xl font-bold">Tools</span>
            <div className="border-2 border-b-2 rounded-sm"></div>
            <div className="scrollView overflow-y-auto flex gap-4">
                {renderCards(data.tools)}
            </div>

            <span className="text-2xl font-bold">Other</span>
            <div className="border-2 border-b-2 rounded-sm"></div>
            <div className="scrollView overflow-y-auto flex gap-4">
                {renderCards(data.other)}
            </div>
        </div>
    );
}
