const Badge = ({ name, icon, unlocked }) => {
    return (
        <div className={`badge-card ${unlocked ? 'unlocked' : 'locked'}`}>
            <span className="badge-icon">{icon}</span>
            <p className="badge-name">{name}</p>
        </div>
    )
}

export default Badge;