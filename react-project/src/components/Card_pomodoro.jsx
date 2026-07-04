const Card = ({ title, description, times }) => {

    return (
        
            <div className="feature-panel w-full text-center">
                <p className="panel-label">{ title }</p>
                <h2>{ description }</h2>

                <div className="flex bg-gray-50 border border-emerald-100 p-1 rounded-xl max-w-xs mx-auto mb-6">
                    <button className="mode-btn active flex-1 py-2 text-sm font-medium rounded-lg transition-all" id="focusBtn">Focus</button>
                    <button className="mode-btn flex-1 py-2 text-sm font-medium rounded-lg transition-all" id="breakBtn">Break</button>
                </div>

                <div className="timer-display">
                    <div className="timer-inner">
                        <h2 id="pomodoroTime">{ times }</h2>
                        <p id="pomodoroStatus">Ready to focus</p>
                    </div>
                </div>

                <div className="flex justify-center gap-4 mt-6">
                    <button className="primary-btn" id="startBtn">Start</button>
                    <button className="secondary-btn" id="pauseBtn">Pause</button>
                    <button className="secondary-btn" id="resetBtn">Reset</button>
                </div>
            </div>
    )

}

export default Card;