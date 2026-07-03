// const Card = ({ title, description }) => {

//     return (
        
//             <div className="mt-8 mb-10 w-full">

//                 <div className="stat-card flex justify-between items-center p-5 w-full">
//                     <div>
//                         <p className="text-sm text-slate-400 font-medium">{title}</p>
//                         <h3 id="levelValue" className="text-2xl font-bold text-slate-800 mt-1">{ description}</h3>
//                     </div>
//                         <i data-lucide="sparkles" class="w-6 h-6 text-amber-500"></i>
//                 </div>
//             </div>
//     )

// }

// export default Card;

import { Sparkles, Zap, Flame, Leaf } from 'lucide-react'

const iconMap = {
    'Level': <Sparkles className="w-6 h-6 text-amber-500" />,
    'Total Xp': <Zap className="w-6 h-6 text-yellow-500" />,
    'Habit Strike': <Flame className="w-6 h-6 text-orange-500" />,
    'Eco Points': <Leaf className="w-6 h-6 text-emerald-500" />,
}

const Card = ({ title, description }) => {
    return (
        <div className="stat-card flex justify-between items-center p-5 w-full">
            <div>
                <p className="text-sm text-slate-400 font-medium">{title}</p>
                <h3 className="text-4xl font-bold text-slate-800 mt-1">{description}</h3>
            </div>
            {iconMap[title]}
        </div>
    )
}

export default Card;