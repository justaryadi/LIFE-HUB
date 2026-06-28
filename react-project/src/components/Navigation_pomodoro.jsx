// import { useState } from 'react';
// const Navigation = () => {

//     const [isMenuOpen, setIsMenuOpen] = useState(false);

//     return (

//         <>
 
//     <nav className=" hidden md:feature-navbar">
//         <div className="nav-pill">
//             <a href="dashboard.html"><i data-lucide="layout-dashboard"></i><span>Dashboard</span></a>
//             <a href="quest.html"><i data-lucide="check-square"></i><span>Quest</span></a>
//             <a href="habit.html"><i data-lucide="repeat"></i><span>Habit</span></a>
//             <a href="pomodoro.html" className="active"><i data-lucide="timer"></i><span>Pomodoro</span></a>
//             <a href="achievement.html"><i data-lucide="award"></i><span>Achievement</span></a>
//             <a href="eco.html"><i data-lucide="leaf"></i><span>Eco</span></a>
//         </div>

//         <button
//             className="md:hidden text-2xl"
//             onClick={() => setIsMenuOpen(prev => !prev)} >
//                  { isMenuOpen ? 'x' : '≡' }
//         </button>

//     </nav>

//     { isMenuOpen && (
//         <nav className=" hidden md:feature-navbar">
//             <div className="nav-pill">
//                <a href="dashboard.html"><i data-lucide="layout-dashboard"></i><span>Dashboard</span></a>
//                <a href="quest.html"><i data-lucide="check-square"></i><span>Quest</span></a>
//                <a href="habit.html"><i data-lucide="repeat"></i><span>Habit</span></a>
//                <a href="pomodoro.html" className="active"><i data-lucide="timer"></i><span>Pomodoro</span></a>
//                <a href="achievement.html"><i data-lucide="award"></i><span>Achievement</span></a>
//                <a href="eco.html"><i data-lucide="leaf"></i><span>Eco</span></a>
//             </div>
//         </nav>
//     )};

//       </>   
//     );

// };

// export default Navigation;

import { useState, useEffect } from 'react';

const Navigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsMenuOpen(false); 
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <nav className="feature-navbar" style={{ justifyContent: isMobile ? 'space-between' : 'center' }}>
                
                {!isMobile && (
                    <div className="nav-pill">
                        <a href="dashboard.html"><span>Dashboard</span></a>
                        <a href="quest.html"><span>Quest</span></a>
                        <a href="habit.html"><span>Habit</span></a>
                        <a href="pomodoro.html" className="active"><span>Pomodoro</span></a>
                        <a href="achievement.html"><span>Achievement</span></a>
                        <a href="eco.html"><span>Eco</span></a>
                    </div>
                )}

                {isMobile && (
                    <button
                        style={{ fontSize: '24px', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer' }}
                        onClick={() => setIsMenuOpen(prev => !prev)}>
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                )}
            </nav>

            {isMobile && isMenuOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '16px', background: 'white', borderBottom: '1px solid #99F6E4' }}>
                    <a href="dashboard.html" style={{ textDecoration: 'none', color: '#475569', fontWeight: '700' }}>Dashboard</a>
                    <a href="quest.html" style={{ textDecoration: 'none', color: '#475569', fontWeight: '700' }}>Quest</a>
                    <a href="habit.html" style={{ textDecoration: 'none', color: '#475569', fontWeight: '700' }}>Habit</a>
                    <a href="pomodoro.html" style={{ textDecoration: 'none', color: '#14B8A6', fontWeight: '700' }}>Pomodoro</a>
                    <a href="achievement.html" style={{ textDecoration: 'none', color: '#475569', fontWeight: '700' }}>Achievement</a>
                    <a href="eco.html" style={{ textDecoration: 'none', color: '#475569', fontWeight: '700' }}>Eco</a>
                </div>
            )}
        </>
    );
};

export default Navigation;