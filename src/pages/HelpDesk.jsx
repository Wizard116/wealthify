import React from 'react';

export default function HelpDesk() {
    const sections = [
        { title: "Dashboard", content: "Overview of your activities, statistics, and quick access to main features." },
        { title: "Account Settings", content: "Manage your account details, security settings, and preferences." },
        { title: "Notifications", content: "View and manage your notification settings and history." },
        { title: "Income", content: "Track your income sources and manage your earnings." },
        { title: "Expense", content: "Record and categorize your expenses to keep track of your spending." },
        { title: "Transactions", content: "Review your transaction history and manage your financial activities." },
        { title: "Generate Reports", content: "Create detailed financial reports based on your data." },
        { title: "Explore", content: "Discover new features, tools, and resources available in the app." },
        { title: "Goals", content: "Set and track your financial goals and milestones." },
    ];

    return (
        <div className="flex flex-col p-6 gap-6 bg-white drop-shadow rounded-xl max-w-4xl mx-auto mt-10">
            <span className="text-2xl font-bold">HelpDesk</span>
            <ul className="divide-y rounded-xl shadow shadow-blue-600">
                {sections.map((section, index) => (
                    <li key={index}>
                        <details className="group">
                            <summary className="flex items-center gap-3 px-4 py-3 font-medium marker:content-none hover:cursor-pointer">
                                <svg
                                    className="w-5 h-5 text-gray-500 transition group-open:rotate-90"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={16}
                                    height={16}
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                                    ></path>
                                </svg>
                                <span>{section.title}</span>
                            </summary>
                            <article className="px-4 pb-4">
                                <p>{section.content}</p>
                            </article>
                        </details>
                    </li>
                ))}
            </ul>
        </div>
    );
}
