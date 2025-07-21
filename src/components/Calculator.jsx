import { useState } from "react";

export default function Calculator() {
    const [screenData, setScreenData] = useState('0');

    const handleButtons = (e) => {
        let btnId = e.target.innerHTML;

        // Check if the last character is an operator (+, -, /, *, %)
        const lastChar = screenData.charAt(screenData.length - 1);
        const operators = ['+', '-', '/', '*', '%'];
        const isLastCharOperator = operators.includes(lastChar);
        const isBtnOperator = operators.includes(btnId);
        
        // Prevent adding operators at the start
        if (isBtnOperator && (screenData === '0' || isLastCharOperator)) {
            return;
        }

        // Prevent repeating "." or any operator
        if ((btnId === '.' || isBtnOperator) && (isLastCharOperator || screenData === '0' || lastChar === '.')) {
            // If "." is pressed at the start, append it just after "0"
            if (btnId === '.' && screenData === '0') {
                setScreenData('0.');
                return;
            }
            return;
        }

        // Prevent repeating "0" at the start
        if (btnId === '0' && screenData === '0') {
            return;
        }

        // Handling division and multiplication symbols
        if ((btnId === '/' || btnId === '÷') && (screenData === '0' || isLastCharOperator) || (btnId === '*' || btnId === 'X') && (screenData === '0' || isLastCharOperator)) {
            // Handle division by zero
            return;
        } else if (btnId === '÷') {
            btnId = '/';
        } else if (btnId === 'X') {
            btnId = '*';
        }

        // Allow adding minus sign as the first character
        if (btnId === '-' && screenData === '0') {
            setScreenData('-');
            return;
        }

        // Handling percentage calculation
        if (btnId === '%') {
            // Check if the last character is a number
            const lastNumber = parseFloat(screenData);
            if (!isNaN(lastNumber)) {
                const result = lastNumber / 100;
                setScreenData(String(result));
            }
        } else if (btnId === '=') {
            // Evaluate expression when "=" is clicked
            if (!isLastCharOperator && screenData !== '') {
                let result = eval(screenData);
                setScreenData(String(result));
            }
        } else if (btnId === 'C') {
            // Clear the screen
            setScreenData('0');
        } else if (btnId === 'Del') {
            // Delete the last character
            setScreenData(prevScreenData => prevScreenData.slice(0, -1) || '0');
        } else {
            // Append the clicked button value to the screen data
            setScreenData(screenData === '0' ? btnId : screenData + btnId);
        }
    };

    return (
        <div className="fixed bottom-20 w-[70vw] md:w-max right-10 z-20 bg-gray-100 drop-shadow-sm">
            <div className="w-full mx-auto rounded-xl bg-gray-100 shadow-xl text-gray-800 relative overflow-hidden">
                <div className="w-full h-40 bg-gradient-to-b from-gray-800 to-gray-700 flex items-end text-right">
                    <div className="w-full py-5 px-6 text-6xl text-white font-thin">
                        <input className={`bg-transparent w-max text-xl`} value={screenData} type="text" readOnly />
                    </div>
                </div>
                <div className="w-full bg-gradient-to-b from-indigo-400 to-indigo-500" onClick={handleButtons}>
                    {/* All Buttons */}
                    <div className="flex w-full">
                        <div className="w-1/4 border-r border-b border-indigo-400">
                            <button className="w-full h-16 outline-none focus:outline-none hover:bg-indigo-700 hover:bg-opacity-20 text-white text-opacity-50 text-xl font-light">C</button>
                        </div>
                        <div className="w-1/4 border-r border-b border-indigo-400">
                            <button className="w-full h-16 outline-none focus:outline-none hover:bg-indigo-700 hover:bg-opacity-20 text-white text-opacity-50 text-xl font-light">Del</button>
                        </div>
                        <div className="w-1/4 border-r border-b border-indigo-400">
                            <button className="w-full h-16 outline-none focus:outline-none hover:bg-indigo-700 hover:bg-opacity-20 text-white text-opacity-50 text-xl font-light">%</button>
                        </div>
                        <div className="w-1/4 border-r border-b border-indigo-400">
                            <button className="w-full h-16 outline-none focus:outline-none bg-indigo-700 bg-opacity-10 hover:bg-opacity-20 text-white text-2xl font-light">÷</button>
                        </div>
                    </div>
                    <div className="flex w-full">
                        <div className="w-1/4 border-r border-b border-indigo-400">
                            <button className="w-full h-16 outline-none focus:outline-none hover:bg-indigo-700 hover:bg-opacity-20 text-white text-xl font-light">7</button>
                        </div>
                        <div className="w-1/4 border-r border-b border-indigo-400">
                            <button className="w-full h-16 outline-none focus:outline-none hover:bg-indigo-700 hover:bg-opacity-20 text-white text-xl font-light">8</button>
                        </div>
                        <div className="w-1/4 border-r border-b border-indigo-400">
                            <button className="w-full h-16 outline-none focus:outline-none hover:bg-indigo-700 hover:bg-opacity-20 text-white text-xl font-light">9</button>
                        </div>
                        <div className="w-1/4 border-r border-b border-indigo-400">
                            <button className="w-full h-16 outline-none focus:outline-none bg-indigo-700 bg-opacity-10 hover:bg-opacity-20 text-white text-xl font-light">X</button>
                        </div>
                    </div>
                    <div className="flex w-full">
                        <div className="w-1/4 border-r border-b border-indigo-400">
                            <button className="w-full h-16 outline-none focus:outline-none hover:bg-indigo-700 hover:bg-opacity-20 text-white text-xl font-light">4</button>
                        </div>
                        <div className="w-1/4 border-r border-b border-indigo-400">
                            <button className="w-full h-16 outline-none focus:outline-none hover:bg-indigo-700 hover:bg-opacity-20 text-white text-xl font-light">5</button>
                        </div>
                        <div className="w-1/4 border-r border-b border-indigo-400">
                            <button className="w-full h-16 outline-none focus:outline-none hover:bg-indigo-700 hover:bg-opacity-20 text-white text-xl font-light">6</button>
                        </div>
                        <div className="w-1/4 border-r border-b border-indigo-400">
                            <button className="w-full h-16 outline-none focus:outline-none bg-indigo-700 bg-opacity-10 hover:bg-opacity-20 text-white text-xl font-light">-</button>
                        </div>
                    </div>
                    <div className="flex w-full">
                        <div className="w-1/4 border-r border-b border-indigo-400">
                            <button className="w-full h-16 outline-none focus:outline-none hover:bg-indigo-700 hover:bg-opacity-20 text-white text-xl font-light">1</button>
                        </div>
                        <div className="w-1/4 border-r border-b border-indigo-400">
                            <button className="w-full h-16 outline-none focus:outline-none hover:bg-indigo-700 hover:bg-opacity-20 text-white text-xl font-light">2</button>
                        </div>
                        <div className="w-1/4 border-r border-b border-indigo-400">
                            <button className="w-full h-16 outline-none focus:outline-none hover:bg-indigo-700 hover:bg-opacity-20 text-white text-xl font-light">3</button>
                        </div>
                        <div className="w-1/4 border-r border-b border-indigo-400">
                            <button className="w-full h-16 outline-none focus:outline-none bg-indigo-700 bg-opacity-10 hover:bg-opacity-20 text-white text-xl font-light">+</button>
                        </div>
                    </div>
                    <div className="flex w-full">
                        <div className="w-1/4 border-r border-indigo-400">
                            <button className="w-full h-16 outline-none focus:outline-none hover:bg-indigo-700 hover:bg-opacity-20 text-white text-xl font-light">0</button>
                        </div>
                        <div className="w-1/4 border-r border-indigo-400">
                            <button className="w-full h-16 outline-none focus:outline-none hover:bg-indigo-700 hover:bg-opacity-20 text-white text-xl font-light">.</button>
                        </div>
                        <div className="w-2/4 border-r border-indigo-400">
                            <button className="w-full h-16 outline-none focus:outline-none bg-indigo-700 bg-opacity-30 hover:bg-opacity-40 text-white text-xl font-light">=</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
