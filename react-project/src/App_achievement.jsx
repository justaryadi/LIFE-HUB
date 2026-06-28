// import './App.css';
// import { useState } from 'react';
// import Navbar from './components/Navigation_achievement';
// import Header from './components/Header_achievement';
// import CardGrid from './components/CardGrid_achievement';
// import { featureData } from './Data/features_achievement';

// const App = () => {
//   const [features, setFeatures] = useState(featureData);

//   return (
//     <>
//       <Navbar />
//       <main className="page-shell">
//         <Header />
//         <CardGrid features={features} />
//       </main>
//     </>
//   )  
// }

// export default App;

import './App.css'
import { useState } from 'react'
import Navbar from './components/Navigation_achievement'
import Header from './components/Header_achievement'
import CardGrid from './components/CardGrid_achievement'
import BadgeGrid from './components/BadgeGrid_achievement'
import { featureData, badgeData } from './data/feature_achievement'

const App = () => {
    const [features, setFeatures] = useState(featureData)
    const [badges, setBadges] = useState(badgeData)

    return (
        <>
            <Navbar />
            <main className="page-shell">
                <div className="max-w-5xl mx-auto w-full">
                    <Header />
                    
                    {/* Stat Cards */}
                    <div className="mt-8 mb-10 w-full">
                        <CardGrid features={features} />
                    </div>

                    {/* Badges */}
                    <section className="panel mb-12">
                        <div className="panel-header mb-6">
                            <div>
                                <p className="eyebrow">Badges</p>
                                <h3 className="text-xl font-bold text-slate-800">Your Achievements</h3>
                            </div>
                        </div>
                        <BadgeGrid badges={badges} />
                    </section>
                </div>
            </main>
        </>
    )
}

export default App;