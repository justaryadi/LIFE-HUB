import Card from "./Card_achievement";

const CardGrid = ({ features }) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {features.map((item) => (
        <Card
          key={item.id}
          title={item.title}
          description={item.description}
        />
      ))}
    </section>
  );
};

export default CardGrid;