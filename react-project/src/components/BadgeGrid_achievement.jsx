import Badge from "./Badge_achievement"

const BadgeGrid = ({ badges }) => {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {badges.map((item) => (
                <Badge
                    key={item.id}
                    name={item.name}
                    icon={item.icon}
                    unlocked={item.unlocked}
                />
            ))}
        </section>
    )
}

export default BadgeGrid;