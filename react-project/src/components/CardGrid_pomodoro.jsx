import Card from "./Card_pomodoro";

const CardGrid = ({ features }) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
      {features.map((item) => (
        <Card
          key={item.id}
          title={item.title}
          description={item.description}
          times={item.times}
        />
      ))}
    </section>
  );
};

export default CardGrid;